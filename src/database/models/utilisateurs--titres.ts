import { Model } from 'objection'
import { IUtilisateurTitre } from '../../types'
import { join } from 'path'

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

  public static relationMappings = {
    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'utilisateurs__titres.utilisateurId',
        to: 'utilisateurs.id'
      }
    }
  }
}

export default UtilisateursTitres
