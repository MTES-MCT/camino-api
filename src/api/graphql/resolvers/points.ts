import { ISDOMZone, ITitrePoint, IToken, SDOMZoneId } from '../../../types'

import { debug } from '../../../config/index'
import { FileUpload } from 'graphql-upload'
import { Stream } from 'stream'
import shpjs from 'shpjs'
import { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'
import {
  documentTypeIdsBySdomZonesGet,
  titreEtapePointsCalc,
  titreEtapeSdomZonesGet
} from './_titre-etape'
import { geoSystemes } from '../../../database/cache/geo-systemes'
import {
  geojsonFeatureMultiPolygon,
  geojsonSurface
} from '../../../tools/geojson'
import { Feature } from '@turf/helpers'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { userGet } from '../../../database/queries/utilisateurs'
import { etapeTypeGet } from '../../../database/queries/metas'
import { titreGet } from '../../../database/queries/titres'
import { userSuper } from '../../../database/user-super'

const stream2buffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = [] as any[]

    stream.on('data', chunk => _buf.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(_buf)))
    stream.on('error', err =>
      reject(new Error(`error converting stream - ${err}`))
    )
  })
}

interface IGeojsonInformations {
  surface: number
  documentTypeIds: string[]
  messages: string[]
  sdomZones: ISDOMZone[]
}

const pointsImporter = async ({
  fileUpload,
  geoSystemeId,
  titreId,
  etapeTypeId
}: {
  fileUpload: { file: FileUpload }
  geoSystemeId: string
  titreId: string
  etapeTypeId: string
}): Promise<
  IGeojsonInformations & {
    points: Omit<ITitrePoint, 'id' | 'titreEtapeId'>[]
  }
> => {
  try {
    const file = fileUpload.file

    if (!file) {
      throw new Error('fichier vide')
    }

    if (
      !file.filename.endsWith('.geojson') &&
      !file.filename.endsWith('.shp')
    ) {
      throw new Error('seul les fichiers geojson ou shape sont acceptés')
    }

    const geoSysteme = geoSystemes.find(({ id }) => id === geoSystemeId)
    if (!geoSysteme) {
      throw new Error(`système géographique inconnu : EPSG:${geoSystemeId}`)
    }

    const { createReadStream } = await file
    const buffer = await stream2buffer(createReadStream())

    let geojson: Position[][][]
    if (file.filename.endsWith('.geojson')) {
      const features = JSON.parse(
        buffer.toString()
      ) as FeatureCollection<MultiPolygon>
      geojson = (features.features[0].geometry as MultiPolygon).coordinates
    } else {
      geojson = ((await shpjs.parseShp(buffer, 'EPSG:4326')) as Polygon[]).map(
        p => p.coordinates
      )
    }

    const points = [] as Omit<ITitrePoint, 'id' | 'titreEtapeId'>[]

    geojson.forEach((groupe, groupeIndex) => {
      groupe.forEach((contour, contourIndex) => {
        contour.forEach((point, pointIndex) => {
          // Si le point n’a pas déjà été ajouté. Souvent le dernier point est le même que le premier.
          if (
            !points.some(
              p =>
                p.references[0].coordonnees.x === point[0] &&
                p.references[0].coordonnees.y === point[1]
            )
          ) {
            points.push({
              groupe: groupeIndex + 1,
              contour: contourIndex + 1,
              point: pointIndex + 1,
              coordonnees: { x: 0, y: 0 },
              references: [
                {
                  id: '',
                  titrePointId: '',
                  coordonnees: { x: point[0], y: point[1] },
                  geoSystemeId: geoSysteme.id,
                  geoSysteme
                }
              ]
            })
          }
        })
      })
    })

    return await perimetreInformations({
      points: points as ITitrePoint[],
      titreId,
      etapeTypeId
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const sdomZonesInformationsGet = async (
  points: ITitrePoint[],
  etapeSdomZones: ISDOMZone[],
  titreTypeId: string,
  etapeTypeId: string,
  titreSdomZones: ISDOMZone[]
) => {
  const etapeType = await etapeTypeGet(etapeTypeId, { fields: { id: {} } })
  // si c’est une étape fondamentale on récupère les zones directement sur l’étape
  const zones = etapeType!.fondamentale ? etapeSdomZones : titreSdomZones

  const messages = [] as string[]

  // si c’est une demande d’AXM, on doit afficher un message si on est en zone 0 ou 1 du Sdom
  if (titreTypeId === 'axm' && ['mfr', 'mcr'].includes(etapeTypeId)) {
    const zone = zones.find(s =>
      [
        SDOMZoneId.Zone0,
        SDOMZoneId.Zone0Potentielle,
        SDOMZoneId.Zone1
      ].includes(s.id as SDOMZoneId)
    )
    if (zone) {
      messages.push(
        `Le périmètre renseigné est dans une zone du Sdom interdite à l’exploitation minière : ${zone.nom}`
      )
    }
  }

  if (!points || points.length < 3) {
    return { surface: 0, documentTypeIds: [], messages }
  }
  const geojsonFeatures = geojsonFeatureMultiPolygon(points as ITitrePoint[])

  const surface = geojsonSurface(geojsonFeatures as Feature)

  const documentTypeIds = documentTypeIdsBySdomZonesGet(
    etapeSdomZones,
    titreTypeId,
    etapeTypeId
  )

  return { surface, documentTypeIds, messages }
}

const perimetreInformations = async ({
  points,
  titreId,
  etapeTypeId
}: {
  points: ITitrePoint[] | undefined | null
  titreId: string
  etapeTypeId: string
}): Promise<IGeojsonInformations & { points: ITitrePoint[] }> => {
  try {
    let sdomZones = [] as ISDOMZone[]
    let titreEtapePoints = [] as ITitrePoint[]
    if (points && points.length > 2) {
      titreEtapePoints = titreEtapePointsCalc(points)

      const geojsonFeatures = geojsonFeatureMultiPolygon(
        titreEtapePoints as ITitrePoint[]
      )

      sdomZones = await titreEtapeSdomZonesGet(geojsonFeatures)
    }

    const titre = await titreGet(
      titreId,
      {
        fields: { sdomZones: { id: {} } }
      },
      userSuper
    )

    const informations = await sdomZonesInformationsGet(
      titreEtapePoints,
      sdomZones,
      titre!.typeId,
      etapeTypeId,
      titre!.sdomZones || []
    )

    return { ...informations, sdomZones, points: titreEtapePoints }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreEtapePerimetreInformations = async (
  {
    titreEtapeId
  }: {
    titreEtapeId: string
  },
  context: IToken
): Promise<IGeojsonInformations> => {
  try {
    const user = await userGet(context.user?.id)

    const etape = await titreEtapeGet(
      titreEtapeId,
      {
        fields: {
          sdomZones: { id: {} },
          demarche: { titre: { sdomZones: { id: {} } } }
        }
      },
      user
    )

    if (!etape) {
      throw new Error('droits insuffisants')
    }

    const sdomZones = etape.sdomZones || []

    const informations = await sdomZonesInformationsGet(
      etape.points || [],
      sdomZones,
      etape.demarche!.titre!.typeId,
      etape.typeId,
      etape.demarche!.titre!.sdomZones || []
    )

    return { sdomZones, ...informations }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  pointsImporter,
  perimetreInformations,
  titreEtapePerimetreInformations
}
