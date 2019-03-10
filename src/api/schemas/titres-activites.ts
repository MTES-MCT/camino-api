export default `
type TitreActivite {
  id: ID!
  type: ActiviteType!
  statut: ActiviteStatut!
  titreId: ID!
  date: Date!
  dateSaisie: Date!
  contenu: Json
  periode: Json
  annee: Int
}

input InputTitreActivite {
  id: ID!
  titreId: ID!
  date: Date!
  statut: InputTitreActiviteStatut!
  type: InputTitreActiviteType!
  contenu: Json
}`
