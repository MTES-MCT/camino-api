import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import { titresFormat } from './_titre-format'
import { utilisateursFormat } from './_utilisateur'

const administrationFormat = (administration, user) => {
  administration.titresTitulaire = titresFormat(
    administration.titresTitulaire,
    user
  )
  administration.titresAmodiataire = titresFormat(
    administration.titresAmodiataire,
    user
  )
  administration.utilisateurs = utilisateursFormat(
    administration.utilisateurs,
    user
  )

  return administration
}

const administrationsFormat = (administrations, user) =>
  administrations.map(administration =>
    administrationFormat(administration, user)
  )

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
