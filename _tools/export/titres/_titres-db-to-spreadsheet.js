// const spreadsheetToJson = require('../_utils/_spreadsheet-to-json')

const PQueue = require('p-queue')
const decamelize = require('decamelize')
const GoogleSpreadsheet = require('google-spreadsheet')
const { titresGet } = require('../../../postgres/queries/titres')
const credentials = require('../credentials')

const {
  gssUseServiceAccountAuth,
  gssGetInfo,
  worksheetRemove,
  worksheetAdd,
  rowAdd,
  cellsGet
} = require('../_utils/google-spreadsheet-promisify')

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
  await gssUseServiceAccountAuth(gss, credentials)

  // obtiens les infos sur la spreadsheet
  const infos = await gssGetInfo(gss)

  // si l'onglet 'tmp' n'existe pas, le créer
  if (!infos.worksheets.find(w => w.title === 'tmp')) {
    await worksheetAdd(gss, { title: 'tmp' })
  }

  // retourne un tableau des onglets à supprimer
  const worksheetsRemove = infos.worksheets.filter(w => w.title !== 'tmp')

  // retourne un tableau avec les requêtes pour supprimer les onglets
  const worksheetRemovePromises = worksheetsRemove.map(w =>
    worksheetRemove(gss, w)
  )

  // supprime les onglets
  await Promise.all(worksheetRemovePromises)

  // retourne un tableau avec les requêtes pour ajouter les nouveaux onglets
  const worksheetsAddPromises = worksheets.map(({ title, headers }) => () =>
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
  const worksheetsNew = await worksheetQueue.addAll(worksheetsAddPromises)

  // renseigne l'id des worksheets créées
  worksheets.forEach(w => {
    const worksheetNew = worksheetsNew.find(
      wn => wn.title === decamelize(w.title)
    )
    w.id = worksheetNew && worksheetNew.id
  })

  // est ce que l'onglet tmp existe ?
  const worksheetTmpRemove = infos.worksheets.find(w => w.title === 'tmp')

  // si l'onglet 'tmp' existe, on le supprime
  if (worksheetTmpRemove) {
    await worksheetRemove(gss, worksheetTmpRemove)
  }

  const titresRowsAddPromises = titres.map(titre => {
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
  // pour éviter une erreur de saturation de google api
  const titreRowsQueue = new PQueue({ concurrency: 20 })
  await titreRowsQueue.addAll(titresRowsAddPromises)

  const titresDemarchesRowsAddPromises = titres.reduce((res, titre) => {
    const worksheet = worksheets.find(w => w.title === 'titresDemarches')
    const titreDemarchesRowsAddPromises = titre['demarches'].map(d => {
      const row = worksheet.headers.reduce(
        (r, header) =>
          Object.assign(r, {
            [header === 'id' ? 'Id' : decamelize(header)]: d[header]
          }),
        {}
      )
      return () => rowAdd(gss, worksheet.id, row)
    })
    return [...res, ...titreDemarchesRowsAddPromises]
  }, [])

  // on utilise une queue plutôt que Promise.all
  // pour éviter une erreur de saturation de google api
  const titresDemarchesRowsQueue = new PQueue({ concurrency: 20 })
  await titresDemarchesRowsQueue.addAll(titresDemarchesRowsAddPromises)

  const worksheetsWithId = worksheets.filter(w =>
    w.headers.find(h => h === 'id')
  )

  worksheetsWithId.forEach(async worksheet => {
    const cellIds = await cellsGet(gss, worksheet.id, {
      'min-row': 1,
      'max-row': 1,
      'min-col': 1,
      'max-col': 1
    })

    cellIds[0].setValue('id', (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    })
  })
}
