const jsonToSpreadsheet = require('./_utils/json-to-spreadsheet')

const { utilisateursGet } = require('../../postgres/queries/utilisateurs')

const credentials = require('./credentials')

const tables = [
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
      'permissionId'
    ]
  }
]

module.exports = async () => {
  const utilisateurs = await utilisateursGet({
    noms: null,
    entrepriseIds: null,
    permissionIds: null,
    administrationIds: null
  })

  await jsonToSpreadsheet(spreadsheetId, credentials, tables, utilisateurs)
}
