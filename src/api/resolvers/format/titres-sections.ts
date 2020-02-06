import { ISections, ISectionsElement } from '../../../types'

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = (
  sections: ISections[],
  periodeId: number | undefined = undefined,
  date: string | undefined = undefined
) =>
  sections.reduce((sections: ISections[], s) => {
    const elements =
      s.elements &&
      s.elements.reduce((elements: ISectionsElement[], e) => {
        // ne conserve que les éléments dont
        // - la période (si elle existe),
        // - la date de début et la date de fin
        // correspondent à l'élément
        if (
          (!periodeId ||
            !e.frequencePeriodesIds ||
            e.frequencePeriodesIds.find(id => periodeId === id)) &&
          (!date ||
            ((!e.dateFin || e.dateFin >= date) &&
              (!e.dateDebut || e.dateDebut < date)))
        ) {
          elements.push(e)
        }

        return elements
      }, [])

    const section = {
      id: s.id,
      nom: s.nom,
      elements
    }

    if (section.elements?.length) {
      sections.push(section)
    }

    return sections
  }, [])

export { titreSectionsFormat }
