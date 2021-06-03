import Document from '../../database/models/documents'
import { documentFilePathFind } from './document-path-find'
import * as fs from 'fs'
import { datesDiffInDays } from '../date'
import { documentSupprimer } from '../../api/graphql/resolvers/documents'
import { userSuper } from '../../database/user-super'

const documentsClean = async () => {
  console.info()
  console.info('- - -')
  console.info('suppression des documents orphelins')
  console.info()

  const documents = await Document.query()
    .whereNull('titreEtapeId')
    .whereNull('titreActiviteId')
    .whereNull('titreTravauxEtapeId')
    .whereNull('entrepriseId')

  for (const document of documents) {
    const path = await documentFilePathFind(document)

    try {
      const { mtime } = fs.statSync(path)
      if (datesDiffInDays(mtime, new Date()) >= 1) {
        await documentSupprimer(
          { id: document.id },
          { user: { id: userSuper.id } }
        )
        console.info(`document ${path} supprimé`)
      }
    } catch (e) {}
  }
}

export { documentsClean }
