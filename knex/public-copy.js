// afin de faire un dump public de la base de données,
// ce script copie la base de données
// et supprime les informations confidentielles

const Knex = require('knex')
const config = require('./config-api')
const chalk = require('chalk')
const dbManager = require('knex-db-manager').databaseManagerFactory(config)
const { knexSnakeCaseMappers } = require('objection')

if (!process.env.PUBLIC_TITRES_IDS) {
  console.error(
    "La variable d'environnement PUBLIC_TITRES_IDS n'est pas définie"
  )
  process.exit(1)
}

const titresIds = process.env.PUBLIC_TITRES_IDS.split(',')

const run = async () => {
  try {
    console.log('Copie de la base de données…')
    await dbManager.dropDb('camino_public')
    await dbManager.copyDb(config.knex.connection.database, 'camino_public')

    console.log('Suppression des informations confidentielles…')

    const connection = {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: 'camino_public',
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

    console.log(
      `${entreprisesDeleted} entreprises supprimées de la base de données`
    )

    const titresAdministrations = [
      ...(await knex('titres_administrations_gestionnaires')),
      ...(await knex('titres_administrations_locales')),
      ...(await knex('administrations__domaines'))
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

    console.log(
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

    console.log(`${communesDeleted} communes supprimées de la base de données`)

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

    console.log(
      `${substancesDeleted} substances supprimées de la base de données`
    )

    process.exit()
  } catch (e) {
    console.error(chalk.red(e))

    process.exit(1)
  }
}

run()
