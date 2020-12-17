import { ITitre, ITitreDemarche, ITitreEtape } from '../types'
import { titreEtapeTypeIdValidate } from './utils/titre-demarche-etats-validate'

const titreEtapeDeletionValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) =>
  titreEtapeTypeIdValidate(
    titreDemarche.type!,
    titreDemarche.etapes!,
    titre,
    titreEtape,
    true
  )

export default titreEtapeDeletionValidate
