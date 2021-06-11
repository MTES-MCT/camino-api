import PQueue from 'p-queue'

import {
  utilisateursGet,
  utilisateurUpdate
} from '../../database/queries/utilisateurs'
import { userSuper } from '../../database/user-super'
import { newsletterSubscribersFind } from '../../tools/api-mailjet/newsletter'

const utilisateursNewsletterUpdate = async (utilisateursIds?: string[]) => {
  console.info()
  console.info('utilisateurs inscrits à la newsletter…')
  const queue = new PQueue({ concurrency: 100 })

  const utilisateurs = await utilisateursGet(
    { ids: utilisateursIds },
    { fields: {} },
    userSuper
  )

  const emails = await newsletterSubscribersFind()

  const utilisateursUpdated = [] as string[]

  utilisateurs.forEach(utilisateur => {
    if (
      utilisateur.email &&
      ((emails.includes(utilisateur.email) && !utilisateur.newsletter) ||
        (!emails.includes(utilisateur.email) && utilisateur.newsletter))
    ) {
      const newsletter = !utilisateur.newsletter
      queue.add(async () => {
        await utilisateurUpdate(utilisateur.id, { newsletter })

        const log = {
          type: 'utilisateur : inscrit à la newsletter (mise à jour) ->',
          value: `${utilisateur.id} : ${newsletter}`
        }

        console.info(log.type, log.value)

        utilisateursUpdated.push(utilisateur.id)
      })
    }
  })

  await queue.onIdle()

  return utilisateursUpdated
}

export { utilisateursNewsletterUpdate }
