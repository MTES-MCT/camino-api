require('dotenv').config()
require('../../../database/index')

const {
  titresDemarchesGet
} = require('../../../database/queries/titres-demarches')

async function main() {
  let res = await titresDemarchesGet({ demarchesIds: ['abr', 'ren', 'ret'] })

  res = res.filter(({ typeId, etapes }) => {
    if (typeId === 'ren') {
      return !etapes.find(te => te.points.length)
    }
    return true
  })

  console.log(res.map(({ id, statutId }) => ({ id, statutId })))

  process.exit()
}

main()
