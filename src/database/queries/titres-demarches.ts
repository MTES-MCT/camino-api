import {
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneInput,
  IColonne,
  IFields,
  Index,
  IUtilisateur
} from '../../types'
import { transaction, Transaction, QueryBuilder, raw } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import { utilisateurGet } from './utilisateurs'
import options from './_options'
import graphFormat from './graph/format'
import graphBuild from './graph/build'
import { fieldTitreAdd } from './graph/fields-add'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  utilisateur?: IUtilisateur
) => {
  if (utilisateur?.permissionId === 'super') {
    return q
  }

  q.select('titresDemarches.*')

  q.leftJoinRelated(
    'titre.[type.autorisationsTitresStatuts, domaine.autorisation]'
  )

  if (!utilisateur) {
    // visibilité des etapes en utilisateur public
    q.modifyGraph('etapes', b => {
      b.leftJoinRelated('type.autorisations')
      b.where('type:autorisations.publicLecture', true)
    })
  } else {
    if (utilisateur.permissionId === 'entreprise') {
      // titulaires et amodiataires
      q.leftJoinRelated('titre.[titulaires, amodiataires]')

      // visibilité des etapes en tant que titulaire
      q.modifyGraph('etapes', b => {
        b.leftJoinRelated('type.autorisations')
        b.where('type:autorisations.entreprisesLecture', true)
      })
    } else if (
      ['admin', 'editeur', 'lecteur'].includes(utilisateur.permissionId)
    ) {
      // visibilité des étapes en tant qu'administrations
      q.modifyGraph('etapes', b => {
        const administrationsIds =
          utilisateur.administrations?.map(a => a.id) || []

        // si l'utilisateur admin n'appartient à aucune administration
        // alors il ne peut pas voir les étapes faisant l'objet de restriction
        // peut importe l'administration
        if (!administrationsIds.length) {
          b.leftJoinRelated(
            '[type.restrictionsTitresTypesAdministrations, demarche.titre]'
          )

          b.whereNot({
            'type:restrictionsTitresTypesAdministrations.lectureInterdit': true
          }).andWhereRaw('?? = ??', [
            'type:restrictionsTitresTypesAdministrations.titreTypeId',
            'demarche:titre.typeId'
          ])
        } else {
          b.leftJoinRelated('demarche.titre')

          b.leftJoin(
            'administrations',
            raw('?? IN (?)', ['administrations.id', administrationsIds])
          )
          b.leftJoin(
            'r__titresTypes__etapesTypes__administrations as type:restrictionsTitresTypesAdministrations',
            raw('?? = ?? AND ?? = ?? AND ?? = ??', [
              'titresEtapes.typeId',
              'type:restrictionsTitresTypesAdministrations.etapeTypeId',
              'type:restrictionsTitresTypesAdministrations.administrationId',
              'administrations.id',
              'type:restrictionsTitresTypesAdministrations.titreTypeId',
              'demarche:titre.typeId'
            ])
          )

          b.whereRaw('?? is not true', [
            'type:restrictionsTitresTypesAdministrations.lectureInterdit'
          ])
        }
      })
    }
  }

  // démarches des titres publics et entreprises
  if (
    !utilisateur ||
    ['defaut', 'entreprise'].includes(utilisateur.permissionId)
  ) {
    // démarches des titres publics
    q.andWhere(b => {
      b.where({
        'titre:domaine:autorisation.publicLecture': true,
        'titre:type:autorisationsTitresStatuts.publicLecture': true
      }).andWhereRaw('?? = ??', [
        'titre:type:autorisationsTitresStatuts.titreStatutId',
        'titre.statutId'
      ])

      // si l'utilisateur est `entreprise`,
      // démarches des titres dont il est titulaire ou amodiataire
      if (utilisateur?.permissionId === 'entreprise') {
        const entreprisesIds = utilisateur.entreprises?.map(e => e.id)

        if (entreprisesIds) {
          b.orWhereIn('titre:titulaires.id', entreprisesIds)
          b.orWhereIn('titre:amodiataires.id', entreprisesIds)
        }
      }
    })
  }

  return q
}

