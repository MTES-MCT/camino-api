import 'dotenv/config'
import { knexConfig } from './config/knex'
import { knexInit } from './knex'

knexInit(knexConfig)
