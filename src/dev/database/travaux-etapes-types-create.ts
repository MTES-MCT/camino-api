import '../../init'
import { knex } from '../../knex'

const main = async () => {
  console.info('créé les nouvelles tables')
  await knex.schema
    .createTable('travauxEtapesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.text('description')
      table.integer('ordre').notNullable()
    })
    .createTable('travauxEtapesTypes__etapesStatuts', table => {
      table
        .string('travauxEtapeTypeId', 3)
        .index()
        .references('travauxEtapesTypes.id')
        .notNullable()
      table
        .string('etapeStatutId', 3)
        .index()
        .references('etapesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['travauxEtapeTypeId', 'etapeStatutId'])
    })
    .createTable('travauxEtapesTypes__documentsTypes', table => {
      table
        .string('travauxEtapeTypeId', 3)
        .index()
        .references('travauxEtapesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('documentTypeId', 3)
        .index()
        .references('documentsTypes.id')
        .notNullable()
      table.boolean('optionnel')
      table.primary(['travauxEtapeTypeId', 'documentTypeId'])
    })

  console.info("corrige une erreur d'id")

  await knex('travauxTypes__etapesTypes')
    .where('etapeTypeId', 'rtd')
    .update({ etapeTypeId: 'rdt' })

  // ids des étapes qui existent uniquement dans les travaux
  const newTravauxEtapesTypesIds = [
    'aow',
    'awd',
    'awu',
    'dow',
    'dpm',
    'mdd',
    'mfw',
    'rdt',
    'rwp',
    'rwt',
    'sup'
  ]

  // ids des étapes existent dans les démarches et les travaux
  const copyTravauxEtapesTypesIds = [
    'dec',
    'dex',
    'mdp',
    'mfr',
    'ncl',
    'ppc',
    'ppu',
    'rpu',
    'scl',
    'ssr'
  ]

  console.info("copie les types d'étapes dans les types d'étapes de travaux")
  console.info('copie les statuts des étapes de travaux')
  console.info('copie les types de documents des étapes de travaux')

  for (const travauxEtapeTypeId of [
    ...newTravauxEtapesTypesIds,
    ...copyTravauxEtapesTypesIds
  ]) {
    const { id, nom, description, ordre } = await knex('etapesTypes')
      .where('id', travauxEtapeTypeId)
      .first()

    await knex('travauxEtapesTypes').insert({ id, nom, description, ordre })

    const etapesTypesEtapesStatuts = await knex(
      'etapesTypes__etapesStatuts'
    ).where('etapeTypeId', travauxEtapeTypeId)

    for (const etEs of etapesTypesEtapesStatuts) {
      etEs.travauxEtapeTypeId = etEs.etapeTypeId
      delete etEs.etapeTypeId

      await knex('travauxEtapesTypes__etapesStatuts').insert(etEs)
    }
    const etapeTypesDocumentsTypes = await knex(
      'etapesTypes__documentsTypes'
    ).where('etapeTypeId', travauxEtapeTypeId)

    for (const etDt of etapeTypesDocumentsTypes) {
      etDt.travauxEtapeTypeId = etDt.etapeTypeId
      delete etDt.etapeTypeId

      await knex('travauxEtapesTypes__documentsTypes').insert(etDt)
    }
  }

  console.info('modifie la table des étapes de travaux')

  await knex.schema.alterTable('titresTravauxEtapes', table => {
    table.dropIndex('typeId').dropForeign(['typeId'])
    table.renameColumn('typeId', 'typeIdOld')
  })

  await knex.schema.alterTable('titresTravauxEtapes', table => {
    table
      .string('typeId', 3)
      .index()
      .references('travauxEtapesTypes.id')
      .notNullable()
      .defaultTo('aow')
  })

  await knex('titresTravauxEtapes').update('typeId', knex.ref('typeIdOld'))

  console.info(
    'renomme la table de jointure travaux_types__travaux_etapes_types'
  )

  await knex.schema.renameTable(
    'travauxTypes__etapesTypes',
    'travauxTypes__travauxEtapesTypes'
  )

  console.info(
    'met à jour la table de jointure travaux_types__travaux_etapes_types'
  )

  await knex.schema.alterTable('travauxTypes__travauxEtapesTypes', table => {
    table.dropColumn('sections')
    table
      .string('travauxEtapeTypeId', 3)
      .index()
      .references('travauxEtapesTypes.id')
      .notNullable()
      .defaultTo('aow')
  })

  await knex('travauxTypes__travauxEtapesTypes').update(
    'travauxEtapeTypeId',
    knex.ref('etapeTypeId')
  )

  await knex.schema
    .alterTable('travauxTypes__travauxEtapesTypes', table => {
      table.dropColumn('etapeTypeId')
      table.primary(['travauxTypeId', 'travauxEtapeTypeId'])
    })
    .alterTable('titresTravauxEtapes', table => {
      table.dropColumn('typeIdOld')
    })

  console.info(
    "supprime les ids des types d'étapes de travaux dans la table des types d'étape"
  )

  for (const travauxEtapeTypeId of newTravauxEtapesTypesIds) {
    await knex('etapesTypes__etapesStatuts')
      .where('etapeTypeId', travauxEtapeTypeId)
      .del()
    await knex('etapesTypes').where('id', travauxEtapeTypeId).del()
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
