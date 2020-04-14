import {
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  IEtapeType,
  ISection
} from '../../../types'

import titreEtapeDateValidate from '../../../business/utils/titre-etape-date-validate'

import { dupRemove } from '../../../tools/index'
import { titreSectionsFormat } from './titres-sections'

const etapeTypeSectionsFormat = (
  etapeType: IEtapeType,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) => {
  // cherche le type d'étape parmi les types d'étapes de la démarche
  // pour récupérer les sections spécifiques configurées dans t_d_e
  const demarcheEtapeType = demarcheTypeEtapesTypes.find(et =>
    et.id === etapeType.id &&
    et.titreTypeId === titreTypeId
  )

  if (demarcheEtapeType?.sectionsSpecifiques) {
    etapeType.sectionsSpecifiques = demarcheEtapeType.sectionsSpecifiques
  }

  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (etapeType.sectionsSpecifiques) {
    etapeType.sections = etapeType.sections
      ? (dupRemove(
        'id',
        etapeType.sectionsSpecifiques,
        etapeType.sections
      ) as ISection[])
      : etapeType.sectionsSpecifiques
  }

  if (etapeType.sections) {
    etapeType.sections = titreSectionsFormat(etapeType.sections)
  }

  return etapeType
}

const etapeTypeFormat = (
  etapeType: IEtapeType,
  titre: ITitre,
  demarche: ITitreDemarche,
  etapeTypeId?: string
) => {
  // TODO: filtrer les types d'étapes avec type.dateFin
  // en fonction de la date du titre

  // restreint la liste des types d'étapes en fonction
  // de la possibilité de les créer
  etapeType.etapesStatuts = etapeType.etapesStatuts!.filter(es => {
    // si le type d'étape courant est celui de l'étape dont l'édition est en cours
    // alors on ne procède pas à la vérification car elle existe déjà
    if (etapeType.id === etapeTypeId) return true

    // TODO: utiliser la date de l'étape éditée
    const error = !titreEtapeDateValidate(
      {
        typeId: etapeType.id,
        date: '3000-01-01',
        statutId: es.id
      } as ITitreEtape,
      demarche,
      titre
    )

    return error
  })

  // si il n'est possible de créer le type d'étape pour aucun statut
  // alors on ne retourne pas ce type d'étape pendant l'édition
  if (!etapeType.etapesStatuts.length) return null

  etapeType.demarcheTypeId = demarche.typeId

  return etapeTypeSectionsFormat(
    etapeType,
    demarche.type!.etapesTypes,
    titre.typeId
  )
}

export { etapeTypeFormat, etapeTypeSectionsFormat }
