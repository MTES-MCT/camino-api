import PQueue from 'p-queue'

import dbToSpreadsheet from './db-to-spreadsheet'
import defininitionsTitres from './definitions/titres'
import defininitionDocuments from './definitions/documents'
import defininitionUtilisateurs from './definitions/utilisateurs'
import defininitionActivites from './definitions/titres-activites'
import defininitionAdministrations from './definitions/administrations'
import defininitionEntreprises from './definitions/entreprises'
import defininitionTerritoires from './definitions/territoires'
import defininitionTravaux from './definitions/titres-travaux'
import defininitionForets from './definitions/forets'

const ssExport = async () => {
  try {
    console.info('Export en cours…')

    // construit un tableau de promesses avec
    // - les requête en base de données
    // - les appels à l'API Google Sheets
    const spreadsheetsRequests = [
      ...defininitionsTitres.map(d => () => dbToSpreadsheet(d)),
      () => dbToSpreadsheet(defininitionDocuments),
      () => dbToSpreadsheet(defininitionUtilisateurs),
      () => dbToSpreadsheet(defininitionActivites),
      () => dbToSpreadsheet(defininitionAdministrations),
      () => dbToSpreadsheet(defininitionEntreprises),
      () => dbToSpreadsheet(defininitionTerritoires),
      () => dbToSpreadsheet(defininitionForets),
      () => dbToSpreadsheet(defininitionTravaux)
    ]

    const queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 1000 })

    await queue.addAll(spreadsheetsRequests)

    console.info('Export terminé')
  } catch (e) {
    console.error(e)

    throw e
  }
}

export default ssExport
