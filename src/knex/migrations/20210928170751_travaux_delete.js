import DemarchesTypes from '../../database/models/demarches-types'
import Document from '../../database/models/documents'

exports.up = async knex =>
  {
    await knex.schema
    .table(DemarchesTypes.tableName, table => {
      table.boolean('travaux')
    })

    await knex.schema.table(Document.tableName, table => {
      table.dropColumn('titre_travaux_etape_id')
    })

    await knex.schema.dropTable('titres_travaux_etapes')

    return knex.schema.dropTable('titres_travaux')
  }


// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.down = knex => {
  // TODO
}
