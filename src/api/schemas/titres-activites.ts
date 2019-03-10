export default `
type TitreActivite {
  id: ID!
  type: ActiviteType!
  statut: ActiviteStatut!
  titreId: ID!
  date: Date!
  dateSaisie: Date!
  contenu: Json
}

input InputTitreActivite {
  id: ID!
  titreId: ID!
  date: Date!
  statut: InputTitreActiviteStatut!
  type: InputTitreActiviteType!
  contenu: Json
}`
