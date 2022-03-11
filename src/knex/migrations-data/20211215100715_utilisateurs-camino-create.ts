import { idGenerate } from '../../database/models/_format/id-create'
import { userSuper } from '../../database/user-super'
import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  await knex('utilisateurs').insert({
    ...userSuper,
    motDePasse: idGenerate()
  })
}
exports.down = () => ({})
