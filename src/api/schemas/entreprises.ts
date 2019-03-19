export default `
type Entreprise {
  id: ID!
  raisonSociale: String
  paysId: String
  legalSiren: String
  legalEtranger: String
  legalForme: String
  voieNumero: String
  voieType: String
  voieNom: String
  adresseComplement: String
  codePostal: Int
  ville: String
  cedex: Int
  url: String
  telephone: String
  email: String
  etablissements: [EntrepriseEtablissement]
  utilisateurs: [Utilisateur]
}

type EntrepriseEtablissement {
  id: ID!
  nom: String!
  dateDebut: Date
  dateFin: Date
  legalSiret: String
}

input InputEntreprise {
  id: ID!
  raisonSociale: String
  paysId: String
  legalSiren: String
  legalEtranger: String
  legalForme: String
  voieNumero: String
  voieType: String
  voieNom: String
  adresseComplement: String
  codePostal: Int
  ville: String
  cedex: Int
  url: String
  telephone: String
  email: String
  utilisateurs: [InputUtilisateur]
  etablissements: [InputEtablissements]
}

input InputEtablissements {
  id: ID!
  nom: String
  legalSiret: String
  dateDebut: Date
  dateFin: Date
}`
