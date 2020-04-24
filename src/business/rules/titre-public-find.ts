import {
  ITitreDemarche,
  IAutorisationTitreTypeTitreStatut
} from '../../types'

const titrePublicFind = (
  titreTypeId: string,
  titreStatutId: string,
  autorisationsTitresStatuts: IAutorisationTitreTypeTitreStatut[],
  titreDemarches: ITitreDemarche[]
) => {
  const entrepriseLecture = true
  let publicLecture = false

  const autorisation = autorisationsTitresStatuts.find(a => a.titreStatutId === titreStatutId)

  // si une autorisation existe
  // et la démarche d'octroi est publique
  // alors le titre est public
  if (autorisation?.publicLecture) {
    const titreDemarcheOctroi = titreDemarches.find(d => d.typeId === 'oct')

    if (titreDemarcheOctroi?.publicLecture) {
      publicLecture = true
    }
  }

  return { publicLecture, entrepriseLecture }
}

export default titrePublicFind
