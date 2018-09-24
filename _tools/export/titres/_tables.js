const dateFormat = require('dateformat')

// liste des tables
// la colonne id si elle existe doit être en première position
// car c'est un mot clé réservé par l'API google
// (cf: _titres-db-to-spreadsheet.js)
const tables = [
  {
    name: 'titres',
    columns: ['id', 'nom', 'typeId', 'domaineId', 'statutId', 'references'],
    callbacks: {
      references: v => JSON.stringify(v)
    }
  },
  {
    name: 'titresDemarches',
    columns: ['id', 'demarcheId', 'titreId', 'demarcheStatutId', 'ordre'],
    parents: ['demarches']
  },
  {
    name: 'titresPhases',
    columns: ['titreDemarcheId', 'phaseStatutId', 'dateDebut', 'dateFin'],
    parents: ['demarches', 'phase'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd')
    }
  },
  {
    name: 'titresEtapes',
    columns: [
      'id',
      'titreDemarcheId',
      'etapeId',
      'etapeStatutId',
      'ordre',
      'date',
      'dateDebut',
      'duree',
      'dateFin',
      'surface',
      'visas',
      'engagement',
      'engagementDevise',
      'sourceIndisponible'
    ],
    parents: ['demarches', 'etapes'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd'),
      date: v => dateFormat(v, 'yyyy-mm-dd'),
      visas: v => JSON.stringify(v)
    }
  },
  {
    name: 'titresPoints',
    columns: [
      'id',
      'titreEtapeId',
      'coordonees',
      'groupe',
      'contour',
      'point',
      'nom',
      'description',
      'securite'
    ],
    parents: ['demarches', 'etapes', 'points'],
    callbacks: {
      coordonees: v => JSON.stringify(v)
    }
  },
  {
    name: 'titresPointsReferences',
    columns: ['id', 'titrePointId', 'systeme', 'coordonees'],
    parents: ['demarches', 'etapes', 'points', 'references'],
    callbacks: {
      coordonees: v => JSON.stringify(v)
    }
  },
  {
    name: 'titresDocuments',
    columns: [
      'id',
      'titreEtapeId',
      'type',
      'nom',
      'url',
      'uri',
      'fichier',
      'jorf',
      'nor'
    ],
    parents: ['demarches', 'etapes', 'documents']
  },
  {
    name: 'titresSubstances',
    columns: ['titreEtapeId', 'substanceId', 'connexe', 'ordre'],
    parents: ['demarches', 'etapes', 'titresSubstances']
  },
  {
    name: 'titresTitulaires',
    columns: ['titreEtapeId', 'entrepriseId'],
    parents: ['demarches', 'etapes', 'titresTitulaires']
  },
  {
    name: 'titresAmodiataires',
    columns: ['titreEtapeId', 'entrepriseId'],
    parents: ['demarches', 'etapes', 'titresAmodiataires']
  },
  {
    name: 'titresUtilisateurs',
    columns: ['titreEtapeId', 'utilisateurId'],
    parents: ['demarches', 'etapes', 'titresUtilisateurs']
  },
  {
    name: 'titresEmprises',
    columns: ['titreEtapeId', 'empriseId'],
    parents: ['demarches', 'etapes', 'titresEmprises']
  },
  {
    name: 'titresErreurs',
    columns: [
      'titreEtapeId',
      'date',
      'dateDebut',
      'dateFin',
      'duree',
      'surface',
      'points',
      'substances',
      'titulaires',
      'amodiataires',
      'administrations'
    ],
    parents: ['demarches', 'etapes', 'erreurs']
  }
]

module.exports = tables
