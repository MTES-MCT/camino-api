import { stringSplit } from './_utils'
import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import { QueryBuilder } from 'objection'

type ITitreRootName = 'titres' | 'titresDemarches'

const titresFieldsQueryBuild = (
  {
    domainesIds,
    typesIds,
    statutsIds,
    noms,
    entreprises,
    substances,
    references,
    territoires
  }: {
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
    | QueryBuilder<TitresDemarches, TitresDemarches[]>,
  titreTableAlias: string,
  tableRootName: ITitreRootName = 'titres'
) => {
  if (domainesIds) {
    if (titreTableAlias === 'titre') {
      q.leftJoinRelated('titre')
    }

    q.whereIn(`${titreTableAlias}.domaineId`, domainesIds)
  }

  if (typesIds) {
    q.leftJoinRelated(jointureFormat(titreTableAlias, 'type'))

    q.whereIn(fieldFormat(titreTableAlias, 'type.typeId'), typesIds)
  }

  if (statutsIds) {
    if (titreTableAlias === 'titre') {
      q.leftJoinRelated('titre')
    }

    q.whereIn(`${titreTableAlias}.statutId`, statutsIds)
  }

  if (noms) {
    if (titreTableAlias === 'titre') {
      q.leftJoinRelated('titre')
    }

    const nomsArray = stringSplit(noms)

    q.where(b => {
      b.whereRaw(`?? ~* ?`, [
        `${titreTableAlias}.nom`,
        nomsArray.map(n => `(?=.*?(${n}))`).join('')
      ]).orWhereRaw(`?? ~* ?`, [
        `${titreTableAlias}.id`,
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

    if (titreTableAlias === 'titre') {
      fields = fields.map(field => fieldFormat(titreTableAlias, field))
    }

    q.leftJoinRelated(
      jointureFormat(
        titreTableAlias,
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
      .groupBy(`${tableRootName}.id`)
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

    if (titreTableAlias === 'titre') {
      fields = fields.map(field => fieldFormat(titreTableAlias, field))
    }

    q.leftJoinRelated(jointureFormat(titreTableAlias, 'substances.legales'))
      .where(b => {
        substancesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(`${tableRootName}.id`)
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

    if (titreTableAlias === 'titre') {
      fields = fields.map(field => fieldFormat(titreTableAlias, field))
    }

    q.leftJoinRelated(jointureFormat(titreTableAlias, 'references.type'))
      .where(b => {
        referencesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(`${tableRootName}.id`)
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

    if (titreTableAlias === 'titre') {
      fieldsLike = fieldsLike.map(field => fieldFormat(titreTableAlias, field))
    }

    let fieldsExact = [
      'communes:departement:region.paysId',
      'communes.departementId',
      'communes.id'
    ]
    if (titreTableAlias === 'titre') {
      fieldsExact = fieldsExact.map(field =>
        fieldFormat(titreTableAlias, field)
      )
    }

    q.leftJoinRelated(
      jointureFormat(titreTableAlias, 'communes.departement.region')
    )
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

      .groupBy(`${tableRootName}.id`)
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

const jointureFormat = (titreTableAlias: string, jointure: string) =>
  titreTableAlias === 'titre' ? `titre.${jointure}` : jointure

const fieldFormat = (titreTableAlias: string, field: string) =>
  titreTableAlias === 'titre' ? `titre:${field}` : field

export { titresFieldsQueryBuild }
