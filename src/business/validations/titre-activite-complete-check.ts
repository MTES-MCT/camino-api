import { ISection, ITitreActivite } from '../../types'

const titreActiviteCompleteCheck = (
  titreActivite: ITitreActivite,
  activiteSections: ISection[]
) => {
  const activiteComplete = activiteSections.every(s =>
    s.elements?.every(
      e =>
        e.optionnel ||
        (titreActivite.contenu &&
          titreActivite.contenu[s.id][e.id] !== undefined &&
          titreActivite.contenu[s.id][e.id] !== null)
    )
  )

  if (!activiteComplete) {
    return false
  }

  return titreActivite
    .type!.documentsTypes.filter(dt => dt.optionnel)
    .every(dt => {
      if (dt.optionnel) {
        return true
      }

      return titreActivite.documents?.find(
        d =>
          d.typeId === dt.id &&
          !!(d.fichier || d.fichierNouveau) &&
          d.fichierTypeId &&
          d.date
      )
    })
}

export { titreActiviteCompleteCheck }
