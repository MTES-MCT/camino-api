import { ITitreEtape } from '../types'

const titreDemarcheEtapesBuild = (
  titreDemarcheEtapes: ITitreEtape[],
  titreEtape: ITitreEtape,
  suppression = false
) => {
  // quand on ajoute une étape, on ne connaît pas encore sa date.
  // on doit donc proposer tous les types d'étape possibles
  if (!titreEtape.date) {
    titreEtape.date = '2300-01-01'
  }

  // si nous n’ajoutons pas une nouvelle étape
  // on supprime l’étape en cours de modification ou de suppression
  const titreEtapes = titreDemarcheEtapes.reduce((acc: ITitreEtape[], te) => {
    if (te.id !== titreEtape.id) {
      acc.push(te)
    }

    // modification
    if (!suppression && te.id === titreEtape.id) {
      acc.push(titreEtape)
    }

    return acc
  }, [])

  // création
  if (!titreEtape.id) {
    titreEtapes.push(titreEtape)
  }

  return titreEtapes
}

export { titreDemarcheEtapesBuild }
