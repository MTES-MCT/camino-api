export default `
type TitreActivitesRapport {
  id: ID!
  titreId: ID!
  date: Date!
  confirmation: Boolean
  contenu: Json
}

input InputTitreActivitesRapport {
  id: ID!
  titreId: ID!
  date: Date!
  confirmation: Boolean
  contenu: Json
}`
