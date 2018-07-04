exports.up = knex => {
  return knex.schema
    .createTable('entreprises', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.string('service')
      table.string('site')
      table.string('email')
      table.string('telephone')
      table.string('adresse_1')
      table.string('adresse_2')
      table.string('ville')
      table.string('code_postal')
      table.string('cedex')
    })
    .createTable('administrations', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.string('service')
      table.string('site')
      table.string('email')
      table.string('telephone')
      table.string('adresse_1')
      table.string('adresse_2')
      table.string('ville')
      table.string('code_postal')
      table.string('cedex')
    })
    .createTable('utilisateurs', table => {
      table.string('id').primary()
      table
        .string('administration_id', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
      table
        .string('entreprise_id', 64)
        .references('entreprises.id')
        .onDelete('CASCADE')
      table.string('nom').notNullable()
      table.string('email')
      table.string('telephone_fixe')
      table.string('telephone_mobile')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('contacts')
    .dropTable('entreprises')
    .dropTable('administrations')
    .dropTable('utilisateurs')
}
