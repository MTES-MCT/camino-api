import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { administrationFormat, administrationsFormat } from './_administration'

const administration = async ({ id }, context, info) => {
  const administration = await administrationGet(id, {
    eager: eagerBuild(fieldsBuild(info), 'administration', titreEagerFormat)
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  return administrationFormat(administration, user)
}

const administrations = async ({ noms }, context, info) => {
  const administrations = await administrationsGet(
    { noms },
    {
      eager: eagerBuild(fieldsBuild(info), 'administration', titreEagerFormat)
    }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return administrationsFormat(administrations, user)
}

export { administration, administrations }
