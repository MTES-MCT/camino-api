export default `
type ActiviteStatut {
  id: ID!
  nom: String!
  couleur: String!
}

type ActiviteType {
  id: ID!
  nom: String!
  sections: Json!
  frequence: Frequence!
  pays: [Pays!]
}

input InputTitreActiviteStatut {
  "L'id composée de trois lettres"
  id: EtapeStatutId!

  "Le nom en français"
  nom: String

  couleur: Couleur
}

input InputTitreActiviteType {
  "L'id composée de trois lettres"
  id: EtapeStatutId!

  "Le nom en français"
  nom: String
}`
