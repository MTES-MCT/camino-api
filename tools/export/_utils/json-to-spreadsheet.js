const PQueue = require('p-queue')
const GoogleSpreadsheet = require('google-spreadsheet')
const decamelize = require('decamelize')
const rowFormat = require('./row-format')

const {
  gssUseServiceAccountAuth,
  gssGetInfo,
  worksheetRemove,
  worksheetAdd,
  rowAdd,
  cellsGet,
  cellSet
} = require('./google-spreadsheet-promisify')

const jsonToSpreadsheet = async (
  spreadsheetId,
  credentials,
  tables,
  content
) => {
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
    (promises, table) => [
      ...promises,
      ...table.rows.map(row => () => rowAdd(gss, table.worksheetId, row))
    ],
    []
  )

  // utilise une queue plutôt que Promise.all
  // pour éviter de saturer l'API google
  const rowsQueue = new PQueue({ concurrency: 15 })
  await rowsQueue.addAll(rowPromises)

  // converti le champs Id en id
  const tablesWithId = tables.filter(w => w.columns.find(h => h === 'id'))

  await Promise.all(
    tablesWithId.map(async table => {
      const cells = await cellsGet(gss, table.worksheetId, {
        'min-row': 1,
        'max-row': 1,
        'min-col': 1,
        'max-col': 1
      })

      await cellSet(cells[0], 'id')
    })
  )
}

// fonction récursive qui parcourt les 'elements' (p.e.: 'titres')
// en descendant la chaîne de 'parents' (p.e.: ['demarches', 'etapes', 'points'])
// et retourne un tableau avec les éléments à convertir en 'rows'
// ceux dont le nom correspond à la dernière entrée parmi les parents
// (p.e.: des 'points')
// in:
// - elements: un tableau avec les éléments extraits de la bdd
// - parents: un tableau avec le nom des ancêtres ['grandParents', 'parents', 'elements']
// out
// - un tableau avec les éléments à convertir en 'rows'
const rowsCreate = (elements, parents) =>
  // si il existe au moins un parent
  parents && parents.length
    ? // parcourt la liste d'éléments
      elements.reduce(
        (rows, element) =>
          // si il existe un element dont le nom correspond au premier parent
          element[parents[0]]
            ? // recursion sur rowsCreate avec cet élément
              // et la liste de parents moins le premier
              [...rows, ...rowsCreate(element[parents[0]], parents.slice(1))]
            : // sinon, retourne le résultat
              rows,
        []
      )
    : // si il n'y a pas de parent
    // si elements est un tableau
    Array.isArray(elements)
    ? // le retourne tel quel
      elements
    : // sinon, l'insère dans un tableau
      [elements]

module.exports = jsonToSpreadsheet
