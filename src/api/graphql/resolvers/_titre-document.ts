import {
  ITitre,
  ITitreDemarche,
  ITitreTravaux,
  ITitreActivite,
  ITitreEtapeOrTitreTravauxEtape,
  IDocumentRepertoire
} from '../../../types'

import { join } from 'path'

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

const titreDemarchesOrTravauxFichiersDelete = async (
  repertoire: IDocumentRepertoire,
  demarchesOrTravaux?: ITitreDemarche[] | ITitreTravaux[] | null
) => {
  if (demarchesOrTravaux?.length) {
    for (const dt of demarchesOrTravaux) {
      await titreEtapesOrActivitesFichiersDelete(repertoire, dt.etapes)
    }
  }
}

const titreFichiersDelete = async (titre: ITitre) => {
  titreDemarchesOrTravauxFichiersDelete('demarches', titre.demarches)
  titreDemarchesOrTravauxFichiersDelete('travaux', titre.travaux)
  titreEtapesOrActivitesFichiersDelete('activites', titre.activites)
}

export {
  fichiersRepertoireDelete,
  titreEtapesOrActivitesFichiersDelete,
  titreFichiersDelete
}
