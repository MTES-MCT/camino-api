import dateFormat from 'dateformat'

import {
  IToken,
  ITitreDemande,
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  IDocument
} from '../../../types'
import { debug } from '../../../config/index'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreDemandeEntreprisesGet } from '../../../database/queries/entreprises'
import { permissionCheck } from '../../../tools/permission'
import { domaineGet } from '../../../database/queries/metas'
import { titreCreate, titreGet } from '../../../database/queries/titres'
import { titreDemarcheCreate } from '../../../database/queries/titres-demarches'
import {
  titreEtapeGet,
  titreEtapeUpsert,
  titresEtapesJustificatifsUpsert
} from '../../../database/queries/titres-etapes'

import titreUpdateTask from '../../../business/titre-update'
import titreDemarcheUpdateTask from '../../../business/titre-demarche-update'
import titreEtapeUpdateTask from '../../../business/titre-etape-update'
import { userSuper } from '../../../database/user-super'
import { etapeTypeFormat } from '../../_format/etapes-types'
import { documentCreer } from './documents'
import { GraphQLResolveInfo } from 'graphql'
import { attestationFiscaleGet } from '../../../tools/api-entreprise'

const justificatifsByApiEntrepriseGet = async (
  titreEtapeId: string,
  titreSlug: string
) => {
  const titreEtape = await titreEtapeGet(
    titreEtapeId,
    { fields: { titulaires: { documents: { id: {} } } } },
    userSuper
  )

  const etapeType = etapeTypeFormat(
    titreEtape.type!,
    undefined,
    undefined,
    titreEtape.justificatifsTypesSpecifiques
  )
  if (
    etapeType.justificatifsTypes?.length &&
    etapeType.justificatifsTypes.find(
      justificatifType =>
        !justificatifType.optionnel && justificatifType.id === ''
    )
  ) {
    // vérifie qu’on n’a pas déjà l’attestion fiscale,
    // car elle est valide un an sur une année civile (jusqu’au 31/12/AAAA).
    const titulaire = titreEtape.titulaires![0]
    const attestationFiscaleCheck = titulaire!.documents?.find(d => {
      if (d.typeId !== 'atf') {
        return false
      }

      if (!d.fichier) {
        return false
      }

      const annee = d.date.substr(0, 4)

      return annee === new Date().getFullYear().toString()
    })

    if (!attestationFiscaleCheck) {
      try {
        const file = await attestationFiscaleGet(
          titulaire.legalSiren!,
          titreSlug,
          'NouvelleDemande'
        )

        const attestationFiscale: IDocument = {
          id: '',
          fichierNouveau: { file },
          description:
            "Attestation fiscale : document récupéré automatiquement grâce à l'API Entreprise.",
          typeId: 'atf',
          date: dateFormat(new Date(), 'yyyy-mm-dd'),
          entreprisesLecture: true,
          publicLecture: false,
          entrepriseId: titreEtape.titulaires![0].id
        }
        const document = await documentCreer(
          { document: attestationFiscale },
          { user: userSuper },
          {} as GraphQLResolveInfo
        )

        await titresEtapesJustificatifsUpsert([
          { documentId: document.id, titreEtapeId: titreEtape.id }
        ])
      } catch (e) {
        console.warn(
          'impossible de récupérer l’attestation fiscale via l’API entreprise',
          e
        )
      }
    }
  }
}

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

    titre = (await titreGet(
      titreId,
      { fields: { demarches: { id: {} } } },
      userSuper
    )) as ITitre

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

    titreEtape = await titreEtapeUpsert(titreEtape, user, titreId)

    await justificatifsByApiEntrepriseGet(titreEtape.id, titre.slug!)

    await titreEtapeUpdateTask(titreEtape.id, titreEtape.titreDemarcheId, user)

    titre = (await titreGet(
      titreId,
      { fields: { demarches: { etapes: { id: {} } } } },
      userSuper
    )) as ITitre

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
