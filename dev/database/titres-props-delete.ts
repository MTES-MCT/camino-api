import 'dotenv/config'
import knex from '../../src/init'
import {
  IPropId,
  IPropsTitreEtapesIds,
  ITitre,
  ITitreIncertitudes
} from '../../src/types'

import { titresGet, titreUpdate } from '../../src/database/queries/titres'
import { titreEtapeUpdate } from '../../src/database/queries/titres-etapes'

type ITitreEtapeIdPropId =
  | 'pointsTitreEtapeId'
  | 'titulairesTitreEtapeId'
  | 'amodiatairesTitreEtapeId'
  | 'administrationsTitreEtapeId'
  | 'substancesTitreEtapeId'
  | 'communesTitreEtapeId'
  | 'surfaceTitreEtapeId'

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

interface ITitreTmp extends ITitre {
  pointsTitreEtapeId?: string | null
  titulairesTitreEtapeId?: string | null
  amodiatairesTitreEtapeId?: string | null
  administrationsTitreEtapeId?: string | null
  substancesTitreEtapeId?: string | null
  communesTitreEtapeId?: string | null
  surfaceTitreEtapeId?: string | null
}

async function main() {
  await knex.schema.alterTable('titres', table => {
    table.jsonb('propsTitreEtapesIds')
  })

  await knex.schema.alterTable('titresEtapes', table => {
    table.jsonb('incertitudes')
  })

  const titres = (await titresGet(
    {},
    { fields: { demarches: { etapes: { id: {} } } } },
    'super'
  )) as ITitreTmp[]

  for (const t of titres) {
    const propsTitreEtapesIds = {} as IPropsTitreEtapesIds
    titrePropsEtapes.forEach(({ propId, titreEtapeIdPropId }) => {
      if (propId !== 'communes' && t[titreEtapeIdPropId]) {
        propsTitreEtapesIds[propId] = t[titreEtapeIdPropId] as string
      }
    })

    if (t.demarches?.length) {
      for (const td of t.demarches) {
        if (td.etapes?.length) {
          for (const te of td.etapes) {
            let incertitudes = (await knex
              .first()
              .table('titresIncertitudes')
              .where('titreEtapeId', te.id)) as any

            if (incertitudes) {
              delete incertitudes.titreEtapeId

              // on supprime les incertitudes null
              incertitudes = Object.keys(incertitudes).reduce(
                (acc: ITitreIncertitudes, key) => {
                  if (incertitudes[key]) {
                    acc[key as keyof ITitreIncertitudes] = incertitudes[key]
                  }

                  return acc
                },
                {}
              )

              if (Object.keys(incertitudes).length) {
                await titreEtapeUpdate(te.id, { incertitudes } as {
                  incertitudes: ITitreIncertitudes
                })
              }
            }
          }
        }
      }
    }

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

  // await knex.schema.dropTable('titresIncertitudes')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
