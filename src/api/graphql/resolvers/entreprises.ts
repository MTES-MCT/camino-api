import { IEntreprise, IEntrepriseColonneId, IToken } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'

import { debug } from '../../../config/index'
import {
  entrepriseGet,
  entreprisesCount,
  entreprisesGet,
  entrepriseUpsert
} from '../../../database/queries/entreprises'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreGet } from '../../../database/queries/titres'

import fieldsBuild from './_fields-build'

import { entrepriseFormat } from '../../_format/entreprises'
import { permissionCheck } from '../../../tools/permission'
import { emailCheck } from '../../../tools/email-check'
import { entrepriseAndEtablissementsGet } from '../../../tools/api-insee/index'

import titreEtapePropFind from '../../../business/rules/titre-etape-prop-find'

const entreprise = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const entreprise = await entrepriseGet(id, { fields }, context.user?.id)

    if (!entreprise) return null

    const user = context.user && (await userGet(context.user.id))

    return entrepriseFormat(user, entreprise)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeEntreprises = async (
  { etapeId }: { etapeId: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user.permissionId, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    const titreEtape = await titreEtapeGet(
      etapeId,
      { fields: { id: {} } },
      'super'
    )
    if (!titreEtape) throw new Error("l'étape n'existe pas")

    const titreDemarche = await titreDemarcheGet(
      titreEtape.titreDemarcheId,
      { fields: { etapes: { id: {} } } },
      'super'
    )

    if (!titreDemarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      titreDemarche.titreId,
      {
        fields: {
          demarches: {
            etapes: {
              titulaires: fields.elements,
              amodiataires: fields.elements
            }
          }
        }
      },
      'super'
    )

    if (!titre) throw new Error("le titre n'existe pas")

    let entreprises = [] as IEntreprise[]

    if (titreDemarche.etapes) {
      const titulaires =
        (titreEtapePropFind(
          'titulaires',
          titreEtape,
          titreDemarche.etapes,
          titre
        ) as IEntreprise[] | null) || []

      const amodiataires =
        (titreEtapePropFind(
          'amodiataires',
          titreEtape,
          titreDemarche.etapes,
          titre
        ) as IEntreprise[] | null) || []

      entreprises = [...titulaires, ...amodiataires]
    }

    return {
      elements: entreprises,
      total: entreprises.length
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entreprises = async (
  {
    etapeId,
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    archive
  }: {
    etapeId?: string | null
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IEntrepriseColonneId | null
    noms?: string | null
    archive?: boolean | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  if (etapeId) {
    return etapeEntreprises({ etapeId }, context, info)
  }

  try {
    const fields = fieldsBuild(info)

    const [entreprises, total] = await Promise.all([
      entreprisesGet(
        {
          page,
          intervalle,
          ordre,
          colonne,
          noms,
          archive
        },
        { fields: fields.elements },
        context.user?.id
      ),
      entreprisesCount(
        { noms, archive },
        { fields: { id: {} } },
        context.user?.id
      )
    ])

    if (!entreprises.length) return { elements: [], total: 0 }

    const user = context.user && (await userGet(context.user.id))

    return {
      elements: entreprises.map(e => entrepriseFormat(user, e)),
      page,
      intervalle,
      ordre,
      colonne,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entrepriseCreer = async (
  { entreprise }: { entreprise: { legalSiren: string; paysId: string } },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.paysId !== 'fr') {
      errors.push('impossible de créer une entreprise étrangère')
    }

    const fields = fieldsBuild(info)

    const entrepriseOld = await entrepriseGet(
      `${entreprise.paysId}-${entreprise.legalSiren}`,
      { fields },
      context.user?.id
    )

    if (entrepriseOld) {
      errors.push(`l'entreprise ${entrepriseOld.nom} existe déjà dans Camino`)
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseInsee = await entrepriseAndEtablissementsGet(
      entreprise.legalSiren!
    )

    if (!entrepriseInsee) {
      throw new Error('numéro de siren non reconnu dans la base Insee')
    }

    const entrepriseNew = await entrepriseUpsert(entrepriseInsee)

    return entrepriseNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const entrepriseModifier = async (
  {
    entreprise
  }: {
    entreprise: { id: string; url?: string; telephone?: string; email?: string }
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const errors = []

    if (entreprise.email && !emailCheck(entreprise.email)) {
      errors.push('adresse email invalide')
    }

    const fields = fieldsBuild(info)
    const entrepriseOld = await entrepriseGet(
      entreprise.id,
      { fields },
      context.user?.id
    )
    if (!entrepriseOld) {
      errors.push('entreprise inconnue')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    const entrepriseUpserted = await entrepriseUpsert({
      ...entrepriseOld,
      ...entreprise
    })

    return entrepriseGet(entrepriseUpserted.id, { fields }, context.user?.id)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { entreprise, entreprises, entrepriseCreer, entrepriseModifier }
