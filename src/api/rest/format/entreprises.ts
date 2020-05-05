import { IEntreprise } from '../../../types'

const entreprisesFormatTable = (entreprises: IEntreprise[]) =>
  entreprises.map(entreprise => {
    const entrepriseNew = {
      nom: entreprise.nom,
      siren: entreprise.legalSiren
    }

    return entrepriseNew
  })

export { entreprisesFormatTable }
