// afin de faire un dump public de la base de données,
// ce script copie la base de données
// et supprime les informations confidentielles

const Knex = require('knex')
const config = require('./config-api')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(config)
const { knexSnakeCaseMappers } = require('objection')

const titresIds = process.env.DUMP_TITRES_IDS.split(',')

const run = async () => {
  try {
    console.log('Copie de la base de données…')
    await dbManager.dropDb('camino-public')
    await dbManager.copyDb('camino', 'camino-public')

    console.log('Suppression des informations confidentielles…')

    const connection = {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: 'camino-public',
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD
    }

    const knexConfig = {
      client: 'pg',
      // debug: true,
      connection,
      ...knexSnakeCaseMappers()
    }

    const knex = Knex(knexConfig)
    const titresDeleted = await knex('titres')
      .whereNotIn('id', titresIds)
      .del()

    console.log(`${titresDeleted} titres supprimés de la base de données`)

    const activitesDeleted = await knex('titresActivites').del()

    console.log(`${activitesDeleted} activités supprimés de la base de données`)

    const utilisateursDeleted = await knex('utilisateurs').del()

    console.log(
      `${utilisateursDeleted} utilisateurs supprimés de la base de données`
    )
    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()
