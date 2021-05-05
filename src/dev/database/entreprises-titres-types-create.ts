import '../../init'

import { knex } from '../../knex'

const main = async () => {
  await knex.schema.createTable('entreprises__titresTypes', table => {
    table
      .string('entrepriseId')
      .index()
      .references('entreprises.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
    table
      .string('titreTypeId')
      .index()
      .references('titresTypes.id')
      .notNullable()
    table.boolean('titresCreation')
    table.primary(['entrepriseId', 'titreTypeId'])
  })

  process.exit(0)
}

main()
