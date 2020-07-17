// afin de faire un dump public de la base de données,
// ce script copie la base de données
// et supprime les informations confidentielles

const chalk = require('chalk')
const Knex = require('knex')
const { knexSnakeCaseMappers } = require('objection')
const dbManagerConfig = require('./config-db-manager')
const dbManager = require('knex-db-manager').databaseManagerFactory(
  dbManagerConfig
)

if (!process.env.PUBLIC_TITRES_IDS) {
  console.error(
    "La variable d'environnement PUBLIC_TITRES_IDS n'est pas définie"
  )
  process.exit(1)
}

const titresIds = process.env.PUBLIC_TITRES_IDS.split(',')

const dbPublicName = 'camino_public'

const dbPublicKnexConfig = {
  client: 'pg',
  connection: {
    host: dbManagerConfig.knex.connection.host,
    port: dbManagerConfig.knex.connection.port,
    database: dbPublicName,
    user: dbManagerConfig.knex.connection.user,
    password: dbManagerConfig.knex.connection.password
  },
  ...knexSnakeCaseMappers()
}

const run = async () => {
  try {
    console.info('Copie de la base de données…')
    await dbManager.dropDb(dbPublicName)
    await dbManager.copyDb(
      dbManagerConfig.knex.connection.database,
      dbPublicName
    )

    console.info('Suppression des informations confidentielles…')

    const knex = Knex(dbPublicKnexConfig)
    const titresDeleted = await knex('titres').whereNotIn('id', titresIds).del()

    console.info(`${titresDeleted} titres supprimés de la base de données`)

    const activitesDeleted = await knex('titresActivites').del()

    console.info(
      `${activitesDeleted} activités supprimés de la base de données`
    )

    const utilisateursDeleted = await knex('utilisateurs').del()

    console.info(
      `${utilisateursDeleted} utilisateurs supprimés de la base de données`
    )

    const titresEntreprises = [
      ...(await knex('titres_titulaires')),
      ...(await knex('titres_amodiataires'))
    ]

    const entreprisesIdsIndex = titresEntreprises.reduce(
      (entreprisesIdsIndex, titreEntreprise) => {
        entreprisesIdsIndex[titreEntreprise.entrepriseId] = true

        return entreprisesIdsIndex
      },
      {}
    )

    const entreprisesDeleted = await knex('entreprises')
      .whereNotIn('id', Object.keys(entreprisesIdsIndex))
      .del()

    console.info(
      `${entreprisesDeleted} entreprises supprimées de la base de données`
    )

    const titresAdministrations = [
      ...(await knex('titres_administrations_gestionnaires')),
      ...(await knex('titres_administrations_locales'))
    ]

    const administrationsIdsIndex = titresAdministrations.reduce(
      (administrationsIdsIndex, titreAdministration) => {
        administrationsIdsIndex[titreAdministration.administrationId] = true

        return administrationsIdsIndex
      },
      {}
    )

    const administrationsDeleted = await knex('administrations')
      .whereNotIn('id', Object.keys(administrationsIdsIndex))
      .del()

    console.info(
      `${administrationsDeleted} administrations supprimées de la base de données`
    )

    const titresCommunes = await knex('titres_communes')

    const communesIdsIndex = titresCommunes.reduce(
      (communesIdsIndex, titreCommune) => {
        communesIdsIndex[titreCommune.communeId] = true

        return communesIdsIndex
      },
      {}
    )

    const communesDeleted = await knex('communes')
      .whereNotIn('id', Object.keys(communesIdsIndex))
      .del()

    console.info(`${communesDeleted} communes supprimées de la base de données`)

    const titresSubstances = await knex('titres_substances')

    const substancesIdsIndex = titresSubstances.reduce(
      (substancesIdsIndex, titreSubstance) => {
        substancesIdsIndex[titreSubstance.substanceId] = true

        return substancesIdsIndex
      },
      {}
    )

    const substancesDeleted = await knex('substances')
      .whereNotIn('id', Object.keys(substancesIdsIndex))
      .del()

    console.info(
      `${substancesDeleted} substances supprimées de la base de données`
    )

    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()
