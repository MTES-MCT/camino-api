import 'dotenv/config'
import knex from '../../init'

async function main() {
  await knex.schema.dropTable('activitesTypes__administrations')

  await knex.schema.createTable('administrations__activitesTypes', table => {
    table
      .string('activiteTypeId', 3)
      .index()
      .references('activitesTypes.id')
      .notNullable()
      .onDelete('CASCADE')
    table
      .string('administrationId', 64)
      .notNullable()
      .index()
      .references('administrations.id')
      .onDelete('CASCADE')
    table.boolean('ModificationInterdit')
    table.boolean('lectureInterdit')
  })

  const administrationsActivitesTypes = [
    {
      activiteTypeId: 'gra',
      administrationId: 'ope-brgm-02',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'gra',
      administrationId: 'pre-97302-01',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'gra',
      administrationId: 'ope-onf-973-01',
      modificationInterdit: true,
      lectureInterdit: true
    },
    {
      activiteTypeId: 'grp',
      administrationId: 'ope-brgm-02',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'grp',
      administrationId: 'pre-97302-01',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'grp',
      administrationId: 'ope-onf-973-01',
      modificationInterdit: true,
      lectureInterdit: true
    },
    {
      activiteTypeId: 'grx',
      administrationId: 'ope-brgm-02',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'grx',
      administrationId: 'pre-97302-01',
      modificationInterdit: true
    },
    {
      activiteTypeId: 'grx',
      administrationId: 'ope-onf-973-01',
      modificationInterdit: true,
      lectureInterdit: true
    }
  ]

  for (const aAt of administrationsActivitesTypes) {
    await knex('administrations__activitesTypes').insert(aAt)
    console.info(
      `administrations__activitesTypes ${JSON.stringify(aAt)} ajoutée`
    )
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
