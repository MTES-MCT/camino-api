import '../../init'

import { knex } from '../../knex'

async function main() {
  await knex.schema.createTable(
    'titresTypes__demarchesTypes__etapesTypes__documentsTypes',
    table => {
      table.string('titreTypeId', 3).index().notNullable()
      table.string('demarcheTypeId', 7).index().notNullable()
      table.string('etapeTypeId', 3).index().notNullable()
      table
        .string('documentTypeId', 3)
        .index()
        .references('documentsTypes.id')
        .notNullable()
      table.boolean('optionnel')
      table.primary([
        'titreTypeId',
        'demarcheTypeId',
        'etapeTypeId',
        'documentTypeId'
      ])
      table
        .foreign(['titreTypeId', 'demarcheTypeId', 'etapeTypeId'])
        .references(['titreTypeId', 'demarcheTypeId', 'etapeTypeId'])
        .inTable('titresTypes__demarchesTypes__etapesTypes')
    }
  )
  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
