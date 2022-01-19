import { Model } from 'objection'
import { IUtilisateurTitre } from '../../types'
import Utilisateurs from './utilisateurs'

interface UtilisateursTitres extends IUtilisateurTitre {}

class UtilisateursTitres extends Model {
  public static tableName = 'utilisateurs__titres'

  public static jsonSchema = {
    type: 'object',
    required: ['utilisateurId', 'titreId'],

    properties: {
      utilisateurId: { type: 'string' },
      titreId: { type: 'string' }
    }
  }

  public static idColumn = ['utilisateurId', 'titreId']

  static relationMappings = () => ({
    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: Utilisateurs,
      join: {
        from: 'utilisateurs__titres.utilisateurId',
        to: 'utilisateurs.id'
      }
    }
  })
}

export default UtilisateursTitres
