import { Model } from 'objection'

class RestrictionsDomaines extends Model {
  public static tableName = 'restrictions__domaines'

  public static jsonSchema = {
    type: 'object',
    required: ['domaineId', 'publicLectureInterdit'],

    properties: {
      domaineId: { type: 'string', maxLength: 1 },
      publicLectureInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['domaineId', 'publicLectureInterdit']
}

class RestrictionsTypesStatuts extends Model {
  public static tableName = 'restrictions__types__statuts'

  public static jsonSchema = {
    type: 'object',
    required: ['typeId', 'statutId', 'publicLectureInterdit'],

    properties: {
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      publicLectureInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['typeId', 'statutId', 'publicLectureInterdit']
}

class RestrictionsTypesAdministrations extends Model {
  public static tableName = 'restrictions__types__administrations'

  public static jsonSchema = {
    type: 'object',
    required: ['typeId', 'administrationId'],

    properties: {
      typeId: { type: 'string', maxLength: 3 },
      administrationId: { type: 'string', maxLength: 64 },
      creationLectureInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['typeId', 'administrationId']
}

class RestrictionsTypesStatutsAdministrations extends Model {
  public static tableName = 'restrictions__types__statuts__administrations'

  public static jsonSchema = {
    type: 'object',
    required: ['typeId', 'statutId', 'administrationId'],

    properties: {
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      administrationId: { type: 'string', maxLength: 64 },
      creationInterdit: { type: 'boolean' },
      lectureInterdit: { type: 'boolean' },
      modificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['typeId', 'statutId', 'administrationId']
}

class RestrictionsEtapesTypes extends Model {
  public static tableName = 'restrictions__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      publicLectureInterdit: { type: 'boolean' },
      entreprisesLectureInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['etapeTypeId']
}

class RestrictionsEtapesTypesAdministrations extends Model {
  public static tableName = 'restrictions__etapesTypes__administrations'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId', 'administrationId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      administrationId: { type: 'string', maxLength: 64 },
      creationInterdit: { type: 'boolean' },
      lectureInterdit: { type: 'boolean' },
      modificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['etapeTypeId', 'administrationId']
}

export {
  RestrictionsDomaines,
  RestrictionsTypesAdministrations,
  RestrictionsTypesStatuts,
  RestrictionsTypesStatutsAdministrations,
  RestrictionsEtapesTypes,
  RestrictionsEtapesTypesAdministrations
}
