import titresContenuMigrate from './titres-contenu-migrate'

const targets = ['mfr']

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

const defCopyToMfr = {
  copy: true,
  // ne crée une copie de la def vers une étape de demande
  // seulement si le statut de la def est rejeté
  // et qu'il n'existe pas encore d'étape de demande
  condition: (e, etapes) =>
    e.statutId === 'rej' && !etapes.find(ee => ee.typeId === 'mfr'),
  props: {
    id: e => e.id.replace('def', 'mfr'),
    typeId: 'mfr',
    type: null,
    statutId: 'fai',
    statut: null,
    // récupère la date non incertaine de l'étape la plus ancienne
    date: (e, etapes) =>
      etapes.reduce((a, b) =>
        a.date < b.date && !(a.incertitudes && a.incertitudes.date) ? a : b
      ).date,
    incertitudes: {
      date: true
    }
  }
}

// les incertitudes peuvent être sur les dates ou les points
// en fonction des relations, on ne les bouge pas
// elles sont donc traitées à part
const incertitudesMove = {
  relation: 'incertitudes',
  condition: e => e.points && e.points.length,
  targets
}

const modifs = {
  def: {
    defCopyToMfr,
    ...relationsMove,
    incertitudesMove
  }
}

const ids = null && [
  'm-arm-affluents-crique-amadis-2019',
  'm-arm-cambrouze-2019',
  'm-arm-crique-saut-2010'
]

const options = {
  ids, // : ['m-ar-apatou-2003'],
  titresIds: ['m'],
  typesIds: ['ar']
}

titresContenuMigrate(options, modifs)
