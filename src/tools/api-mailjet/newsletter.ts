import { mailjet } from '../../tools/api-mailjet/index'

interface IContact {
  IsExcludedFromCampaigns: boolean
  Name: string
  CreatedAt: string
  DeliveredCount: number
  Email: string
  ExclusionFromCampaignsUpdatedAt: string
  ID: number
  IsOptInPending: boolean
  IsSpamComplaining: boolean
  LastActivityAt: string
  LastUpdateAt: string
  UnsubscribedAt: string
  UnsubscribedBy: string
}

interface IRecipient {
  ContactID: number
  ID: number
  IsActive: boolean
  IsUnsubscribed: boolean
  ListID: number
  ListName: string
  SubscribedAt: string
  UnsubscribedAt: string
}

interface IContactList {
  ListID: number
  IsUnsub: boolean
  IsActive: boolean
  SubscribedAt: string
}

interface IContactListAdd {
  ListID: number
  Action: string
}

const contactListId = Number(process.env.API_MAILJET_CONTACTS_LIST_ID!)

const recipientsGet = async () => {
  const recipientsResult = await mailjet
    .get('listrecipient', { version: 'v3' })
    .request({ Limit: 1000 })

  return recipientsResult.body.Data as IRecipient[]
}

const contactsGet = async () => {
  const contactsResult = await mailjet
    .get('contact', { version: 'v3' })
    .request({
      Limit: 1000,
      ContactsList: contactListId
    })

  return contactsResult.body.Data as IContact[]
}

const contactGet = async (email: string) => {
  const contactsResult = await mailjet
    .get('contact', { version: 'v3' })
    .id(email)
    .request()

  return contactsResult.body.Data[0] as IContact[]
}

const contactListCheck = async (email: string) => {
  const contactResult = await mailjet
    .get('contact', { version: 'v3' })
    .id(encodeURIComponent(email))
    .action('getcontactslists')
    .request()

  const contactLists = contactResult.body.Data as IContactList[]

  if (!contactLists.length) return false

  return !!contactLists.find(cl => cl.ListID === contactListId)
}

const contactListSubscribe = async (email: string, Action: string) => {
  const contactResult = (await mailjet
    .post('contact', { version: 'v3' })
    .id(encodeURIComponent(email))
    .action('managecontactslists')
    .request({
      ContactsLists: [{ Action, ListID: contactListId }]
    })) as { body: { Data: IContactListAdd[] } }

  const contactListAdded = contactResult.body.Data[0]

  if (contactListAdded) return true

  return false
}

const contactAdd = async (Email: string) => {
  const contactResult = (await mailjet
    .post('contact', { version: 'v3' })
    .request({ Email })) as { body: { Data: IContact[] } }

  return contactResult.body.Data[0]
}

const recipientFind = (contactId: number, recipients: IRecipient[]) =>
  recipients.find(r => r.ListID === contactListId && r.ContactID === contactId)

const newsletterSubscribersFind = async () => {
  try {
    const emails = [] as string[]

    const contacts = await contactsGet()
    const recipients = await recipientsGet()

    contacts.forEach(c => {
      const recipient = recipientFind(c.ID, recipients)

      if (recipient && !recipient.IsUnsubscribed) {
        emails.push(c.Email)
      }
    })

    return emails
  } catch (e: any) {
    throw new Error(e)
  }
}

const newsletterSubscriberCheck = async (email: string) => {
  try {
    // est ce que le contact est inscrit à la liste
    return await contactListCheck(email)
  } catch (e: any) {
    throw new Error(e)
  }
}

const newsletterSubscriberUpdate = async (
  email: string,
  subscribed: boolean
) => {
  try {
    if (subscribed) {
      // est ce que le contact existe
      const contact = await contactGet(email)

      // si non on le créé
      if (!contact) {
        await contactAdd(email)
      }

      // est ce que le contact est inscrit à la liste
      const contactList = await contactListCheck(email)
      if (contactList) return 'email déjà inscrit à la newsletter'

      // si non, on l'inscrit
      await contactListSubscribe(email, 'addforce')

      return 'email inscrit à la newsletter'
    } else {
      // est ce que le contact existe
      const contact = await contactGet(email)

      // si oui,
      if (!contact) return "cet email n'est pas enregistré"

      // est ce que le contact est inscrit à la liste
      const contactList = await contactListCheck(email)
      if (!contactList) return "cet email n'est pas inscrit à la newsletter"

      // si oui, on le désinscrit
      await contactListSubscribe(email, 'unsub')

      return 'email désinscrit à la newsletter'
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export {
  newsletterSubscribersFind,
  newsletterSubscriberUpdate,
  newsletterSubscriberCheck
}
