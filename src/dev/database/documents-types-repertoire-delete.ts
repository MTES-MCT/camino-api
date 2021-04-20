import '../../init'
import { knex } from '../../knex'

const main = async () => {
  await knex.schema.createTable('entreprises__documentsTypes', table => {
    table
      .string('documentTypeId', 3)
      .index()
      .references('documentsTypes.id')
      .notNullable()
    table.primary(['documentTypeId'])
  })

  const documentsTypes = await knex('documentsTypes').where(
    'repertoire',
    'entreprises'
  )

  await knex('entreprises__documentsTypes').insert(
    documentsTypes.map(({ id }) => ({ documentTypeId: id }))
  )

  await knex.schema.alterTable('documentsTypes', table => {
    table.dropColumn('repertoire')
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
