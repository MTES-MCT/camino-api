import { ITitrePoint } from '../../../types'

import { debug } from '../../../config/index'
import { FileUpload } from 'graphql-upload'
import { Stream } from 'stream'
import shpjs from 'shpjs'
import { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'
import { titreEtapePointsCalc } from './_titre-etape'
import { geoSystemes } from '../../../database/cache/geo-systemes'

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

const pointsImporter = async ({
  fileUpload,
  geoSystemeId
}: {
  fileUpload: { file: FileUpload }
  geoSystemeId: string
}): Promise<Omit<ITitrePoint, 'id' | 'titreEtapeId'>[]> => {
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
        })
      })
    })

    return titreEtapePointsCalc(points)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { pointsImporter }
