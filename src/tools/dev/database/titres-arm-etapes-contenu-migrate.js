import 'dotenv/config'
import '../../../database/index'

import { titresGet } from '../../../database/queries/titres'
import {
  titreDemarcheUpsert,
  titreDemarcheDelete
} from '../../../database/queries/titres-demarches'

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
    console.log('condition non remplie', condition, condition(titreEtapeFrom))
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
  { valueProp, condition, changeTo, targets },
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
    } else {
      throw new Error(`unknown modification ${JSON.stringify(modif)}`)
    }

    modifications[name] = modification

    return modifications
  }, {})

const onfContenuRename = {
  prop: 'contenu.onf',
  moveTo: 'contenu.arm'
}

const paiementContenuRename = {
  prop: 'contenu.onf',
  moveTo: 'contenu.paiement'
}

const ptmgContenuRename = {
  prop: 'contenu.onf',
  moveTo: 'contenu.ptmg'
}

const targets = ['sco', 'aco', 'mfr', 'def']

const foretMove = {
  prop: 'contenu.arm.foret',
  targets: ['meo']
}

const mecaniseMove = {
  prop: 'contenu.arm.mecanise',
  targets,
  // on garde la valeur d'origine (ex : `mdp` vers `aco`)
  // m-arm-eau-blanche-2019-pro01-mdp01
  overwrite: false
}

const mecaniseeRename = {
  prop: 'contenu.arm.mecanisee',
  moveTo: 'contenu.arm.mecanise',
  // on garde la valeur d'origine (ex : { mecanisee: false, mecanise: true })
  // m-arm-crique-emmanuel-2017-oct01-mfr01
  overwrite: false
}

const mecaniseeMove = {
  ...mecaniseeRename,
  targets
}

// m-arm-crique-grand-moussinga-2019-oct01-mdp01
const mecanisePropToContenuMove = {
  prop: 'mecanise',
  moveTo: 'contenu.arm.mecanise',
  targets
}

const signataireContenuMove = {
  prop: 'contenu.arm.signataire',
  moveTo: 'contenu.suivi.signataire'
}

const agentContenuMove = {
  prop: 'contenu.arm.agent',
  moveTo: 'contenu.suivi.agent'
}

const dateFinMove = {
  prop: 'dateFin',
  targets,
  // on écrase la valeur (ex : `def` vers `sco`)
  overwrite: true
}

const dureeMove = {
  prop: 'duree',
  targets
}

const surfaceMove = {
  prop: 'surface',
  targets,
  // on écrase la valeur (ex : `def` vers `sco`)
  overwrite: true
}

const statutIdNfaChange = {
  valueProp: 'statutId',
  condition: 'nfa',
  changeTo: 'fai'
}

const statutNfaChange = {
  valueProp: 'statut',
  condition: e => e.statut.id === 'nfa',
  changeTo: null
}

const statutIdAccChange = {
  valueProp: 'statutId',
  condition: 'acc',
  changeTo: 'fai'
}

const statutAccChange = {
  valueProp: 'statut',
  condition: e => e.statut.id === 'acc',
  changeTo: null
}

const relationsMove = [
  'points',
  'substances',
  'titulaires',
  'administrations',
  'communes'
].reduce((r, relation) => {
  r[relation] = {
    relation,
    targets
  }

  return r
}, {})

// les incertitudes peuvent être sur les dates ou les points
// en fonction des relations, on ne les bouge pas
// elles sont donc traitées à part
const incertitudesMove = {
  relation: 'incertitudes',
  condition: e => e.points && e.points.length,
  targets
}

const modifs = {
  mfr: {
    onfContenuRename,
    mecaniseeRename,
    dateFinMove
  },
  mdp: {
    onfContenuRename,
    foretMove,
    mecanisePropToContenuMove,
    mecaniseeMove,
    mecaniseMove,
    dureeMove,
    surfaceMove,
    ...relationsMove
  },
  pfd: {
    paiementContenuRename
  },
  mcr: {
    ptmgContenuRename,
    ...relationsMove
  },
  meo: {
    mecaniseeMove,
    mecaniseMove,
    dureeMove,
    surfaceMove,
    ...relationsMove,
    // les incertitudes de points sont bougées seulement depuis les MEO
    incertitudesMove
  },
  eof: {
    statutIdNfaChange,
    statutNfaChange
  },
  def: {
    onfContenuRename,
    foretMove,
    mecaniseeMove,
    mecaniseMove,
    dateFinMove,
    dureeMove,
    surfaceMove,
    ...relationsMove
  },
  sco: {
    onfContenuRename,
    statutIdAccChange,
    statutAccChange,
    signataireContenuMove,
    agentContenuMove
  },
  aco: {
    onfContenuRename,
    signataireContenuMove,
    agentContenuMove
  }
}

const titreEtapesModify = (modifs, { id, etapes: titreEtapes = [] } = {}) => {
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

    await titreDemarcheDelete(demarche.id)

    return titreDemarcheUpsert(demarche)
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

async function main(modifs) {
  try {
    const ids = null && [
      'm-arm-affluents-crique-amadis-2019',
      'm-arm-cambrouze-2019',
      'm-arm-crique-saut-2010'
    ]

    const titres = await titresGet({
      ids,
      typeIds: ['arm']
    })

    console.log('titres ARM de Guyane :', titres.length)

    const titresDemarchesModifiees = titresDemarchesModifieesGet(
      modifs,
      titres //.filter(t => t.id === 'm-arm-belle-helene-2014')
    )

    console.log('demarches modifiees:', titresDemarchesModifiees.length)

    await titresDemarchesModifiesSave(titresDemarchesModifiees)
  } catch (error) {
    console.error(error)
  }

  process.exit()
}

main(modifs)
