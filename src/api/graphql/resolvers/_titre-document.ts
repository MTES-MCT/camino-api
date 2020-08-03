import {
  ITitre,
  ITitreDemarche,
  ITitreTravaux,
  ITitreActivite,
  ITitreEtapeOrTitreTravauxEtape,
  IDocument
} from '../../../types'

import { join } from 'path'

import fileDelete from '../../../tools/file-delete'

const fichiersDelete = async (documents?: IDocument[] | null) => {
  if (documents?.length) {
    for (const document of documents) {
      if (document.fichier && document.type) {
        try {
          const documentPath = `files/${document.type.repertoire}/${
            document.titreEtapeId ||
            document.titreActiviteId ||
            document.entrepriseId ||
            document.titreTravauxEtapeId
          }/${document.id}.${document.fichierTypeId}`

          await fileDelete(join(process.cwd(), documentPath))
        } catch (e) {
          console.info(`impossible de supprimer le fichier: ${document.id}`)
        }
      }
    }
  }
}

const titreEtapesOrActivitesFichiersDelete = async (
  etapesOrActvites?: ITitreEtapeOrTitreTravauxEtape[] | ITitreActivite[] | null
) => {
  if (etapesOrActvites?.length) {
    for (const ea of etapesOrActvites) {
      await fichiersDelete(ea.documents)
    }
  }
}

const titreDemarchesOrTravauxFichiersDelete = async (
  demarchesOrTravaux?: ITitreDemarche[] | ITitreTravaux[] | null
) => {
  if (demarchesOrTravaux?.length) {
    for (const dt of demarchesOrTravaux) {
      await titreEtapesOrActivitesFichiersDelete(dt.etapes)
    }
  }
}

const titreFichiersDelete = async (titre: ITitre) => {
  titreDemarchesOrTravauxFichiersDelete(titre.demarches)
  titreDemarchesOrTravauxFichiersDelete(titre.travaux)
  titreEtapesOrActivitesFichiersDelete(titre.activites)
}

export {
  fichiersDelete,
  titreEtapesOrActivitesFichiersDelete,
  titreFichiersDelete
}
