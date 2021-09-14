import 'dotenv/config'

import { knexInit } from './knex'
import { knexConfig } from './knex/config'

knexInit(knexConfig)
