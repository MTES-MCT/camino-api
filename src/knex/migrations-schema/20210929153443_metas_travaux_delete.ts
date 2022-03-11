import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  return knex.schema
    .dropTable('travaux_etapes_types__documents_types')
    .dropTable('travaux_etapes_types__etapes_statuts')
    .dropTable('travaux_types__travaux_etapes_types')
    .dropTable('travaux_etapes_types')
    .dropTable('travaux_types')
}

exports.down = () => ({})
