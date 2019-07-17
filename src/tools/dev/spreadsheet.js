import 'dotenv/config'
import '../../database/index'
import { titreActivitesRowUpdate } from '../export/titre-activites'

async function main() {
  const activite = {
    id: 'm-axm-crique-belle-helene-1-2017-2018-02',
    titreId: 'm-axm-crique-belle-helene-1-2017',
    utilisateurId: 'guillaume-levieux',
    date: '2019-01-14',
    confirmation: null,
    contenu: {
      annee: 2018,
      orBrut: 6371.67,
      pelles: 0,
      pompes: 0,
      mercure: 0,
      travaux: [
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
      ],
      effectifs: 6,
      trimestre: 1,
      complement:
        "RAS. La tenneur moyenne récupérée en couche est de l'ordre de 0,67 g/m3. Rapport papier daté du 22/08/2018 enregistré par la DEAL le 27/08/2018.",
      environnement: 0,
      carburantDetaxe: 0,
      carburantConventionnel: 31863
    }
  }

  await titreActivitesRowUpdate([activite])

  process.exit()
}

main()
