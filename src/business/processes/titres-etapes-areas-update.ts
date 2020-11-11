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
import { apiGeoGet } from '../../tools/api-geo'
import {
  communesGet,
  communesUpsert,
  foretsGet,
  foretsUpsert
} from '../../database/queries/territoires'
import {
  titreEtapeCommuneDelete,
  titreEtapeForetDelete,
  titresEtapesCommunesUpdate as titresEtapesCommunesUpdateQuery,
  titresEtapesForetsUpdate as titresEtapesForetsUpdateQuery,
  titresEtapesGet
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

  return apiGeoGet(geojson, ['communes'])
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
) => {
  if (!areasEtapeOld) return []

  return areasEtapeOld.reduce((titreEtapesAreas: ITitreArea[], areaOld) => {
    if (!areasEtape.find(areaEtape => areaEtape.id === areaOld.id)) {
      titreEtapesAreas.push({
        titreEtapeId,
        areaId: areaOld.id
      })
    }

    return titreEtapesAreas
  }, [])
}

/**
 * Pour chaque étape, recherche les territoires à mettre à jour ou à supprimer
 * @param titresEtapesAreasIndex - index d’étapes associées à leur nouveaux territoires
 * @param areaId - type de territoire en cour de manipulatin
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
 * Construit un index des territoires à créer
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
    (acc: { areasIndex: Index<boolean>; areasNew: IArea[] }, titreEtapeId) => {
      const etapeAreas = titresEtapesAreasIndex[titreEtapeId].areas[areaType]

      return etapeAreas.reduce(({ areasIndex, areasNew }, area) => {
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
      }, acc)
    },
    { areasIndex: {}, areasNew: [] }
  )

  return areasNew
}

/**
 * Recherche tous les territoires de chaque étape en fonction de son périmètre
 * @param titresEtapes - liste d’étapes
 * @returns un index d’étapes associées à leurs territoires
 */
