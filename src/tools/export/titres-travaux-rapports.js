import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import definitions from './definitions'

const titresTravauxRapportsDefinition = definitions.find(
  definition => definition.name === 'titres-travaux-rapports'
)

const run = async () => {
  const res = await dbProcess(titresTravauxRapportsDefinition)
  console.log(res)
  process.exit()
}

run()
