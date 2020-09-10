import { ITitre, Index, IContenuValeur } from '../../../types'

import decamelize from '../../../tools/decamelize'

const titreContenuFormat = (titre: ITitre) =>
  titre.contenu
    ? Object.keys(titre.contenu).reduce(
        (props: Index<IContenuValeur>, section) =>
          titre.contenu && titre.contenu[section]
            ? Object.keys(titre.contenu[section]).reduce((props, element) => {
                if (titre.contenu && titre.contenu[section][element]) {
                  props[decamelize(element).replace('_id', '')] = titre.contenu[
                    section
                  ][element] as IContenuValeur
                }

                return props
              }, props)
            : props,
        {}
      )
    : {}

const titresFormatTable = (titres: ITitre[]) =>
  titres.map(titre => {
    const { communes, departements, regions } = titre.pays!.reduce(
      (
        {
          communes,
          departements,
          regions
        }: { communes: string[]; departements: string[]; regions: string[] },
        pay
      ) => {
        const {
          payRegions,
          payDepartements,
          payCommunes
        } = pay.regions!.reduce(
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

    const titreReferences = titre.references
      ? titre.references.reduce((titreReferences: Index<string>, reference) => {
          titreReferences[`reference_${reference.type!.nom}`] = reference.nom

          return titreReferences
        }, {})
      : {}

    const titreNew = {
      id: titre.id,
      nom: titre.nom,
      type: titre.type!.type.nom,
      nature: titre.type!.type.exploitation ? 'exploitation' : 'exploration',
      domaine: titre.domaine!.nom,
      date_debut: titre.dateDebut,
      date_fin: titre.dateFin,
      date_demande: titre.dateDemande,
      statut: titre.statut!.nom,
      substances: titre.substances!.map(s => s.nom).join(';'),
      surface_km2: titre.surface,
      communes: communes.join(';'),
      departements: departements.join(';'),
      regions: regions.join(';'),
      administrations_noms: titre.administrations!.map(a => a.nom).join(';'),
      titulaires_noms: titre.titulaires!.map(e => e.nom).join(';'),
      titulaires_adresses: titre
        .titulaires!.map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(';'),
      titulaires_legal: titre
        .titulaires!.map(e => e.legalEtranger || e.legalSiren)
        .join(';'),
      amodiataires_noms: titre.amodiataires!.map(e => e.nom).join(';'),
      amodiataires_adresses: titre
        .amodiataires!.map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(';'),
      amodiataires_legal: titre
        .amodiataires!.map(e => e.legalEtranger || e.legalSiren)
        .join(';'),
      geojson: JSON.stringify(titre.geojsonMultiPolygon),
      ...titreReferences,
      ...titreContenuFormat(titre)
    }

    return titreNew
  })

const titresFormatGeojson = (titres: ITitre[]) => ({
  type: 'FeatureCollection',
  features: titres.map(titre => ({
    type: 'Feature',
    geometry: titre.geojsonMultiPolygon?.geometry,
    properties: {
      id: titre.id,
      nom: titre.nom,
      type: titre.type!.type.nom,
      nature: titre.type!.type.exploitation ? 'exploitation' : 'exploration',
      domaine: titre.domaine!.nom,
      date_debut: titre.dateDebut,
      date_fin: titre.dateFin,
      date_demande: titre.dateDemande,
      statut: titre.statut!.nom,
      substances: titre.substances!.map(s => s.nom).join(', ') || null,
      surface_km2: titre.surface,
      administrations_noms: titre.administrations!.map(a => a.nom),
      titulaires_noms: titre.titulaires!.map(e => e.nom).join(', ') || null,
      titulaires_legal:
        titre
          .titulaires!.map(e => e.legalEtranger || e.legalSiren)
          .join(', ') || null,
      amodiataires_noms: titre.amodiataires!.map(e => e.nom).join(', ') || null,
      amodiataires_legal:
        titre
          .amodiataires!.map(e => e.legalEtranger || e.legalSiren)
          .join(', ') || null,
      references:
        titre.references &&
        titre.references
          .map(reference => `${reference.type!.nom}: ${reference.nom}`)
          .join(', '),
      ...titreContenuFormat(titre)
    }
  }))
})

export { titresFormatGeojson, titresFormatTable }
