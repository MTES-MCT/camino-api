import '../../init'

import { knex } from '../../knex'

const main = async () => {
  await knex.schema.alterTable('documentsTypes', table => {
    table.text('description')
  })
  await knex.schema.alterTable('etapesTypes__documentsTypes', table => {
    table.text('description')
  })
  await knex.schema.alterTable('etapesTypes__justificatifsTypes', table => {
    table.text('description')
  })
  await knex.schema.alterTable(
    'titresTypes__demarchesTypes__etapesTypes__documentsTypes',
    table => {
      table.text('description')
    }
  )
  await knex.schema.alterTable(
    'titresTypes__demarchesTypes__etapesTypes__justificatifsT',
    table => {
      table.text('description')
    }
  )

  process.exit(0)
}

main()
