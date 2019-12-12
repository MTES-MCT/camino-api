import 'dotenv/config'
import '../../../database/index'

import { titresGet } from '../../../database/queries/titres'
import {
  titreDemarcheUpsert,
  titreDemarcheDelete
} from '../../../database/queries/titres-demarches'

const etapesTypes = ['mfr', 'mdp', 'mcr', 'meo', 'eof', 'def', 'sco'].reduce(
  (types, t) => {
    types[t] = null

    return types
  },
  {}
)

// delete etapesTypes.meo

const exists = a => a !== undefined && a !== null

const existFilter = a => a.filter(exists)

const titreEtapeRelationsRemove = (
  relation,
  titreEtapeRetirer,
  titreEtapesRecevoir
) => {
  if (!titreEtapeRetirer) return false

  if (!titreEtapeRetirer[relation] || !titreEtapeRetirer[relation].length) {
    return false
  }

  let titreEtapeRecevoir = titreEtapesRecevoir.find(
    e =>
      e.id !== titreEtapeRetirer.id &&
      exists(e[relation]) &&
      e[relation].length > 0
  )

  let move = false

  // aucune étape ne contient ces relations
  // on essaye de la déplacer dans la première étape correcte trouvée
  if (!titreEtapeRecevoir) {
    titreEtapeRecevoir = titreEtapesRecevoir.find(
      e => e.id !== titreEtapeRetirer.id
    )

    move = true
  }

  if (!titreEtapeRecevoir || titreEtapeRecevoir.id === titreEtapeRetirer.id) {
    return false
  }

  console.log(
    `\t relation of "${titreEtapeRetirer.typeId}" already in "${titreEtapeRecevoir.typeId}", remove ${relation}`
  )

  if (move === true) {
    titreEtapeRecevoir[relation] = titreEtapeRetirer[relation]
  }

  titreEtapeRetirer[relation] = []

  return true
}

const titreEtapeContenuModify = (
  fieldRetirer,
  titreEtapeRetirer,
  titreEtapesRecevoir
) => {
  if (!titreEtapeRetirer) return false

  if (!titreEtapeRetirer.contenu || !titreEtapeRetirer.contenu.onf) return false

  let valueRetirer = titreEtapeRetirer.contenu.onf[fieldRetirer]
  if (!exists(valueRetirer)) return false

  // on prend la première étape disponible
  // pas de duplication sur toutes étapes cibles
  const titreEtapeRecevoir = titreEtapesRecevoir[0]

  console.log(
    `\t from "${titreEtapeRetirer.typeId}" => "${titreEtapeRecevoir.typeId}" ${fieldRetirer}`
  )

  if (!titreEtapeRecevoir.contenu) {
    titreEtapeRecevoir.contenu = { onf: {} }
  }
  if (!titreEtapeRecevoir.contenu.onf) {
    titreEtapeRecevoir.contenu.onf = {}
  }

  const fieldRecevoir = fieldRetirer === 'mecanisee' ? 'mecanise' : fieldRetirer

  const valueRecevoir = titreEtapeRecevoir.contenu.onf[fieldRecevoir]

  // vérification qu'on n'écrase pas une valeur différente
  if (exists(valueRecevoir) && valueRecevoir !== valueRetirer) {
    console.error('!!!attention, ecrasement!!!')
    console.error(titreEtapeRetirer.id, valueRetirer)
    console.error(titreEtapeRecevoir.id, valueRecevoir)
    console.error('!!!attention, ecrasement!!!')

    valueRetirer = valueRecevoir
  }

  titreEtapeRecevoir.contenu.onf[fieldRecevoir] = valueRetirer

  if (
    titreEtapeRetirer.id !== titreEtapeRecevoir.id ||
    fieldRecevoir !== fieldRetirer
  ) {
    delete titreEtapeRetirer.contenu.onf[fieldRetirer]
  }

  return true
}

const titreEtapePropsModify = (
  field,
  titreEtapeRetirer,
  titreEtapesRecevoir
) => {
  if (!titreEtapeRetirer) return false

  let valueRetirer = titreEtapeRetirer[field]
  if (!exists(valueRetirer)) return false

  // on prend la première étape disponible
  // pas de duplication sur toutes les étapes cibles
  const titreEtapeRecevoir = titreEtapesRecevoir[0]

  console.log(
    `\t from "${titreEtapeRetirer.typeId}" => "${titreEtapeRecevoir.typeId}" ${field}`
  )

  const valueRecevoir = titreEtapeRecevoir[field]

  // vérification qu'on n'écrase pas une valeur différente
  if (exists(valueRecevoir) && valueRecevoir !== valueRetirer) {
    console.error('!!!attention, ecrasement!!!')
    console.error(titreEtapeRetirer.id, valueRetirer)
    console.error(titreEtapeRecevoir.id, valueRecevoir)
    console.error('!!!attention, ecrasement!!!')

    valueRetirer = valueRecevoir
  }

  titreEtapeRecevoir[field] = valueRetirer

  if (titreEtapeRetirer.id !== titreEtapeRecevoir.id) {
    delete titreEtapeRetirer[field]
  }

  return true
}

