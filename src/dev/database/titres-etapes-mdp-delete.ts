import '../../init'

import EtapesStatuts from '../../database/models/etapes-statuts'
import TitresEtapes from '../../database/models/titres-etapes'
import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'
import TitresDemarches from '../../database/models/titres-demarches'
import fileRename from '../../tools/file-rename'
import Document from '../../database/models/documents'
import EtapesTypes from '../../database/models/etapes-types'
import AdministrationsTitresTypesEtapesTypes from '../../database/models/administrations-titres-types-etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import dirCreate from '../../tools/dir-create'
import { fichiersRepertoireDelete } from '../../api/graphql/resolvers/_titre-document'

const main = async () => {
  await EtapesStatuts.query().insert({
    id: 'dep',
    nom: 'déposé',
    couleur: 'success'
  })
  await EtapesTypesEtapesStatuts.query()
    .patch({ etapeStatutId: 'dep' })
    .where('etapeStatutId', 'fav')
    .andWhere('etapeTypeId', 'mfr')

  await EtapesTypes.query()
    .patch({
      sections: [
        {
          id: 'demande',
          elements: [
            {
              id: 'date',
              nom: 'Date de la demande',
              type: 'date',
              optionnel: true
            }
          ]
        }
      ]
    })
    .where('id', 'mfr')

  const demarches = await TitresDemarches.query().withGraphFetched({
    etapes: { documents: {} },
    type: {}
  })

  for (const demarche of demarches) {
    if (demarche.etapes?.length) {
      let demandeEtape = demarche.etapes.find(e => e.typeId === 'mfr')
      const depotDemandeEtape = demarche.etapes.find(e => e.typeId === 'mdp')

      if (demandeEtape && depotDemandeEtape) {
        // si on a une demande et un depot de demande, on peut mettre le statut « déposé » sur la demande
        demandeEtape.statutId = 'dep'
        if (!demandeEtape.contenu) {
          demandeEtape.contenu = {}
        }
        if (demandeEtape.date !== depotDemandeEtape.date) {
          if (!demandeEtape.contenu.demande) {
            demandeEtape.contenu.demande = {}
          }
          demandeEtape.contenu.demande.date = demandeEtape.date
        }
        demandeEtape.date = depotDemandeEtape.date

        if (depotDemandeEtape.documents?.length) {
          if (!demandeEtape.documents) {
            demandeEtape.documents = []
          }

          for (const d of depotDemandeEtape.documents) {
            d.titreEtapeId = demandeEtape!.id
            if (d.fichier) {
              await dirCreate(`files/demarches/${demandeEtape.id}`)
              await fileRename(
                `files/demarches/${depotDemandeEtape.id}/${d.id}.${d.fichierTypeId}`,
                `files/demarches/${demandeEtape.id}/${d.id}.${d.fichierTypeId}`
              )
            }
            await Document.query().upsertGraph(d)
          }
        }

        await TitresEtapes.query().deleteById(depotDemandeEtape.id)
        await fichiersRepertoireDelete(depotDemandeEtape.id, 'demarches')
      } else if (depotDemandeEtape) {
        // si on a que un dépot de la demande, on transforme cette étape en demande au statut déposé
        depotDemandeEtape.typeId = 'mfr'
        depotDemandeEtape.statutId = 'dep'
        demandeEtape = depotDemandeEtape
      } else if (demandeEtape && demandeEtape.statutId === 'fai') {
        // si on qu’une demande au statut « fait », il faut chercher quel statut lui mettre

        const completed = demarche.etapes.some(etape =>
          ['dex', 'dpu', 'men', 'aca', 'aco'].includes(etape.typeId)
        )
        if (completed) {
          demandeEtape.statutId = 'dep'
        } else {
          // TODO en attente de vérification
          console.log(
            `https://camino.beta.gouv.fr/titres/${demarche.titreId}, ${
              demarche.type!.nom
            }`
          )
          demandeEtape.statutId = 'aco'
        }
      }

      if (demandeEtape) {
        await TitresEtapes.query()
          .patch({
            statutId: demandeEtape.statutId,
            date: demandeEtape.date,
            typeId: demandeEtape.typeId,
            contenu: demandeEtape.contenu
          })
          .where('id', demandeEtape.id)
      }
    }
  }

  await EtapesTypesEtapesStatuts.query().delete().where('etapeTypeId', 'mdp')
  await AdministrationsTitresTypesEtapesTypes.query()
    .delete()
    .where('etapeTypeId', 'mdp')
  await TitresTypesDemarchesTypesEtapesTypes.query()
    .delete()
    .where('etapeTypeId', 'mdp')
  await EtapesTypes.query().deleteById('mdp')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
