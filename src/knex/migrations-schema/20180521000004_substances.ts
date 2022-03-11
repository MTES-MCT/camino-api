import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  return knex.schema
    .createTable('substancesLegalesCodes', table => {
      table.string('id').primary()
      table.string('nom')
      table.string('code').notNullable()
      table.text('description')
      table.string('lien').notNullable()
      table.integer('ordre').notNullable()
    })
    .createTable('substancesLegales', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table
        .string('domaineId', 1)
        .notNullable()
        .index()
        .references('domaines.id')
      table.text('description')
      table
        .string('substanceLegaleCodeId')
        .index()
        .references('substancesLegalesCodes.id')
        .notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table.string('symbole')
      table.integer('gerep')
      table.string('description', 2048)
    })
    .createTable('substances__substancesLegales', table => {
      table
        .string('substanceId')
        .index()
        .references('substances.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('substanceLegaleId')
        .index()
        .references('substancesLegales.id')
        .notNullable()
      table.primary(['substanceId', 'substanceLegaleId'])
    })
    .createTable('substancesFiscales', table => {
      table.string('id', 4).primary()
      table
        .string('substanceLegaleId')
        .index()
        .references('substancesLegales.id')
        .notNullable()
      table.string('uniteId').index().references('unites.id').notNullable()
      table.string('redevanceUniteId').index().references('unites.id')
      table.string('nom').notNullable()
      table.string('description', 2048)
    })
}

exports.down = () => ({})
