import {
  ITitre,
  ITitreDemarche,
  ITitreEtape
} from '../../types'

import { join } from 'path'

import fileDelete from '../../tools/file-delete'

const titreEtapeDocumentsDelete = async (etape: ITitreEtape) => {
  if (etape.documents?.length) {
    for (let document of etape.documents) {
      if (document.fichier) {
        const documentPath = `files/${document.id}.${document.fichierTypeId}`

        try {
          await fileDelete(join(process.cwd(), documentPath))
        } catch (e) {
          console.info(`impossible de supprimer le fichier: ${documentPath}`)
        }
      }
    }
  }
}

const titreDemarcheDocumentsDelete = async (demarche: ITitreDemarche) => {
  if (demarche.etapes?.length) {
    for (let etape of demarche.etapes) {
      await titreEtapeDocumentsDelete(etape)
    }
  }
}

const titreDocumentsDelete = async (titre: ITitre) => {
  if (titre.demarches?.length) {
    for (let demarche of titre.demarches) {
      await titreDemarcheDocumentsDelete(demarche)
    }
  }
}

export {
  titreEtapeDocumentsDelete,
  titreDemarcheDocumentsDelete,
  titreDocumentsDelete
}
