const fieldsOrderDesc = [
  'etablissements',
  'demarches',
  'etapes',
  'activites',
  'travaux',
  'travauxEtapes'
]
const fieldsOrderAsc = [
  'domaines',
  'points',
  'substances',
  'references',
  'etapesTypes',
  'titresTypesEtapesTypes',
  'titresTypesTitresStatuts'
]
const fieldsToRemove = ['coordonnees', 'incertitudes', 'propsHeritage']
const titreFieldsToRemove = ['geojsonCentre'] as string[]
const geoFieldsToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const titrePropsEtapesFields = ['surface']

interface IFields {
  [key: string]: IFields
}

const graphTitreAdministrationsFormat = (fields: IFields, type: string) => {
  if (!fields.administrations) return

  fields[`administrations${type}`] = {
    ...fields.administrations
  }

  if (
    !fields.administrations.type &&
    Object.keys(fields.administrations).length !== 0
  ) {
    fields[`administrations${type}`].type = { id: {} }
  }
}

// ajoute des propriétés requises par /database/queries/_format
const fieldsFormat = (fields: IFields, parent: string) => {
  const isParentTitre = [
    'titres',
    'titre',
    'amodiataireTitres',
    'titulaireTitres'
  ].includes(parent)

  // ajoute la propriété `titreType` sur les démarches
  if (fields.demarches && !fields.demarches.titreType) {
    fields.demarches.titreType = { id: {} }
  }

  // ajoute la propriété `type` sur les démarches
  // pour pouvoir récupérer les types d'étapes spécifiques
  if (fields.demarches && !fields.demarches.type) {
    fields.demarches.type = { id: {} }
  }

  // ajoute la propriété `etapesTypes` sur les démarches
  // pour pouvoir récupérer les types spécifiques
  if (
    fields.demarches &&
    fields.demarches.type &&
    !fields.demarches.type.etapesTypes
  ) {
    fields.demarches.type.etapesTypes = { id: {} }
  }

  // ajoute la propriété `type` sur les activités
  // pour savoir si une activité est liée à une administration
  if (fields.activites && !fields.activites.type) {
    fields.activites.type = { id: {}, administrations: { id: {} } }
  }

  // si `geojsonPoints` ou `geojsonMultiPolygon` sont présentes
  // - ajoute la propriété `points`
  // - supprime les propriété `geojsonPoints` ou `geojsonMultiPolygon`
  geoFieldsToReplace.forEach(key => {
    if (fields[key]) {
      if (!fields.points) {
        fields.points = { id: {} }
      }

      delete fields[key]
    }
  })

  // supprime la propriété `coordonnees`
  fieldsToRemove.forEach(key => {
    if (fields[key]) {
      delete fields[key]
    }
  })

  if (fields.pays && (isParentTitre || parent === 'etapes')) {
    fields.communes = { departement: { region: { pays: { id: {} } } } }

    delete fields.pays
  }

  // ajoute `(orderDesc)` à certaine propriétés
  if (fieldsOrderDesc.includes(parent)) {
    // TODO: est ce qu'on peut faire un typage plus propre ?
    fields.$modifier = ('orderDesc' as unknown) as IFields
  }

  // ajoute `(orderAsc)` à certaine propriétés
  if (fieldsOrderAsc.includes(parent)) {
    fields.$modifier = ('orderAsc' as unknown) as IFields
  }

  if (fields.administrations) {
    if (isParentTitre) {
      // ajoute la propriété `type` sur les administrations
      graphTitreAdministrationsFormat(fields, 'Locales')
      graphTitreAdministrationsFormat(fields, 'Gestionnaires')
      delete fields.administrations
    } else if (
      !fields.administrations.type &&
      Object.keys(fields.administrations).length !== 0
    ) {
      fields.administrations.type = { id: {} }
    }
  }

  // sur les titres
  if (isParentTitre) {
    if (fields.references && !fields.references.type) {
      fields.references.type = { id: {} }
    }

    // si la propriété `surface` est présente
    // - la remplace par `surfaceEtape`
    titrePropsEtapesFields.forEach(key => {
      if (fields[key]) {
        fields[`${key}Etape`] = { id: {} }

        delete fields[key]
      }
    })

    // supprime certaines propriétés
    titreFieldsToRemove.forEach(key => {
      if (fields[key]) {
        delete fields[key]
      }
    })

    // trie les types de titres
    if (fields.type) {
      fields.type.$modifier = ('orderAsc' as unknown) as IFields
    }

    // ajouter titulaires et amodiataires
  }

  if (['activites', 'activite'].includes(parent)) {
    if (!fields.type) {
      fields.type = { id: {} }
    }

    if (!fields.type.administrations) {
      fields.type.administrations = { id: {} }
    }
  }

  if (['utilisateurs', 'utilisateur'].includes(parent)) {
    if (fields.sections) {
      delete fields.sections
    }
  }

  // on a besoin des activités si elles sont absentes
  // pour calculer le nombre d'activités par type
  if (!fields.activites) {
    if (
      fields.activitesDeposees ||
      fields.activitesEnConstruction ||
      fields.activitesAbsentes
    ) {
      fields.activites = { id: {} }
    }
  }

  return fields
}

export { fieldsFormat }
