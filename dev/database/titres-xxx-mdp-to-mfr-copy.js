import titresContenuMigrate from './titres-contenu-migrate'

const targets = ['mfr']

const relationsMove = [
  'points',
  'substances',
  'titulaires',
  'administrations',
  'communes',
  'documents'
].reduce((r, relation) => {
  r[relation] = {
    relation,
    targets
  }

  return r
}, {})

const mdpCopyToMfr = {
  copy: true,
  // ne crée une copie de la mdp vers une `mfr`
  // seulement s'il n'en existe pas encore une
  condition: (e, etapes) => !etapes.find(ee => ee.typeId === 'mfr'),
  props: {
    id: e => e.id.replace('mdp', 'mfr'),
    typeId: 'mfr',
    type: null,
    contenu: e => {
      const { contenu } = e

      // supprime le contenu de la `mdp` pour le mettre dans la `mfr`
      e.contenu = null

      return contenu
    },
    incertitudes: e => ({
      titreEtapeId: e.id.replace('mdp', 'mfr'),
      ...e.incertitudes,
      date: true
    })
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
  mdp: {
    mdpCopyToMfr,
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
  ids // : ['m-ar-apatou-2003'],
  // titreIds: ['m'],
  // typesIds: ['ar']
}

titresContenuMigrate(options, modifs)
