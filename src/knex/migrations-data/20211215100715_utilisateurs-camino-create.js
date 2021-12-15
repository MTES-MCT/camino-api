import { idGenerate } from '../../database/models/_format/id-create'
import { userSuper } from '../../database/user-super'

exports.up = async knex => {
  await knex('utilisateurs').insert({
    ...userSuper,
    motDePasse: idGenerate()
  })
}
exports.down = () => ({})
