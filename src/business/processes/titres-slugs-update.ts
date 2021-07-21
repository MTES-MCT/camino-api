import { Index, ITitre } from '../../types'

import { titresGet } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'

import { titreSlugAndRelationsUpdate } from '../utils/titre-slug-and-relations-update'

// met à jour les slugs de titre
const titreSlugsUpdate = async (titre: ITitre) => {
  const titreOldSlug = titre.slug

  try {
    const { slug, hasChanged } = await titreSlugAndRelationsUpdate(titre)

    if (!hasChanged) return null

    const log = {
      type: 'titre : slug (mise à jour) ->',
      value: slug
    }
    console.info(log.type, log.value)

    return { [slug]: titreOldSlug }
  } catch (e) {
    console.error(`erreur: titreSlugsUpdate ${titreOldSlug}`, e)

    return null
  }
}

const titresSlugsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('slugs de titres, démarches, étapes et sous-éléments…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        type: { type: { id: {} } },
        demarches: {
          etapes: {
            points: { references: { id: {} } }
          }
        },
        travaux: {
          travauxEtapes: {
            id: {}
          }
        },
        activites: { id: {} }
      }
    },
    userSuper
  )

  const titresUpdatedIndex = {} as Index<string>

  for (const titre of titres) {
    const titreUpdatedIndex = await titreSlugsUpdate(titre)

    if (titreUpdatedIndex) {
      Object.assign(titresUpdatedIndex, titreUpdatedIndex)
    }
  }

  return titresUpdatedIndex
}

export { titresSlugsUpdate }
