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

input InputEtapeSubstance {
  id: ID!
  nom: String
  symbole: String
  connexe: Boolean
  gerep: Int
  ordre: Int
  description: String
  legales: [InputSubstanceLegale]
}

input InputSubstanceLegale {
  id: ID!
  nom: String
  domaine: InputDomaineId
  description: String
  code: InputSubstanceLegaleCode
}

input InputSubstanceLegaleCode {
  id: ID!
  nom: String
  description: String
  lien: String
}`
