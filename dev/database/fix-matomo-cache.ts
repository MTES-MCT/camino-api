import 'dotenv/config'
import knex from '../../src/init'

async function main() {
  await knex.schema.createTable('caches', table => {
    table.string('id', 128).primary()
    table.jsonb('valeur')
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
