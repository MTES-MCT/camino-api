import { Model, Pojo, RelationMappings } from 'objection'
import { join } from 'path'
import { titreInsertFormat } from './_format/titre-insert'

import { paysFormat } from './_format/pays'
import Administrations from './administrations'
import Communes from './communes'
import Domaines from './domaines'
import Entreprises from './entreprises'
import TitresStatuts from './titres-statuts'
import Substances from './substances'
import TitresDemarches from './titres-demarches'
import TitresEtapes from './titres-etapes'
import TitresPoints from './titres-points'
import TitresReferences from './titres-references'
import Types from './titres-types'

import { ITitre } from '../../types'
import Forets from './forets'
import { titreContenuFormat } from './_format/titres-contenu'

interface Titres extends ITitre {}

class Titres extends Model {
  public static tableName = 'titres'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'domaineId', 'typeId'],
    properties: {
      id: { type: 'string' },
      nom: { type: 'string' },
      domaineId: { type: 'string', maxLength: 1 },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      dateDemande: { type: ['string', 'null'] },
      substancesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      pointsTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      titulairesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      amodiatairesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      administrationsTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      surfaceTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      communesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      propsTitreEtapesIds: { type: 'json' },
      coordonnees: {
        type: ['object', 'null'],
        properties: { x: { type: 'number' }, y: { type: 'number' } }
      }
    }
  }

  public static relationMappings = (): RelationMappings => ({
    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: Domaines,
      join: { from: 'titres.domaineId', to: 'domaines.id' }
    },

    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: Types,
      join: { from: 'titres.typeId', to: 'titresTypes.id' }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresStatuts,
      join: { from: 'titres.statutId', to: 'titresStatuts.id' }
    },

    demarches: {
      relation: Model.HasManyRelation,
      modelClass: TitresDemarches,
      join: { from: 'titres.id', to: 'titresDemarches.titreId' }
    },

    surfaceEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titres.surfaceTitreEtapeId',
        to: 'titresEtapes.id'
      }
    },

    substances: {
      relation: Model.ManyToManyRelation,
      modelClass: Substances,
      join: {
        from: 'titres.substancesTitreEtapeId',
        through: {
          from: 'titresSubstances.titreEtapeId',
          to: 'titresSubstances.substanceId',
          extra: ['ordre', 'connexe']
        },
        to: 'substances.id'
      }
    },

    points: {
      relation: Model.HasManyRelation,
      modelClass: TitresPoints,
      join: {
        from: 'titres.pointsTitreEtapeId',
        to: 'titresPoints.titreEtapeId'
      }
    },

    titulaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: 'titres.titulairesTitreEtapeId',
        through: {
          from: 'titresTitulaires.titreEtapeId',
          to: 'titresTitulaires.entrepriseId',
          extra: ['operateur']
        },
        to: 'entreprises.id'
      }
    },

    amodiataires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: 'titres.amodiatairesTitreEtapeId',
        through: {
          from: 'titresAmodiataires.titreEtapeId',
          to: 'titresAmodiataires.entrepriseId',
          extra: ['operateur']
        },
        to: 'entreprises.id'
      }
    },

    administrationsGestionnaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      // On ne peut pas utiliser directement administrations__titresTypes car on ne peut pas sélectionner les lignes où le booléen
      // gestionnaire est à vrai
      // https://github.com/Vincit/objection.js/issues/1356
      join: {
        from: 'titres.id',
        through: {
          from: 'titresAdministrationsGestionnaires.titreId',
          to: 'titresAdministrationsGestionnaires.administrationId',
          extra: ['associee']
        },
        to: 'administrations.id'
      }
    },

    administrationsLocales: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: 'titres.administrationsTitreEtapeId',
        through: {
          from: 'titresAdministrationsLocales.titreEtapeId',
          to: 'titresAdministrationsLocales.administrationId',
          extra: ['associee', 'coordinateur']
        },
        to: 'administrations.id'
      }
    },

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        from: 'titres.communesTitreEtapeId',
        through: {
          from: 'titresCommunes.titreEtapeId',
          to: 'titresCommunes.communeId',
          extra: ['surface']
        },
        to: 'communes.id'
      }
    },

    forets: {
      relation: Model.ManyToManyRelation,
      modelClass: Forets,
      join: {
        from: 'titres.pointsTitreEtapeId',
        through: {
          from: 'titresForets.titreEtapeId',
          to: 'titresForets.foretId',
          extra: ['surface']
        },
        to: 'forets.id'
      }
    },

    activites: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-activites'),
      join: { from: 'titres.id', to: 'titresActivites.titreId' }
    },

    travaux: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-travaux'),
      join: { from: 'titres.id', to: 'titresTravaux.titreId' }
    },

    references: {
      relation: Model.HasManyRelation,
      modelClass: TitresReferences,
      join: { from: 'titres.id', to: 'titresReferences.titreId' }
    }
  })

  $afterFind() {
    this.pays = paysFormat(this.communes || [])

    if (this.propsTitreEtapesIds) {
      this.contenu = titreContenuFormat(
        this.propsTitreEtapesIds,
        this.demarches
      )
    }

    return this
  }

  public $parseJson(json: Pojo) {
    json = titreInsertFormat(json)
    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = titreInsertFormat(json)
    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default Titres
