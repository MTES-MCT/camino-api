import fileCreate from '../../file-create'
import { join } from 'path'

const titresActivitesPath = 'sources/titres-activites.json'
const titresActivites = require(join('../../../..', titresActivitesPath))

async function main() {
  const titresActivitesNew = titresActivites.reduce((tas, ta) => {
    if (
      ta.contenu &&
      ta.contenu.renseignements &&
      (ta.contenu.renseignements.orNet || ta.contenu.renseignements.orNet === 0)
    ) {
      tas.push({
        id: ta.id.replace('grp', 'gra').slice(0, -3),
        titre_id: ta.titre_id,
        utilisateur_id: ta.utilisateur_id,
        date: ta.date,
        date_saisie: ta.date_saisie,
        activite_type_id: 'gra',
        activite_statut_id: ta.activite_statut_id,
        frequence_periode_id: '1',
        annee: ta.annee,
        contenu: {
          renseignements: {
            orNet: ta.contenu.renseignements.orNet
          }
        }
      })

      delete ta.contenu.renseignements.orNet
    }
    tas.push(ta)

    return tas
  }, [])

  await fileCreate(
    titresActivitesPath,
    JSON.stringify(titresActivitesNew, null, 2)
  )
}

main()
