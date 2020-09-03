import { ITitreEtape, ITitreArea, IArea, IAreaType } from '../../types'

import PQueue from 'p-queue'

import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import { communesGeojsonApiGet } from '../../tools/api-communes'
import { communesGet, communesUpsert } from '../../database/queries/territoires'
import {
  titreEtapeCommuneDelete,
  titresEtapesCommunesUpdate as titresEtapesCommunesUpdateQuery
} from '../../database/queries/titres-etapes'

export interface ITitreEtapesAreasIndex {
  [idTitreEtape: string]: ITitreEtapeAreas
}
interface ITitreEtapeAreas {
  titreEtape: ITitreEtape
  areas: { [areaType in IAreaType]: IArea[] }
}
interface IAreasIndex {
  [id: string]: boolean
}

const communesGeojsonApiTest = () => {
  const geojson = {
    type: 'Feature',
    properties: { id: 'api-test' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-54.0950602907814, 5.20885569954379],
          [-54.1130169578246, 5.21036597243676],
          [-54.1134002694189, 5.20586546870085],
          [-54.0950602907814, 5.20885569954379]
        ]
      ]
    }
  }

  return communesGeojsonApiGet(geojson, ['communes'])
}

const titreEtapesAreasUpdateBuild = (
  titreEtapeId: string,
  areasEtape: IArea[],
  areasEtapeOld: IArea[] | null | undefined
) =>
  areasEtape.reduce((titreEtapesAreas: ITitreArea[], area: IArea) => {
    const titreEtapeArea =
      areasEtapeOld && areasEtapeOld.find(areaOld => areaOld.id === area.id)

    if (
      (!titreEtapeArea || titreEtapeArea.surface !== area.surface) &&
      !titreEtapesAreas.find(tec => tec.areaId === area.id)
    ) {
      titreEtapesAreas.push({
        titreEtapeId,
        areaId: area.id,
        surface: area.surface
      })
    }

    return titreEtapesAreas
  }, [])

const titreEtapesAreasDeleteBuild = (
  titreEtapeId: string,
  areasEtape: IArea[],
  areasEtapeOld: IArea[] | null | undefined
) =>
  areasEtapeOld
    ? areasEtapeOld.reduce((titreEtapesAreas: ITitreArea[], areaOld) => {
        if (!areasEtape.find(areaEtape => areaEtape.id === areaOld.id)) {
          titreEtapesAreas.push({
            titreEtapeId,
            areaId: areaOld.id
          })
        }

        return titreEtapesAreas
      }, [])
    : []

const titresEtapesAreasToUpdateAndDeleteBuild = (
  titresEtapesAreasIndex: ITitreEtapesAreasIndex,
  areaType: IAreaType
) =>
  Object.keys(titresEtapesAreasIndex).reduce(
    (
      {
        titresEtapesAreasToUpdate,
        titresEtapesAreasToDelete
      }: {
        titresEtapesAreasToUpdate: ITitreArea[]
        titresEtapesAreasToDelete: ITitreArea[]
      },
      titreEtapeId
    ) => {
      const { titreEtape, areas } = titresEtapesAreasIndex[titreEtapeId]

      const oldAreas = titreEtape[areaType]

      titresEtapesAreasToUpdate.push(
        ...titreEtapesAreasUpdateBuild(titreEtape.id, areas[areaType], oldAreas)
      )

      titresEtapesAreasToDelete.push(
        ...titreEtapesAreasDeleteBuild(titreEtape.id, areas[areaType], oldAreas)
      )

      return {
        titresEtapesAreasToUpdate,
        titresEtapesAreasToDelete
      }
    },
    {
      titresEtapesAreasToUpdate: [],
      titresEtapesAreasToDelete: []
    }
  )

const areasBuild = (
  areasOld: IArea[],
  areaType: IAreaType,
  titresEtapesAreasIndex: ITitreEtapesAreasIndex
) => {
  const areasOldIndex = areasOld.reduce(
    (areasOldIndex: IAreasIndex, areaOld) => {
      areasOldIndex[areaOld.id] = true

      return areasOldIndex
    },
    {}
  )

  const { areasNew } = Object.keys(titresEtapesAreasIndex).reduce(
    (acc: { areasIndex: IAreasIndex; areasNew: IArea[] }, titreEtapeId) =>
      titresEtapesAreasIndex[titreEtapeId].areas[areaType].reduce(
        ({ areasIndex, areasNew }, area) => {
          // Ajoute la area
          // - si elle n'est pas déjà présente dans l'accumulateur
          // - si elle n'est pas présente dans areasOld
          if (!areasIndex[area.id] && !areasOldIndex[area.id]) {
            areasNew.push({ ...area })
            areasIndex[area.id] = true
          }

          return { areasIndex, areasNew }
        },
        acc
      ),
    { areasIndex: {}, areasNew: [] }
  )

  return areasNew
}

