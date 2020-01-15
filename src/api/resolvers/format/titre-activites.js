const titreActiviteFormatFields = {
  periode: true,
  sections: true
}

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = tea =>
  tea.type.sections.reduce((sections, s) => {
    const elements = s.elements.reduce((elements, e) => {
      // ne conserve que les éléments dont
      // - la période (si elle existe),
      // - la date de début et la date de fin
      // correspondent à l'activité
      if (
        (!e.frequencePeriodesIds ||
          e.frequencePeriodesIds.find(
            id => tea.periode && tea.periode.id === id
          )) &&
        (!e.dateFin || e.dateFin >= tea.date) &&
        (!e.dateDebut || e.dateDebut < tea.date)
      ) {
        elements.push(e)
      }

      return elements
    }, [])

    const section = {
      id: s.id,
      nom: s.nom,
      type: s.type,
      description: s.description,
      elements
    }

    if (section.elements.length) {
      sections.push(section)
    }

    return sections
  }, [])

const titreActiviteFormat = (ta, fields = titreActiviteFormatFields) => {
  // si
  // - le formatage de la période est requis
  // - l'activité a une périodicité
  // - le type d'activité a une fréquence qui contient un tableau de périodes
  // alors la période de l'activité en cours est définie
  if (
    fields.periode &&
    ta.frequencePeriodeId &&
    ta.type.frequence &&
    ta.type.frequence[ta.type.frequence.periodesNom] &&
    ta.type.frequence[ta.type.frequence.periodesNom].length
  ) {
    ta.periode = ta.type.frequence[ta.type.frequence.periodesNom].find(
      p => p.id === ta.frequencePeriodeId
    )
  }

  if (fields.sections && ta.type.sections) {
    // - les sections qui contiennent des élements sur cette activité
    ta.sections = titreSectionsFormat(ta)
  }

  return ta
}

const titreActiviteCalc = (activites, statutId) =>
  activites.reduce(
    (acc, activite) => (activite.statut.id === statutId ? ++acc : acc),
    0
  )

export { titreActiviteFormatFields, titreActiviteFormat, titreActiviteCalc }
