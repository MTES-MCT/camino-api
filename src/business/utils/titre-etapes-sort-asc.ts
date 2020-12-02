import { ITitreEtape } from '../../types'

// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesSortAscByOrdre = (titreEtapes: ITitreEtape[]) =>
  titreEtapes.slice().sort((a, b) => a.ordre! - b.ordre!)

export default titreEtapesSortAscByOrdre
