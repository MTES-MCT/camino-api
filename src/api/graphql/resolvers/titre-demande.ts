import dateFormat from 'dateformat'

import {
  IToken,
  ITitreDemande,
  ITitre,
  ITitreDemarche,
  ITitreEtape
} from '../../../types'
import { debug } from '../../../config/index'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreDemandeEntreprisesGet } from '../../../database/queries/entreprises'
import { permissionCheck } from '../../../tools/permission'
import { domaineGet } from '../../../database/queries/metas'
import { titreCreate, titreGet } from '../../../database/queries/titres'
import { titreDemarcheCreate } from '../../../database/queries/titres-demarches'
import { titreEtapeUpsert } from '../../../database/queries/titres-etapes'

import titreUpdateTask from '../../../business/titre-update'
import titreDemarcheUpdateTask from '../../../business/titre-demarche-update'
import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import { userSuper } from '../../../database/user-super'

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
      const titreType = domaine.titresTypes.find(
        tt => tt.id === titreDemande.typeId
      )

      if (!user || !titreType?.titresCreation)
        throw new Error('droits insuffisants')
    }
    // insert le titre dans la base
    let titre = await titreCreate(
      {
        nom: titreDemande.nom,
        typeId: titreDemande.typeId,
        domaineId: titreDemande.domaineId,
        references: titreDemande.references
      } as ITitre,
      { fields: {} }
    )

    const titreId = titre.id
    await titreUpdateTask(titre.id)

    const titreDemarche = await titreDemarcheCreate({
      titreId,
      typeId: 'oct'
    } as ITitreDemarche)

    await titreDemarcheUpdateTask(titreDemarche.id, titreDemarche.titreId)

    titre = await titreGet(
      titreId,
      { fields: { demarches: { id: {} } } },
      userSuper
    )

    const date = dateFormat(new Date(), 'yyyy-mm-dd')
    const titreDemarcheId = titre.demarches![0].id

    let titreEtape = {
      titreDemarcheId,
      typeId: 'mfr',
      statutId: 'aco',
      date,
      duree: titreDemande.typeId === 'arm' ? 4 : undefined,
      titulaires: [{ id: titreDemande.entrepriseId }]
    } as ITitreEtape

    titreEtape = await titreEtapeUpsert(titreEtape, user)

    await titreEtapeUpdateTask(titreEtape.id, titreEtape.titreDemarcheId)

    titre = await titreGet(
      titreId,
      { fields: { demarches: { etapes: { id: {} } } } },
      userSuper
    )

    const titreEtapeId = titre.demarches![0].etapes![0].id

    // (envoi un email avec l'url)

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
