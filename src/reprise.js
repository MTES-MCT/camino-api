import 'dotenv/config'
import './database/index'

const csvToJson = require('csvtojson')

import { titresGet } from './database/queries/titres.js'
import {
  titreEtapeUpdate,
  titreEtapeCreate
} from './database/queries/titres-etapes.js'
import titreDemarchesAscSort from './business/utils/titre-demarches-asc-sort'
import titreEtapesAscSort from './business/utils/titre-etapes-asc-sort'

const dateFormatt = require('dateformat')

const dateFormat = date => dateFormatt(date, 'yyyy-mm-dd')

const { readFileSync: read } = require('fs')

const main = async () => {
  const [header, ...lines] = read('./reprise.csv')
    .toString()
    .split('\n')

  const headers = header.split(',')

  const data = lines.reduce((data, line) => {
    data.push(line.split(',').reduce((r, v, i) => ((r[headers[i]] = v), r), {}))
    return data
  }, [])

  for (let line of data) {
    console.log(line.onf)

    const titres = await titresGet(
      { references: [line.onf] },
      { graph: 'demarches.[etapes,type.[etapesTypes]]' }
    )

    if (!titres.length) return

    const [titre] = titres

    let mdp
    let meo

    console.log(titre.id)
    for (let demarche of titreDemarchesAscSort(titre.demarches)) {
      console.log('demarche', demarche.typeId)
      // console.log(demarche.type.etapesTypes[0])
      for (let etape of titreEtapesAscSort(demarche.etapes)) {
        console.log(
          'etape',
          etape.typeId,
          etape.ordre,
          dateFormat(etape.date),
          demarche.type.etapesTypes.find(
            t => t.id === etape.typeId && t.typeId === titre.typeId
          ).ordre
        )
        if (etape.typeId === 'mdp') {
          mdp = etape
        } else if (etape.typeId === 'meo') {
          meo = etape
        }
      }
    }

    if (line.mdp) {
      if (mdp) {
        const mdpDate = dateFormat(mdp.date)
        if (mdpDate !== line.mdp) {
          console.log(mdp.id, dateFormat(mdp.date), line.mdp)

          await titreEtapeUpdate(mdp.id, { date: line.mdp })
        }
      } else {
        await titreEtapeCreate({
          titreDemarcheId: titre.demarches.find(d => d.typeId === 'oct').id,
          typeId: 'mdp',
          date: line.mdp,
          statutId: 'fai'
        })
      }
    }

    if (line.meo) {
      if (meo) {
        const meoDate = dateFormat(meo.date)
        if (meoDate !== line.meo) {
          console.log(meo.id, meoDate, line.meo)

          await titreEtapeUpdate(meo.id, { date: line.meo })
        }
      } else {
        await titreEtapeCreate({
          titreDemarcheId: titre.demarches.find(d => d.typeId === 'oct').id,
          typeId: 'meo',
          date: line.meo,
          statutId: 'fai'
        })
      }
    }
  }

  process.exit(0)
}

main()
