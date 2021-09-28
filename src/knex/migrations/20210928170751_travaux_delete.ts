import type Knex from 'knex'
import DemarchesTypes from '../../database/models/demarches-types'
import Document from '../../database/models/documents'

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema
    .alterTable(DemarchesTypes.tableName, table => {
      table.boolean('travaux')
    })
    .alterTable(Document.tableName, table => {
      table.dropColumn('titre_travaux_etape_id')
    })
    .dropTable('titres_travaux_etapes')
    .dropTable('titres_travaux')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (knex: Knex): Promise<void> => {
  // TODO
}
