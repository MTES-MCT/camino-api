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

const etapeTypeFormat = (
  et: IEtapeType,
  titre: ITitre,
  demarche: ITitreDemarche,
  etapeTypeId?: string
) => {
  // TODO: filtrer les types d'étapes avec type.dateFin
  // en fonction de la date du titre

  // restreint la liste des types d'étapes en fonction
  // de la possibilité de les créer
  et.etapesStatuts = et.etapesStatuts!.filter(es => {
    // si le type d'étape courant est celui de l'étape dont l'édition est en cours
    // alors on ne procède pas à la vérification car elle existe déjà
    if (et.id === etapeTypeId) return true

    // TODO: utiliser la date de l'étape éditée
    const error = !titreEtapeDateValidate(
      { typeId: et.id, date: '3000-01-01', statutId: es.id } as ITitreEtape,
      demarche,
      titre
    )

    return error
  })

  // si il n'est possible de créer le type d'étape pour aucun statut
  // alors on ne retourne pas ce type d'étape pendant l'édition
  if (!et.etapesStatuts.length) return null

  et.demarcheTypeId = demarche.typeId

  return et
}

const etapeTypeSectionsFormat = (et: IEtapeType) => {
  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (et.sectionsSpecifiques) {
    et.sections = et.sections
      ? (dupRemove('id', et.sectionsSpecifiques, et.sections) as ISection[])
      : et.sectionsSpecifiques
  }

  if (et.sections) {
    et.sections = titreSectionsFormat(et.sections)
  }

  return et
}

export { etapeTypeFormat, etapeTypeSectionsFormat }
