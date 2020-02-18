import 'dotenv/config'
import '../../../database/index'

import { transaction } from 'objection'

import { titresGet } from '../../../database/queries/titres'
import {
  titreDemarcheUpsert,
  titreDemarcheDelete
} from '../../../database/queries/titres-demarches'
import TitresDemarches from '../../../database/models/titres-demarches'

const valueExists = a => a !== undefined && a !== null

const objectValueGet = (object, prop) =>
  prop.split('.').reduce((r, f) => r && r[f], object)

const objectValueDelete = (object, prop) =>
  prop.split('.').reduce((r, f, i, arr) => {
    if (i === arr.length - 1) {
      delete r[f]
    }

    return r && r[f]
  }, object)

const objectValueSet = (object, prop, value) => {
  prop.split('.').reduce((r, f, i, arr) => {
    if (i === arr.length - 1) {
      r[f] = value
    } else if (!r[f]) {
      r[f] = {}
    }

    return r && r[f]
  }, object)

  return object
}

const titreEtapeCopy = ({ props, condition }, titreEtapeFrom, titreEtapes) => {
  if (
    condition &&
    typeof condition === 'function' &&
    !condition(titreEtapeFrom, titreEtapes)
  ) {
    return false
  }

  const etapeCopy = JSON.parse(JSON.stringify(titreEtapeFrom))

  Object.keys(props).forEach(prop => {
    const value =
      typeof props[prop] === 'function'
        ? props[prop](titreEtapeFrom, titreEtapes)
        : props[prop] && typeof props[prop] === 'object'
        ? Object.assign(titreEtapeFrom[prop] || {}, props[prop])
        : props[prop]

    etapeCopy[prop] = value
  })

  titreEtapes.push(etapeCopy)

  return true
}

const titreEtapeRelationMove = (
  { relation, condition, targets },
  titreEtapeFrom,
  titreEtapes
) => {
  if (!titreEtapeFrom) return false

  if (
    !(Array.isArray(titreEtapeFrom[relation])
      ? titreEtapeFrom[relation].length > 0
      : titreEtapeFrom[relation] !== null)
  ) {
    return false
  }

  const titreEtapesTo = targets.reduce(
    (r, t) => r.concat(titreEtapes.filter(e => e.typeId === t)),
    []
  )

  let titreEtapeTo = titreEtapesTo.find(
    e =>
      e.typeId !== titreEtapeFrom.typeId &&
      (Array.isArray(e[relation])
        ? e[relation].length > 0
        : e[relation] !== null)
  )

  let move = false

  // aucune étape ne contient ces relations
  // on essaye de la déplacer dans la première étape correcte trouvée
  if (!titreEtapeTo) {
    titreEtapeTo = titreEtapesTo.find(e => e.typeId !== titreEtapeFrom.typeId)

    move = true
  }

  if (!titreEtapeTo || titreEtapeTo.typeId === titreEtapeFrom.typeId) {
    return false
  }

  // si il y a une condition à la suppression / mouvement de relation
  // et qu'elle n'est pas positive, alors on ne fait rien
  if (
    typeof condition === 'function' &&
    !condition(titreEtapeTo, titreEtapeFrom)
  ) {
    console.log(
      'condition non remplie',
      condition.toString(),
      condition(titreEtapeFrom)
    )

    return false
  }

  if (move === true) {
    titreEtapeTo[relation] = titreEtapeFrom[relation]

    console.log(
      `\t from "${titreEtapeFrom.typeId}" => "${titreEtapeTo.typeId}" : move ${relation}`
    )
  } else {
    console.log(
      `\t from "${titreEtapeFrom.typeId}" => "${titreEtapeTo.typeId}" : delete ${relation}`
    )
  }

  titreEtapeFrom[relation] = null

  return true
}

const titreEtapeValueModify = (
  { valueProp, condition, changeTo },
  titreEtapeFrom
) => {
  if (!titreEtapeFrom) return false

  const valueFrom = objectValueGet(titreEtapeFrom, valueProp)
  if (!valueExists(valueFrom)) return false

  if (
    condition &&
    !(typeof condition === 'function'
      ? condition(titreEtapeFrom)
      : valueFrom === condition)
  ) {
    return false
  }

  console.log(
    `\t from "${titreEtapeFrom.typeId}" : ${valueProp} "${valueFrom}" = "${condition}", set to "${changeTo}"`
  )

  const valueTo =
    typeof changeTo === 'function' ? changeTo(titreEtapeFrom) : changeTo

  objectValueSet(titreEtapeFrom, valueProp, valueTo)

  return true
}

