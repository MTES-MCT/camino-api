import '../../init'

import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'
import EtapesTypes from '../../database/models/etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import TitresEtapes from '../../database/models/titres-etapes'
import AdministrationsTitresTypesEtapesTypes from '../../database/models/administrations-titres-types-etapes-types'
import EtapesTypesDocumentsTypes from '../../database/models/etapes-types--documents-types'
import { ITitreEtape } from '../../types'
import Document from '../../database/models/documents'
import { documentFilePathFind } from '../../tools/documents/document-path-find'
import fileRename from '../../tools/file-rename'

const main = async () => {
  await EtapesTypes.query().insertGraph({
    id: 'mdp',
    nom: 'dépôt de la demande',
    description:
      "Le dépôt de la demande formalise la prise en charge de la demande par l'administration compétente. Cette étape fait l’objet d’un accusé de réception qui informe le demandeur des modalités d’instruction, du délai au-delà duquel une décision implicite d’accord ou de rejet sera formée et des voies de recours.",
    ordre: 6,
    unique: true,
    acceptationAuto: true,
    publicLecture: true,
    entreprisesLecture: true
  })

  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'mdp',
    etapeStatutId: 'fai',
    ordre: 1
  })

  await EtapesTypesDocumentsTypes.query().insertGraph({
    etapeTypeId: 'mdp',
    documentTypeId: 'acr',
    optionnel: true
  })

  const mfrTDEList =
    await TitresTypesDemarchesTypesEtapesTypes.query().andWhere(
      'etapeTypeId',
      'mfr'
    )

  for (const tde of mfrTDEList) {
    await TitresTypesDemarchesTypesEtapesTypes.query().insertGraph({
      titreTypeId: tde.titreTypeId,
      demarcheTypeId: tde.demarcheTypeId,
      etapeTypeId: 'mdp',
      ordre: tde.ordre + 1
    })
  }

  await AdministrationsTitresTypesEtapesTypes.query().insertGraph([
    {
      administrationId: 'ope-brgm-02',
      titreTypeId: 'arm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'ope-brgm-02',
      titreTypeId: 'axm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'ope-brgm-02',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'ope-brgm-02',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'ope-brgm-02',
      titreTypeId: 'pxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dea-guyane-01',
      titreTypeId: 'arm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dea-guyane-01',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dea-guyane-01',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dea-guyane-01',
      titreTypeId: 'pxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-aura-01',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-aura-01',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-bfc-01',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-bfc-01',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-grand-est-01',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-grand-est-01',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-occitanie-01',
      titreTypeId: 'cxm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'dre-occitanie-01',
      titreTypeId: 'prm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'aut-mrae-guyane-01',
      titreTypeId: 'arm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'ope-onf-973-01',
      titreTypeId: 'axm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    },
    {
      administrationId: 'pre-97302-01',
      titreTypeId: 'arm',
      etapeTypeId: 'mdp',
      lectureInterdit: false,
      creationInterdit: true,
      modificationInterdit: true
    }
  ])

  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'mfr',
    etapeStatutId: 'fai',
    ordre: 2
  })

  const mfrEtapes = await TitresEtapes.query()
    .where('typeId', 'mfr')
    .where('statutId', 'dep')

  // On ajoute une mdp pour chaque mfr déposée existant
  for (const demande of mfrEtapes) {
    const mdp = await TitresEtapes.query().insertGraph({
      typeId: 'mdp',
      statutId: 'fai',
      date: demande.date,
      titreDemarcheId: demande.titreDemarcheId
    })

    const partialDemande: Partial<ITitreEtape> = {}
    // On met à jour son statut
    partialDemande.statutId = 'fai'

    if (
      demande.contenu?.demande?.date &&
      demande.contenu.demande.date !== demande.date
    ) {
      // On met à jour la date de la demande
      partialDemande.date = demande.contenu.demande.date as string
    }
    if (demande.heritageContenu) {
      partialDemande.heritageContenu = demande.heritageContenu
      delete partialDemande.heritageContenu.demande
    }
    await TitresEtapes.query().patch(partialDemande).where('id', demande.id)

    // on bouge les accusés de réception sur les dépôts de demande
    const acrList = await Document.query()
      .where('titreEtapeId', demande.id)
      .where('typeId', 'acr')
    if (acrList?.length) {
      for (const acr of acrList) {
        await Document.query()
          .patch({ titreEtapeId: mdp.id })
          .where('id', acr.id)

        if (acr.fichier) {
          const documentOldFilePath = await documentFilePathFind(acr)
          const documentFilePath = await documentFilePathFind(
            { ...acr, titreEtapeId: mdp.id },
            true
          )

          try {
            await fileRename(documentOldFilePath, documentFilePath)
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  }

  // on supprime l’ancienne date des sections qui est maintenant la date de la demande
  const etapes = await TitresEtapes.query().andWhereRaw(
    "contenu->>'demande' is not null"
  )
  for (const e of etapes) {
    const contenu = e.contenu
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete contenu.demande
    await TitresEtapes.query().patch({ contenu }).where('id', e.id)
  }

  // on supprime la section « demande »
  await EtapesTypes.query().patch({ sections: null }).where('id', 'mfr')

  // Suppression de l’ancien statut « dep » sur les demandes
  await EtapesTypesEtapesStatuts.query().deleteById(['mfr', 'dep'])

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
