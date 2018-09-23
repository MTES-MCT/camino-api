const gssUseServiceAccountAuth = (gss, credentials) =>
  new Promise((resolve, reject) =>
    gss.useServiceAccountAuth(credentials, (err, res) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('authentification: succès')
        resolve(res)
      }
    })
  )

const gssGetInfo = gss =>
  new Promise((resolve, reject) =>
    gss.getInfo((err, res) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('spreadsheet:', res.title)
        resolve(res)
      }
    })
  )

const worksheetRemove = (gss, worksheet) =>
  new Promise((resolve, reject) => {
    gss.removeWorksheet(worksheet.id, (err, res) => {
      if (err) {
        console.log('nop ', err)
        reject(err)
      } else {
        console.log(`worksheet supprimée: ${worksheet.title}`)
        resolve(res)
      }
    })
  })

const worksheetAdd = (gss, worksheet) =>
  new Promise((resolve, reject) =>
    gss.addWorksheet(worksheet, (err, res) => {
      if (err) {
        reject(err)
      } else {
        console.log(`worksheet ajoutée: ${worksheet.title}`)
        resolve(res)
      }
    })
  )

const rowAdd = (gss, worksheetId, row) =>
  new Promise((resolve, reject) =>
    gss.addRow(worksheetId, row, (err, res) => {
      if (err) {
        reject(err)
      } else {
        console.log(`row ajouté: ${row.Id}`)
        resolve(res)
      }
    })
  )

const cellsGet = (gss, worksheetId, options) =>
  new Promise((resolve, reject) =>
    gss.getCells(worksheetId, options, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  )

module.exports = {
  gssUseServiceAccountAuth,
  gssGetInfo,
  worksheetRemove,
  worksheetAdd,
  rowAdd,
  cellsGet
}