const titresEtapesAreasGet = async (titresEtapes: ITitreEtape[]) => {
  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API geoareas
  const queue = new PQueue({
    concurrency: 10
    //    interval: 1000,
    //    intervalCap: 10
  })

  const areasTypes = ['communes', 'forets'] as IAreaType[]
  const titresEtapesAreasIndex = {} as Index<ITitreEtapeAreas>

  titresEtapes.forEach((titreEtape: ITitreEtape) => {
    queue.add(async () => {
      const apiGeoResult = titreEtape.points?.length
        ? await apiGeoGet(
            geojsonFeatureMultiPolygon(titreEtape.points),
            areasTypes
          )
        : undefined

      const areas = areasTypes.reduce((acc, id) => {
        acc[id] = apiGeoResult && apiGeoResult[id] ? apiGeoResult[id] : []

        return acc
      }, {} as { [areaType in IAreaType]: IArea[] })

      titresEtapesAreasIndex[titreEtape.id] = { titreEtape, areas }
    })
  })

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
const titresEtapesAreasUpdate = async (titresEtapesIds?: string[]) => {
  console.info()
  console.info('communes et forêts associées aux étapes…')

  const titresEtapes = await titresEtapesGet(
    { titresEtapesIds, etapesTypesIds: null, titresDemarchesIds: null },
    {
      fields: { points: { id: {} }, communes: { id: {} }, forets: { id: {} } }
    },
    'super'
  )
  const communes = await communesGet()
  const forets = await foretsGet()

  // teste l'API geo-areas-api
  const geoAreasApiTestResult = await geoAreaApiTest()
  // si la connexion à l'API échoue, retourne
  if (!geoAreasApiTestResult) {
    console.error('communesGeojsonApi injoignable')

    return { titresCommunes: [[], [], []], titresForets: [[], [], []] }
  }

  const titresEtapesAreasIndex = await titresEtapesAreasGet(titresEtapes)

  return {
    titresCommunes: await titresEtapesCommunesUpdate(
      titresEtapesAreasIndex,
      communes
    ),
    titresForets: await titresEtapesForetsUpdate(titresEtapesAreasIndex, forets)
  }
}

/**
 * Met à jour les communes pour chaque étape
 * @param titresEtapesAreasIndex - liste des étapes
 * @param communes - liste des communes existantes
 * @returns toutes les modifications effectuées
 */
const titresEtapesCommunesUpdate = async (
  titresEtapesAreasIndex: Index<ITitreEtapeAreas>,
  communes: ICommune[]
) =>
  titresEtapesAreaUpdate(
    titresEtapesAreasIndex,
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
 * @param titresEtapesAreasIndex - liste des étapes
 * @param forets - liste des forets existantes
 * @returns toutes les modifications effectuées
 */
const titresEtapesForetsUpdate = async (
  titresEtapesAreasIndex: Index<ITitreEtapeAreas>,
  forets: IForet[]
) =>
  titresEtapesAreaUpdate(
    titresEtapesAreasIndex,
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
 * @param titresEtapesAreasIndex - index des étapes associés à leurs territoires
 * @param areasOld - liste des territoires existantes
 * @param areaId - type de territoire en cours de manipulation
 * @param areasUpsert - fonction peremetant de mettre à jour un territoire
 * @param titresEtapesAreasUpdateQuery - fonction permettant de mettre à jour le territoire d’une étape
 * @param titreEtapeAreaDeleteQuery - fonction permettant de supprimer un territoire d’une étape
 */
const titresEtapesAreaUpdate = async (
  titresEtapesAreasIndex: Index<ITitreEtapeAreas>,
  areasOld: IArea[],
  areaType: IAreaType,
  areasUpsert: (areas: IArea[]) => Promise<IArea[]>,
  titresEtapesAreasUpdateQuery: (
    titresEtapesAreas: ITitreArea
  ) => Promise<TitresCommunes | TitresForets>,
  titreEtapeAreaDeleteQuery: (
    etapeId: string,
    areaId: string
  ) => Promise<number>
) => {
  const areasToUpdate = areasBuild(areasOld, areaType, titresEtapesAreasIndex)

  let areasUpdated: IArea[] = []

  if (areasToUpdate.length) {
    areasUpdated = await areasUpsert(areasToUpdate)

    const log = {
      type: `${areaType} (mise à jour) ->`,
      value: areasToUpdate.map(area => area.id).join(', ')
    }

    console.info(log.type, log.value)
  }

  const {
    titresEtapesAreasToUpdate,
    titresEtapesAreasToDelete
  } = titresEtapesAreasToUpdateAndDeleteBuild(titresEtapesAreasIndex, areaType)

  const titresEtapesAreasUpdated: string[] = []
  const titresEtapesAreasDeleted: string[] = []

  if (titresEtapesAreasToUpdate.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAreasToUpdate.forEach(titreEtapeArea => {
      queue.add(async () => {
        await titresEtapesAreasUpdateQuery(titreEtapeArea)

        const log = {
          type: `titre / démarche / étape : ${areaType} (mise à jour) ->`,
          value: JSON.stringify(titreEtapeArea)
        }

        console.info(log.type, log.value)

        titresEtapesAreasUpdated.push(titreEtapeArea.titreEtapeId)
      })
    })

    await queue.onIdle()
  }

  if (titresEtapesAreasToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAreasToDelete.forEach(({ titreEtapeId, areaId }) => {
      queue.add(async () => {
        await titreEtapeAreaDeleteQuery(titreEtapeId, areaId)

        const log = {
          type: `titre / démarche / étape : ${areaType} (suppression)`,
          value: `${titreEtapeId} : ${areaId}`
        }

        console.info(log.type, log.value)

        titresEtapesAreasDeleted.push(titreEtapeId)
      })
    })

    await queue.onIdle()
  }

  return [areasUpdated, titresEtapesAreasUpdated, titresEtapesAreasDeleted]
}

export { titresEtapesAreasUpdate }
