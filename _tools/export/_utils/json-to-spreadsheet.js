const PQueue = require('p-queue')
const GoogleSpreadsheet = require('google-spreadsheet')
const decamelize = require('decamelize')

const {
  gssUseServiceAccountAuth,
  gssGetInfo,
  worksheetRemove,
  worksheetAdd,
  rowAdd,
  cellsGet,
  cellValueSet
} = require('./google-spreadsheet-promisify')

const dbToSpreadsheet = async (spreadsheetId, credentials, tables, content) => {
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
  const worksheetsPromises = tables.map(({ name, columns }) => () =>
    worksheetAdd(gss, {
      title: decamelize(name),
      // id est un mot clé reservé par l'API google
      // pour contourner cette limitation, on converti id en Id
      // on le convertira à nouveau en id ensuite
      headers: columns.map(h => (h === 'id' ? 'Id' : decamelize(h))),
      colCount: columns.length,
      rowCount: 1
    })
  )

  // on utilise une queue plutôt que Promise.all
  // pour que les onglets soient créés dans l'ordre
  const worksheetQueue = new PQueue({ concurrency: 1 })
  const worksheets = await worksheetQueue.addAll(worksheetsPromises)

  // est ce que l'onglet tmp existe ?
  const worksheetTmpRemove = infos.worksheets.find(w => w.title === 'tmp')

  // si l'onglet 'tmp' existe, on le supprime
  if (worksheetTmpRemove) {
    await worksheetRemove(gss, worksheetTmpRemove)
  }

  // pour chaque table,
  tables.forEach(table => {
    // renseigne l'id des worksheets créées
    const worksheet = worksheets.find(w => w.title === decamelize(table.name))
    table.worksheetId = worksheet && worksheet.id

    // retourne les rows mis au format
    table.rows = rowsCreate(content, table.parents).map(row =>
      rowFormat(row, table.columns, table.callbacks)
    )
  })

  // retourne un tableau avec les requêtes pour ajouter les nouveaux rows
  const rowPromises = tables.reduce(
    (res, table) => [
      ...res,
      ...table.rows.map(row => () => rowAdd(gss, table, row))
    ],
    []
  )

  // utilise une queue plutôt que Promise.all
  // pour éviter de saturer l'API google
  const rowsQueue = new PQueue({ concurrency: 15 })
  await rowsQueue.addAll(rowPromises)

  // converti le champs Id en id
  const tablesWithId = tables.filter(w => w.columns.find(h => h === 'id'))

  await tablesWithId.forEach(async table => {
    const cells = await cellsGet(gss, table.worksheetId, {
      'min-row': 1,
      'max-row': 1,
      'min-col': 1,
      'max-col': 1
    })

    await cellValueSet(cells[0], 'id')
  })
}

const rowsCreate = (elements, parents) => {
  return parents && parents.length
    ? elements.reduce(
        (r, e) =>
          e[parents[0]]
            ? [...r, ...rowsCreate(e[parents[0]], parents.slice(1))]
            : r,
        []
      )
    : Array.isArray(elements)
      ? elements
      : [elements]
}

const rowFormat = (element, columns, callbacks) =>
  columns.reduce(
    (r, header) =>
      element[header]
        ? Object.assign(r, {
            // id est un mot clé réservé par google
            // pour contourner cette limitation, on converti id en Id
            [header === 'id' ? 'Id' : decamelize(header)]:
              callbacks && Object.keys(callbacks).find(cb => cb === header)
                ? callbacks[header](element[header])
                : element[header]
          })
        : r,
    {}
  )

module.exports = dbToSpreadsheet
