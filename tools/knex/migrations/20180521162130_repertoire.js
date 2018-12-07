exports.up = knex => {
  return knex.schema
    .createTable('entreprises', table => {
      table.string('id', 64).primary()
      table.string('nom')
      table.string('raisonSociale')
      table.string('paysId')
      table.string('legalSiren')
      table.string('legalEtranger')
      table.string('legalForme')
      table.string('voieNumero')
      table.string('voieType')
      table.string('voieNom')
      table.string('adresseComplement')
      table.string('codePostal')
      table.string('ville')
      table.string('cedex')
      table.string('localite')
      table.string('insee')
      table.string('url')
      table.string('email')
      table.string('telephone')
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
    .createTable('permissions', table => {
      table.string('id', 12).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('utilisateurs', table => {
      table.string('id').primary()
      table.string('email').notNullable()
      table.string('motDePasse').notNullable()
      table.string('nom')
      table.string('prenom')
      table
        .string('administrationId', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .onDelete('CASCADE')
      table.string('telephoneFixe')
      table.string('telephoneMobile')
      table
        .string('permissionId', 12)
        .references('permissions.id')
        .notNullable()
        .onDelete('CASCADE')
      table.json('preferences')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('utilisateurs')
    .dropTable('permissions')
    .dropTable('entreprises')
    .dropTable('administrations')
}
