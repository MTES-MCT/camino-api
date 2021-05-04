import '../../init'

import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'
import EtapesTypes from '../../database/models/etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import { objectClone } from '../../tools'
import TitresEtapes from '../../database/models/titres-etapes'
import AdministrationsTitresTypesEtapesTypes from '../../database/models/administrations-titres-types-etapes-types'

const main = async () => {
  const mfr = await EtapesTypes.query().findById('mfr')

  await EtapesTypes.query().insertGraph({
    ...mfr,
    id: 'mfm',
    nom: 'demande mécanisée',
    ordre: mfr.ordre + 1
  })

  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'mfm',
    etapeStatutId: 'aco',
    ordre: 1
  })
  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'mfm',
    etapeStatutId: 'dep',
    ordre: 2
  })

  const mfrTDE = await TitresTypesDemarchesTypesEtapesTypes.query()
    .where('titreTypeId', 'arm')
    .andWhere('demarcheTypeId', 'oct')
    .andWhere('etapeTypeId', 'mfr')
    .first()

  const mfmTDE = objectClone(mfrTDE)

  mfmTDE.etapeTypeId = 'mfm'
  mfmTDE
    .sections!.find(({ id }: { id: string }) => id === 'arm')!
    .elements.push({
      id: 'materiel',
      nom: 'Matériel',
      type: 'multiple',
      optionnel: false,
      elements: [
        {
          id: 'type',
          nom: 'Type de matériel',
          type: 'select',
          valeurs: [
            { id: 'pelleHydraulique', nom: 'Pelle hydraulique' },
            {
              id: 'motoTariereAutotractee',
              nom: 'Moto tarière autotractée'
            },
            { id: 'quad', nom: 'Quad' },
            { id: 'autre', nom: 'Autre matériel autorisé' }
          ],
          optionnel: false
        },
        { id: 'marque', nom: 'Marque', type: 'text', optionnel: false },
        { id: 'modele', nom: 'Modèle', type: 'text', optionnel: false },
        {
          id: 'numero',
          nom: 'N° d’identification',
          type: 'text',
          optionnel: false
        },
        {
          id: 'proprietaire',
          nom: 'Nom du propriétaire',
          type: 'text',
          optionnel: false
        },
        {
          id: 'tonnage',
          nom: 'Tonnage',
          type: 'number',
          description: 'Le tonnage maximum autorisé est fixé à 21 tonnes.',
          optionnel: true
        },
        {
          id: 'justificatif',
          nom: 'Justificatif',
          type: 'file',
          description: 'facture d’achat ou contrat de location',
          optionnel: false
        }
      ]
    })

  await TitresTypesDemarchesTypesEtapesTypes.query().insertGraph(mfmTDE)

  const administrationsTitresTypesEtapesTypes = await AdministrationsTitresTypesEtapesTypes.query().where(
    'etapeTypeId',
    'mfr'
  )

  for (const a of administrationsTitresTypesEtapesTypes) {
    a.etapeTypeId = 'mfm'
    await AdministrationsTitresTypesEtapesTypes.query().insertGraph(a)
  }

  await TitresEtapes.query()
    .patch({ typeId: 'mfm' })
    .where('typeId', 'mfr')
    .andWhereRaw("((contenu->>'arm')::json->>'mecanise')::boolean is true")

  // on supprime la section « arm » des mfr
  mfrTDE.sections = null
  await TitresTypesDemarchesTypesEtapesTypes.query().upsertGraph(mfrTDE)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