const titresEtapesAreasGet = async (
  titresEtapes: ITitreEtape[]
): Promise<ITitreEtapesAreasIndex> => {
  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API geoareas
  const queue = new PQueue({
    concurrency: 10
    //    interval: 1000,
    //    intervalCap: 10
  })

  const titresEtapesAreasIndex = titresEtapes.reduce(
    (
      titresEtapesAreasIndex: ITitreEtapesAreasIndex,
      titreEtape: ITitreEtape
    ) => {
      queue.add(async () => {
        let titreEtapeAreas: { [areaType in IAreaType]: IArea[] } = {
          communes: []
        }

        if (titreEtape.points?.length) {
          const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

          const areaTypes: IAreaType[] = ['communes']
          const apiGeoCommuneResult = await communesGeojsonApiGet(
            geojson,
            areaTypes
          )
          if (apiGeoCommuneResult) {
            titreEtapeAreas = areaTypes.reduce((acc, areaType) => {
              return { ...acc, [areaType]: apiGeoCommuneResult[areaType] }
            }, titreEtapeAreas)
          }
        }

        titresEtapesAreasIndex[titreEtape.id] = {
          titreEtape,
          areas: titreEtapeAreas
        }
      })

      return titresEtapesAreasIndex
    },
    {}
  )

  await queue.onIdle()

  return titresEtapesAreasIndex
}

export const titresEtapesAllAreasUpdate = async (
  titresEtapes: ITitreEtape[]
) => {
  // teste l'API geo-areas-api
  const geoAreasApiTest = await communesGeojsonApiTest()
  // si la connexion à l'API échoue, retourne
  if (!geoAreasApiTest) {
    console.warn('communesGeojsonApi injoignable')
    return [[], [], []]
    // return { communes: [[], [], []] }
  }

  const titresEtapesAreas = await titresEtapesAreasGet(titresEtapes)

  return await titresEtapesCommunesUpdate(titresEtapesAreas)
}

export const titresEtapesCommunesUpdate = async (
  titresEtapesAreas: ITitreEtapesAreasIndex
) =>
  await titresEtapesAreaUpdate(
    titresEtapesAreas,
    await communesGet(),
    'communes',
    communesUpsert,
    titresEtapesAreas =>
      titresEtapesCommunesUpdateQuery({
        titreEtapeId: titresEtapesAreas.titreEtapeId,
        surface: titresEtapesAreas.surface,
        communeId: titresEtapesAreas.areaId
      }),
    titreEtapeCommuneDelete
  )

const titresEtapesAreaUpdate = async (
  titresEtapesAreas: ITitreEtapesAreasIndex,
  areasOld: IArea[],
  areaType: IAreaType,
  areasUpsert: (areas: IArea[]) => Promise<IArea[]>,
  titresEtapesAreasUpdateQuery: (titresEtapesAreas: ITitreArea) => Promise<any>,
  titreEtapeAreaDelete: (etapeId: string, areaId: string) => Promise<any>
) => {
  const areasToUpdate = areasBuild(areasOld, areaType, titresEtapesAreas)

  let areasUpdated: IArea[] = []

  if (areasToUpdate.length) {
    areasUpdated = await areasUpsert(areasToUpdate)

    console.info(
      `mise à jour: ${areaType}, ${areasToUpdate
        .map(area => area.id)
        .join(', ')}`
    )
  }

  const {
    titresEtapesAreasToUpdate,
    titresEtapesAreasToDelete
  } = titresEtapesAreasToUpdateAndDeleteBuild(titresEtapesAreas, areaType)

  const titresEtapesAreasUpdated: string[] = []
  const titresEtapesAreasDeleted: string[] = []

  if (titresEtapesAreasToUpdate.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAreasToUpdate.reduce(
      (titresEtapesAreasUpdated: string[], titreEtapeArea) => {
        queue.add(async () => {
          await titresEtapesAreasUpdateQuery(titreEtapeArea)

          console.info(
            `mise à jour: étape ${areaType} ${JSON.stringify(titreEtapeArea)}`
          )

          titresEtapesAreasUpdated.push(titreEtapeArea.titreEtapeId)
        })

        return titresEtapesAreasUpdated
      },
      titresEtapesAreasUpdated
    )

    await queue.onIdle()
  }

  if (titresEtapesAreasToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAreasToDelete.reduce(
      (titresEtapesAreasDeleted, { titreEtapeId, areaId }) => {
        queue.add(async () => {
          await titreEtapeAreaDelete(titreEtapeId, areaId)

          console.info(
            `suppression: étape ${titreEtapeId}, ${areaType} ${areaId}`
          )

          titresEtapesAreasDeleted.push(titreEtapeId)
        })

        return titresEtapesAreasDeleted
      },
      titresEtapesAreasDeleted
    )

    await queue.onIdle()
  }

  return [areasUpdated, titresEtapesAreasUpdated, titresEtapesAreasDeleted]
}
