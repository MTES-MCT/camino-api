export default `
type TitreActivite {
  id: ID!
  type: ActiviteType!
  statut: ActiviteStatut!
  date: Date!
  dateSaisie: Date
  contenu: Json
  periode: Json
  sections: Json
  annee: Int
}

input InputTitreActivite {
  id: ID!
  activiteStatutId: String!
  contenu: Json
}`
