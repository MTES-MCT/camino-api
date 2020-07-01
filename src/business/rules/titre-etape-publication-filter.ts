interface IDemarchePublicationIndex {
  [id: string]: string[]
}

const demarcheEtapesTypesPublication = {
  arm: ['def', 'sco', 'aco'],
  axm: ['dex', 'rpu'],
  prm: ['rpu']
} as IDemarchePublicationIndex

// retourne l'étape de publication de la démarche si elle existe
const titreEtapePublicationFilter = (
  etapeTypeId: string,
  titreTypeId?: string
) =>
  !!(
    ['dpu', 'dup', 'ihi'].includes(etapeTypeId) ||
    (titreTypeId &&
      demarcheEtapesTypesPublication[titreTypeId]?.includes(etapeTypeId))
  )

export default titreEtapePublicationFilter
