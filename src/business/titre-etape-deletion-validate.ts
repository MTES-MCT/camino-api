import { ITitre, ITitreDemarche, ITitreEtape } from '../types'
import { titreArbreTypeIdValidate } from './utils/titre-arbre-type-validate'

const titreEtapeDeletionValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) =>
  titreArbreTypeIdValidate(
    titreDemarche.type!,
    titreDemarche.etapes!,
    titre,
    titreEtape,
    true
  )

export default titreEtapeDeletionValidate
