import { Model } from 'objection'

import {
  IAutorisationDomaine,
  IAutorisationTitreTypeTitreStatut,
  IAutorisationEtapeType,
  IAutorisationTitreTypeAdministration,
  IAutorisationTitreTypeTitreStatutAdministration,
  IAutorisationTitreTypeEtapeTypeAdministration
} from '../../types'

interface AutorisationsDomaines extends IAutorisationDomaine {}

class AutorisationsDomaines extends Model {
  public static tableName = 'autorisations__domaines'

  public static jsonSchema = {
    type: 'object',
    required: ['domaineId', 'publicLecture'],

    properties: {
      domaineId: { type: 'string', maxLength: 1 },
      publicLecture: { type: 'boolean' }
    }
  }

  public static idColumn = ['domaineId']
}

interface AutorisationsTitresTypesTitresStatuts
  extends IAutorisationTitreTypeTitreStatut {}

class AutorisationsTitresTypesTitresStatuts extends Model {
  public static tableName = 'autorisations__titresTypes__titresStatuts'

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
  public static tableName = 'autorisations__etapesTypes'

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
  extends IAutorisationTitreTypeAdministration { }

class AutorisationsTitresTypesAdministrations extends Model {
  public static tableName = 'autorisations__titresTypes__administrations'

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

interface AutorisationsTitresTypesTitresStatutsAdministrations
  extends IAutorisationTitreTypeTitreStatutAdministration {}

class AutorisationsTitresTypesTitresStatutsAdministrations extends Model {
  public static tableName = 'restrictions__titresTypes__titresStatuts__administrations'

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

interface AutorisationsTitresTypesEtapesTypesAdministrations
  extends IAutorisationTitreTypeEtapeTypeAdministration {}

class AutorisationsTitresTypesEtapesTypesAdministrations extends Model {
  public static tableName = 'restrictions__titresTypes__etapesTypes__administrations'

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
  AutorisationsDomaines,
  AutorisationsEtapesTypes,
  AutorisationsTitresTypesAdministrations,
  AutorisationsTitresTypesEtapesTypesAdministrations,
  AutorisationsTitresTypesTitresStatuts,
  AutorisationsTitresTypesTitresStatutsAdministrations
}
