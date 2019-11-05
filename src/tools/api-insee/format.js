import * as dateFormat from 'dateformat'

import inseePays from './pays'
import inseeCategoriesJuridiques from './categories-juridiques'
import inseeTypesVoies from './voies'

// eslint-disable-next-line jsdoc/require-description
/**
 * @description Formate le nom d'une entreprise ou établissement.
 *
 * @param {object} e - L'entité à formater.
 * @param {boolean} usuel - Récupère le nom usuel ou non
 *     si usuel est `true` et que l'entité est une personne
 *     alors format le nom comme une entreprise.
 * @returns {string} Le nom de l'entreprise.
 *
 */
const nomFormat = (e, usuel) =>
  e.nomUniteLegale && !usuel
    ? nomIndividuFormat(e)
    : nomEntrepriseFormat(e, usuel)

// regroupe les établissement en fonction du nom, suivant les périodes
const entrepriseEtablissementsFormat = (entrepriseId, e) =>
  e.periodesUniteLegale
    .reduce((acc, p) => {
      const nom = nomFormat(Object.assign({}, e, p))

      let previous = acc[acc.length - 1]

      if (!previous || !previous[0] || previous[0].nom !== nom) {
        previous = []
        acc.push(previous)
      }

      const nic = p.nicSiegeUniteLegale || 'xxxxx'

      const dateDebut = dateFormat(p.dateDebut, 'yyyy-mm-dd')

      const etablissement = {
        id: `${entrepriseId}-${nic}-${dateDebut}`,
        entrepriseId,
        nom,
        dateDebut,
        legalSiret: `${e.siren}${nic}`
      }

      if (p.dateFin) {
        etablissement.dateFin = dateFormat(p.dateFin, 'yyyy-mm-dd')
      }

      previous.push(etablissement)

      return acc
    }, [])
    // corrige la date de début de la période
    .map(periodesEtablissements => {
      const first = periodesEtablissements[0]

      if (periodesEtablissements.length > 1) {
        first.dateDebut = periodesEtablissements.slice(-1)[0].dateDebut
      }

      return first
    })

const entrepriseEtablissementFormat = e => {
  if (!e) return null

  const entrepriseId = `fr-${e.siren}`

  // periodesUniteLegale est un tableau
  // classé par ordre de fin chronologique décroissant
  return e.periodesUniteLegale && e.periodesUniteLegale.length
    ? entrepriseEtablissementsFormat(entrepriseId, e)
    : []
}

const entrepriseAdresseFormat = e => {
  if (!e) return null

  const { uniteLegale: unite, adresseEtablissement: adresse } = e

  const id = `fr-${e.siren}`

  const entreprise = {
    id,
    legalSiren: e.siren
  }

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

const nomEntrepriseFormat = (e, usuel) => {
  const denomination =
    e.denominationUniteLegale && e.denominationUniteLegale.trim()

  const denominationUsuelle =
    e.denominationUsuelle1UniteLegale &&
    e.denominationUsuelle1UniteLegale.trim()

  const sigle = e.sigleUniteLegale && e.sigleUniteLegale.trim()

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

const nomIndividuFormat = e =>
  `${e.sexeUniteLegale === 'F' ? 'MADAME' : 'MONSIEUR'} ${
    e.prenomUsuelUniteLegale
  } ${e.nomUniteLegale}`

export { entrepriseEtablissementFormat, entrepriseAdresseFormat }
