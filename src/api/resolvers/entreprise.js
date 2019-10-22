import {
  entrepriseBySiren,
  entrepriseCreate
} from '../../database/queries/entreprises'

const entrepriseParSiren = async ({ siren }) => {
  const entreprise = await entrepriseBySiren(siren)

  return entreprise
}

const entrepriseCreer = async ({ entreprise }) => {
  // que choisir pour l'id ?
  entreprise.id = entreprise.nom

  const entrepriseNew = await entrepriseCreate(entreprise)

  return entrepriseNew
}

export { entrepriseParSiren, entrepriseCreer }
