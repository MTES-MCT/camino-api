export default `
"""
# Query
## _Requêtes en lecture_

- [Comment tester l'API Camino ?](https://github.com/MTES-MCT/camino-api/tree/master/manual/api)

_Query_ un type _racine_ (_root_) de GraphQL.

Certaines requêtes sont __publiques__.

Certaines requêtes sont __protégées__ et nécessitent une authentification par token (jwt). Elles sont signalées par une étoile __*__.

Enfin, certaines requêtes sont __semi-publiques__ et retournent un résultat plus ou moins riche selon le niveau de permission de l'utilisateur authentifié. Elles sont signalées par un plus __+__.
"""
type Query {
  "Retourne la version de l'API"
  version: String

  "Retourne les meta-informations sur les titres miniers (types, domaines, statuts)"
  metas: Metas

  "__+__ Retourne un titre minier en fonction de son id"
  titre(id: ID!): Titre

  "__+__ Retourne une liste de titres miniers, en fonction d'arguments (optionels)"
  titres(
    typeIds: [TypeId]
    domaineIds: [DomaineId]
    statutIds: [StatutId]
    substances: [String]
    noms: [String]
    entreprises: [String]
    references: [String]
    territoires: [String]
  ): [Titre]

  "__*__ Retourne un utilisateur en fonction de son id"
  utilisateur(id: ID!): Utilisateur

  "__*__ Retourne une liste d'utilisateurs en fonction d'arguments (optionels)"
  utilisateurs(
    entrepriseIds: [ID]
    administrationIds: [ID]
    permissionIds: [ID]
    noms: [String]
  ): [Utilisateur]

  "Retourne une substance en fonction de son id"
  substance(id: ID!): Substance

  "Retourne la liste des substances"
  substances: [Substance]

  "__*__ Retourne un utilisateur et son token en fonction du token"
  utilisateurIdentifier: UtilisateurToken

  "__+__ Retourne la liste des permissions utilisateurs"
  permissions: [Permission]

  "__*__ Retourne une entreprise en fonction de son id"
  entreprise(id: ID!): Entreprise

  "__*__ Retourne la liste des entreprises"
  entreprises: [Entreprise]

  "__*__ Retourne les statistiques"
  statistiques: Statistiques
}

"""
# Mutation
## _Requêtes en écriture_

- [Comment tester l'API Camino ?](https://github.com/MTES-MCT/camino-api/tree/master/manual/api)

_Mutation_ un type natif de GraphQL.

Ces requêtes sont __protégées__. Elles nécessitent une authentification par token (jwt) et un niveau de permission suffisant. Elle sont signalées par une étoile __*__.
"""
type Mutation {
  "__*__ Connecte l'utilisateur en fonction de ses identifiants"
  utilisateurConnecter(email: String!, motDePasse: String!): UtilisateurToken

  "__*__ Ajoute un utilisateur"
  utilisateurAjouter(utilisateur: InputUtilisateurAjouter!): Utilisateur

  "__*__ Modifie un utilisateur"
  utilisateurModifier(utilisateur: InputUtilisateur!): Utilisateur

  "__*__ Supprime un utilisateur"
  utilisateurSupprimer(id: ID!): Utilisateur

  "__*__ Modifie le mot de passe d'un utilisateur"
  utilisateurMotDePasseModifier(
    id: ID!
    motDePasse: String!
    motDePasseNouveau1: String!
    motDePasseNouveau2: String!
  ): Utilisateur

  "__*__ Envoie un email à un utilisateur contenant une url pour modifier son mot de passe"
  utilisateurMotDePasseEmailEnvoyer(email: String!): String

  "__*__ Envoie un email à un utilisateur contenant une url pour créer son compte"
  utilisateurAjoutEmailEnvoyer(email: String!): String

  "__*__ Initialise un mot de passe utilisateur"
  utilisateurMotDePasseInitialiser(
    motDePasse1: String!
    motDePasse2: String!
  ): String

  "__*__ Modifie un titre minier"
  titreModifier(titre: InputTitre): Titre

  "__*__ Supprime un titre minier"
  titreSupprimer(id: ID!): Titre

  "__*__ Modifie une démarche et met à jour le titre minier"
  titreDemarcheModifier(demarche: InputDemarche): Titre

  "__*__ Supprime une démarche et met à jour le titre minier"
  titreDemarcheSupprimer(id: ID!): Titre

  "__*__ Modifie une étape et met à jour le titre minier"
  titreEtapeModifier(etape: InputEtape): Titre

  "__*__ Supprime une étape et met à jour le titre minier"
  titreEtapeSupprimer(id: ID!): Titre

  "__*__ Créé ou modifie une activité"
  titreActiviteModifier(
    activite: InputTitreActivite!
  ): TitreActivite
}

scalar Json

scalar Date
`
