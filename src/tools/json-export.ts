import { writeFileSync } from 'fs'
import { Pool } from 'pg'

// module pg
const pool = new Pool({
  user: 'postgres'
})

// TODO : remplacer par 'sources'
const repSources = 'sourcesJson'

// Liste des noms des tables à sauvegarder au format json
const tablesNames = [
  'activites_statuts',
  'activites_types__administrations',
  'activites_types__documents_types',
  'activites_types__pays',
  'activites_types',
  'administrations__titres_types__etapes_types',
  'administrations__titres_types__titres_statuts',
  'administrations__titres_types',
  'administrations_types',
  'administrations',
  'annees',
  'definitions',
  'demarches_statuts',
  'demarches_types',
  'departements',
  'devises',
  'documents_types',
  'domaines',
  'etapes_statuts',
  'etapes_types__etapes_statuts',
  'etapes_types',
  'frequences',
  'geo_systemes',
  'globales',
  'mois',
  'pays',
  'permissions',
  'phases_statuts',
  'references_types',
  'regions',
  'substances__substances_legales',
  'substances_legales_codes',
  'substances_legales',
  'substances',
  'titres_statuts',
  'titres_types__activites_types',
  'titres_types__demarches_types__etapes_types',
  'titres_types__demarches_types',
  'titres_types__titres_statuts',
  'titres_types_types',
  'titres_types',
  'travaux_types__etapes_types',
  'travaux_types',
  'trimestres',
  'unites'
]

const jsonSourceFilesCreate = async () => {
  tablesNames.forEach(async tableName => {
    const client = await pool.connect()
    const jsonFileName = `${tableName.replace(/_/g, '-')}.json`

    const filePath = `${repSources}/${jsonFileName}`

    client.query(
      `select jsonb_agg(t) from (select * from ${tableName}) t;`,
      (err: any, res: { rows: any[] }) => {
        if (err) {
          console.log(err)
          // Erreur => les tables suivantes sont inconnues :
          // activites_types__documents_types
          // definitions
          // administrations__titres_types__titres_statuts
          // administrations__titres_types
          // administrations__titres_types__etapes_types
          // titres_statuts
          // titres_types__activites_types
          // titres_types__demarches_types__etapes_types
          // titres_types__demarches_types
          // titres_types__titres_statuts
          // titres_types_types
          // titres_types
          // travaux_types__etapes_types
          // travaux_types
        }
        if (res) {
          writeFileSync(filePath, JSON.stringify(res.rows[0]['jsonb_agg']))
          // Les booleans ne semblent pas être pris en compte
          // le champ 'modification' de la table 'activites_types__administrations' est absent
          // il est pourtant bien visible sous pgadmin4
        } else {
          console.log(tableName)
        }
      }
    )
    client.release()
  })
}

const main = async () => jsonSourceFilesCreate()
main()

export default jsonSourceFilesCreate
