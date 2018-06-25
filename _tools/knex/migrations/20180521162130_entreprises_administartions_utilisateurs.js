exports.up = knex => {
  return knex.schema
    .createTable('contacts', table => {
      table.string('id').primary()
      table.string('site')
      table.string('email')
      table.string('telephone_fixe')
      table.string('telephone_portable')
      table.string('adresse_1')
      table.string('adresse_2')
      table.string('ville')
      table.string('code_postal')
      table.string('cedex')
    })
    .createTable('entreprises', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table
        .string('contact_id')
        .references('contacts.id')
        .onDelete('CASCADE')
    })
    .createTable('administrations', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table
        .string('contact_id')
        .references('contacts.id')
        .onDelete('CASCADE')
    })
    .createTable('entreprises_services', table => {
      table.string('id').primary()
      table
        .string('entreprise_id', 64)
        .references('entreprises.id')
        .onDelete('CASCADE')
      table.string('nom').notNullable()
      table
        .string('contact_id')
        .references('contacts.id')
        .onDelete('CASCADE')
    })
    .createTable('administrations_services', table => {
      table.string('id').primary()
      table
        .string('administration_id', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
      table.string('nom').notNullable()
      table
        .string('contact_id')
        .references('contacts.id')
        .onDelete('CASCADE')
    })
    .createTable('utilisateurs', table => {
      table.string('id').primary()
      table
        .string('administration_id', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
      table.string('nom').notNullable()
      table
        .string('contact_id')
        .references('contacts.id')
        .onDelete('CASCADE')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('contacts')
    .dropTable('entreprises_services')
    .dropTable('administrations_services')
    .dropTable('entreprises')
    .dropTable('administrations')
    .dropTable('utilisateurs')
}
