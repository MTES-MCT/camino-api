import {
  IApiSirenEtablissement,
  IApiSirenUniteLegalePeriode,
  IApiSirenUnionUniteLegalePeriodeEtablissmentUnite,
  IApiSirenUnionUniteLegaleEtablissmentUnite,
  IApiSirenUniteLegale
} from './types'

import * as dateFormat from 'dateformat'

import inseePays from './definitions/pays'
import inseeCategoriesJuridiques from './definitions/categories-juridiques'
import inseeTypesVoies from './definitions/voies'
import { IEntrepriseEtablissement, IEntreprise } from '../../types'

interface IApiSirenNomFormat
  extends IApiSirenUnionUniteLegalePeriodeEtablissmentUnite,
    IApiSirenUnionUniteLegaleEtablissmentUnite {}

const nomFormat = (
  {
    denominationUniteLegale,
    denominationUsuelle1UniteLegale,
    nomUniteLegale,
    prenomUsuelUniteLegale,
    sexeUniteLegale,
    sigleUniteLegale
  }: Partial<IApiSirenNomFormat>,
  usuel?: boolean
) =>
  nomUniteLegale && sexeUniteLegale && prenomUsuelUniteLegale && !usuel
    ? nomIndividuFormat(sexeUniteLegale, prenomUsuelUniteLegale, nomUniteLegale)
    : nomEntrepriseFormat(
        denominationUniteLegale,
        denominationUsuelle1UniteLegale,
        sigleUniteLegale
      )
// TODO: peut-on supprimer cette ligne ?
// sinon, il faut tester si les arguments sont définis dans la fonction
// || nomIndividuFormat(sexeUniteLegale, prenomUsuelUniteLegale, nomUniteLegale)

const entrepriseEtablissementFormat = (
  entreprise: IApiSirenUniteLegale,
  uniteLegalePeriode: IApiSirenUniteLegalePeriode
) => {
  const entrepriseId = `fr-${entreprise.siren}`
  const nic = uniteLegalePeriode.nicSiegeUniteLegale || 'xxxxx'
  const dateDebut = dateFormat(uniteLegalePeriode.dateDebut, 'yyyy-mm-dd')
  const nom = nomFormat(Object.assign({}, entreprise, uniteLegalePeriode))
  const legalSiret = `${entreprise.siren}${nic}`
  const etablissement = {
    id: `${entrepriseId}-${nic}-${dateDebut}`,
    entrepriseId,
    nom,
    dateDebut,
    legalSiret
  } as IEntrepriseEtablissement

  if (uniteLegalePeriode.dateFin) {
    etablissement.dateFin = dateFormat(uniteLegalePeriode.dateFin, 'yyyy-mm-dd')
  }

  return etablissement
}

const entrepriseEtablissementsFormat = (entreprise: IApiSirenUniteLegale) => {
  // periodesUniteLegale est un tableau
  // classé par ordre de fin chronologique décroissant
  if (
    !entreprise.periodesUniteLegale ||
    !entreprise.periodesUniteLegale.length
  ) {
    return []
  }

  const entrepriseEtablissements = entreprise.periodesUniteLegale.map(
    uniteLegalePeriode =>
      entrepriseEtablissementFormat(entreprise, uniteLegalePeriode)
  )

  return entrepriseEtablissements
}

const entrepriseFormat = (e: IApiSirenEtablissement) => {
  const { uniteLegale: unite, adresseEtablissement: adresse } = e

  const id = `fr-${e.siren}`

  const entreprise = {
    id,
    legalSiren: e.siren
  } as IEntreprise

  const nom = nomFormat(Object.assign({}, e, unite), true)
  if (nom) {
    entreprise.nom = nom
  }

  if (unite.categorieEntreprise) {
    entreprise.categorie = unite.categorieEntreprise
  }

  if (adresse.codeCedexEtablissement) {
    entreprise.cedex = adresse.codeCedexEtablissement
  }

  entreprise.adresse = ''

  if (adresse.numeroVoieEtablissement) {
    entreprise.adresse += `${adresse.numeroVoieEtablissement} `
  }

  if (adresse.indiceRepetitionEtablissement) {
    entreprise.adresse += `${adresse.indiceRepetitionEtablissement} `
  }

  if (adresse.typeVoieEtablissement) {
    const typeVoie = inseeTypesVoies.find(
      t => t.id === adresse.typeVoieEtablissement
    )
    if (typeVoie) {
      entreprise.adresse += `${typeVoie.nom} `
    }
  }

  if (adresse.libelleVoieEtablissement) {
    entreprise.adresse += `${adresse.libelleVoieEtablissement} `
  }

  // permet de ne pas avoir de comparaisons entre chaîne vide
  // et null lors des tâches business
  if (!entreprise.adresse) {
    entreprise.adresse = null
  }

  if (adresse.codePostalEtablissement) {
    entreprise.codePostal = adresse.codePostalEtablissement
  }

  const commune =
    adresse.libelleCommuneEtablissement ||
    adresse.libelleCommuneEtrangerEtablissement

  if (commune) {
    entreprise.commune = commune
  }

  if (unite.categorieJuridiqueUniteLegale) {
    const categorie = inseeCategoriesJuridiques.find(
      c => c.code === unite.categorieJuridiqueUniteLegale
    )
    if (categorie) {
      entreprise.legalForme = categorie.nom
    } else {
      console.error(
        `API Insee: catégorie juridique introuvable : ${unite.categorieJuridiqueUniteLegale}`
      )
    }
  }

  if (adresse.codePaysEtrangerEtablissement) {
    const pays = inseePays.find(
      p => p.cog === adresse.codePaysEtrangerEtablissement
    )
    if (pays) {
      entreprise.paysId = pays.codeiso2
    } else {
      console.error(
        `API Insee: code pays introuvable: ${adresse.codePaysEtrangerEtablissement}`
      )
    }
  } else {
    entreprise.paysId = 'FR'
  }

  if (unite.dateCreationUniteLegale) {
    entreprise.dateCreation = dateFormat(
      unite.dateCreationUniteLegale,
      'yyyy-mm-dd'
    )
  }

  return entreprise
}

const nomEntrepriseFormat = (
  denominationUniteLegale?: string | null,
  denominationUsuelle1UniteLegale?: string | null,
  sigleUniteLegale?: string | null
) => {
  const denomination = denominationUniteLegale && denominationUniteLegale.trim()

  const denominationUsuelle =
    denominationUsuelle1UniteLegale && denominationUsuelle1UniteLegale.trim()

  const sigle = sigleUniteLegale && sigleUniteLegale.trim()

  // priorise la dénomination officielle
  // par rapport à la dénomination usuelle
  const nom = denomination || denominationUsuelle

  if (!nom && !sigle) return null

  // si le nom n'est pas rempli, retourne le sigle
  if (!nom) return sigle

  // si le sigle est rempli
  // et qu'il est différent du nom
  if (sigle && nom !== sigle) {
    // alors concatène le nom et le sigle (différent du nom)
    return `${nom} (${sigle})`
  }

  return nom
}

const nomIndividuFormat = (
  sexeUniteLegale: 'F' | 'M' | null,
  prenomUsuelUniteLegale: string,
  nomUniteLegale: string
) =>
  `${
    sexeUniteLegale === 'F' ? 'MADAME' : 'MONSIEUR'
  } ${prenomUsuelUniteLegale} ${nomUniteLegale}`

export { entrepriseEtablissementsFormat, entrepriseFormat }
