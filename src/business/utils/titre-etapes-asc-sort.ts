import { ITitreEtape } from '../../types'

// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesAscSortByOrdre = (titreEtapes: ITitreEtape[]) =>
  titreEtapes.sort((a, b) => a.ordre! - b.ordre!)

export default titreEtapesAscSortByOrdre
