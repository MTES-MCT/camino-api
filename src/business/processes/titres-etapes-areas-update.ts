import {
  ITitreEtape,
  ITitreArea,
  IArea,
  IAreaType,
  Index,
  ICommune,
  IForet
} from '../../types'
import PQueue from 'p-queue'

import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import { geoAreaGeojsonGet } from '../../tools/api-communes'
import {
  communesUpsert,
  foretsUpsert
} from '../../database/queries/territoires'
import {
  titreEtapeCommuneDelete,
  titreEtapeForetDelete,
  titresEtapesCommunesUpdate as titresEtapesCommunesUpdateQuery,
  titresEtapesForetsUpdate as titresEtapesForetsUpdateQuery
} from '../../database/queries/titres-etapes'
import TitresCommunes from '../../database/models/titres-communes'
import TitresForets from '../../database/models/titres-forets'

interface ITitreEtapeAreas {
  titreEtape: ITitreEtape
  areas: { [areaType in IAreaType]: IArea[] }
}

/**
 * Teste si geo-communes-api fonctionne
 */
const geoAreaApiTest = () => {
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

  return geoAreaGeojsonGet(geojson, ['communes'])
}

/**
 * Recherche les territoires  à mettre à jour de l’étape
 * @param titreEtapeId - id de l’étape
 * @param areasEtape - liste des nouveaux territoires (communes, forêts...) de l’étape
 * @param areasEtapeOld - liste des anciens territoires de l’étape
 * @returns la liste des territoires avec leur surface à mettre à jour
 */
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

/**
 * Recherche les territoires  à supprimer de l’étape
 * @param titreEtapeId - id de l’étape
 * @param areasEtape - liste des nouveaux territoires (communes, forêts...) de l’étape
 * @param areasEtapeOld - liste des anciens territoires de l’étape
 * @returns la liste des territoires à supprimer
 */
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

/**
 * Pour chaque étape, recherche les territoires à mettre à jour ou à supprimer
 * @param titresEtapesAreasIndex - index d’étapes associées à leur nouveaux territoires
 * @param areaType - type de territoire en cour de manipulatin
 * @returns la liste de tous les territoires à mettre  à jour et la liste de tous ceux à supprimer
 */
