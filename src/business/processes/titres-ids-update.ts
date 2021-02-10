import { Index, ITitre } from '../../types'

import * as cryptoRandomString from 'crypto-random-string'

import {
  titreIdUpdate,
  titreGet,
  titresGet
} from '../../database/queries/titres'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreFilePathsRename } from './titre-fichiers-rename'

const titreDoublonCheck = async (
  titreOldId: string,
  titreId: string,
  titreDoublonTitreId?: string | null
) => {
  let noLog = false
  let hash = null

  if (titreOldId === titreId) return { hash, noLog }

  const titreWithTheSameId = await titreGet(titreId, {}, 'super')

  // si le titre est en doublon
  // s'il a déjà un hash
  // si la référence du doublon est la même que le doublon actuel
  if (
    titreWithTheSameId &&
    titreDoublonTitreId &&
    titreDoublonTitreId === titreWithTheSameId.id
  ) {
    hash = titreOldId.slice(-8)
    noLog = true
  }
  // si le titre est en doublon et qu'il n'a pas de hash
  else if (titreWithTheSameId) {
    hash = cryptoRandomString({ length: 8 })
  }

  return { hash, noLog }
}

// met à jour les ids de titre par effet de bord
const titreIdsUpdate = async (titre: ITitre) => {
  // les transaction en bdd ne peuvent être effectuées en parallèle
  // comment ça se passe si plusieurs utilisateurs modifient des titres en même temps ?

  const titreOldId = titre.id

  try {
    // met à jour les ids de titre par effet de bord
    // (titre n'est retourné que pour les tests, mais il est modifié de toute façon)
    const {
      titre: titreNew,
      hasChanged,
      relationsIdsUpdatedIndex
    } = titreIdAndRelationsUpdate(titre)

    if (!hasChanged) return null

    titre = titreNew

    // si c'est un doublon
    const { hash, noLog } = await titreDoublonCheck(
      titreOldId,
      titre.id,
      titre.doublonTitreId
    )

    if (hash) {
      titre.doublonTitreId = titre.id
      // met à jour les ids de titre par effet de bord
      const { titre: titreHash } = titreIdAndRelationsUpdate(titre, hash)

      titre = titreHash
    } else {
      delete titre.doublonTitreId
    }

    await titreIdUpdate(titreOldId, titre)

    // attrape l'erreur pour ne pas interrompre le processus
    try {
      await titreFilePathsRename(relationsIdsUpdatedIndex, titre)
    } catch (e) {
      console.error(
        `erreur: renommage de fichiers ${titreOldId} -> ${titre.id}`
      )
    }

    // on n'a aucun moyen de savoir
    // si le hash n'a pas changé mais qu'une relation a changé
    if (noLog) return null

    const log = {
      type: 'titre : id (mise à jour) ->',
      value: titre.id
    }

    console.info(log.type, log.value)

    return { [titre.id]: titreOldId }
  } catch (e) {
    console.error(`erreur: titreIdsUpdate ${titreOldId}`, e)

    return null
  }
}

const titresIdsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('ids de titres, démarches, étapes et sous-éléments…')
  // si l'id du titre change il est effacé puis re-créé entièrement
  // on doit donc récupérer toutes ses relations
  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        type: { type: { id: {} } },
        references: { id: {} },
        administrationsGestionnaires: { id: {} },
        demarches: {
          etapes: {
            points: { references: { id: {} } },
            documents: { id: {} },
            administrations: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { id: {} },
            communes: { id: {} },
            forets: { id: {} },
            justificatifs: { id: {} }
          },
          phase: { id: {} }
        },
        travaux: { etapes: { id: {} } },
        activites: { id: {} }
      }
    },
    'super'
  )

  // les transactions `titreIdUpdate` ne peuvent être exécutées en parallèle
  const titresUpdatedIndex = {} as Index<string>

  for (const titre of titres) {
    const titreUpdatedIndex = await titreIdsUpdate(titre)

    if (titreUpdatedIndex) {
      Object.assign(titresUpdatedIndex, titreUpdatedIndex)
    }
  }

  return titresUpdatedIndex
}

export { titresIdsUpdate }
