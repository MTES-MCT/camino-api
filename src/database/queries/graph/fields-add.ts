import { IFields } from '../../../types'

// ajoute les champs nécessaire pour obtenir le sous-objet titre
// pour vérifier si l'utilisateur a les droits sur les titres
const fieldsTitreAdd = (fields: IFields) => {
  if (!fields.titre) {
    fields.titre = {
      id: {},
      nom: {}
    }
  }

  if (!fields.titre.type) {
    fields.titre.type = { id: {}, type: { nom: {} } }
  }

  if (!fields.titre.type.autorisationsTitresStatuts) {
    fields.titre.type.autorisationsTitresStatuts = { id: {} }
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

  if (fields.titre.activites) {
    fields.titre = activitesFieldsAdd(fields.titre)
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

    if (!fields.propsTitreEtapesIds && fields.contenu) {
      fields.propsTitreEtapesIds = {}
    }
  }

  if (fields.activites) {
    if (!fields.activites.type) {
      fields.activites.type = { id: {} }
    }

    if (!fields.activites.type.frequence) {
      fields.activites.type.frequence = { id: {} }
    }

    fields = activitesFieldsAdd(fields)
  }

  if (fields.travaux) {
    if (!fields.travaux.type) {
      fields.travaux.type = { id: {} }
    }
  }

  return fields
}

// ajoute le lien entre le titre, les substances et les substances légales
// pour formatter les sections des activités
const activitesFieldsAdd = (titreFields: IFields) => {
  if (!titreFields.substances) {
    titreFields.substances = {}
  }

  if (!titreFields.substances.legales) {
    titreFields.substances.legales = {}
  }

  if (!titreFields.substances.legales.fiscales) {
    titreFields.substances.legales.fiscales = { id: {} }
  }

  if (!titreFields.substances.legales.fiscales.unite) {
    titreFields.substances.legales.fiscales.unite = { id: {} }
  }

  return titreFields
}

export { fieldsTitreAdd, titresFieldsAdd }