const titresEtapesAreasToUpdateAndDeleteBuild = (
  titresEtapesAreasIndex: Index<ITitreEtapeAreas>,
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

/**
 * Recherche les territoires à créer
 * @param areasOld - liste des territoires existants
 * @param areaType - type de territoire en cours de manipulation
 * @param titresEtapesAreasIndex - index des étapes associées à leur nouveaux territoires
 * @returns l’index de tous les nouveaux territoires
 */
const areasBuild = (
  areasOld: IArea[],
  areaType: IAreaType,
  titresEtapesAreasIndex: Index<ITitreEtapeAreas>
) => {
  const areasOldIndex = areasOld.reduce(
    (areasOldIndex: Index<boolean>, areaOld) => {
      areasOldIndex[areaOld.id] = true

      return areasOldIndex
    },
    {}
  )

  const { areasNew } = Object.keys(titresEtapesAreasIndex).reduce(
    (acc: { areasIndex: Index<boolean>; areasNew: IArea[] }, titreEtapeId) =>
      titresEtapesAreasIndex[titreEtapeId].areas[areaType].reduce(
        ({ areasIndex, areasNew }, area) => {
          // Ajoute le territoire
          // - si il n'est pas déjà présente dans l'accumulateur
          // - si il n'est pas présent dans areasOld
          if (!areasIndex[area.id] && !areasOldIndex[area.id]) {
            const areaNew = { ...area }
            // La surface ne sert à rien dans la table du territoire,
            // elle sert uniquement dans la table de relation avec l’étape
            delete areaNew.surface
            areasNew.push(areaNew)
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

/**
 * Recherche tous les territoires de chaque étape en fonction de son périmètre
 * @param titresEtapes - liste d’étapes
 * @returns un index d’étapes associées à leurs territoires
 */
const titresEtapesAreasGet = async (
  titresEtapes: ITitreEtape[]
): Promise<Index<ITitreEtapeAreas>> => {
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
      titresEtapesAreasIndex: Index<ITitreEtapeAreas>,
      titreEtape: ITitreEtape
    ) => {
      queue.add(async () => {
        let titreEtapeAreas: { [areaType in IAreaType]: IArea[] } = {
          communes: [],
          forets: []
        }

        if (titreEtape.points?.length) {
          const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

          const areaTypes: IAreaType[] = ['communes', 'forets']
          const apiGeoCommuneResult = await geoAreaGeojsonGet(
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

/**
 * Met à jour tous les territoires d’une liste d’étapes
 * @param titresEtapes - liste d’étapes
 * @param communes - liste des communes existantes
 * @param forets - liste des forêts existantes
 * @returns toutes les modifications effectuées
 */
const titresEtapesAreasUpdate = async (
  titresEtapes: ITitreEtape[],
  communes: ICommune[],
  forets: IForet[]
): Promise<{ titresCommunes: any[]; titresForets: any[] }> => {
  // teste l'API geo-areas-api
  const geoAreasApiTestResult = await geoAreaApiTest()
  // si la connexion à l'API échoue, retourne
  if (!geoAreasApiTestResult) {
    console.warn('communesGeojsonApi injoignable')

    return { titresCommunes: [[], [], []], titresForets: [[], [], []] }
  }

  const titresEtapesAreas = await titresEtapesAreasGet(titresEtapes)

  return {
    titresCommunes: await titresEtapesCommunesUpdate(
      titresEtapesAreas,
      communes
    ),
    titresForets: await titresEtapesForetsUpdate(titresEtapesAreas, forets)
  }
}

/**
 * Met à jour les communes pour chaque étape
 * @param titresEtapesAreas - liste des étapes
 * @param communes - liste des communes existantes
 * @returns toutes les modifications effectuées
 */
const titresEtapesCommunesUpdate = async (
  titresEtapesAreas: Index<ITitreEtapeAreas>,
  communes: ICommune[]
) =>
  titresEtapesAreaUpdate(
    titresEtapesAreas,
    communes,
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

/**
 * Met à jour les forets pour chaque étape
 * @param titresEtapesAreas - liste des étapes
 * @param forets - liste des forets existantes
 * @returns toutes les modifications effectuées
 */
const titresEtapesForetsUpdate = async (
  titresEtapesAreas: Index<ITitreEtapeAreas>,
  forets: IForet[]
) =>
  titresEtapesAreaUpdate(
    titresEtapesAreas,
    forets,
    'forets',
    foretsUpsert,
    titresEtapesAreas =>
      titresEtapesForetsUpdateQuery({
        titreEtapeId: titresEtapesAreas.titreEtapeId,
        surface: titresEtapesAreas.surface,
        foretId: titresEtapesAreas.areaId
      }),
    titreEtapeForetDelete
  )

/**
 * Met à jour tous les territoires d’un certain type pour chaque étape
 * @param titresEtapesAreas - index des étapes associés à leurs territoires
 * @param areasOld - liste des territoires existantes
 * @param areaType - type de territoire en cours de manipulation
 * @param areasUpsert - fonction peremetant de mettre à jour un territoire
 * @param titresEtapesAreasUpdateQuery - fonction permettant de mettre à jour le territoire d’une étape
 * @param titreEtapeAreaDelete - fonction permettant de supprimer un territoire d’une étape
 */
const titresEtapesAreaUpdate = async (
  titresEtapesAreas: Index<ITitreEtapeAreas>,
  areasOld: IArea[],
  areaType: IAreaType,
  areasUpsert: (areas: IArea[]) => Promise<IArea[]>,
  titresEtapesAreasUpdateQuery: (
    titresEtapesAreas: ITitreArea
  ) => Promise<TitresCommunes | TitresForets>,
  titreEtapeAreaDelete: (etapeId: string, areaId: string) => Promise<number>
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

export { titresEtapesAreasUpdate }
