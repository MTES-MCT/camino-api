import { ITitre, ITitreDemarche, ITitreEtape } from '../types'
import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'

const titreEtapeDeletionValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) =>
  titreDemarcheUpdatedEtatValidate(
    titreDemarche.type!,
    titreDemarche.etapes!,
    titre,
    titreEtape,
    true
  )

export { titreEtapeDeletionValidate }
