const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']
const documents = require('../../sources/documents.json')

const etapes = domainesIds.reduce((acc, domaineId) => {
  const e = require(`../../sources/titres-${domaineId}-titres-etapes.json`)

  acc = acc.concat(e)

  return acc
}, [])

const justificatifs = domainesIds.reduce((acc, domaineId) => {
  const j = require(`../../sources/titres-${domaineId}-titres-etapes-justificatifs.json`)

  acc = acc.concat(j)

  return acc
}, [])

documents.forEach(d => {
  if (d.titre_etape_id) {
    const etape = etapes.find(e => e.id === d.titre_etape_id)

    if (!etape) {
      console.infos(etape.id)
      console.infos('---->', d)
    }
  }
})

justificatifs.forEach(j => {
  const etape = etapes.find(e => e.id === j.titre_etape_id)

  if (!etape) {
    console.infos(etape.id)
    console.infos('---->', j)
  }
})