const titreEtapePropModify = (
  { prop: propFrom, moveTo: propTo = propFrom, targets, overwrite = true },
  titreEtapeFrom,
  titreEtapes
) => {
  if (!titreEtapeFrom) return false

  let valueFrom = objectValueGet(titreEtapeFrom, propFrom)
  if (!valueExists(valueFrom)) return false

  // on prend la première étape disponible
  // pas de duplication sur toutes étapes cibles
  const titreEtapeTo =
    (targets &&
      targets.reduce(
        (e, t) => e || titreEtapes.find(e => e.typeId === t),
        null
      )) ||
    titreEtapeFrom

  const valueTo = objectValueGet(titreEtapeTo, propTo)

  // si l'étape cible contient une valeur définie
  if (valueExists(valueTo)) {
    // si les valeurs sont différentes
    if (valueTo !== valueFrom) {
      console.error('!!! attention, ecrasement !!!')

      // si on ne doit pas écraser
      // alors on écrase la cible avec la valeur de la source
      if (overwrite === true) {
        console.error('ecrasement', titreEtapeFrom.id, propFrom, valueFrom)
        console.error('ecrasement', titreEtapeTo.id, propTo, valueTo)
      } else {
        // sinon, on garde la valeur d'origine
        console.error('conservation', titreEtapeFrom.id, propFrom, valueFrom)
        console.error('conservation', titreEtapeTo.id, propTo, valueTo)

        valueFrom = valueTo
      }
    } else if (titreEtapeFrom.typeId === titreEtapeTo.typeId) {
      // si les valeurs sont les mêmes
      // et si le type d'étape est identique
      // alors il n'y a rien à faire
      return false
    }
  }

  console.log(
    `\t from "${titreEtapeFrom.typeId}" => "${titreEtapeTo.typeId}" : ${propFrom} => ${propTo} (${valueFrom})`
  )

  objectValueSet(titreEtapeTo, propTo, valueFrom)

  // si l'étape cible est différente de la source
  // ou si le champ cible est différent du champ source
  // alors supprime le champ
  if (titreEtapeFrom.typeId !== titreEtapeTo.typeId || propTo !== propFrom) {
    objectValueDelete(titreEtapeFrom, propFrom)
  }

  return true
}

const titreEtapeModify = (modifs, titreEtape, titreEtapes) =>
  Object.keys(modifs).reduce((modifications, name) => {
    const modif = modifs[name]

    let modification

    if (modif.prop) {
      modification = titreEtapePropModify(modif, titreEtape, titreEtapes)
    } else if (modif.valueProp) {
      modification = titreEtapeValueModify(modif, titreEtape, titreEtapes)
    } else if (modif.relation) {
      modification = titreEtapeRelationMove(modif, titreEtape, titreEtapes)
    } else if (modif.copy) {
      modification = titreEtapeCopy(modif, titreEtape, titreEtapes)
    } else {
      throw new Error(`unknown modification ${JSON.stringify(modif)}`)
    }

    modifications[name] = modification

    return modifications
  }, {})

const titreEtapesModify = (modifs, { etapes: titreEtapes = [] } = {}) => {
  if (!titreEtapes.length) return false

  const modifications = titreEtapes.reduce((modifications, titreEtape) => {
    const { typeId } = titreEtape

    if (!modifs[typeId]) return modifications

    modifications[typeId] = titreEtapeModify(
      modifs[typeId],
      titreEtape,
      titreEtapes
    )

    return modifications
  }, {})

  const modified = Object.values(modifications).reduce(
    (r, e) => r || Object.keys(e).reduce((r, k) => r || e[k], r),
    false
  )

  if (modified) {
    // je ne sais pas pourquoi j'ai besoin de faire ça
    titreEtapes.forEach(e => delete e.pays)
  }

  return modified
}

const titresDemarchesModifiesSave = async titresDemarchesModifiees =>
  titresDemarchesModifiees.reduce(async (promise, demarche) => {
    await promise

    console.log('save:', demarche.id)

    const knex = TitresDemarches.knex()

    return transaction(knex, async tr => {
      await titreDemarcheDelete(demarche.id, tr)

      return titreDemarcheUpsert(demarche, tr)
    })
  }, null)

const titresDemarchesModifieesGet = (modifs, titres) =>
  titres.reduce((titresDemarchesModifiees, titre) => {
    console.log(titre.id)

    const titreDemarchesModifiees = titre.demarches.filter(d =>
      titreEtapesModify(modifs, d)
    )

    if (titreDemarchesModifiees.length) {
      titresDemarchesModifiees.push(...titreDemarchesModifiees)
    }

    return titresDemarchesModifiees
  }, [])

async function titresContenuMigrate(options, modifs) {
  try {
    const titres = await titresGet(options)

    console.log('titres à traîter :', titres.length)

    const titresDemarchesModifiees = titresDemarchesModifieesGet(modifs, titres)

    console.log('demarches modifiees :', titresDemarchesModifiees.length)

    await titresDemarchesModifiesSave(titresDemarchesModifiees)
  } catch (error) {
    console.error(error)
  }

  process.exit()
}

export default titresContenuMigrate
