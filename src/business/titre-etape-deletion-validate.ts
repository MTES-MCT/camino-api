import { ITitre, ITitreDemarche, ITitreEtape } from '../types'
import { titreEtatIdValidate } from './utils/titre-demarche-etats-validate'

const titreEtapeDeletionValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) =>
  titreEtatIdValidate(
    titreDemarche.type!,
    titreDemarche.etapes!,
    titre,
    titreEtape,
    true
  )

export default titreEtapeDeletionValidate
