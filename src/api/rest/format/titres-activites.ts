import {
  ITitreActivite,
  IContenu,
  ISection,
  Index
} from '../../../types'

const titreActiviteContenuFormat = (contenu: IContenu, sections: ISection[]) =>
  sections.reduce((resSections: Index<string>, section) => {
    const r = section.elements!.reduce(
      (resElements: Index<string>, element) => {
        if (
          !contenu[section.id] ||
          contenu[section.id][element.id] === undefined
        ) {
          resElements[`${section.id}_${element.id}`] = ''

          return resElements
        }

        resElements[`${section.id}_${element.id}`] = Array.isArray(
          contenu[section.id][element.id]
        )
          ? (contenu[section.id][element.id] as string[]).join(';')
          : JSON.stringify(contenu[section.id][element.id])

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
