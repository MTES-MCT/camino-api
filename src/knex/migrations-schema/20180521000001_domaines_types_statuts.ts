import { Knex } from 'knex'

exports.up = async (knex: Knex) =>
  knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypesTypes', table => {
      table.string('id', 2).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('titresTypes', table => {
      table.string('id', 3).primary().notNullable()
      table
        .string('domaineId', 1)
        .index()
        .references('domaines.id')
        .notNullable()
      table
        .string('typeId', 3)
        .index()
        .references('titresTypesTypes.id')
        .notNullable()
      table.specificType('contenuIds', 'jsonb[]')
      table.boolean('archive')
      table.unique(['domaineId', 'typeId'])
    })
    .createTable('titres_statuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.text('description')
      table.string('couleur', 16).notNullable()
      table.integer('ordre')
    })
    .createTable('titresTypes__titresStatuts', table => {
      table
        .string('titreTypeId')
        .index()
        .references('titresTypes.id')
        .notNullable()
      table
        .string('titreStatutId')
        .index()
        .references('titresStatuts.id')
        .notNullable()
      table.boolean('publicLecture')
      table.primary(['titreTypeId', 'titreStatutId'])
    })

exports.down = () => ({})
