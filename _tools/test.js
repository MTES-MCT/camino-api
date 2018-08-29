const entreprisesA = require('./sources/repertoire-entreprises-a.json')
const entreprisesC = require('./sources/repertoire-entreprises-c.json')
const entreprisesF = require('./sources/repertoire-entreprises-f.json')
const entreprisesG = require('./sources/repertoire-entreprises-g.json')
const entreprisesH = require('./sources/repertoire-entreprises-h.json')
const entreprisesM = require('./sources/repertoire-entreprises-m.json')
const entreprisesM973 = require('./sources/repertoire-entreprises-m973.json')
const entreprisesS = require('./sources/repertoire-entreprises-s.json')
const entreprisesW = require('./sources/repertoire-entreprises-w.json')

const entreprises = [
  ...entreprisesA,
  ...entreprisesC,
  ...entreprisesF,
  ...entreprisesG,
  ...entreprisesH,
  ...entreprisesM,
  ...entreprisesM973,
  ...entreprisesS,
  ...entreprisesW
]

const titulaires = require('./sources/titres-h-titulaires.json')

// demarches.forEach(d => {
//   const ti = titres.find(t => t.id === d.titre_id)
//   if (!ti) console.log(d.titre_id)
// })

titulaires.forEach(t => {
  const d = entreprises.find(e => e.id === t.entreprise_id)
  if (!d) {
    console.log(t.titre_etape_id)
  }
})
