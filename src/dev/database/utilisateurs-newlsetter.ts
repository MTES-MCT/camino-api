import '../../init'
import { knex } from '../../knex'

const main = async () => {
  try {
    await knex.schema.alterTable('utilisateurs', table => {
      table.boolean('newsletter')
    })
  } catch (e) {
    console.info(e)
  }

  process.exit(0)
}

main()
