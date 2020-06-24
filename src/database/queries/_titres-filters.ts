import { stringSplit } from './_utils'
import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresActivites from '../models/titres-activites'
import { QueryBuilder } from 'objection'

type ITitreTableName = 'titres' | 'titre'
type ITitreRootName = 'titres' | 'titresDemarches' | 'titresActivites'

const jointureFormat = (name: string, jointure: string) =>
  name === 'titre' ? `titre.${jointure}` : jointure

const fieldFormat = (name: string, field: string) =>
  name === 'titre' ? `titre:${field}` : field

// name: nom de la table ou de la relation sur laquelle s'effectue la requête
// - 'titres' depuis la table 'titres'
// - 'titre' depuis la table 'titresDemarches'
// root: nom de la table de base
const titresFiltersQueryBuild = (
  {
    perimetre,
    domainesIds,
    typesIds,
    statutsIds,
    noms,
    entreprises,
    substances,
    references,
    territoires
  }: {
    perimetre?: number[] | null
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    noms?: string | null
    entreprises?: string | null
    substances?: string | null
    references?: string | null
    territoires?: string | null
  } = {},
  q:
    | QueryBuilder<Titres, Titres[]>
    | QueryBuilder<TitresDemarches, TitresDemarches[]>
    | QueryBuilder<TitresActivites, TitresActivites[]>,
  name: ITitreTableName = 'titres',
  root: ITitreRootName = 'titres'
) => {
  if (perimetre?.length) {
    q.leftJoinRelated(jointureFormat(name, 'points'))
    q.whereRaw(
      `('(' || ? || ',' || ? || '),(' || ? || ',' || ? || ')')::box @> ?? `,
      [...perimetre, 'points.coordonnees']
    )
    q.groupBy('titres.id')
  }

  if (domainesIds) {
    if (name === 'titre') {
      q.leftJoinRelated('titre')
    }

    q.whereIn(`${name}.domaineId`, domainesIds)
  }

  if (typesIds) {
    q.leftJoinRelated(jointureFormat(name, 'type'))

    q.whereIn(fieldFormat(name, 'type.typeId'), typesIds)
  }

  if (statutsIds) {
    if (name === 'titre') {
      q.leftJoinRelated('titre')
    }

    q.whereIn(`${name}.statutId`, statutsIds)
  }

  if (noms) {
    if (name === 'titre') {
      q.leftJoinRelated('titre')
    }

    const nomsArray = stringSplit(noms)

    q.where(b => {
      b.whereRaw(`?? ~* ?`, [
        `${name}.nom`,
        nomsArray.map(n => `(?=.*?(${n}))`).join('')
      ]).orWhereRaw(`?? ~* ?`, [
        `${name}.id`,
        nomsArray.map(n => `(?=.*?(${n}))`).join('')
      ])
    })
  }

  if (entreprises) {
    const entreprisesArray = stringSplit(entreprises)

    let fields = [
      'titulaires:etablissements.nom',
      'titulaires.nom',
      'titulaires.id',
      'amodiataires:etablissements.nom',
      'amodiataires.nom',
      'amodiataires.id'
    ]

    if (name === 'titre') {
      fields = fields.map(field => fieldFormat(name, field))
    }

    q.leftJoinRelated(
      jointureFormat(
        name,
        '[titulaires.etablissements, amodiataires.etablissements]'
      )
    )
      .where(b => {
        entreprisesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(`${root}.id`)
      .havingRaw(
        `(${entreprisesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        entreprisesArray.flatMap(e =>
          fields.flatMap(f => [f, `%${e.toLowerCase()}%`])
        )
      )
  }

  if (substances) {
    const substancesArray = stringSplit(substances)

    let fields = [
      'substances.nom',
      'substances.id',
      'substances:legales.nom',
      'substances:legales.id'
    ]

    if (name === 'titre') {
      fields = fields.map(field => fieldFormat(name, field))
    }

    q.leftJoinRelated(jointureFormat(name, 'substances.legales'))
      .where(b => {
        substancesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(`${root}.id`)
      .havingRaw(
        `(${substancesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        substancesArray.flatMap(s =>
          fields.flatMap(f => [f, `%${s.toLowerCase()}%`])
        )
      )
  }

  if (references) {
    const referencesArray = stringSplit(references)

    let fields = ['references.nom', 'references:type.nom']

    if (name === 'titre') {
      fields = fields.map(field => fieldFormat(name, field))
    }

    q.leftJoinRelated(jointureFormat(name, 'references.type'))
      .where(b => {
        referencesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(`${root}.id`)
      .havingRaw(
        `(${referencesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        referencesArray.flatMap(r =>
          fields.flatMap(f => [f, `%${r.toLowerCase()}%`])
        )
      )
  }

  if (territoires) {
    const territoiresArray = stringSplit(territoires)

    let fieldsLike = [
      'communes:departement:region.nom',
      'communes:departement.nom',
      'communes.nom'
    ]

    if (name === 'titre') {
      fieldsLike = fieldsLike.map(field => fieldFormat(name, field))
    }

    let fieldsExact = [
      'communes:departement:region.paysId',
      'communes.departementId',
      'communes.id'
    ]
    if (name === 'titre') {
      fieldsExact = fieldsExact.map(field => fieldFormat(name, field))
    }

    q.leftJoinRelated(jointureFormat(name, 'communes.departement.region'))
      .where(b => {
        territoiresArray.forEach(t => {
          fieldsLike.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${t.toLowerCase()}%`])
          })

          fieldsExact.forEach(f => {
            b.orWhereRaw(`?? = ?`, [f, t])
          })
        })
      })

      .groupBy(`${root}.id`)
      .havingRaw(
        `(${territoiresArray
          .map(
            () =>
              'count(*) filter (where ' +
              [
                ...fieldsLike.map(() => 'lower(??) like ?'),
                ...fieldsExact.map(() => `lower(??) = ?`)
              ].join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        territoiresArray.flatMap(t => [
          ...fieldsLike.flatMap(f => [f, `%${t.toLowerCase()}%`]),
          ...fieldsExact.flatMap(f => [f, t.toLowerCase()])
        ])
      )
  }
}

export { titresFiltersQueryBuild }
