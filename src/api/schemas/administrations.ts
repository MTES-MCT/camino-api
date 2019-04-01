export default `
type Administration {
  id: ID!
  nom: String
  service: String
  url: String
  email: String
  telephone: String
  adresse1: String
  adresse2: String
  codePostal: String
  commune: String
  cedex: String
  utilisateurs: [Utilisateur]
}

input InputAdministrationId {
  id: ID!
}

input InputAdministration {
  id: ID!
  nom: String
  service: String
  url: String
  email: String
  telephone: String
  adresse1: String
  adresse2: String
  codePostal: String
  commune: String
  cedex: String
}`
