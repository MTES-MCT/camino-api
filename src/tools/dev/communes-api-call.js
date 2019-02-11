import 'dotenv/config'
import api from '../api-communes'

const geojson = {
  type: 'Feature',
  properties: { id: 'test' },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [-0.003511817426206, 43.4699897941247],
          [-0.003510675548367, 43.379992017286],
          [0.086492457141402, 43.3799922060496],
          [0.086492395200926, 43.2899938575523],
          [0.266499564242721, 43.2899958347523],
          [0.266498422976084, 43.3799936438263],
          [0.176495463022904, 43.3799924051132],
          [0.176494466412028, 43.4699904648683],
          [-0.003511817426206, 43.4699897941247]
        ],
        [
          [0.149494714775711, 43.3169980868321],
          [0.149495737551508, 43.3259972246487],
          [0.140494074719633, 43.3259972052475],
          [0.140494667441234, 43.3439967446387],
          [0.131494370741759, 43.3439970882588],
          [0.131493979866131, 43.3529964603265],
          [0.122493641497581, 43.3529971097641],
          [0.122494266127063, 43.370996144705],
          [0.158495319359878, 43.3709970371161],
          [0.158494333168507, 43.3619965574681],
          [0.194496359336044, 43.361996882516],
          [0.194496951739768, 43.3169982443264],
          [0.149494714775711, 43.3169980868321]
        ]
      ]
    ]
  }
}

async function main() {
  const communes = await api(geojson)

  console.log(communes)

  process.exit()
}

main()
