const dateFormat = require('dateformat')

const tables = [
  {
    title: 'titres',
    columns: ['id', 'nom', 'typeId', 'domaineId', 'statutId', 'references'],
    callbacks: {
      references: v => JSON.stringify(v)
    }
  },
  {
    title: 'titresDemarches',
    columns: ['id', 'demarcheId', 'titreId', 'demarcheStatutId', 'ordre'],
    parents: ['demarches']
  },
  {
    title: 'titresEtapes',
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
      date: v => dateFormat(v, 'yyyy-mm-dd')
    }
  }
  // {
  //   title: 'titresPhases',
  //   columns: ['test']
  // },
  // { title: 'titresPoints', columns: ['test'] },
  // { title: 'titresPointsReferences', columns: ['test'] },
  // { title: 'titresDocuments', columns: ['test'] },
  // { title: 'titresSubstances', columns: ['test'] },
  // { title: 'titresTitulaires', columns: ['test'] },
  // { title: 'titresAmodiataires', columns: ['test'] },
  // { title: 'titresUtilisateurs', columns: ['test'] },
  // { title: 'titresEmprises', columns: ['test'] },
  // { title: 'titresErreurs', columns: ['test'] }
]

module.exports = tables
