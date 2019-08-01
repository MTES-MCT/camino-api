const entreprisesR = require('../../../../sources/entreprises-titres-r.json')
const entreprisesC = require('../../../../sources/entreprises-titres-c.json')
const entreprisesF = require('../../../../sources/entreprises-titres-f.json')
const entreprisesG = require('../../../../sources/entreprises-titres-g.json')
const entreprisesH = require('../../../../sources/entreprises-titres-h.json')
const entreprisesM = require('../../../../sources/entreprises-titres-m.json')
const entreprisesS = require('../../../../sources/entreprises-titres-s.json')
const entreprisesW = require('../../../../sources/entreprises-titres-w.json')
const titulairesR = require('../../../../sources/titres-r-titres-titulaires.json')
const titulairesC = require('../../../../sources/titres-c-titres-titulaires.json')
const titulairesF = require('../../../../sources/titres-f-titres-titulaires.json')
const titulairesG = require('../../../../sources/titres-g-titres-titulaires.json')
const titulairesH = require('../../../../sources/titres-h-titres-titulaires.json')
const titulairesM = require('../../../../sources/titres-m-titres-titulaires.json')
const titulairesS = require('../../../../sources/titres-s-titres-titulaires.json')
const titulairesW = require('../../../../sources/titres-w-titres-titulaires.json')

const entreprises = [].concat(
  entreprisesC,
  entreprisesF,
  entreprisesG,
  entreprisesH,
  entreprisesM,
  entreprisesR,
  entreprisesS,
  entreprisesW
)

const titulaires = [].concat(
  titulairesR,
  titulairesC,
  titulairesF,
  titulairesG,
  titulairesH,
  titulairesM,
  titulairesS,
  titulairesW
)

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
