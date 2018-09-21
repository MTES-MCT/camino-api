// const spreadsheetToJson = require('../_utils/_spreadsheet-to-json')

const PQueue = require('p-queue')
const decamelize = require('decamelize')
const GoogleSpreadsheet = require('google-spreadsheet')
const { titresGet } = require('../../../postgres/queries/titres')
const credentials = require('../credentials')

const worksheets = [
  {
    title: 'titres',
    headers: ['id', 'nom', 'typeId', 'domaineId', 'statutId', 'references']
  },
  {
    title: 'titresDemarches',
    headers: ['id', 'demarcheId', 'titreId', 'demarcheStatutId', 'ordre']
  },
  { title: 'titresPhases', headers: ['test'] },
  { title: 'titresEtapes', headers: ['test'] },
  { title: 'titresPoints', headers: ['test'] },
  { title: 'titresPointsReferences', headers: ['test'] },
  { title: 'titresDocuments', headers: ['test'] },
  { title: 'titresSubstances', headers: ['test'] },
  { title: 'titresTitulaires', headers: ['test'] },
  { title: 'titresAmodiataires', headers: ['test'] },
  { title: 'titresUtilisateurs', headers: ['test'] },
  { title: 'titresEmprises', headers: ['test'] },
  { title: 'titresErreurs', headers: ['test'] }
]

module.exports = async (spreadsheetId, domaineId) => {
  const titres = await titresGet({
    typeIds: undefined,
    domaineIds: [domaineId],
    statutIds: undefined,
    substances: undefined,
    noms: undefined
  })

  // instancie le constructeur
  const gss = new GoogleSpreadsheet(spreadsheetId)

  // authentification dans google
  await gssUseServiceAccountAuth(gss)

  // obtiens les infos sur la spreadsheet
  const infos = await gssGetInfo(gss)

  // si l'onglet 'tmp' n'existe pas, le créer
  if (!infos.worksheets.find(w => w.title === 'tmp')) {
    await worksheetAdd(gss, { title: 'tmp' })
  }

  // retourne un tableau des onglets à supprimer
  const worksheetsToRemove = infos.worksheets.filter(w => w.title !== 'tmp')

  // retourne un tableau avec les requêtes pour supprimer les onglets
  const worksheetToRemovePromises = worksheetsToRemove.map(w =>
    worksheetRemove(gss, w)
  )

  // supprime les onglets
  await Promise.all(worksheetToRemovePromises)

  // retourne un tableau avec les requêtes pour ajouter les nouveaux onglets
  const worksheetsToAddPromises = worksheets.map(({ title, headers }) => () =>
    worksheetAdd(gss, {
      title: decamelize(title),
      headers: headers.map(h => (h === 'id' ? 'Id' : h)),
      colCount: headers.length,
      rowCount: 1
    })
  )

  // on utilise une queue plutôt que Promise.all
  // pour que les onglets soient créés dans l'ordre
  const worksheetQueue = new PQueue({ concurrency: 1 })
  const worksheetsNew = await worksheetQueue.addAll(worksheetsToAddPromises)

  // renseigne l'id des worksheets créés dans le tableau original

  worksheets.forEach(w => {
    const worksheetNew = worksheetsNew.find(wn => wn.title === w.title)
    w.id = worksheetNew && worksheetNew.id
  })

  // est ce que l'onglet tmp existe ?
  const worksheetTmpToRemove = infos.worksheets.find(w => w.title === 'tmp')

  // si l'onglet 'tmp' existe, on le supprime
  if (worksheetTmpToRemove) {
    await worksheetRemove(gss, worksheetTmpToRemove)
  }

  const titresRowsToAddPromises = titres.map(titre => {
    const worksheet = worksheets.find(w => w.title === 'titres')
    const row = worksheet.headers.reduce(
      (r, header) =>
        titre[header]
          ? Object.assign(r, {
              [header === 'id' ? 'Id' : decamelize(header)]:
                header === 'references'
                  ? JSON.stringify(titre[header])
                  : titre[header]
            })
          : r,
      {}
    )

    return () => rowAdd(gss, worksheet.id, row)
  })

  // on utilise une queue plutôt que Promise.all
  // pour que les onglets soient créés dans l'ordre
  const titreRowsQueue = new PQueue({ concurrency: 20 })
  await titreRowsQueue.addAll(titresRowsToAddPromises)

  const worksheet = worksheets.find(w => w.title === 'titres')
  console.log(worksheet)
  const cellId = await cellsGet(gss, worksheet.id, {
    'min-row': 1,
    'max-row': 1,
    'min-col': 1,
    'max-col': 1
  })

  cellId[0].setValue('id', (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
}

const gssUseServiceAccountAuth = gss =>
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
        console.log(`row ajoutée: ${row.Id}`)
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
