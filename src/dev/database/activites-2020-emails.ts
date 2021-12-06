import '../../init'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { userSuper } from '../../database/user-super'
import { dupRemove } from '../../tools'
import { IAdministration } from '../../types'
import { emailsSend } from '../../tools/api-mailjet/emails'

async function main() {
  const activites = await titresActivitesGet(
    { statutsIds: ['dep'], annees: [2020] },
    {
      fields: {
        titre: {
          administrationsGestionnaires: { activitesTypesEmails: { id: {} } },
          administrationsLocales: { activitesTypesEmails: { id: {} } }
        }
      }
    },
    userSuper
  )

  const emailsToNotify = activites.reduce((acc, activite) => {
    const titre = activite.titre!

    const administrations = dupRemove('id', [
      ...(titre.administrationsGestionnaires || []),
      ...(titre.administrationsLocales || [])
    ]) as IAdministration[]

    const emails = administrations
      .flatMap(a => a.activitesTypesEmails)
      .filter(ate => ate && ate.id === activite.typeId)
      .map(ate => ate!.email)
      .filter(
        email =>
          ![
            'mc.remd.deal-guyane@developpement-durable.gouv.fr',
            'cecile.caron@developpement-durable.gouv.fr'
          ].includes(email)
      )

    emails.forEach(email => {
      if (!acc[email]) {
        acc[email] = false
      }
      acc[email] = acc[email] || titre.domaineId === 'm'
    })

    return acc
  }, {} as { [email: string]: boolean })

  for (let i = 0; i < Object.keys(emailsToNotify).length; i++) {
    const email = Object.keys(emailsToNotify)[i]
    let content = `
    Chaque année, les opérateurs miniers titulaires d'autorisation d'exploitation, de concession ou de permis d'exploitation doivent adresser à l'administration un rapport comportant les conditions techniques et économiques de l'exploitation, le programme de travaux, et les résultats des mesures de suivi prescrites.
    Cette année, les rapports d'exploitation de 2020, pour les titres relatifs aux minéraux, métaux et granulats marins ont été transmis par les exploitants, sous format dématérialisé (pdf) sur la plateforme Camino (Cadastre Minier Numérique Ouvert).
    <br/>
    <br/>
    Ces rapports ne vous seront pas transmis par courrier ou par mél cette année. Pour télécharger les pièces, nous vous invitons à créer un compte en ligne sur <a href="https://camino.beta.gouv.fr">Camino</a> (connexion / créer un compte).
    <br/>
    <br/>
    Après vous avoir attribué les droits spécifiques aux services administratifs, vous aurez accès à tous les rapports d'exploitation de votre région en suivant ce <a href="https://camino.beta.gouv.fr/activites?page=1&intervalle=200&ordre=asc&annees=2020">lien</a>.
    `

    // Si c’est un titre m
    if (emailsToNotify[email]) {
      content += `
      <br/>
      <br/>
      Pour les titres miniers "métaux et minéraux" (ne sont pas concernés les titres "granulats marins" ), nous vous rappelons, qu'en application de :
      <br/>
      <br/>
      - l'article L.172-1 du code minier, le rapport d'exploitation doit être communiqué aux collectivités territoriales concernées ;
      <br/>
      <br/>
      - l’article 35 du décret n°2006-649 du 2 juin 2006, une copie de ce rapport doit être adressée aux services intéressés, aux maires des communes sur le territoire desquelles les travaux d’exploitation ont été réalisés ainsi qu’aux maires des communes où sont situés les exutoires et les points de pompage des eaux d’exhaure.
      <br/> 
      <br/> 
      Si vous ne souhaitez pas transmettre ce rapport par voie postale ou mél, vous pouvez inviter l'administration concernée à se créer un compte sur Camino d'où l'agent pourra télécharger le rapport annuel.
          `
    }

    await emailsSend([email], 'Activités déposées 2020', content)
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
