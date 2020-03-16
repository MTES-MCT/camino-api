import { ITitreDemarche } from '../../types'

const titreValiditePeriodeCheck = (
  titreDemarches: ITitreDemarche[],
  dateDebut: string,
  dateFin: string
) =>
  titreDemarches &&
  titreDemarches.some(
    ({ phase }) =>
      phase && dateDebut <= phase.dateFin && dateFin >= phase.dateDebut
  )

export default titreValiditePeriodeCheck
