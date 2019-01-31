require('dotenv').config()
require('../../../database/index')

const { utilisateursGet } = require('../../../database/queries/utilisateurs')
const { titreGet } = require('../../../database/queries/titres')

async function main() {
  const titre = await titreGet('m-pxm-esperance-1993')

  const entrepriseIds = titre.titulaires.map(t => t.id)

  console.log('titre.titulaires', titre.titulaires)
  console.log('entrepriseIds', entrepriseIds)

  const utilisateurs = await utilisateursGet({
    entrepriseIds,
    noms: undefined,
    administrationIds: undefined,
    permissionIds: undefined
  })

  console.log('utilisateurs', utilisateurs)

  process.exit()
}

main()
