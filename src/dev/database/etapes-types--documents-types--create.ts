import '../../init'
import { knex } from '../../knex'
import { titresEtapesGet } from '../../database/queries/titres-etapes'
import { userSuper } from '../../database/user-super'
import EtapesTypesDocumentsTypes from '../../database/models/etapes-types--documents-types'

const main = async () => {
  await knex.schema.createTable('etapesTypes__documentsTypes', table => {
    table
      .string('etapeTypeId', 3)
      .index()
      .references('etapesTypes.id')
      .notNullable()
      .onDelete('CASCADE')
    table
      .string('documentTypeId', 3)
      .index()
      .references('documentsTypes.id')
      .notNullable()
    table.boolean('optionnel')
    table.primary(['etapeTypeId', 'documentTypeId'])
  })

  let etapes = await titresEtapesGet(
    {},
    {
      fields: {
        type: { id: {} },
        documents: { type: { id: {} } }
      }
    },
    userSuper
  )

  etapes = etapes.filter(d => d.documents?.length)

  const result = {} as { [typeId: string]: string[] }

  etapes.forEach(e => {
    if (!result[e.type!.id]) {
      result[e.type!.id] = []
    }
    e.documents!.forEach(d => {
      if (!result[e.type!.id].includes(d.type!.id)) {
        result[e.type!.id].push(d.type!.id)
      }
    })
  })

  for (const etapeTypeId of Object.keys(result)) {
    await EtapesTypesDocumentsTypes.query().insertGraph(
      result[etapeTypeId].map(documentTypeId => ({
        etapeTypeId,
        documentTypeId,
        optionnel: true
      }))
    )
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
