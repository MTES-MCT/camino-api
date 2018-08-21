const spreadsheetToJson = require('../_utils/_spreadsheet-to-json')
const filePathCreate = require('../_utils/file-path-create')

const jsonParse = value => json =>
  json.map(j =>
    Object.keys(j).reduce((res, cur) => {
      res[cur] = cur === value ? JSON.parse(j[cur]) : j[cur]
      return res
    }, {})
  )

const tables = [
  { name: '', cb: jsonParse('references') },
  { name: '_demarches', cb: null },
  { name: '_etapes', cb: jsonParse('visas') },
  { name: '_points', cb: null },
  { name: '_points_references', cb: null },
  { name: '_documents', cb: null },
  { name: '_substances', cb: null },
  { name: '_titulaires', cb: null },
  { name: '_amodiataires', cb: null },
  { name: '_utilisateurs', cb: null },
  { name: '_emprises', cb: null },
  { name: '_verifications', cb: null }
]

module.exports = async (spreadsheetId, domaineId) =>
  Promise.all([
    ...tables.map(t => {
      return spreadsheetToJson(
        filePathCreate(`titres_${domaineId}${t.name}`),
        spreadsheetId,
        `titres${t.name}`,
        t.cb
      )
    })
  ])
