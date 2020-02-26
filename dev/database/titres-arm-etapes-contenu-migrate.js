import titresContenuMigrate from './titres-contenu-migrate'

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

const ids = null && [
  'm-arm-affluents-crique-amadis-2019',
  'm-arm-cambrouze-2019',
  'm-arm-crique-saut-2010'
]

const options = {
  ids,
  typesIds: ['arm']
}

titresContenuMigrate(options, modifs)
