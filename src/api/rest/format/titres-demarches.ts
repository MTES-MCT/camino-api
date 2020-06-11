import { ITitreDemarche } from '../../../types'

const titresDemarchesFormatTable = (titresDemarches: ITitreDemarche[]) =>
  titresDemarches.map(titreDemarche => {
    const titre = titreDemarche.titre!

    const titreDemarcheNew = {
      titre_id: titre.id,
      titre_nom: titre.nom,
      titre_domaine: titre.domaine!.nom,
      titre_type: titre.type!.type.nom,
      titre_nature: titre.type!.type.exploitation
        ? 'exploitation'
        : 'exploration',
      titre_statut: titre.statut!.nom,
      type: titreDemarche.type!.nom,
      statut: titreDemarche.statut!.nom
    }

    return titreDemarcheNew
  })

export { titresDemarchesFormatTable }
