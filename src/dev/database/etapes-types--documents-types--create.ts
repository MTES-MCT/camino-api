import 'dotenv/config'
import knex from '../../init'

const main = async () => {
  await knex.schema.createTable('etapesTypes__documentsTypes', table => {
    table
      .string('etapeTypeId', 3)
      .index()
      .references('etapesTypes.id')
      .notNullable()
      .onDelete('CASCADE')
    table
      .string('documentTypeId', 3)
      .index()
      .references('documentsTypes.id')
      .notNullable()
    table.boolean('optionnel')
    table.primary(['etapeTypeId', 'documentTypeId'])
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
