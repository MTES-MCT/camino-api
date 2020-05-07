import * as Knex from 'knex'
import { Model } from 'objection'

import knexConfig from '../config/knex'

const knex = Knex(knexConfig)

Model.knex(knex)

export default knex
