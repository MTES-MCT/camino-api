import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import definitions from './definitions'

const utilisateursDefinition = definitions.find(
  definition => definition.name === 'utilisateurs'
)

const run = async () => {
  const res = await dbProcess(utilisateursDefinition)
  console.log(res)
  process.exit()
}

run()
