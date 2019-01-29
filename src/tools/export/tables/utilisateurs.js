const utilisateursTables = [
  {
    name: 'utilisateurs',
    columns: [
      'id',
      'email',
      'motDePasse',
      'nom',
      'prenom',
      'administrationId',
      'entrepriseId',
      'telephoneFixe',
      'telephoneMobile',
      'permissionId',
      'preferences'
    ],
    callbacks: {
      preferences: v => JSON.stringify(v)
    }
  }
]

module.exports = utilisateursTables
