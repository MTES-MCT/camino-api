import 'dotenv/config'

import '../../database/index'
import fileCreate from '../file-create'

// import { titresGet } from '../../database/queries/titres'
import {
  titresEtapesGet,
  titreEtapeAdministrationInsert
} from '../../database/queries/titres-etapes'
import { departementsGet } from '../../database/queries/territoires'
import { administrationInsert } from '../../database/queries/administrations'

// import { geojsonFeatureMultiPolygon } from '../geojson'

import { organismeGet } from '../api-administrations/index'
// import { departementChefGeojsonGet } from '../api-communes/index'

// const multiDepartements = async () => {
//   const titres = await titresGet()

//   const titresMultiDepartements = titres.filter(
//     t =>
//       t.pays &&
//       t.pays[0].regions &&
//       t.pays[0].regions[0].departements &&
//       t.pays[0].regions[0].departements.length > 1
//   )

//   console.log(
//     titresMultiDepartements
//       .map(t => t.id)
//       .sort()
//       .join('\n')
//   )

//   console.log('multi dep:', titresMultiDepartements.length)

//   const titresDepartements = await titresMultiDepartements.reduce(
//     async (accPromise, titre) => {
//       const departementChef = await departementChefGeojsonGet(
//         titre.geojsonMultiPolygon
//       )

//       console.log(
//         titre.id,
//         titre.pays[0].regions[0].departements.map(d => d.id).join(','),
//         'chef:',
//         departementChef.id
//       )

//       const { id: departementId } = departementChef

//       const acc = await accPromise
//       acc.push({ id : titre.id, departementId })
//       return acc
//     },
//     []
//   )

//   console.log(titresDepartements)

//   process.exit()

//   const orgs = await Promise.all(
//     ['prefecture', 'dreal', 'dreal_ut'].map(org =>
//       organismeGet(departementChef.id, org)
//     )
//   )

//   console.log('orgs:', JSON.stringify(orgs, null, 2))

//   process.exit()
// }

const main = async () => {
  const departements = await departementsGet()
  console.log(departements.length)

  const administrations = await departements.reduce(
    async (accPromise, { id }) => {
      const acc = await accPromise
      acc.push(
        await organismeGet(id, id === '75' ? 'prefecture_region' : 'prefecture')
      )

      return acc
    },
    []
  )

  const administrationsIndex = administrations.reduce((acc, a) => {
    acc[a.departementId] = a

    return acc
  }, {})
  await fileCreate(
    'test-administrations.json',
    JSON.stringify(administrations, null, 2)
  )

  try {
    await Promise.all(administrations.map(administrationInsert))
  } catch (e) {}

  const titresEtapes = await titresEtapesGet()

  console.log('titresEtapes:', titresEtapes.length)

  await Promise.all(
    titresEtapes.reduce(
      (acc, titreEtape) =>
        !titreEtape.communes || !titreEtape.communes.length
          ? acc
          : acc.concat(
              titreEtape.communes.map(commune =>
                titreEtapeAdministrationInsert({
                  titreEtapeId: titreEtape.id,
                  administrationId:
                    administrationsIndex[commune.departementId].id
                })
              )
            ),
      []
    )
  )

  // console.log(res)

  process.exit()
}

main()
