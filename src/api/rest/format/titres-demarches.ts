import { ITitreDemarche, Index, IEtapeType } from '../../../types'

import { metasGet } from '../../../database/cache/metas'

import titreEtapesSortAscByDate from '../../../business/utils/titre-etapes-sort-asc-by-date'

const etapesTypesIds = [
  'mfr',
  'spp',
  'mcp',
  'mcr',
  'anf',
  'ane',
  'ppu',
  'epu',
  'eof',
  'aof',
  'apd',
  'spo',
  'apo',
  'sca',
  'aca',
  'app',
  'scg',
  'acg',
  'spe',
  'ape',
  'sas',
  'dim',
  'css',
  'dex',
  'dpu',
  'dux',
  'dup',
  'npp',
  'mno',
  'sco'
]

const etapesDatesStatutsBuild = (titreDemarche: ITitreDemarche) => {
  if (!titreDemarche.etapes?.length) return null

  const etapes = titreEtapesSortAscByDate(
    titreDemarche.etapes,
    'demarches'
  ).reverse()

  // initialise l'objet selon tous les types d'étapes intéressants pour l'instruction
  return etapesTypesIds.reduce((etapesDatesStatuts, typeId) => {
    const etapesTypes = metasGet('etapesTypes') as IEtapeType[]
    const type = etapesTypes.find(et => et.id === typeId)

    if (!type) return etapesDatesStatuts

    // cherche l'étape la plus récente de ce type
    const etape = etapes.find(e => e.typeId === typeId && e.statutId !== 'aco')

    etapesDatesStatuts[type.nom] = etape?.date || ''

    // si le type d'étape a plus d'un statut possible
    // (ex : fav/def ou acc/rej)
    // alors on exporte aussi le statut
    if (type.etapesStatuts!.length > 1) {
      const statut = etape?.type!.etapesStatuts!.find(
        s => s.id === etape.statutId
      )

      etapesDatesStatuts[`${type.nom}_statut`] = statut?.nom || ''
    }

    return etapesDatesStatuts
  }, {} as Index<string>)
}

const titresDemarchesFormatTable = (titresDemarches: ITitreDemarche[]) =>
  titresDemarches.map(titreDemarche => {
    const titre = titreDemarche.titre!

    const etapesTypesStatuts = etapesDatesStatutsBuild(titreDemarche)

    const titreDemarcheNew = {
      titre_id: titre.id,
      titre_nom: titre.nom,
      titre_domaine: titre.domaine!.nom,
      titre_type: titre.type!.type.nom,
      titre_statut: titre.statut!.nom,
      type: titreDemarche.type!.nom,
      statut: titreDemarche.statut!.nom,
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
      ...etapesTypesStatuts
    }

    return titreDemarcheNew
  })

export { titresDemarchesFormatTable }
