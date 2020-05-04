import { stringSplit } from './_utils'
import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import { QueryBuilder } from 'objection'

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
  titreTableAlias: string
) => {
  if (domainesIds) {
    if (titreTableAlias === 'titre') q.leftJoinRelated('titre')
    q.whereIn(`${titreTableAlias}.domaineId`, domainesIds)
  }

  if (typesIds) {
    let typeJoin = 'type'
    if (titreTableAlias === 'titre') {
      typeJoin = `titre.${typeJoin}`
    }
    q.leftJoinRelated(typeJoin)
    let typeField = 'type.typeId'
    if (titreTableAlias === 'titre') {
      typeField = `titre:${typeField}`
    }
    q.whereIn(typeField, typesIds)
  }

  if (statutsIds) {
    if (titreTableAlias === 'titre') q.leftJoinRelated('titre')
    q.whereIn(`${titreTableAlias}.statutId`, statutsIds)
  }

  if (noms) {
    if (titreTableAlias === 'titre') q.leftJoinRelated('titre')
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
      fields = fields.map(field => `${titreTableAlias}:${field}`)
    }

    let entreprisesJoin =
      '[titulaires.etablissements, amodiataires.etablissements]'
    if (titreTableAlias === 'titre') {
      entreprisesJoin = `titre.${entreprisesJoin}`
    }
    q.leftJoinRelated(entreprisesJoin)
      .where(b => {
        entreprisesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy(titreTableAlias === 'titre' ? 'titresDemarches.id' : 'titres.id')
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
      fields = fields.map(field => `${titreTableAlias}:${field}`)
    }

    let substancesJoin = 'substances.legales'
    if (titreTableAlias === 'titre') {
      substancesJoin = `titre.${substancesJoin}`
    }
    q.leftJoinRelated(substancesJoin)
      .where(b => {
        substancesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })

      .groupBy(titreTableAlias === 'titre' ? 'titresDemarches.id' : 'titres.id')
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
      fields = fields.map(field => `${titreTableAlias}:${field}`)
    }

    let referencesJoin = 'references.type'
    if (titreTableAlias === 'titre') {
      referencesJoin = `titre.${referencesJoin}`
    }
    q.leftJoinRelated(referencesJoin)
      .where(b => {
        referencesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })

      .groupBy(titreTableAlias === 'titre' ? 'titresDemarches.id' : 'titres.id')
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
      fieldsLike = fieldsLike.map(field => `${titreTableAlias}:${field}`)
    }

    let fieldsExact = [
      'communes:departement:region.paysId',
      'communes.departementId',
      'communes.id'
    ]
    if (titreTableAlias === 'titre') {
      fieldsExact = fieldsExact.map(field => `${titreTableAlias}:${field}`)
    }

    let communesJoin = 'communes.departement.region'
    if (titreTableAlias === 'titre') {
      communesJoin = `titre.${communesJoin}`
    }
    q.leftJoinRelated(communesJoin)
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

      .groupBy(titreTableAlias === 'titre' ? 'titresDemarches.id' : 'titres.id')
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

export { titresFieldsQueryBuild }
