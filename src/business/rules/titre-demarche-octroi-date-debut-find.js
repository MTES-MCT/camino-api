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
    etapes.find(
      e =>
        (['dpu', 'rpu', 'dex', 'dim', 'def', 'sco', 'aco'].includes(e.typeId) &&
          demarcheOctroi.statutId === 'acc') ||
        e.typeId === 'mfr'
    ) ||
    // sinon utilise la première étape (chronologique) de l'octroi
    etapes[etapes.length - 1]

  return etapeOctroi.dateDebut || etapeOctroi.date
}

export default titreDemarcheOctroiDateDebutFind
