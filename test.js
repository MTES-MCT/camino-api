const etapes = require('./_tools/sources/titres-h-etapes.json')
const documents = require('./_tools/sources/titres-h-documents.json')

// demarches.forEach(d => {
//   const ti = titres.find(t => t.id === d.titre_id)
//   if (!ti) console.log(d.titre_id)
// })

documents.forEach(d => {
  const eta = etapes.find(e => e.id === d.titre_etape_id)
  if (!eta) {
    console.log(d.id)
  }
})
