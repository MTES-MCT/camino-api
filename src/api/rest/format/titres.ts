import decamelize from 'decamelize'

import { ITitre, Index, IContenuValeur, IPays, IContenu } from '../../../types'

const titreContenuTableFormat = (contenu?: IContenu | null) =>
  contenu
    ? Object.keys(contenu).reduce(
        (props: Index<IContenuValeur>, section) =>
          contenu && contenu[section]
            ? Object.keys(contenu[section]).reduce((props, element) => {
                if (contenu && contenu[section][element]) {
                  const propNom = decamelize(element).replace('_id', '')

                  props[propNom] = contenu[section][element] as IContenuValeur
                }

                return props
              }, props)
            : props,
        {}
      )
    : {}

const titresTableFormat = (titres: ITitre[]) =>
  titres.map(titre => {
    const { communes, departements, regions } = titreTerritoiresFind(titre)

    const titreReferences = titre.references
      ? titre.references.reduce((titreReferences: Index<string>, reference) => {
          titreReferences[`reference_${reference.type!.nom}`] = reference.nom

          return titreReferences
        }, {})
      : {}

    const separator = ';'

    const titreNew = {
      id: titre.id,
      nom: titre.nom,
      type: titre.type!.type.nom,
      domaine: titre.domaine!.nom,
      date_debut: titre.dateDebut,
      date_fin: titre.dateFin,
      date_demande: titre.dateDemande,
      statut: titre.statut!.nom,
      substances: titre.substances!.map(s => s.nom).join(separator),
      surface_km2: titre.surface,
      communes: communes.join(separator),
      forets: titre.forets?.map(f => f.nom).join(separator),
      departements: departements.join(separator),
      regions: regions.join(separator),
      administrations_noms: titre
        .administrations!.map(a => a.nom)
        .join(separator),
      titulaires_noms: titre.titulaires!.map(e => e.nom).join(separator),
      titulaires_adresses: titre
        .titulaires!.map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(separator),
      titulaires_legal: titre
        .titulaires!.map(e => e.legalEtranger || e.legalSiren)
        .join(separator),
      titulaires_categorie: titre
        .titulaires!.map(e => e.categorie)
        .join(separator),
      amodiataires_noms: titre.amodiataires!.map(e => e.nom).join(separator),
      amodiataires_adresses: titre
        .amodiataires!.map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(separator),
      amodiataires_legal: titre
        .amodiataires!.map(e => e.legalEtranger || e.legalSiren)
        .join(separator),
      amodiataires_categorie: titre
        .amodiataires!.map(e => e.categorie)
        .join(separator),
      geojson: JSON.stringify(titre.geojsonMultiPolygon),
      ...titreReferences,
      ...titreContenuTableFormat(titre.contenu)
    }

    return titreNew
  })

const titreGeojsonPropertiesFormat = (titre: ITitre) => {
  const { communes, departements, regions } = titreTerritoiresFind(titre)

  const separator = ', '

  return {
    id: titre.id,
    nom: titre.nom,
    type: titre.type!.type.nom,
    domaine: titre.domaine!.nom,
    date_debut: titre.dateDebut,
    date_fin: titre.dateFin,
    date_demande: titre.dateDemande,
    statut: titre.statut!.nom,
    substances: titre.substances!.map(s => s.nom).join(separator) || null,
    surface_km2: titre.surface,
    communes: communes.join(separator),
    forets: titre.forets?.map(f => f.nom).join(separator),
    departements: departements.join(separator),
    regions: regions.join(separator),
    administrations_noms: titre.administrations!.map(a => a.nom),
    titulaires_noms: titre.titulaires!.map(e => e.nom).join(separator) || null,
    titulaires_legal:
      titre
        .titulaires!.map(e => e.legalEtranger || e.legalSiren)
        .join(separator) || null,
    amodiataires_noms:
      titre.amodiataires!.map(e => e.nom).join(separator) || null,
    amodiataires_legal:
      titre
        .amodiataires!.map(e => e.legalEtranger || e.legalSiren)
        .join(separator) || null,
    references:
      titre.references &&
      titre.references
        .map(reference => `${reference.type!.nom}: ${reference.nom}`)
        .join(separator),
    ...titreContenuTableFormat(titre.contenu)
  }
}

const titreGeojsonFormat = (titre: ITitre) => ({
  type: 'FeatureCollection',
  properties: titreGeojsonPropertiesFormat(titre),
  features: titre.geojsonPoints
    ? [titre.geojsonMultiPolygon].concat(titre.geojsonPoints.features)
    : titre.geojsonMultiPolygon
})

const titresGeojsonFormat = (titres: ITitre[]) => ({
  type: 'FeatureCollection',
  features: titres.map(titre => ({
    type: 'Feature',
    geometry: titre.geojsonMultiPolygon?.geometry,
    properties: titreGeojsonPropertiesFormat(titre)
  }))
})

const titreTerritoiresFind = (titre: ITitre) =>
  titre.pays!.reduce(
    (
      {
        communes,
        departements,
        regions
      }: { communes: string[]; departements: string[]; regions: string[] },
      pay: IPays
    ) => {
      const { payRegions, payDepartements, payCommunes } = pay.regions!.reduce(
        (
          {
            payRegions,
            payDepartements,
            payCommunes
          }: {
            payRegions: string[]
            payDepartements: string[]
            payCommunes: string[]
          },
          region
        ) => {
          const {
            regionDepartements,
            regionCommunes
          } = region.departements!.reduce(
            (
              {
                regionDepartements,
                regionCommunes
              }: { regionDepartements: string[]; regionCommunes: string[] },
              departement
            ) => {
              regionDepartements.push(departement.nom)
              regionCommunes.push(
                ...departement.communes!.map(
                  commune =>
                    `${commune.nom} (${
                      Math.round(commune.surface! / 100) / 10000
                    })`
                )
              )

              return { regionDepartements, regionCommunes }
            },
            { regionDepartements: [], regionCommunes: [] }
          )

          payRegions.push(region.nom)
          payDepartements.push(...regionDepartements)
          payCommunes.push(...regionCommunes)

          return { payRegions, payDepartements, payCommunes }
        },
        { payRegions: [], payDepartements: [], payCommunes: [] }
      )

      regions.push(...payRegions)
      departements.push(...payDepartements)
      communes.push(...payCommunes)

      return { communes, departements, regions }
    },
    { communes: [], departements: [], regions: [] }
  )

export { titresGeojsonFormat, titreGeojsonFormat, titresTableFormat }
