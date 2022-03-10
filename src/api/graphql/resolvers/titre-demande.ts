import dateFormat from 'dateformat'

import {
  IToken,
  ITitreDemande,
  ITitreEtape,
  ISection,
  ITitreEntreprise
} from '../../../types'
import { debug } from '../../../config/index'
import {
  userGet,
  utilisateurTitreCreate
} from '../../../database/queries/utilisateurs'
import { titreDemandeEntreprisesGet } from '../../../database/queries/entreprises'
import { permissionCheck } from '../../../business/permission'
import { domaineGet, etapeTypeGet } from '../../../database/queries/metas'
import { titreCreate, titreGet } from '../../../database/queries/titres'
import { titreDemarcheCreate } from '../../../database/queries/titres-demarches'
import { titreEtapeUpsert } from '../../../database/queries/titres-etapes'

import titreUpdateTask from '../../../business/titre-update'
import titreDemarcheUpdateTask from '../../../business/titre-demarche-update'
import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import { userSuper } from '../../../database/user-super'
import { specifiquesGet } from './titres-etapes'

const titreDemandeCreer = async (
  { titreDemande }: { titreDemande: ITitreDemande },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (
      !user ||
      !permissionCheck(user.permissionId, [
        'super',
        'admin',
        'editeur',
        'entreprise'
      ])
    ) {
      throw new Error('permissions insuffisantes')
    }

    if (permissionCheck(user.permissionId, ['entreprise'])) {
      if (titreDemande.references?.length) {
        throw new Error('permissions insuffisantes')
      }

      const entreprises = await titreDemandeEntreprisesGet(
        { fields: { id: {} } },
        user
      )

      const entreprise = entreprises.find(
        e => e.id === titreDemande.entrepriseId
      )

      if (!entreprise) {
        throw new Error('permissions insuffisantes')
      }

      const titreType = entreprise.titresTypes!.find(
        tt => tt.id === titreDemande.typeId
      )

      if (!titreType) {
        throw new Error('permissions insuffisantes')
      }
    }

    if (permissionCheck(user.permissionId, ['super', 'admin', 'editeur'])) {
      const domaine = await domaineGet(
        titreDemande.domaineId,
        { fields: { titresTypes: { id: {} } } },
        user
      )
      const titreType = domaine?.titresTypes.find(
        tt => tt.id === titreDemande.typeId
      )

      if (!user || !titreType || !titreType.titresCreation)
        throw new Error('droits insuffisants')
    }
    // insert le titre dans la base
    const titre = await titreCreate(
      {
        nom: titreDemande.nom,
        typeId: titreDemande.typeId,
        domaineId: titreDemande.domaineId,
        references: titreDemande.references,
        propsTitreEtapesIds: {}
      },
      { fields: {} }
    )

    const titreId = titre.id
    await titreUpdateTask(titre.id)

    const titreDemarche = await titreDemarcheCreate({
      titreId,
      typeId: 'oct'
    })

    await titreDemarcheUpdateTask(titreDemarche.id, titreDemarche.titreId)

    const updatedTitre = await titreGet(
      titreId,
      { fields: { demarches: { id: {} } } },
      userSuper
    )

    if (!updatedTitre) {
      throw new Error('recupération du titre nouvellement créé impossible')
    }

    const date = dateFormat(new Date(), 'yyyy-mm-dd')
    const titreDemarcheId = updatedTitre.demarches![0].id

    const titulaire = { id: titreDemande.entrepriseId } as ITitreEntreprise
    const titreEtape: Omit<ITitreEtape, 'id'> = {
      titreDemarcheId,
      typeId: 'mfr',
      statutId: 'aco',
      date,
      duree: titreDemande.typeId === 'arm' ? 4 : undefined,
      titulaires: [titulaire]
    }

    let decisionsAnnexesEtapeTypeIds: string[] = []
    if (titreDemande.typeId === 'axm') {
      // si c’est une AXM, d’après l’arbre d’instructions il y a 2 décisions annexes
      // - la décision du propriétaire du sol (asl)
      // - la décision de la mission autorité environnementale (dae)
      decisionsAnnexesEtapeTypeIds = ['asl', 'dae']
    }
    if (decisionsAnnexesEtapeTypeIds.length) {
      titreEtape.decisionsAnnexesSections = []

      for (const etapeTypeId of decisionsAnnexesEtapeTypeIds) {
        const etapeType = await etapeTypeGet(etapeTypeId, {
          fields: {
            etapesStatuts: { id: {} },
            documentsTypes: { id: {} }
          }
        })

        const decisionAnnexeSections: ISection = {
          id: etapeTypeId,
          nom: etapeType!.nom,
          elements: [
            {
              id: 'date',
              nom: 'Date',
              type: 'date'
            },
            {
              id: 'statutId',
              nom: 'Statut',
              type: 'select',
              valeurs: etapeType!.etapesStatuts!.map(statut => ({
                id: statut.id,
                nom: statut.nom
              }))
            }
          ]
        }

        const { documentsTypes } = await specifiquesGet(
          titreDemande.typeId,
          titreDemarche.typeId,
          etapeType!
        )

        documentsTypes
          ?.filter(dt => !dt.optionnel)
          .forEach(dt => {
            decisionAnnexeSections.elements!.push({
              id: dt.id,
              nom: dt.nom!,
              type: 'file'
            })
          })

        titreEtape.decisionsAnnexesSections.push(decisionAnnexeSections)
      }
    }
    const updatedTitreEtape = await titreEtapeUpsert(titreEtape, user, titreId)

    await titreEtapeUpdateTask(
      updatedTitreEtape.id,
      titreEtape.titreDemarcheId,
      user
    )

    const titreEtapeId = updatedTitreEtape.id

    // on abonne l’utilisateur au titre
    await utilisateurTitreCreate({ utilisateurId: user.id, titreId })

    return {
      titreId,
      titreEtapeId
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemandeCreer }
