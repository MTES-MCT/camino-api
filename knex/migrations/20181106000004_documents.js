exports.up = knex =>
  knex.schema
    .createTable('documents', table => {
      table.string('id').primary()
      table.string('typeId', 3).references('documentsTypes.id').notNullable()
      table.string('date', 10).notNullable()
      table.string('entrepriseId', 64)
      table
        .foreign('entrepriseId')
        .references('entreprises.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('titreEtapeId', 128)
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('description', 1024)
      table.string('titreActiviteId', 128)
      table
        .foreign('titreActiviteId')
        .references('titresActivites.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('fichier')
      table.string('fichierTypeId', 3)
      table.string('url', 1024)
      table.string('uri', 1024)
      table.string('jorf', 32)
      table.string('nor', 32)
      table.boolean('public_lecture')
      table.boolean('entreprises_lecture')
    })
    .createTable('titresEtapesJustificatifs', table => {
      table.string('titreEtapeId', 128)
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('documentId')
        .references('documents.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.primary(['titreEtapeId', 'documentId'])
    })

exports.down = knex =>
  knex.schema.dropTable('titresEtapesJustificatifs').dropTable('documents')
