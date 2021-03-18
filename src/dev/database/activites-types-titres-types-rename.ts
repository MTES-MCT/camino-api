import '../../init'
import { knex } from '../../knex'

async function main() {
  await knex.schema.renameTable(
    'titresTypes__activitesTypes',
    'activitesTypes__titresTypes'
  )

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
