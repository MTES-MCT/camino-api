exports.up = async knex => {
  return knex.schema
    .dropTable('travaux_etapes_types__documents_types')
    .dropTable('travaux_etapes_types__etapes_statuts')
    .dropTable('travaux_types__travaux_etapes_types')
    .dropTable('travaux_etapes_types')
    .dropTable('travaux_types')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.down = knex => {
  // TODO
}
