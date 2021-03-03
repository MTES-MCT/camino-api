/* eslint-disable @typescript-eslint/ban-ts-comment */

import 'dotenv/config'
import '../../init'
import { ITitreIncertitudes } from '../../types'

import TitresEtapes from '../../database/models/titres-etapes'

async function main() {
  const etapes = await TitresEtapes.query()

  for (const te of etapes) {
    let incertitudes = te.incertitudes

    if (incertitudes) {
      // @ts-ignore
      delete incertitudes.titreEtapeId

      // on supprime les incertitudes null
      incertitudes = Object.keys(incertitudes).reduce(
        (acc: ITitreIncertitudes, key) => {
          // @ts-ignore
          if (incertitudes[key]) {
            // @ts-ignore
            acc[key as keyof ITitreIncertitudes] = incertitudes[key]
          }

          return acc
        },
        {}
      )

      if (!Object.keys(incertitudes).length) {
        incertitudes = null
      }
      await TitresEtapes.query().patch({ incertitudes }).where('id', te.id)
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
