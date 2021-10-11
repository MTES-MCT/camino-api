import { IFields } from '../../../types'

const fieldsEntreprisesTitresCreationAdd = (fields: IFields = {}) => {
  if (!fields.titresTypes) {
    fields.titresTypes = { id: {} }
  }

  return fields
}

// ajoute les champs nécessaire pour obtenir le sous-objet titre
// pour vérifier si l'utilisateur a les droits sur les titres
const fieldsTitreAdd = (fields: IFields) => {
  if (!fields.titre) {
    fields.titre = {
      id: {}
    }
  }

  if (!fields.titre.type) {
    fields.titre.type = { id: {}, type: { id: {} } }
  }

  if (!fields.titre.type.titresTypesTitresStatuts) {
    fields.titre.type.titresTypesTitresStatuts = { id: {} }
  }

  if (!fields.titre.domaine) {
    fields.titre.domaine = { id: {} }
  }

  if (!fields.titre.statut) {
    fields.titre.statut = { id: {} }
  }

  if (!fields.titre.titulaires) {
    fields.titre.titulaires = { id: {} }
  }

  if (!fields.titre.amodiataires) {
    fields.titre.amodiataires = { id: {} }
  }

  return fields
}

// ajoute les démarches et les étapes sur une requête de titre
// pour calculer ses sections en fonction des sections des étapes
const titresFieldsAdd = (fields: IFields) => {
  if (fields.type?.sections || fields.contenu) {
    if (!fields.demarches) {
      fields.demarches = { id: {} }
    }

    if (!fields.demarches.etapes) {
      fields.demarches.etapes = { id: {} }
    }

    // permet d'avoir accès aux sections des étapes
    if (!fields.demarches.etapes.type) {
      fields.demarches.etapes.type = { id: {} }
    }

    // permet d'avoir accès aux sections des étapes des démarches
    if (!fields.demarches.type) {
      fields.demarches.type = { id: {} }
    }

    // permet d'avoir accès aux sections des étapes des démarches
    if (!fields.demarches.type.etapesTypes) {
      fields.demarches.type.etapesTypes = { id: {} }
    }

    if (!fields.contenusTitreEtapesIds && fields.contenu) {
      fields.contenusTitreEtapesIds = {}
    }
  }

  if (fields.activites) {
    if (!fields.activites.type) {
      fields.activites.type = { id: {} }
    }

    if (!fields.activites.type.frequence) {
      fields.activites.type.frequence = { id: {} }
    }
  }

  return fields
}

export { fieldsTitreAdd, titresFieldsAdd, fieldsEntreprisesTitresCreationAdd }
