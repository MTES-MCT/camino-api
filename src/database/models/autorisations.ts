import { Model } from 'objection'

import {
  IAutorisationTitreTypeTitreStatut,
  IAutorisationEtapeType,
  IAutorisationTitreTypeAdministration,
  IRestrictionTitreTypeTitreStatutAdministration,
  IRestrictionTitreTypeEtapeTypeAdministration
} from '../../types'

interface AutorisationsTitresTypesTitresStatuts
  extends IAutorisationTitreTypeTitreStatut {}

class AutorisationsTitresTypesTitresStatuts extends Model {
  public static tableName = 'a__titresTypes__titresStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'titreStatutId', 'publicLecture'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      titreStatutId: { type: 'string', maxLength: 3 },
      publicLecture: { type: 'boolean' }
    }
  }

  public static idColumn = ['titreTypeId', 'titreStatutId']
}

interface AutorisationsEtapesTypes extends IAutorisationEtapeType {}

class AutorisationsEtapesTypes extends Model {
  public static tableName = 'a__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId', 'publicLecture', 'entreprisesLecture'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      publicLecture: { type: 'boolean' },
      entreprisesLecture: { type: 'boolean' }
    }
  }

  public static idColumn = ['etapeTypeId']
}

interface AutorisationsTitresTypesAdministrations
  extends IAutorisationTitreTypeAdministration {}

class AutorisationsTitresTypesAdministrations extends Model {
  public static tableName = 'a__titresTypes__administrations'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'administrationId', 'gestionnaire', 'associee'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      gestionnaire: { type: 'boolean' },
      associee: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId']
}

interface RestrictionsTitresTypesTitresStatutsAdministrations
  extends IRestrictionTitreTypeTitreStatutAdministration {}

class RestrictionsTitresTypesTitresStatutsAdministrations extends Model {
  public static tableName = 'r__titresTypes__titresStatuts__administrations'

  public static jsonSchema = {
    type: 'object',
    required: [
      'administrationId',
      'titreTypeId',
      'titreStatutId',
      'titresModificationInterdit',
      'demarchesModificationInterdit',
      'etapesModificationInterdit'
    ],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      titreStatutId: { type: 'string', maxLength: 3 },
      titresModificationInterdit: { type: 'boolean' },
      demarchesModificationInterdit: { type: 'boolean' },
      etapesModificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId', 'titreStatutId']
}

interface RestrictionsTitresTypesEtapesTypesAdministrations
  extends IRestrictionTitreTypeEtapeTypeAdministration {}

class RestrictionsTitresTypesEtapesTypesAdministrations extends Model {
  public static tableName = 'r__titresTypes__etapesTypes__administrations'

  public static jsonSchema = {
    type: 'object',
    required: [
      'administrationId',
      'titreTypeId',
      'etapeTypeId',
      'lectureInterdit',
      'creationInterdit',
      'modificationInterdit'
    ],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      lectureInterdit: { type: 'boolean' },
      creationInterdit: { type: 'boolean' },
      modificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId', 'etapeTypeId']
}

export {
  AutorisationsEtapesTypes,
  AutorisationsTitresTypesTitresStatuts,
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesTitresStatutsAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations
}
