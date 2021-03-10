import 'dotenv/config'
import { writeFileSync } from 'fs'
import knex from '../init'
import * as makeDir from 'make-dir'
import { ICoordonnees } from '../types'
// import { IFields } from '../types'

// TODO : remplacer par 'sources'
const repSources = 'sourcesJson'

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

// Liste des noms des tables à sauvegarder au format json
const tablesNames = [
  'activites_statuts',
  'activites_types',
  // 'activites_types__administrations', // old
  'activites_types__documents_types',
  'activites_types__pays',
  'administrations',
  'administrations__activites_types', // new
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
  'titres_activites',
  'titres_statuts',
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
const tablesTitresNames = [
  'titres',
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
  'titres_substances',
  'titres_titulaires'
]

const jsonSourceFilesExport = async () => {
  await makeDir(`./${repSources}`)

  for (const tableName of tablesNames) {
    const jsonFileName = `${tableName.replace(/_/g, '-')}.json`
    const filePath = `${repSources}/${jsonFileName}`

    const res = await knex.from(tableName)

    if (res) {
      writeFileSync(filePath, JSON.stringify(res))
    }
  }

  for (const domaineId of domainesIds) {
    for (const tableName of tablesTitresNames) {
      const jsonFileName = `titres-${domaineId}-${tableName.replace(
        /_/g,
        '-'
      )}.json`
      const filePath = `${repSources}/${jsonFileName}`

      let res

      if (tableName === 'titres') {
        res = await knex
          .select(
            'id',
            'nom',
            'typeId',
            'domaineId',
            'statutId',
            'date_debut',
            'date_fin',
            'date_demande',
            'coordonnees',
            'public_lecture',
            'entreprises_lecture'
          )
          .from(tableName)
          .where({ domaineId })
        res = formatElements(res)
      } else {
        res = await knex.from(tableName)
      }

      if (res) {
        writeFileSync(filePath, JSON.stringify(res))
      }
    }
  }

  process.exit(0)
}

interface IFields {
  [key: string]: IFields | string
}

const formatElements = (elements: IFields[]) =>
  elements.map(e => formatElement(e))

const formatElement = (element: IFields) =>
  Object.keys(element).reduce((acc: IFields, k: string) => {
    if (element[k]) {
      acc[camelToSnakeCase(k) as string] = formatField(element, k)
    }

    return acc
  }, {})

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

const main = () => jsonSourceFilesExport()

main()

export default jsonSourceFilesExport
