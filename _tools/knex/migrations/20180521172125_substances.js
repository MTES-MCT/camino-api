exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('substancesLegals', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table.string('description').notNullable()
      table.string('lien').notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table
        .enum('domaine', [
          'mines',
          'carrières',
          'stockages souterrains',
          'granulats marins',
          'gîtes géothermiques'
        ])
        .notNullable()
      table.enum('type', ['fossile', 'minérale'])
      table
        .enum('usage', [
          'énergétique',
          'non énergétique',
          'utile à l énergie atomique',
          'stockage'
        ])
        .notNullable()
      table.string('symbole')
      table.specificType('alias', 'character varying(255)[]')
      table.integer('gerep')
      table.string('description', 2048)
      table
        .string('legalId')
        .references('substancesLegals.id')
        .notNullable()
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('substances').dropTable('substancesLegals')
}
