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

import fieldsBuild from './_fields-build'

import { entrepriseFormat } from '../../_format/entreprises'
import { permissionCheck } from '../../../tools/permission'
import { emailCheck } from '../../../tools/email-check'
import { apiInseeEntrepriseAndEtablissementsGet } from '../../../tools/api-insee/index'

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
  try {
    const fields = fieldsBuild(info)

    let entreprises = [] as IEntreprise[]
    let total = 0

    ;[entreprises, total] = await Promise.all([
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

    if (etapeId) {
      const titreEtape = await titreEtapeGet(etapeId, {
        fields: { titulaires: fields.elements, amodiataires: fields.elements }
      })

      if (titreEtape.titulaires?.length) {
        titreEtape.titulaires.forEach(t => {
          if (!entreprises.find(e => e.id === t.id)) {
            entreprises.push(t)
            total++
          }
        })
      }

      if (titreEtape.amodiataires?.length) {
        titreEtape.amodiataires.forEach(a => {
          if (!entreprises.find(e => e.id === a.id)) {
            entreprises.push(a)
            total++
          }
        })
      }
    }

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

    const entrepriseInsee = await apiInseeEntrepriseAndEtablissementsGet(
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
