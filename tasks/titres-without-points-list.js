require('dotenv').config()
require('../postgres')

const { titresGet } = require('../postgres/queries/titres')

const titresWithoutPointsList = async () => {
  const titres = await titresGet({ domaineIds: ['g'] })

  const list = titres.filter(
    titre =>
      titre.demarches.every(demarche =>
        demarche.etapes.every(etape => etape.points.length === 0)
      ) && titre.statutId === 'val'
  )

  return list.map(titre => titre.id)
}

const run = async () => {
  const res = await titresWithoutPointsList()
  console.log(res)
  console.log('Done')

  process.exit()
}

run()
