export default `
type Entreprise {
  id: ID!
  nom: String
  paysId: String
  legalSiren: String
  legalEtranger: String
  legalForme: String
  categorie: String
  dateCreation: Date
  adresse: String
  codePostal: String
  commune: String
  cedex: String
  url: String
  telephone: String
  email: String
  etablissements: [EntrepriseEtablissement]
  utilisateurs: [Utilisateur]
}

type EntrepriseEtablissement {
  id: ID!
  nom: String
  dateDebut: Date
  dateFin: Date
  legalSiret: String
}

input InputEntreprise {
  id: ID!
  nom: String
  paysId: String
  legalSiren: String
  legalEtranger: String
  legalForme: String
  categorie: String
  adresse: String
  codePostal: String
  commune: String
  cedex: String
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
