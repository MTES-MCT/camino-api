export default `
type Frequence {
  id: ID!
  nom: String!
  trimestres: [Trimestre]
  mois: [Mois]
}

type Trimestre {
  id: ID!
  nom: String!
  mois: [Mois]
}

type Mois {
  id: ID!
  nom: String!
}`
