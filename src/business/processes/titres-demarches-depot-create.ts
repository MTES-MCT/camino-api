import { ITitreDemarche, ITitreEntreprise, ITitreEtape } from '../../types'

import { titreEtapeUpsert } from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { userSuper } from '../../database/user-super'
import dateFormat from 'dateformat'
import titreEtapeUpdateTask from '../titre-etape-update'
import { titreEtapeAdministrationsEmailsSend } from '../../api/graphql/resolvers/_titre-etape-email'
import { titreDemarcheDepotDemandeDateFind } from '../rules/titre-demarche-depot-demande-date-find'
import { demarcheDefinitionFind } from '../rules-demarches/definitions'
import { titreUrlGet } from '../utils/urls-get'
import {
  emailsWithTemplateSend,
  IEmail,
  IEmailTemplateId
} from '../../tools/api-mailjet/emails'

const emailConfirmationDepotSend = async (
  emails: string[],
  params: {
    titreTypeNom: string
    titulaireNom: string
    titreUrl: string
    titreNom: string
  }
) => {
  await emailsWithTemplateSend(
    emails,
    'Confirmation du dépôt d’une demande',
    IEmailTemplateId.DEMARCHE_CONFIRMATION_DEPOT,
    {
      ...params,
      emailONF: IEmail.ONF,
      emailDGTM: IEmail.DGTM
    }
  )
}

// envoie un email de confirmation à l’opérateur
const titreEtapeDepotConfirmationEmailsSend = async (
  titreDemarche: ITitreDemarche,
  etape: ITitreEtape,
  titulaires: ITitreEntreprise[]
) => {
  const titreUrl = titreUrlGet(titreDemarche.titreId)
  const titreNom = titreDemarche.titre!.nom
  const titreTypeNom = titreDemarche.titre!.type!.type!.nom

  for (const titulaire of titulaires) {
    const emails = titulaire.utilisateurs
      ?.map(u => u.email)
      .filter(email => !!email) as string[]

    if (emails?.length) {
      await emailConfirmationDepotSend(emails, {
        titreTypeNom,
        titulaireNom: titulaire.nom,
        titreUrl,
        titreNom
      })
    }
  }
}

const titreDemarcheDepotCheck = (titreDemarche: ITitreDemarche) => {
  if (titreDemarche.titre!.typeId === 'arm' && titreDemarche.typeId === 'oct') {
    // Si on a pas de demande faite
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'mfr' && e.statutId === 'fai'
      )
    ) {
      return false
    }

    // Si on a déjà un dépot de la demande
    return !titreDemarche.etapes?.find(e => e.typeId === 'mdp')
  } else if (
    titreDemarche.titre!.typeId === 'axm' &&
    titreDemarche.typeId === 'oct'
  ) {
    // https://cacoo.com/diagrams/Yb0HWsbldfgf7kt1/249D0
    // Si on a pas de demande faite
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'mfr' && e.statutId === 'fai'
      )
    ) {
      return false
    }
    // Si on a pas de décision de la mission d’autorité environnementale exemptée
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'dae' && e.statutId === 'exe'
      )
    ) {
      return false
    }
    // Si on a pas de décision du propriétaire du sol favorable avec ou sans réserve
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'asl' && ['fav', 'fre'].includes(e.statutId)
      )
    ) {
      return false
    }

    // Si on a déjà un dépot de la demande
    return !titreDemarche.etapes?.find(e => e.typeId === 'mdp')
  }

  return false
}

export const titreEtapeDepotCreate = async (titreDemarche: ITitreDemarche) => {
  let titreEtapeDepot = {
    titreDemarcheId: titreDemarche.id,
    typeId: 'mdp',
    statutId: 'fai',
    date: dateFormat(new Date(), 'yyyy-mm-dd')
  } as ITitreEtape

  titreEtapeDepot = await titreEtapeUpsert(
    titreEtapeDepot,
    userSuper,
    titreDemarche.titreId
  )
  await titreEtapeUpdateTask(
    titreEtapeDepot.id,
    titreEtapeDepot.titreDemarcheId,
    userSuper
  )
  await titreEtapeAdministrationsEmailsSend(
    titreEtapeDepot,
    titreEtapeDepot.type!,
    titreDemarche.typeId,
    titreDemarche.titreId,
    titreDemarche.titre!.typeId,
    userSuper
  )

  const titulaires = titreDemarche.titre?.titulaires

  if (titulaires?.length) {
    await titreEtapeDepotConfirmationEmailsSend(
      titreDemarche,
      titreEtapeDepot,
      titulaires
    )
  }
}
export const titresEtapesDepotCreate = async (demarcheId: string) => {
  console.info()
  console.info('dépôt d’une démarche…')

  const titreDemarche = await titreDemarcheGet(
    demarcheId,
    {
      fields: {
        etapes: { id: {} },
        titre: {
          type: { type: { id: {} } },
          titulaires: { utilisateurs: { id: {} } }
        }
      }
    },
    userSuper
  )

  if (!titreDemarche) {
    return false
  }

  const demarcheDefinition = demarcheDefinitionFind(
    titreDemarche.titre!.typeId,
    titreDemarche.typeId,
    titreDemarcheDepotDemandeDateFind(titreDemarche.etapes!)
  )
  // On peut déposer automatiquement seulement les démarches qui possèdent un arbre d’instructions
  if (!demarcheDefinition) return false

  const depotCheck = titreDemarcheDepotCheck(titreDemarche)
  if (depotCheck) {
    await titreEtapeDepotCreate(titreDemarche)
  }

  return depotCheck
}
