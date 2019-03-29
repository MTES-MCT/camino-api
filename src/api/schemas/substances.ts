export default `
type Substance {
  id: ID!
  nom: String!
  symbole: String
  gerep: Int
  description: String
  legales: [SubstanceLegale!]!
}

type TitreSubstance {
  id: ID!
  nom: String!
  symbole: String
  gerep: Int
  description: String
  legales: [SubstanceLegale!]!
  connexe: Boolean
  ordre: Int
}

type SubstanceLegale {
  id: ID!
  nom: String!
  domaine: Domaine
  description: String
  code: SubstanceLegaleCode!
}

type SubstanceLegaleCode {
  id: ID!
  nom: String!
  description: String
  lien: String!
}

input InputSubstanceId {
  id: ID!
}`
