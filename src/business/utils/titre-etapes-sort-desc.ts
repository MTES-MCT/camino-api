import { ITitreEtape } from '../../types'

// classe les étapes selon leur ordre inverse: 3, 2, 1.
const titreEtapesSortDescByOrdre = (titreEtapes: ITitreEtape[]) =>
  titreEtapes.sort((a, b) => b.ordre! - a.ordre!)

export default titreEtapesSortDescByOrdre
