const entreprisesR = require('../sources/repertoire-entreprises-r.json')
const entreprisesC = require('../sources/repertoire-entreprises-c.json')
const entreprisesF = require('../sources/repertoire-entreprises-f.json')
const entreprisesG = require('../sources/repertoire-entreprises-g.json')
const entreprisesH = require('../sources/repertoire-entreprises-h.json')
const entreprisesM = require('../sources/repertoire-entreprises-m.json')
const entreprisesM973 = require('../sources/repertoire-entreprises-m973.json')
const entreprisesS = require('../sources/repertoire-entreprises-s.json')
const entreprisesW = require('../sources/repertoire-entreprises-w.json')

const entreprises = [
  ...entreprisesC,
  ...entreprisesF,
  ...entreprisesG,
  ...entreprisesH,
  ...entreprisesM,
  ...entreprisesM973,
  ...entreprisesR,
  ...entreprisesS,
  ...entreprisesW
]

const titulairesR = require('../sources/titres-r-titulaires.json')
const titulairesC = require('../sources/titres-c-titulaires.json')
const titulairesF = require('../sources/titres-f-titulaires.json')
const titulairesG = require('../sources/titres-g-titulaires.json')
const titulairesH = require('../sources/titres-h-titulaires.json')
const titulairesM = require('../sources/titres-m-titulaires.json')
const titulairesM973 = require('../sources/titres-m973-titulaires.json')
const titulairesS = require('../sources/titres-s-titulaires.json')
const titulairesW = require('../sources/titres-w-titulaires.json')

const titulaires = [
  ...titulairesR,
  ...titulairesC,
  ...titulairesF,
  ...titulairesG,
  ...titulairesH,
  ...titulairesM,
  ...titulairesM973,
  ...titulairesS,
  ...titulairesW
]

// demarches.forEach(d => {
//   const ti = titres.find(t => t.id === d.titre_id)
//   if (!ti) console.log(d.titre_id)
// })

titulaires.forEach(t => {
  const d = entreprises.find(e => e.id === t.entreprise_id)
  if (!d) {
    console.log(t.titre_etape_id, t.entreprise_id)
  }
})
