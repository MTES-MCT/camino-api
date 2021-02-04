import 'dotenv/config'
import knex from '../../src/init'
import {
  IPropId,
  ITitreEtapeIdPropId,
  IPropsTitreEtapesIds
} from '../../src/types'

import { titresGet, titreUpdate } from '../../src/database/queries/titres'

async function main() {
  await knex.schema.alterTable('titres', table => {
    table.jsonb('propsTitreEtapesIds')
  })

  const titrePropsEtapes = [
    'points',
    'titulaires',
    'amodiataires',
    'administrations',
    'substances',
    'communes',
    'surface'
  ].map(propId => ({
    propId,
    titreEtapeIdPropId: `${propId}TitreEtapeId`
  })) as {
    propId: IPropId
    titreEtapeIdPropId: ITitreEtapeIdPropId
  }[]

  const titres = await titresGet({}, {}, 'super')

  for (const t of titres) {
    const propsTitreEtapesIds = {} as IPropsTitreEtapesIds
    titrePropsEtapes.forEach(({ propId, titreEtapeIdPropId }) => {
      if (propId !== 'communes' && t[titreEtapeIdPropId]) {
        propsTitreEtapesIds[propId] = t[titreEtapeIdPropId] as string
      }
    })
    await titreUpdate(t.id, { propsTitreEtapesIds })

    console.info(`${t.id} mis à jour`)
  }

  await knex.schema.alterTable('titres', table => {
    table.dropColumns(
      ...titrePropsEtapes.map(({ titreEtapeIdPropId }) => titreEtapeIdPropId)
    )
  })

  console.info(`${titres.length} titres modifiés`)

  await knex.schema.alterTable('titresEtapes', table => {
    table.jsonb('contenusTitreEtapesIds')
    table.jsonb('propsTitreEtapesIds')
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
