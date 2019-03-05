export default `
type TitreActivite {
  id: ID!
  titreId: ID!
  date: Date!
  confirmation: Boolean
  contenu: Json
}

input InputTitreActivite {
  id: ID!
  titreId: ID!
  date: Date!
  confirmation: Boolean
  contenu: Json
}`
