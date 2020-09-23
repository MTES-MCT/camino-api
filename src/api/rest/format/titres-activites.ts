import {
  ITitreActivite,
  IContenu,
  IContenuValeur,
  ISection,
  Index
} from '../../../types'

const titreActiviteContenuFormat = (contenu: IContenu, sections: ISection[]) =>
  sections.reduce((resSections: Index<IContenuValeur>, section) => {
    const r = section.elements!.reduce(
      (resElements: Index<IContenuValeur>, element) => {
        const key = `${section.id}_${element.id}`
        let value = null
        if (contenu[section.id]) {
          value = contenu[section.id][element.id]
        }

        if (value === undefined || value === null) {
          resElements[key] = element.type === 'number' ? 0 : ''
        } else {
          resElements[key] = Array.isArray(value)
            ? (value as string[]).join(';')
            : value
        }

        return resElements
      },
      {}
    )

    return Object.assign(resSections, r)
  }, {})

const titresActivitesFormatTable = (activites: ITitreActivite[]) =>
  activites.map(activite => {
    const contenu =
      activite.contenu && activite.type?.sections
        ? titreActiviteContenuFormat(activite.contenu, activite.type.sections)
        : {}

    return {
      id: activite.id,
      titre_id: activite.titre!.id,
      type: activite.type!.nom,
      statut: activite.statut!.nom,
      annee: activite.annee,
      periode: activite.periode!.nom,
      frequence_periode_id: activite.frequencePeriodeId,
      ...contenu
    }
  })

export { titresActivitesFormatTable }
