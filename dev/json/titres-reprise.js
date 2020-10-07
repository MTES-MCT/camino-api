import 'dotenv/config'
import '../../../database/index'

import { titresGet, titreUpsert } from '../../../database/queries/titres'
import {
  entreprisesGet,
  entrepriseUpsert
} from '../../../database/queries/entreprises'

import titreDemarcheStatutIdFind from '../../../business/rules/titre-demarche-statut-id-find'
import titreIdFind from '../../../business/utils/titre-id-find'

const indexify = (arr, propGet = i => i) =>
  arr.reduce((index, item) => {
    const value = propGet(item)
    if (!index[value]) {
      index[value] = []
    }

    index[propGet(item)].push(item)

    return index
  }, {})

async function main() {
  const entreprisesCamino = await entreprisesGet()

  console.info('camino entreprises:', entreprisesCamino.length)

  const entreprisesCaminoIndex = indexify(entreprisesCamino, a => a.id)

  const titresCamino = await titresGet(
    // { typeIds: ['axm'] },
    {},
    { graph: '[references]' }
  )

  console.info('camino titres:', titresCamino.length)

  const titresCaminoIndexId = indexify(
    titresCamino,
    a => console.info('camino, id:', a.id) || a.id
  )

  const titresCaminoIndexDeal = indexify(
    titresCamino,
    a =>
      console.info('camino, ref:', a.references[0].nom) || a.references[0].nom
  )

  // process.exit(0)

  // const filePath = '../../../../aex-echues-lot-2-cartog.json'
  // const filePath = '../../../../aex-echues-lot-3-nocartog.json'
  // const filePath = '../../../../aex-echues-lot-2_3.json'
  const filePath = '../../../../deb-titres-entreprises.json'

  const {
    entreprises: entreprisesReprise,
    titres: titresReprise
  } = require(filePath)

  console.info('reprise n entreprises:', entreprisesReprise.length)
  console.info('reprise n titres:', titresReprise.length)

  titresReprise.reduce((titresIds, titre) => {
    titre.demarches.forEach(titreDemarche => {
      titreDemarche.etapes = titreDemarche.etapes.reverse()

      const statutId = titreDemarcheStatutIdFind(titreDemarche, titre.typeId)

      console.info(titreDemarche.id, statutId)

      titreDemarche.statutId = statutId
    })

    const idNew = titreIdFind(titre)
    if (idNew !== titre.id) {
      console.info(`${titre.id} => ${idNew}`)

      titre.id = idNew
    }

    titresIds[titre.id] = (titresIds[titre.id] | 0) + 1

    return titresIds
  }, {})

  const titresRepriseIndexId = indexify(
    titresReprise,
    a => console.info('reprise, id:', a.id) || a.id
  )

  // if (false) {
  //   // verification de doublons dans les ids générés sur google sheets
  //   const ids = Object.keys(titresRepriseIndexId).sort()

  //   console.info(ids.join('\n'))

  //   ids.forEach(id => {
  //     if (titresRepriseIndexId[id].length < 2) return

  //     console.info(id)
  //     console.info(titresRepriseIndexId[id].map(e => e.references[0]))
  //   })

  //   process.exit(0)
  // }

  for (const entreprise of entreprisesReprise) {
    if (!entreprisesCaminoIndex[entreprise.id]) {
      console.info(`upserting ${entreprise.id} in Camino`)

      await entrepriseUpsert(entreprise)
    } else {
      console.info(`${entreprise.id} existe déjà dans Camino !`)
    }
  }

  // process.exit(0)

  for (const titre of titresReprise) {
    console.info('reperise:', titre.id, titre.references[0].nom)

    if (titresRepriseIndexId[titre.id].length > 1) {
      console.info(`id [${titre.id}] dupliquée !`)

      // break
      continue
    }

    if (titresCaminoIndexId[titre.id]) {
      console.info(`id [${titre.id}] existe déjà dans Camino !`)

      continue
    }

    if (titresCaminoIndexDeal[titre.references[0].nom]) {
      console.info(`ref [${titre.references[0].nom}] existe déjà dans Camino !`)

      continue
    }

    /*
    try {
      await titreUpsert(titre)
    } catch (e) {
      console.error(e.message)
    }
     */
  }

  for (const titre of titresReprise) {
    console.info(titre.id, titre.references[0].nom)

    await titreUpsert(titre, {})
  }

  // await Promise.all(titresReprise.map(titres => titreUpsert(titres)))

  process.exit(0)
}

main().catch(e => {
  console.info(e)
  process.exit(1)
})
