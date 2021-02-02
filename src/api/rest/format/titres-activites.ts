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
        const value = contenu[section.id]
          ? contenu[section.id][element.id]
          : undefined

        if (value === undefined) {
          resElements[key] = ['number', 'integer'].includes(element.type)
            ? 0
            : ''
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
      periode_id: activite.periodeId,
      ...contenu
    }
  })

export { titresActivitesFormatTable }
