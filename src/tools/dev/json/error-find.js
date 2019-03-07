const entreprisesR = require('../../../../sources/entreprises-titres-r.json')
const entreprisesC = require('../../../../sources/entreprises-titres-c.json')
const entreprisesF = require('../../../../sources/entreprises-titres-f.json')
const entreprisesG = require('../../../../sources/entreprises-titres-g.json')
const entreprisesH = require('../../../../sources/entreprises-titres-h.json')
const entreprisesM = require('../../../../sources/entreprises-titres-m.json')
const entreprisesM973 = require('../../../../sources/entreprises-titres-m973.json')
const entreprisesS = require('../../../../sources/entreprises-titres-s.json')
const entreprisesW = require('../../../../sources/entreprises-titres-w.json')
const titulairesR = require('../../../../sources/titres-r-titres-titulaires.json')
const titulairesC = require('../../../../sources/titres-c-titres-titulaires.json')
const titulairesF = require('../../../../sources/titres-f-titres-titulaires.json')
const titulairesG = require('../../../../sources/titres-g-titres-titulaires.json')
const titulairesH = require('../../../../sources/titres-h-titres-titulaires.json')
const titulairesM = require('../../../../sources/titres-m-titres-titulaires.json')
const titulairesM973 = require('../../../../sources/titres-m973-titres-titulaires.json')
const titulairesS = require('../../../../sources/titres-s-titres-titulaires.json')
const titulairesW = require('../../../../sources/titres-w-titres-titulaires.json')

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
