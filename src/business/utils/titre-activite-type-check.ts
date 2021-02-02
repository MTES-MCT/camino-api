import { IActiviteType, ITitre } from '../../types'

/**
 * Vérifie que le titre peut recevoir un type d'activité
 * @param activiteType - type d'activité
 * @param titre - titre
 */

const titreActiviteTypeCheck = (activiteType: IActiviteType, titre: ITitre) =>
  // si le type d'activité est relié au type de titre
  activiteType.titresTypes.some(titreType => titreType.id === titre.typeId) &&
  // et que le type d'activité n'est relié à aucun pays
  // ou que le type d'activite est relié à l'un des pays du titre
  (!activiteType.pays?.length ||
    (!!titre.pays?.length &&
      activiteType.pays.some(pay => titre.pays!.some(p => pay.id === p.id))))

export { titreActiviteTypeCheck }
