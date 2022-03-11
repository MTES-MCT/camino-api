import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  return knex.schema
    .createTable('frequences', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('periodesNom')
    })
    .createTable('annees', table => {
      table.integer('id', 1).primary()
      table.string('nom').notNullable()
      table.string('frequenceId', 3).index().references('frequences.id')
    })
    .createTable('trimestres', table => {
      table.integer('id', 1).primary()
      table.string('nom').notNullable()
      table.string('frequenceId', 3).index().references('frequences.id')
    })
    .createTable('mois', table => {
      table.integer('id', 2).primary()
      table.string('nom').notNullable()
      table.string('frequenceId', 3).index().references('frequences.id')
      table.integer('trimestreId', 1).index().references('trimestres.id')
    })
}

exports.down = () => ({})
