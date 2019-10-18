exports.up = knex => {
  return knex.schema
    .createTable('entreprises', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.string('paysId')
      table.string('legalSiren')
      table.string('legalEtranger')
      table.string('legalForme')
      table.string('categorie')
      table.string('dateCreation', 10)
      table.string('adresse')
      table.string('codePostal')
      table.string('commune')
      table.string('cedex')
      table.string('url')
      table.string('email')
      table.string('telephone')
    })
    .createTable('entreprisesEtablissements', table => {
      table.string('id', 64).primary()
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .notNullable()
        .onDelete('CASCADE')
      table.string('nom')
      table.string('legalSiret')
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
    })
    .createTable('administrationsTypes', table => {
      table.string('id', 64).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('administrations', table => {
      table.string('id', 64).primary()
      table
        .string('typeId')
        .references('administrationsTypes.id')
        .notNullable()
      table.string('nom').notNullable()
      table.string('service')
      table.string('url')
      table.string('email')
      table.string('telephone')
      table.string('adresse1')
      table.string('adresse2')
      table.string('codePostal')
      table.string('commune')
      table.string('cedex')
      table.string('departementId').references('departements.id')
      table.string('regionId').references('regions.id')
    })
    .createTable('administrations__domaines', table => {
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
      table
        .string('administrationId')
        .references('administrations.id')
        .notNullable()
    })
    .createTable('permissions', table => {
      table.string('id', 12).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('utilisateurs', table => {
      table.string('id').primary()
      table.string('email')
      table.string('motDePasse').notNullable()
      table.string('nom')
      table.string('prenom')
      table.string('telephoneFixe')
      table.string('telephoneMobile')
      table
        .string('permissionId', 12)
        .references('permissions.id')
        .notNullable()
        .onDelete('CASCADE')
      table.json('preferences')
    })
    .createTable('utilisateurs__entreprises', table => {
      table
        .string('utilisateurId', 64)
        .references('utilisateurs.id')
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .onDelete('CASCADE')
    })
    .createTable('utilisateurs__administrations', table => {
      table
        .string('utilisateurId', 64)
        .references('utilisateurs.id')
        .onDelete('CASCADE')
      table
        .string('administrationId', 64)
        .references('administrations.id')
        .onDelete('CASCADE')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('utilisateurs__administrations')
    .dropTable('utilisateurs__entreprises')
    .dropTable('entreprisesEtablissements')
    .dropTable('utilisateurs')
    .dropTable('permissions')
    .dropTable('entreprises')
    .dropTable('administrations__domaines')
    .dropTable('administrations')
    .dropTable('administrationsTypes')
}
