const demarcheEtapesTypesPublication = {
  arm: ['def', 'sco', 'aco'],
  axm: ['dex', 'rpu'],
  prx: ['rpu']
}

// retourne l'étape de publication de la démarche si elle existe
const titreEtapePublicationFilter = (titreEtape, titreTypeId) =>
  titreEtape.typeId === 'dpu' ||
  (demarcheEtapesTypesPublication[titreTypeId] &&
    demarcheEtapesTypesPublication[titreTypeId].includes(titreEtape.typeId))

export default titreEtapePublicationFilter
