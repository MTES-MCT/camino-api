// classe les étapes selon leur ordre inverse: 3, 2, 1.
import { ITitresEtapes } from '../../types'

const titreEtapesSortDescByOrdre = (titreEtapes: ITitresEtapes[]) =>
  titreEtapes.sort((a, b) => b.ordre! - a.ordre!)

export default titreEtapesSortDescByOrdre
