import { ISection, ITitreActivite } from '../../types'

const titreActiviteUpdationValidate = (
  titreActivite: ITitreActivite,
  activiteSections: ISection[]
) => {
  const errors = [] as string[]
  if (titreActivite.statutId === 'dep') {
    activiteSections.forEach(s => {
      s.elements?.forEach(e => {
        if (
          !e.optionnel &&
          (!titreActivite.contenu ||
            titreActivite.contenu[s.id][e.id] === undefined ||
            titreActivite.contenu[s.id][e.id] === null)
        ) {
          errors.push(
            `le champ ${e.nom} de la section ${s.nom || s.id} est obligatoire`
          )
        }
      })
    })
  }

  return errors
}

export { titreActiviteUpdationValidate }
