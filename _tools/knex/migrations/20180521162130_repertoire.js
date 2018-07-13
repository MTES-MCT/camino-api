exports.up = knex => {
  return knex.schema
    .createTable('entreprises', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.string('service')
      table.string('site')
      table.string('email')
      table.string('telephone')
      table.string('adresse1')
      table.string('adresse2')
      table.string('ville')
      table.string('codePostal')
      table.string('cedex')
    })
    .createTable('administrations', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.string('service')
      table.string('site')
      table.string('email')
      table.string('telephone')
      table.string('adresse1')
      table.string('adresse2')
      table.string('ville')
      table.string('codePostal')
      table.string('cedex')
    })
    .createTable('utilisateurs', table => {
      table.string('id').primary()
      table
        .string('administrationId', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .onDelete('CASCADE')
      table.string('nom').notNullable()
      table.string('email')
      table.string('telephoneFixe')
      table.string('telephoneMobile')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('utilisateurs')
    .dropTable('entreprises')
    .dropTable('administrations')
}
