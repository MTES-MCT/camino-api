import { ITitreDemarche } from '../../types'

import titreDemarchesSortAsc from '../utils/titre-elements-sort-asc'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'

const titreDemarcheOctroiDateDebutFind = (
  titreDemarches?: ITitreDemarche[] | null
) => {
  if (!titreDemarches || !titreDemarches.length) return '0000'

  // récupère la démarche d'octroi (naturelle ou virtuelle)
  const demarcheOctroi = titreDemarchesSortAsc(
    titreDemarches
  ).find(({ typeId }) => ['oct', 'vut'].includes(typeId))

  if (
    !demarcheOctroi ||
    !demarcheOctroi.etapes ||
    !demarcheOctroi.etapes.length
  ) {
    return '0000'
  }

  // trie les étapes dans l'ordre décroissant
  const etapes = titreEtapesSortDesc(demarcheOctroi.etapes)

  // récupère l'étape la plus importante de l'octroi en premier
  const etapeOctroi =
    etapes.find(
      ({ typeId }) =>
        ([
          'dpu',
          'dup',
          'rpu',
          'dex',
          'dux',
          'dim',
          'def',
          'sco',
          'aco'
        ].includes(typeId) &&
          demarcheOctroi.statutId === 'acc') ||
        ['mfr', 'mfm'].includes(typeId)
    ) ||
    // sinon utilise la première étape (chronologique) de l'octroi
    etapes[etapes.length - 1]

  return etapeOctroi.dateDebut || etapeOctroi.date
}

export default titreDemarcheOctroiDateDebutFind
