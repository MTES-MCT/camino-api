const dateFormat = require('dateformat')

// liste des tables
// la colonne id si elle existe doit être en première position
// car c'est un mot clé réservé par l'API google
// (cf: _utils/json-to-spreadsheet.js)
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
    columns: ['id', 'typeId', 'titreId', 'statutId', 'ordre'],
    parents: ['demarches']
  },
  {
    name: 'titresPhases',
    columns: ['titreDemarcheId', 'statutId', 'dateDebut', 'dateFin'],
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
      'typeId',
      'statutId',
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
      'coordonnees',
      'groupe',
      'contour',
      'point',
      'nom',
      'description',
      'securite'
    ],
    parents: ['demarches', 'etapes', 'points'],
    callbacks: {
      coordonnees: v => `${v.x}, ${v.y}`
    }
  },
  {
    name: 'titresPointsReferences',
    columns: ['id', 'titrePointId', 'systeme', 'coordonnees'],
    parents: ['demarches', 'etapes', 'points', 'references'],
    callbacks: {
      coordonnees: v => `${v.x}, ${v.y}`
    }
  },
  {
    name: 'titresDocuments',
    columns: [
      'id',
      'titreEtapeId',
      'type',
      'jorf',
      'nor',
      'nom',
      'url',
      'uri',
      'fichier'
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
