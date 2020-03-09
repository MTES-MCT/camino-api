import { IFields } from '../../../types'

// ajoute les champs nécessaire pour requêter le sous-objet titre
// pour vérifier si l'utilisateur a les droits sur les titres
const fieldTitreAdd = (fields: IFields) => {
  if (!fields.titre) {
    fields.titre = {
      id: {},
      nom: {}
    }
  }

  if (!fields.titre.type) {
    fields.titre.type = { id: {}, type: { nom: {} } }
  }

  if (!fields.titre.domaine) {
    fields.titre.domaine = { id: {}, nom: {} }
  }

  if (!fields.titre.statut) {
    fields.titre.statut = { id: {}, nom: {} }
  }

  if (!fields.titre.titulaires) {
    fields.titre.titulaires = {}
  }

  if (!fields.titre.amodiataires) {
    fields.titre.amodiataires = {}
  }

  return fields
}

// ajoute les démarches et les étapes sur une requête de titre
// pour calculer le contenu en fonction des sections du type de titre
const titresFieldsAdd = (fields: IFields) => {
  if (fields.contenu) {
    if (!fields.type) {
      fields.type = { id: {} }
    }

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
  }

  return fields
}

export { fieldTitreAdd, titresFieldsAdd }
