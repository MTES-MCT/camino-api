import { IUtilisateur } from '../../../types'

const utilisateursFormatTable = (utilisateurs: IUtilisateur[]) =>
  utilisateurs.map(utilisateur => {
    const lien = utilisateur.administrations?.length
      ? utilisateur.administrations.map(a => a.nom)
      : utilisateur.entreprises?.length
      ? utilisateur.entreprises.map(a => a.nom)
      : []

    const utilisateurNew = {
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      permission: utilisateur.permission.nom,
      lien: lien.join(',')
    }

    return utilisateurNew
  })

export { utilisateursFormatTable }
