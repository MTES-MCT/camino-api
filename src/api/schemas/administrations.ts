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
  codePostal: Int
  commune: String
  cedex: Int
  utilisateurs: [Utilisateur]
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
  codePostal: Int
  commune: String
  cedex: Int
}`
