import * as dateFormat from 'dateformat'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const titreDemarcheOctroiDateDebutFind = titre => {
  if (!titre.demarches || !titre.demarches.length) return '0000'

  // récupère la démarche d'octroi (naturelle ou virtuelle)
  const demarcheOctroi = titreDemarchesAscSort(titre.demarches).find(d =>
    ['oct', 'vut'].includes(d.typeId)
  )
  if (
    !demarcheOctroi ||
    !demarcheOctroi.etapes ||
    !demarcheOctroi.etapes.length
  ) {
    return '0000'
  }

  // trie les étapes dans l'ordre décroissant
  const etapes = titreEtapesDescSort(demarcheOctroi.etapes)

  // récupère l'étape la plus importante de l'octroi en premier
  const etapeOctroi =
    ['dpu', 'rpu', 'dim', 'dex', 'mfr'].reduce(
      (etape, typeId) => etape || etapes.find(e => e.typeId === typeId),
      null
    ) ||
    // sinon utilise la première étape (chronologique) de l'octroi
    etapes[etapes.length - 1]

  const demarcheOctroiDate = etapeOctroi.dateDebut || etapeOctroi.date || '0000'

  return dateFormat(demarcheOctroiDate, 'yyyy-mm-dd')
}

export default titreDemarcheOctroiDateDebutFind
