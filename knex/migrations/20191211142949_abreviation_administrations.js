exports.up = knex =>
  knex.schema
    .alterTable('administrations', table => {
      table.string('abreviation', 255)
    })
    .then(() => {
      return knex('administrations').update('abreviation', knex.raw('nom'))
    })
    .then(() => {
      return knex('administrations')
        .where('nom', 'like', '%(%')
        .update(
          'abreviation',
          knex.raw(
            "replace(replace(substring(nom,position('(' in nom)),'(',''),')','')"
          )
        )
    })
    .then(() => {
      return knex('administrations')
        .where('service', 'like', '%DGALN%')
        .update('abreviation', 'DGALN/DEB/EARM2')
    })
    .then(() => {
      return knex('administrations')
        .where('service', 'like', '%DGEC%')
        .update('abreviation', 'DGEC/DE/SD2/2A')
    })
    .then(() => {
      return knex('administrations')
        .where('service', 'like', '%DGPR%')
        .update('abreviation', 'DGPR/SRT/SDRCP/BSSS')
    })

exports.down = knex =>
  knex.schema.alterTable('administrations', table => {
    table.dropColumn('abreviation')
  })
