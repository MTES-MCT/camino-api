import 'dotenv/config'
import { connection, knexConfig } from './config'

export const dbManagerConfig = {
  knex: knexConfig,
  dbManager: {
    superUser: connection.user,
    superPassword: connection.password
  }
}
