import { Model } from 'objection'

export default class TitresIncertitudes extends Model {
  public static tableName = 'titresIncertitudes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId'],

    properties: {
      titreEtapeId: { type: 'string', maxLength: 128 },
      date: { type: ['null', 'boolean'] },
      dateDebut: { type: ['null', 'boolean'] },
      dateFin: { type: ['null', 'boolean'] },
      duree: { type: ['null', 'boolean'] },
      surface: { type: ['null', 'boolean'] },
      volume: { type: ['null', 'boolean'] },
      engagement: { type: ['null', 'boolean'] },
      points: { type: ['null', 'boolean'] },
      substances: { type: ['null', 'boolean'] },
      titulaires: { type: ['null', 'boolean'] },
      amodiataires: { type: ['null', 'boolean'] },
      administrations: { type: ['null', 'boolean'] }
    }
  }

  public static idColumn = 'titreEtapeId'

  public titreEtapeId!: string
  public date?: boolean
  public dateDebut?: boolean
  public dateFin?: boolean
  public duree?: boolean
  public surface?: boolean
  public volume?: boolean
  public engagement?: boolean
  public points?: boolean
  public substances?: boolean
  public titulaires?: boolean
  public amodiataires?: boolean
  public administrations?: boolean
}
