import { join } from 'path'

import {
  ITitre,
  ITitreDemarche,
  ITitreActivite,
  IDocumentRepertoire,
  ITitreEtape
} from '../../../types'

import { dirDelete } from '../../../tools/dir-delete'

const fichiersRepertoireDelete = async (
  id: string,
  repertoire: IDocumentRepertoire
) => {
  const repertoirePath = `files/${repertoire}/${id}`
  try {
    await dirDelete(join(process.cwd(), repertoirePath))
  } catch (e) {
    console.error(`impossible de supprimer le répertoire: ${repertoirePath}`, e)
  }
}

const titreEtapesOrActivitesFichiersDelete = async (
  repertoire: IDocumentRepertoire,
  etapesOrActvites?: ITitreEtape[] | ITitreActivite[] | null
) => {
  if (etapesOrActvites?.length) {
    for (const ea of etapesOrActvites) {
      await fichiersRepertoireDelete(ea.id, repertoire)
    }
  }
}

const titreDemarchesFichiersDelete = async (
  repertoire: IDocumentRepertoire,
  demarches?: ITitreDemarche[] | null
) => {
  if (demarches?.length) {
    for (const dt of demarches) {
      await titreEtapesOrActivitesFichiersDelete(repertoire, dt.etapes)
    }
  }
}

const titreFichiersDelete = async (titre: ITitre) => {
  await titreDemarchesFichiersDelete('demarches', titre.demarches)
  await titreEtapesOrActivitesFichiersDelete('activites', titre.activites)
}

export {
  fichiersRepertoireDelete,
  titreEtapesOrActivitesFichiersDelete,
  titreFichiersDelete
}
