import { IFields } from '../../../types'

const titreFieldsAdd = (fields: IFields) => {
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

export { titreFieldsAdd }