const titreEtapesRelationsRemove = (
  relation,
  titreEtapesRetirer,
  titreEtapesRecevoir
) => {
  titreEtapesRecevoir = existFilter(titreEtapesRecevoir)
  if (!titreEtapesRecevoir.length) return false

  return titreEtapesRetirer.reduce(
    (r, titreEtapeRetirer) =>
      titreEtapeRelationsRemove(
        relation,
        titreEtapeRetirer,
        titreEtapesRecevoir
      ) || r,
    false
  )
}

const titreEtapesContenuModify = (
  field,
  titreEtapesRetirer,
  titreEtapesRecevoir
) => {
  titreEtapesRecevoir = existFilter(titreEtapesRecevoir)
  if (!titreEtapesRecevoir.length) return false

  return titreEtapesRetirer.reduce(
    (r, titreEtapeRetirer) =>
      titreEtapeContenuModify(field, titreEtapeRetirer, titreEtapesRecevoir) ||
      r,
    false
  )
}

const titreEtapesPropsModify = (
  field,
  titreEtapesRetirer,
  titreEtapesRecevoir
) => {
  titreEtapesRecevoir = existFilter(titreEtapesRecevoir)
  if (!titreEtapesRecevoir.length) return false

  return titreEtapesRetirer.reduce(
    (r, titreEtapeRetirer) =>
      titreEtapePropsModify(field, titreEtapeRetirer, titreEtapesRecevoir) || r,
    false
  )
}

const titreEtapesFind = titreEtapes =>
  titreEtapes.reduce(
    (etapesTypes, e) => {
      if (etapesTypes[e.typeId] === undefined) {
        return etapesTypes
      }

      etapesTypes[e.typeId] = e

      return etapesTypes
    },
    { ...etapesTypes }
  )

const titreEtapesModify = ({ id, etapes: titreEtapes = [] } = {}) => {
  if (!titreEtapes.length) return false

  const { mfr, mdp, mcr, meo, eof, def, sco } = titreEtapesFind(titreEtapes)

  const titreEtapesRetirer = existFilter([mfr, mdp, mcr, meo])
  if (!titreEtapesRetirer.length) return false

  const modifs = [
    titreEtapesContenuModify(
      'foret',
      [mfr, mdp, mcr, meo],
      [eof, sco, def, meo, mdp, mfr]
    ),
    ...['mecanise', 'mecanisee'].map(field =>
      titreEtapesContenuModify(
        field,
        [mdp, mcr, meo, mfr],
        [sco, mfr, def, mdp, meo]
      )
    ),

    ...['duree', 'surface'].map(field =>
      titreEtapesPropsModify(field, [mdp, mcr, meo, eof, def], [sco, mfr, mdp])
    ),
    titreEtapesPropsModify(
      'dateFin',
      // attention: l'eof contient une date de fin
      // qui correspond à la date d'enregistrement
      // on ne la bouge pas
      [def, mdp, mcr, meo],
      [sco, mfr, mdp]
    ),
    ...['points', 'substances', 'titulaires', 'incertitudes'].map(relation =>
      titreEtapesRelationsRemove(
        relation,
        [def, mdp, meo, mcr],
        [sco, mfr, mdp]
      )
    )
  ]

  const modified = modifs.reduce((r, e) => r || e, false)

  if (modified) {
    // je ne sais pas pourquoi j'ai besoin de faire ça
    titreEtapes.forEach(e => delete e.pays)
  }

  return modified
}

async function main() {
  try {
    const titres = await titresGet({ typeIds: ['arm'] })

    console.log('titres ARM de Guyane :', titres.length)

    const titresDemarchesModifiees = titres.reduce(
      (titresDemarchesModifiees, titre) => {
        // if (titre.id !== 'm-arm-adolphe-crique-centrale-2019')
        // return titresDemarchesModifiees

        const titreDemarchesModifiees = titre.demarches.filter(
          titreEtapesModify
        )

        if (titreDemarchesModifiees.length) {
          titresDemarchesModifiees.push(...titreDemarchesModifiees)
        }

        return titresDemarchesModifiees
      },
      []
    )

    console.log('demarches modifiees:', titresDemarchesModifiees.length)

    await titresDemarchesModifiees.reduce(async (promise, demarche) => {
      await promise

      console.log(demarche.id)

      await titreDemarcheDelete(demarche.id)

      return titreDemarcheUpsert(demarche)
    }, null)
  } catch (error) {
    console.error(error)
  }

  process.exit()
}

main()
