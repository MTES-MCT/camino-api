import { join } from 'path'

import {
  ITitre,
  ITitreDemarche,
  ITitreTravaux,
  ITitreActivite,
  ITitreEtapeOrTitreTravauxEtape,
  IDocumentRepertoire
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
  etapesOrActvites?: ITitreEtapeOrTitreTravauxEtape[] | ITitreActivite[] | null
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

const titreTravauxFichiersDelete = async (
  repertoire: IDocumentRepertoire,
  travaux?: ITitreTravaux[] | null
) => {
  if (travaux?.length) {
    for (const dt of travaux) {
      await titreEtapesOrActivitesFichiersDelete(repertoire, dt.travauxEtapes)
    }
  }
}

const titreFichiersDelete = async (titre: ITitre) => {
  await titreDemarchesFichiersDelete('demarches', titre.demarches)
  await titreTravauxFichiersDelete('travaux', titre.travaux)
  await titreEtapesOrActivitesFichiersDelete('activites', titre.activites)
}

export {
  fichiersRepertoireDelete,
  titreEtapesOrActivitesFichiersDelete,
  titreFichiersDelete
}
