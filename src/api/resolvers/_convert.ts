import {
  ITitre,
  ITitreDemarche,
  ITelechargement,
  ITitrePoint,
  ITitreActivite,
  IActiviteStatut,
  ISection
} from '../../types'
import * as xlsx from 'xlsx'
import fileCreate from '../../tools/file-create'

type IFormat = 'csv' | 'xlsx' | 'ods' | 'geojson'

const titresFormatCsv = (titres: ITitre[]) =>
  titres.map(titre => {
    const { communes, departements, regions } = titre.pays.reduce(
      ({ communes, departements, regions }, pay) => {
        const { payRegions, payDepartements, payCommunes } = pay.regions.reduce(
          ({ payRegions, payDepartements, payCommunes }, region) => {
            const {
              regionDepartements,
              regionCommunes
            } = region.departements.reduce(
              ({ regionDepartements, regionCommunes }, departement) => {
                regionDepartements.push(departement.nom)
                regionCommunes.push(
                  ...departement.communes.map(
                    commune =>
                      `${commune.nom} (${Math.round(commune.surface / 100) /
                        10000})`
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

    const titreNew = {
      id: titre.id,
      nom: titre.nom,
      type: titre.type!.type.nom,
      nature: titre.type!.type.exploitation ? 'exploitation' : 'exploration',
      domaine: titre.domaine!.nom,
      date_debut: titre.dateDebut,
      date_fin: titre.dateFin,
      date_demande: titre.dateDemande,
      statut: titre.statut.nom,
      substances: titre.substances.map(s => s.nom).join(';'),
      surface_km2: titre.surface,
      communes: communes.join(';'),
      departements: departements.join(';'),
      regions: regions.join(';'),
      administrations_noms: titre.administrations.map(a => a.nom).join(';'),
      titulaires_noms: titre.titulaires.map(e => e.nom).join(';'),
      titulaires_adresses: titre.titulaires
        .map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(';'),
      titulaires_legal: titre.titulaires
        .map(e => e.legalEtranger || e.legalSiren)
        .join(';'),
      amodiataires_noms: titre.amodiataires.map(e => e.nom).join(';'),
      amodiataires_adresses: titre.amodiataires
        .map(e => `${e.adresse} ${e.codePostal} ${e.commune}`)
        .join(';'),
      amodiataires_legal: titre.amodiataires
        .map(e => e.legalEtranger || e.legalSiren)
        .join(';'),
      geojson: titre.geojsonMultiPolygon,
      // todo : gérer les props qui viennent des étapes
      volume: titre.volume,
      volume_unite: titre.volumeUnite,
      engagement: titre.engagement,
      engagement_devise: titre.engagementDevise && titre.engagementDevise.id
    }

    titre.references &&
      titre.references.forEach(reference => {
        titreNew[`reference_${reference.type.nom}`] = reference.nom
      })

    return titreNew
  })

const titresFormatGeojson = (titres: ITitre[]) => ({
  type: 'FeatureCollection',
  features: titres.map(titre => {
    return {
      type: 'Feature',
      geometry: titre.geojsonMultiPolygon && titre.geojsonMultiPolygon.geometry,
      properties: {
        id: titre.id,
        nom: titre.nom,
        type: titre.type.type.nom,
        nature: titre.type.type.exploitation ? 'exploitation' : 'exploration',
        domaine: titre.domaine.nom,
        date_debut: titre.dateDebut,
        date_fin: titre.dateFin,
        date_demande: titre.dateDemande,
        statut: titre.statut.nom,
        substances: titre.substances.map(s => s.nom).join(', ') || null,
        surface_km2: titre.surface,
        administrations_noms: titre.administrations.map(a => a.nom),
        titulaires_noms: titre.titulaires.map(e => e.nom).join(', ') || null,
        titulaires_legal:
          titre.titulaires
            .map(e => e.legalEtranger || e.legalSiren)
            .join(', ') || null,
        amodiataires_noms:
          titre.amodiataires.map(e => e.nom).join(', ') || null,
        amodiataires_legal:
          titre.amodiataires
            .map(e => e.legalEtranger || e.legalSiren)
            .join(', ') || null,
        volume: titre.volume,
        volume_unite: titre.volumeUnite,
        // todo : gérer les props qui viennent des étapes
        engagement: titre.engagement,
        engagement_devise: titre.engagementDevise && titre.engagementDevise.id,
        references:
          titre.references &&
          titre.references
            .map(reference => `${reference.type.nom}: ${reference.nom}`)
            .join(', ')
      }
    }
  })
})

const activiteContenuFormat = (contenu: IContenu, sections: ISection[]) =>
  contenu
    ? sections.reduce((resSections, section) => {
        const r = section.elements.reduce((resElements, element) => {
          if (
            !contenu[section.id] ||
            contenu[section.id][element.id] === undefined
          ) {
            resElements[`${section.id}_${element.id}`] = ''

            return resElements
          }

          resElements[`${section.id}_${element.id}`] = Array.isArray(
            contenu[section.id][element.id]
          )
            ? contenu[section.id][element.id].join(';')
            : JSON.stringify(contenu[section.id][element.id])

          return resElements
        }, {})

        return Object.assign(resSections, r)
      }, {})
    : {}

const activitesFormatCsv = (activites: ITitreActivite[], activitesTypesSections: ISection[]) =>
  activites.map(activite => {
    const contenu = activiteContenuFormat(
      activite.contenu,
      activitesTypesSections
    )

    return       {
        id: activite.id,
        titre_id: activite.titre!.id,
        type: activite.type!.nom,
        statut: activite.statut!.nom,
        annee: activite.annee,
        periode: activite.periode!.nom,
        frequence_periode_id: activite.frequencePeriodeId,
        ...contenu
    }
    
  })

const convert = (
  section: string,
  elements: ITitre[] | ITitreDemarche[],
  format: IFormat
) => {
  if (format === 'geojson') {
    if (section === 'titres') {
      elements = titresFormatGeojson(elements)
    }
  } else if (format === 'csv') {
    if (section === 'titres') {
      elements = titresFormatCsv(elements)
    } else if (section === 'activites') {
        elements = ctivitesFormatCsv()elements
    }
  }

  const sheet = xlsx.utils.json_to_sheet(elements)

  const nom = `${section}.${format}`

  let contenu = ''

  if (format === 'geojson') {
    contenu = JSON.stringify(elements, null, 2)
  } else if (format === 'csv') {
    contenu = xlsx.utils.sheet_to_csv(sheet)
  } else if (format === 'xlsx') {
    // contenu = xlsx.utils.sheet
    const wb = xlsx.utils.book_new()

    xlsx.utils.book_append_sheet(wb, sheet, section)

    contenu = xlsx.write(wb, { type: 'base64' })

    // fileCreate(nom, Buffer.from(contenu, 'base64').toString())

    fileCreate(nom, xlsx.write(wb, { type: 'buffer' }))
  }

  return {
    __typename: 'Telechargement',
    contenu: Buffer.from(contenu).toString('base64'),
    nom,
    taille: contenu.length,
    type: format,
    ordre: 'asc',
    colonne: '',
    total: elements.length
  } as ITelechargement
}

export { convert }
