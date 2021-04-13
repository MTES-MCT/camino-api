import '../../init'
import { knex } from '../../knex'

const main = async () => {
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

  await knex('travauxTypes__etapesTypes')
    .where('etapeTypeId', 'rtd')
    .update({ etapeTypeId: 'rdt' })

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
  }

  await knex.schema.renameTable(
    'travauxTypes__etapesTypes',
    'travauxTypes__travauxEtapesTypes'
  )
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

  for (const travauxEtapeTypeId of [
    ...newTravauxEtapesTypesIds,
    ...copyTravauxEtapesTypesIds
  ]) {
    const titresTravauxEtapes = await knex('titresTravauxEtapes').where(
      'typeId',
      travauxEtapeTypeId
    )

    for (const tte of titresTravauxEtapes) {
      await knex('titresTravauxEtapes')
        .where('id', tte.id)
        .update('typeId', tte.typeIdOld)
    }
  }

  await knex.schema.alterTable('travauxTypes__travauxEtapesTypes', table => {
    table.dropColumn('sections')
    table
      .string('travauxEtapeTypeId', 3)
      .index()
      .references('travauxEtapesTypes.id')
      .notNullable()
      .defaultTo('aow')
  })

  const travauxTypesTravauxEtapesTypes = await knex(
    'travauxTypes__travauxEtapesTypes'
  )

  for (const ttTet of travauxTypesTravauxEtapesTypes) {
    await knex('travauxTypes__travauxEtapesTypes')
      .where('etapeTypeId', ttTet.etapeTypeId)
      .where('travauxTypeId', ttTet.travauxTypeId)
      .first()
      .update({ travauxEtapeTypeId: ttTet.etapeTypeId })
  }

  await knex.schema
    .alterTable('travauxTypes__travauxEtapesTypes', table => {
      table.dropColumn('etapeTypeId')
    })
    .alterTable('titresTravauxEtapes', table => {
      table.dropColumn('typeIdOld')
    })

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
