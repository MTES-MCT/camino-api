export default `
type Utilisateur {
  id: ID!
  email: String!
  nom: String
  prenom: String
  telephoneMobile: String
  telephoneFixe: String
  administration: Administration
  entreprise: Entreprise
  permission: Permission
  preferences: Json
}

type UtilisateurToken {
  utilisateur: Utilisateur
  token: String
}

type Permission {
  id: ID!
  nom: String
}

input InputUtilisateur {
  id: ID!
  email: String!
  nom: String
  prenom: String
  telephoneMobile: String
  telephoneFixe: String
  permission: InputPermission
  entreprise: [InputEntrepriseId]
  administration: [InputAdministrationId]
  preferences: Json
}

input InputUtilisateurAjouter {
  email: String!
  motDePasse: String!
  nom: String
  prenom: String
  telephoneMobile: String
  telephoneFixe: String
  permission: InputPermission
  entreprise: [InputEntrepriseId]
  administration: [InputAdministrationId]
  preferences: Json
}

input InputPermission {
  id: ID!
  nom: String
}`
