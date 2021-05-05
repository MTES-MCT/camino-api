import { GraphQLResolveInfo } from 'graphql'

import { IToken, ITitreDemande } from '../../../types'
import { debug } from '../../../config/index'
import { userGet } from '../../../database/queries/utilisateurs'
import { fieldsBuild } from './_fields-build'
import { titreDemandeEntreprisesGet } from '../../../database/queries/entreprises'

const titreDemandeCreer = async (
  titreDemande: ITitreDemande,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const fields = fieldsBuild(info)

    const entreprises = await titreDemandeEntreprisesGet({ fields }, user)

    const entreprise = entreprises.find(e => e.id === titreDemande.entrepriseId)

    if (!entreprise) {
      throw new Error('permissions insuffisantes')
    }

    const titreType = entreprise.titresTypes.find(
      tt => tt.id === titreDemande.titreTypeId
    )

    if (!titreType) {
      throw new Error('permissions insuffisantes')
    }

    // créer un titre
    // créer une démarche d'octroi
    // si arm, on peut choisir le type d'étape mfr ou mfm
    // sinon mfr
    // étape en construction statutId = aco
    // étape à la date du jour
    // ajoute l'entrepriseId en titulaire
    // (envoi un email avec l'url)

    return {
      titreId: 'titreId',
      titreEtapeId: 'titreEtapeId'
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemandeCreer }
