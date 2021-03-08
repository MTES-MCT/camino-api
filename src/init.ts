import * as Knex from 'knex'
import { Model } from 'objection'

import { knexConfig } from './config/knex'

const knexInstance = Knex(knexConfig)

Model.knex(knexInstance)

export default knexInstance
