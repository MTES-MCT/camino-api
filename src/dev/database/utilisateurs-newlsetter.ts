import '../../init'
import { knex } from '../../knex'
import { mailjet } from '../../tools/api-mailjet/index'

import {
  utilisateursGet,
  utilisateurUpdate
} from '../../database/queries/utilisateurs'
import { userSuper } from '../../database/user-super'

const main = async () => {
  // await knex.schema.alterTable('utilisateurs', table => {
  //   table.boolean('newsletter')
  // })

  try {
    const utilisateurs = await utilisateursGet({}, {}, userSuper)

    const contactsRequest = mailjet.get('contact', { version: 'v3' }).request({
      Limit: 1000,
      ContactsList: Number(process.env.API_MAILJET_CONTACTS_LIST_ID!)
    })

    const contactsResult = await contactsRequest
    const contacts = contactsResult.body.Data as {
      CreatedAt: string
      DeliveredCount: number
      Email: string
      ExclusionFromCampaignsUpdatedAt: string
      ID: number
      IsExcludedFromCampaigns: boolean
      IsOptInPending: boolean
      IsSpamComplaining: boolean
      LastActivityAt: string
      LastUpdateAt: string
      Name: string
      UnsubscribedAt: string
      UnsubscribedBy: string
    }[]

    const recipientsRequest = mailjet
      .get('listrecipient', { version: 'v3' })
      .request({ Limit: 1000 })

    const recipientsResult = await recipientsRequest
    const recipients = recipientsResult.body.Data as {
      ContactID: number
      ID: number
      IsActive: boolean
      IsUnsubscribed: boolean
      ListID: number
      ListName: string
      SubscribedAt: string
      UnsubscribedAt: string
    }[]

    console.log(
      recipients.filter(
        r => r.ListID === Number(process.env.API_MAILJET_CONTACTS_LIST_ID)
      ).length
    )

    for (const s of contacts) {
      const recipient = recipients.find(
        r =>
          r.ListID === Number(process.env.API_MAILJET_CONTACTS_LIST_ID) &&
          r.ContactID === s.ID
      )
      if (s.Email === 'vanessa.michoud@novacap.eu') {
        console.log(recipient)
      }
      const utilisateur = utilisateurs.find(u => u.email === s.Email!)
      if (utilisateur) {
        const newsletter = !recipient!.IsUnsubscribed
        await utilisateurUpdate(utilisateur.id, { newsletter })
        console.info(utilisateur.email, newsletter)
      }
    }
  } catch (e) {
    console.log(e)
  }

  process.exit(0)
}

main()
