import 'dotenv/config'
import './database/index'

const csvToJson = require('csvtojson')
const { parse: jsonToCsv } = require('json2csv')

import { titresGet } from './database/queries/titres.js'
import {
  titresEtapesGet,
  titreEtapeUpdate,
  titreEtapeCreate
} from './database/queries/titres-etapes.js'
import titreDemarchesAscSort from './business/utils/titre-demarches-asc-sort'
import titreEtapesAscSort from './business/utils/titre-etapes-asc-sort'

const dateFormatt = require('dateformat')

const dateFormat = date => dateFormatt(date, 'yyyy-mm-dd')

const { readFileSync: read } = require('fs')

const boolsify = o => JSON.parse(JSON.stringify(o).replace(/"TRUE"/g, 'true'))

let etapes = []

const main = async () => {
  const reprise = boolsify(
    await csvToJson().fromFile(`./reprise-tableau-onf-fusion.csv`)
  )

  // console.log(reprise[0])

  for (let line of reprise) {
    // console.log(line.titre.references.ONF)

    const titres = await titresGet(
      { references: [line.titre.references.ONF] },
      { graph: 'demarches.[etapes,type.[etapesTypes]]' }
    )

    if (!titres.length) return

    const [titre] = titres

    etapes = etapes.concat(
      Object.keys(line.etapes).map(typeId => {
        const { statut, ...etape } = line.etapes[typeId]

        return {
          source: 'onf',
          id: `${titre.id}-oct01-${typeId}01`,
          typeId,
          statutId: statut || 'fai',
          ...etape
        }
      })
    )

    continue
  }

  const etapesIds = etapes.map(e => e.id)

  const etapesCamino = await titresEtapesGet({ etapesIds }, { graph: '' })

  const fields = etapesCamino.length
    ? Object.keys(etapesCamino[0])
    : Object.keys(
        etapes.reduce(
          (r, e) => ({
            ...r,
            ...Object.keys(e).reduce((r, k) => ({ ...r, [k]: true }), {})
          }),
          {}
        ),
        {}
      )

  console.log(await jsonToCsv(etapes, { fields }))

  if (etapesCamino[0]) {
    console.log(await jsonToCsv(etapesCamino, { fields }))
  }

  process.exit(0)
}

main()
