const demarcheEtapesTypesPublication = {
  arm: ['def', 'sco', 'aco'],
  axm: ['dex', 'rpu'],
  prm: ['rpu']
}

// retourne l'étape de publication de la démarche si elle existe
const titreEtapePublicationFilter = (titreEtape, titreTypeId) =>
  ['dpu', 'dup'].includes(titreEtape.typeId) ||
  (demarcheEtapesTypesPublication[titreTypeId] &&
    demarcheEtapesTypesPublication[titreTypeId].includes(titreEtape.typeId))

export default titreEtapePublicationFilter
