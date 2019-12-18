exports.up = knex =>
  knex.schema
    .table('administrations__domaines', table => {
      table
        .dropForeign(
          'administration_id',
          'administrations__domaines_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'administrations__domaines_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('restrictions__etapes_types__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__etapestypes__administrations_administrationid_for'
        )
        .foreign(
          'administration_id',
          'restrictions__etapestypes__administrations_administrationid_for'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('restrictions__types__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__types__administrations_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'restrictions__types__administrations_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('restrictions__types__statuts__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__types__statuts__administrations_administrationid_'
        )
        .foreign(
          'administration_id',
          'restrictions__types__statuts__administrations_administrationid_'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('titres_administrations_gestionnaires', table => {
      table
        .dropForeign(
          'administration_id',
          'titres_administrations_gestionnaires_pkey'
        )
        .foreign(
          'administration_id',
          'titres_administrations_gestionnaires_pkey'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('titres_administrations_locales', table => {
      table
        .dropForeign('administration_id', 'titres_administrations_locales_pkey')
        .foreign('administration_id', 'titres_administrations_locales_pkey')
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('titres_administrations_locales', table => {
      table
        .dropForeign(
          'administration_id',
          'titresadministrationslocales_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'titresadministrationslocales_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
    .table('utilisateurs__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'utilisateurs__administrations_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'utilisateurs__administrations_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })

exports.down = knex =>
  knex.schema
    .table('administrations__domaines', table => {
      table
        .dropForeign(
          'administration_id',
          'administrations__domaines_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'administrations__domaines_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('restrictions__etapes_types__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__etapestypes__administrations_administrationid_for'
        )
        .foreign(
          'administration_id',
          'restrictions__etapestypes__administrations_administrationid_for'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('restrictions__types__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__types__administrations_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'restrictions__types__administrations_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('restrictions__types__statuts__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'restrictions__types__statuts__administrations_administrationid_'
        )
        .foreign(
          'administration_id',
          'restrictions__types__statuts__administrations_administrationid_'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('titres_administrations_gestionnaires', table => {
      table
        .dropForeign(
          'administration_id',
          'titres_administrations_gestionnaires_pkey'
        )
        .foreign(
          'administration_id',
          'titres_administrations_gestionnaires_pkey'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('titres_administrations_locales', table => {
      table
        .dropForeign('administration_id', 'titres_administrations_locales_pkey')
        .foreign('administration_id', 'titres_administrations_locales_pkey')
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('titres_administrations_locales', table => {
      table
        .dropForeign(
          'administration_id',
          'titresadministrationslocales_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'titresadministrationslocales_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
    .table('utilisateurs__administrations', table => {
      table
        .dropForeign(
          'administration_id',
          'utilisateurs__administrations_administrationid_foreign'
        )
        .foreign(
          'administration_id',
          'utilisateurs__administrations_administrationid_foreign'
        )
        .references('administrations.id')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
    })
