import Knex from 'knex'
import { Model } from 'objection'

let knexInstance = (null as unknown) as Knex

const knexInit = (knexConfig: Knex.Config) => {
  knexInstance = Knex(knexConfig)
  Model.knex(knexInstance)
}

const knexInstanceSet = (knexInst: Knex) => {
  knexInstance = knexInst
  Model.knex(knexInstance)
}

export { knexInstance as knex, knexInit, knexInstanceSet }
