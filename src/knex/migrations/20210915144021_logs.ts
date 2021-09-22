import Knex from 'knex'

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('logs', table => {
    table.string('id').primary()
    table.string('utilisateurId').index().notNullable()
    table.dateTime('date').notNullable()
    table.string('elementId').notNullable()
    table.enum('operation', ['create', 'update', 'delete']).notNullable()
    table.jsonb('differences').nullable()
  })
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable('logs')
}
