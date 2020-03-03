import { IFields } from '../../../types'

const titreDemarcheFieldsAdd = (fields: IFields) => {
  if (!fields.titre) {
    fields.titre = {
      id: {},
      nom: {},
      type: { id: {}, type: { nom: {} } },
      domaine: { id: {}, nom: {} },
      statut: { id: {}, nom: {}, couleur: {} }
    }
  }

  // on récupère les titulaires et les amodiataires
  // pour vérifier si l'utilisateur a les droits sur les titres
  if (!fields.titre.titulaires) {
    fields.titre.titulaires = {}
  }
  if (!fields.titre.amodiataires) {
    fields.titre.amodiataires = {}
  }

  return fields
}

const titreFieldsAdd = (fields: IFields) => {
  // pour accéder au contenu des titres
  // on récupère les démarches et ses étapes
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

export { titreDemarcheFieldsAdd, titreFieldsAdd }
