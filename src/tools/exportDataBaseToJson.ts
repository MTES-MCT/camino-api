import 'dotenv/config'
import { rmdir, writeFileSync } from 'fs'
import knex from '../init'
import * as makeDir from 'make-dir'
import { ICoordonnees } from '../types'

const repSources = 'sources'

// Liste des noms des tables à sauvegarder au format json
const tablesNames = [
  'activites_statuts',
  'activites_types',
  'activites_types__documents_types',
  'activites_types__pays',
  'administrations',
  'administrations__activites_types',
  'administrations__titres_types',
  'administrations__titres_types__etapes_types',
  'administrations__titres_types__titres_statuts',
  'administrations_types',
  'annees',
  'caches',
  'communes',
  'definitions',
  'demarches_statuts',
  'demarches_types',
  'departements',
  'devises',
  'documents',
  'documents_types',
  'domaines',
  'entreprises',
  'entreprises_etablissements',
  'etapes_statuts',
  'etapes_types',
  'etapes_types__etapes_statuts',
  'forets',
  'frequences',
  'geo_systemes',
  'globales',
  'knex_migrations',
  'knex_migrations_lock',
  'mois',
  'pays',
  'permissions',
  'phases_statuts',
  'references_types',
  'regions',
  'substances',
  'substances__substances_legales',
  'substances_fiscales',
  'substances_legales',
  'substances_legales_codes',
  'titres',
  'titres_activites',
  'titres_administrations_gestionnaires',
  'titres_administrations_locales',
  'titres_amodiataires',
  'titres_communes',
  'titres_demarches',
  'titres_demarches_liens',
  'titres_etapes',
  'titres_etapes_justificatifs',
  'titres_forets',
  'titres_phases',
  'titres_points',
  'titres_points_references',
  'titres_references',
  'titres_statuts',
  'titres_substances',
  'titres_titulaires',
  'titres_travaux',
  'titres_travaux_etapes',
  'titres_types',
  'titres_types__activites_types',
  'titres_types__demarches_types',
  'titres_types__demarches_types__etapes_types',
  'titres_types__titres_statuts',
  'titres_types_types',
  'travaux_types',
  'travaux_types__etapes_types',
  'trimestres',
  'unites',
  'utilisateurs',
  'utilisateurs__administrations',
  'utilisateurs__entreprises'
]

const databaseToJsonExport = async () => {
  const dir = `./${repSources}`

  await rmdir(dir, { recursive: true }, err => {
    if (err) {
      throw err
    }
    makeDir(dir)
  })

  for (const tableName of tablesNames) {
    const jsonFileName = `${tableName.replace(/_/g, '-')}.json`
    const filePath = `${repSources}/${jsonFileName}`

    const res = format(await knex.from(tableName))

    if (res) {
      writeFileSync(filePath, JSON.stringify(res))
    }
  }

  process.exit(0)
}

interface IFields {
  [key: string]: IFields | string
}

const format = (elements: IFields[]) =>
  elements.map(e =>
    Object.keys(e).reduce((acc: IFields, k: string) => {
      if (e[k]) {
        acc[camelToSnakeCase(k) as string] = formatField(e, k)
      }

      return acc
    }, {})
  )

const formatField = (field: IFields, key: string) => {
  if (key === 'coordonnees') {
    const coordonnees = (field[key] as unknown) as ICoordonnees

    return `${coordonnees.x},${coordonnees.y}`
  }
  if (typeof field[key] === 'boolean') {
    return String(field[key])
  }

  return field[key]
}

const camelToSnakeCase = (field: string) =>
  (field.match(/([A-Z])/g) || []).reduce(
    (acc, m) => (acc = acc.replace(m, `_${m.toLowerCase()}`)),
    field
  )

const main = () => databaseToJsonExport()

main()

export default databaseToJsonExport
