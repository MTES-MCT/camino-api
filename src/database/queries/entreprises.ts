import { raw, QueryBuilder } from 'objection'

import {
  IEntreprise,
  IFields,
  IUtilisateur,
  IEntrepriseColonneId,
  IEntrepriseTitreType
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { stringSplit } from './_utils'

import Entreprises from '../models/entreprises'
import { entreprisesQueryModify } from './permissions/entreprises'
import EntreprisesTitresTypes from '../models/entreprises-titres-types'
import { permissionCheck } from '../../tools/permission'
import { fieldsEntreprisesTitresCreationAdd } from './graph/fields-add'
import { utilisateurGet } from './utilisateurs'
import { titresCreationQuery } from './permissions/metas'

const entreprisesFiltersQueryModify = (
  {
    noms,
    archive
  }: {
    noms?: string | null
    archive?: boolean | null
  },
  q: QueryBuilder<Entreprises, Entreprises[]>
) => {
  if (noms) {
    const nomsArray = stringSplit(noms)

    if (nomsArray) {
      const fields = [
        'entreprises.id',
        'entreprises.nom',
        'etablissements.nom',
        'etablissements.legalSiret'
      ]

      q.leftJoinRelated('etablissements')
      q.groupBy('entreprises.id')

      nomsArray.forEach(s => {
        q.where(b => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
    }
  }

  if (archive !== undefined && archive !== null) {
    q.where('entreprises.archive', archive)
  }
}

const entreprisesQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'entreprises', fieldsFormat)
    : options.entreprises.graph

  const q = Entreprises.query().skipUndefined().withGraphFetched(graph)

  entreprisesQueryModify(q, user)

  return q
}

const entreprisesCount = async (
  {
    noms,
    archive
  }: {
    noms?: string | null
    archive?: boolean | null
  },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

  entreprisesFiltersQueryModify({ noms, archive }, q)
  if (!q) return 0

  const entreprises = (await q) as unknown as { total: number }[]

  return entreprises.length
}

const entrepriseGet = async (
  id: string,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

  return (await q.findById(id)) as IEntreprise
}

const entreprisesGet = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    archive
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IEntrepriseColonneId | null
    noms?: string | null
    archive?: boolean | null
  },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

  entreprisesFiltersQueryModify({ noms, archive }, q)

  if (!q) return []

  // le tri sur la colonne 'siren' s'effectue sur le legal_siren ET le legal_etranger
  if (colonne && colonne === 'siren') {
    q.orderBy(
      raw(`CONCAT(
        "entreprises"."legal_siren",
        "entreprises"."legal_etranger"
      )`),
      ordre || 'asc'
    )
  } else {
    q.orderBy('entreprises.nom', ordre || 'asc')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const entreprisesUpsert = async (entreprises: IEntreprise[]) =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprises, options.entreprises.update)

const entrepriseUpsert = async (entreprise: IEntreprise) =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprise, options.entreprises.update)
    .returning('*')

const entrepriseDelete = async (id: string) =>
  Entreprises.query().deleteById(id).first().returning('*')

const entrepriseTitreTypeUpsert = async (
  entrepriseTitreType: IEntrepriseTitreType
) =>
  EntreprisesTitresTypes.query().upsertGraph(entrepriseTitreType, {
    insertMissing: true
  })

const entrepriseTitreTypeDelete = async (
  entrepriseId: string,
  titreTypeId: string
) => EntreprisesTitresTypes.query().deleteById([entrepriseId, titreTypeId])

const titreDemandeEntreprisesGet = async (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  if (!user) return []

  if (permissionCheck(user?.permissionId, ['super'])) {
    return entreprisesGet({ archive: false }, { fields }, user)
  }

  if (permissionCheck(user?.permissionId, ['admin', 'editeur'])) {
    if (!user.administrations) return []

    const titresCreation = await titresCreationQuery(
      user.administrations?.map(a => a.id)
    ).first()

    if (!titresCreation) return []

    return entreprisesGet({ archive: false }, { fields }, user)
  }

  if (permissionCheck(user?.permissionId, ['entreprise'])) {
    const utilisateur = await utilisateurGet(
      user.id,
      { fields: { entreprises: fieldsEntreprisesTitresCreationAdd(fields) } },
      user
    )

    if (!utilisateur.entreprises) return []

    return utilisateur.entreprises.filter(e =>
      e.titresTypes!.some(tt => tt.titresCreation)
    )
  }

  return []
}

export {
  entrepriseGet,
  entreprisesGet,
  entreprisesCount,
  entreprisesUpsert,
  entrepriseUpsert,
  entrepriseDelete,
  entrepriseTitreTypeUpsert,
  entrepriseTitreTypeDelete,
  titreDemandeEntreprisesGet
}
