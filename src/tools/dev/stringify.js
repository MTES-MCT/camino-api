import 'dotenv/config'
import fileCreate from '../file-create'

const json = [
  {
    id: 1,
    nom: '1er trimestre',
    mois: [
      {
        id: 1,
        nom: 'Janvier'
      },
      {
        id: 2,
        nom: 'Février'
      },
      {
        id: 3,
        nom: 'Mars'
      }
    ]
  },
  {
    id: 2,
    nom: '2nd trimestre',
    mois: [
      {
        id: 4,
        nom: 'Avril'
      },
      {
        id: 5,
        nom: 'Mai'
      },
      {
        id: 6,
        nom: 'Juin'
      }
    ]
  },
  {
    id: 3,
    nom: '3ème trimestre',
    mois: [
      {
        id: 7,
        nom: 'Juillet'
      },
      {
        id: 8,
        nom: 'Août'
      },
      {
        id: 9,
        nom: 'Septembre'
      }
    ]
  },
  {
    id: 4,
    nom: '4ème trimestre',
    mois: [
      {
        id: 10,
        nom: 'Octobre'
      },
      {
        id: 11,
        nom: 'Novembre'
      },
      {
        id: 12,
        nom: 'Décembre'
      }
    ]
  }
]

async function main() {
  await fileCreate('json.json', JSON.stringify(json))

  process.exit()
}

main()