const titresDemarchesQueryBuild = (
  {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  fields: IFields,
  userId?: string
) => {
  fields = fieldTitreAdd(fields)
  const graph = graphBuild(fields, 'titre', graphFormat)

  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)

  titreDemarchePermissionQueryBuild(q, userId)

  q.groupBy('titresDemarches.id')

  if (typesIds) {
    q.whereIn('titresDemarches.typeId', typesIds)
  }

  if (statutsIds) {
    q.whereIn('titresDemarches.statutId', statutsIds)
  }

  if (titresDomainesIds) {
    q.joinRelated('titre').whereIn('titre.domaineId', titresDomainesIds)
  }

  if (titresTypesIds) {
    q.joinRelated('titre.type').whereIn('titre:type.typeId', titresTypesIds)
  }

  if (titresStatutsIds) {
    q.joinRelated('titre').whereIn('titre.statutId', titresStatutsIds)
  }

  if (etapesInclues?.length || etapesExclues?.length) {
    q.joinRelated('etapes').groupBy('titresDemarches.id')

    if (etapesInclues?.length) {
      const raw = etapesInclues
        .map(({ statutId, dateDebut, dateFin }) => {
          const statutCond = statutId ? 'and etapes.statut_id = ?' : ''
          const dateDebutCond = dateDebut ? 'and etapes.date >= ?' : ''
          const dateFinCond = dateFin ? 'and etapes.date <= ?' : ''

          return `count(*) filter (where etapes.type_id = ? ${statutCond} ${dateDebutCond} ${dateFinCond}) > 0`
        })
        .join(') and (')

      q.havingRaw(
        `(${raw})`,
        etapesInclues.flatMap(({ typeId, statutId, dateDebut, dateFin }) => {
          const values = [typeId]

          if (statutId) {
            values.push(statutId)
          }
          if (dateDebut) {
            values.push(dateDebut)
          }
          if (dateFin) {
            values.push(dateFin)
          }

          return values
        })
      )
    }

    if (etapesExclues?.length) {
      const raw = etapesExclues.map(({ statutId }) => {
        const statutCond = statutId ? 'and etapes.statut_id = ?' : ''

        return `count(*) filter (where etapes.type_id = ? ${statutCond}) = 0`
      })

      q.havingRaw(
        `(${raw})`,
        etapesExclues.flatMap(({ typeId, statutId }) => {
          const values = [typeId]

          if (statutId) {
            values.push(statutId)
          }

          return values
        })
      )
    }
  }

  return q
}

const titresDemarchesCount = async (
  {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  { fields }: { fields: IFields },
  userId?: string
) => {
  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      etapesInclues,
      etapesExclues
    },
    fields,
    userId
  )

  const titresDemarches = ((await q) as unknown) as { total: number }[]

  return titresDemarches.length
}

const titresDemarchesColonnes = {
  titreNom: { id: 'titre.nom', relation: 'titre' },
  titreDomaine: { id: 'titre.domaineId', relation: 'titre' },
  titreType: { id: 'titre:type:type.nom', relation: 'titre.type.type' },
  titreStatut: { id: 'titre.statutId', relation: 'titre' },
  type: { id: 'typeId' },
  statut: { id: 'statutId' }
} as Index<IColonne>

const titresDemarchesGet = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreDemarcheColonneInput | null
    ordre?: 'asc' | 'desc' | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  { fields }: { fields: IFields },
  userId?: string
) => {
  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      etapesInclues,
      etapesExclues
    },
    fields,
    userId
  )

  if (colonne) {
    if (titresDemarchesColonnes[colonne].relation) {
      q.leftJoinRelated(titresDemarchesColonnes[colonne].relation!).groupBy(
        titresDemarchesColonnes[colonne].id!
      )
    }
    q.orderBy(titresDemarchesColonnes[colonne].id, ordre || undefined)
  } else {
    q.orderBy('titresDemarches.ordre')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const titreDemarcheGet = async (
  titreDemarcheId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  let utilisateur

  if (userId) {
    utilisateur =
      userId === 'super'
        ? (({ permissionId: 'super' } as unknown) as IUtilisateur)
        : await utilisateurGet(userId)
  }

  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'titre', graphFormat)
    : options.demarches.graph

  const q = TitresDemarches.query()
    .withGraphFetched(graph)
    .findById(titreDemarcheId)

  titreDemarchePermissionQueryBuild(q, utilisateur)

  q.groupBy('titresDemarches.id')

  return q
}

const titreDemarcheCreate = async (titreDemarche: ITitreDemarche) =>
  TitresDemarches.query()
    .insertAndFetch(titreDemarche)
    .withGraphFetched(options.demarches.graph)

const titreDemarcheDelete = async (id: string, trx?: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  props: Partial<ITitreDemarche>
) =>
  TitresDemarches.query()
    .withGraphFetched(options.demarches.graph)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (
  titreDemarche: ITitreDemarche,
  trx: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.demarches.update)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarchesIdsUpdate = async (
  titresDemarchesIdsOld: string[],
  titresDemarchesNew: ITitreDemarche[]
) => {
  const knex = TitresDemarches.knex()

  return transaction(knex, async tr => {
    await Promise.all(
      titresDemarchesIdsOld.map(titreDemarcheId =>
        titreDemarcheDelete(titreDemarcheId, tr)
      )
    )
    await Promise.all(
      titresDemarchesNew.map(titreDemarche =>
        titreDemarcheUpsert(titreDemarche, tr)
      )
    )
  })
}

export {
  titresDemarchesGet,
  titresDemarchesCount,
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheUpsert,
  titreDemarcheDelete,
  titreDemarchesIdsUpdate
}
