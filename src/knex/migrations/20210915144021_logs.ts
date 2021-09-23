import Knex from 'knex'

export const up = (knex: Knex): Promise<void> => {
  return knex.schema
    .createTable('logs', table => {
      table.string('id').primary()
      table.string('utilisateurId').index().notNullable()
      table.dateTime('date').notNullable()
      table.string('elementId').notNullable()
      table.enum('operation', ['create', 'update', 'delete']).notNullable()
      table.jsonb('differences').nullable()
    })
    .then(() => {
      console.log('Migration terminée : Ajout de la table « logs »')
    })
}

export const down = (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('logs')
}
