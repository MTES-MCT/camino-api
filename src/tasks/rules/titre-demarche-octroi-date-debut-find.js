import * as dateFormat from 'dateformat'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

const titreDemarcheOctroiDateDebutFind = titre => {
  if (!titre.demarches || !titre.demarches.length) return '0000'

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

  const etapes = titreEtapesAscSort(demarcheOctroi.etapes)

  const etapeOctroi =
    ['dpu', 'rpu', 'dim', 'dex', 'mfr'].reduce(
      (etape, typeId) => etape || etapes.find(e => e.typeId === typeId),
      null
    ) || etapes[0]

  const demarcheOctroiDate = etapeOctroi.dateDebut || etapeOctroi.date || '0000'

  return dateFormat(demarcheOctroiDate, 'yyyy-mm-dd')
}

export default titreDemarcheOctroiDateDebutFind
