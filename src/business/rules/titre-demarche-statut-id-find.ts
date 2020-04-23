import { ITitreEtape } from '../../types'

import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

const titreEtapesDecisivesCommunesTypes = ['css', 'rtd', 'abd', 'and']

const titreEtapesDecisivesDemandesTypes = [
  'mfr',
  'mdp',
  'men',
  'meo',
  'ide',
  'des',
  'mcp',
  'mcr',
  'dim',
  'dex',
  'aca',
  'def',
  'sco',
  'aco',
  'apu',
  'rpu',
  'dpu',
  ...titreEtapesDecisivesCommunesTypes
]

const titreDemarchesDemandesTypes = [
  'oct',
  'pro',
  'pr1',
  'pr2',
  'pre',
  'ren',
  'fus',
  'exp',
  'exs',
  'mut',
  'vut',
  'amo',
  'res',
  'ces',
  'dep',
  'vus',
  'vct'
]

const titreEtapesDecisivesUnilateralesTypes = [
  'ide',
  'spp',
  'dup',
  'dux',
  ...titreEtapesDecisivesCommunesTypes
]

const titreDemarchesUnilateralesTypes = ['ret', 'prr', 'dec']

const titresDemarcheCommunesStatutIdFind = (
  titreEtapeRecent: ITitreEtape,
  titreTypeId?: string
) => {
  //  - le type de l’étape est classement sans suite (css)
  //  - le titre est une ARM
  //    - et le type de l’étape est avis de la commission ARM (aca)
  //    - ou le type de l’étape est recevabilité de la demande (mcr) (historique)
  //    - et le statut de l’étape est défavorable (def)
  if (titreEtapeRecent.typeId === 'css') {
    //  - le statut de la démarche est classé sans suite (cls)
    return 'cls'
  }

  //  - le type de l’étape est retrait de la décision (rtd)
  //  - le type de l’étape est abrogation de la décision (abd)
  if (['rtd', 'abd'].includes(titreEtapeRecent.typeId)) {
    //  - le statut de la démarche repasse en “instruction”
    return 'ins'
  }

  //  - le type de l’étape est annulation de la décision (and)
  if (titreEtapeRecent.typeId === 'and') {
    //  - si le statut est fait
    //  - alors, le statut de la démarche repasse en “instruction”
    //  - sinon, le statut de la démarche a celui l'étape (accepté ou rejeté)
    return titreEtapeRecent.statutId === 'fai'
      ? 'ins'
      : titreEtapeRecent.statutId
  }

  return null
}

const titreDemarcheUnilateralStatutIdFind = (
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId?: string
) => {
  // filtre les types d'étapes qui ont un impact
  // sur le statut de la démarche de demande
  const titreEtapesDecisivesUnilaterale = titreDemarcheEtapes.filter(
    titreEtape =>
      titreEtapesDecisivesUnilateralesTypes.includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indétrminé
  if (!titreEtapesDecisivesUnilaterale.length) return 'ind'

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesDescSort(
    titreEtapesDecisivesUnilaterale
  )[0]

  // calcule le statut de démarche pour les étapes communes
  const statutId = titresDemarcheCommunesStatutIdFind(
    titreEtapeRecent,
    titreTypeId
  )
  if (statutId) return statutId

  // - le type de l’étape est publication au JO unilatérale
  // - le type de l’étape est décision unilatérale
  if (['dup', 'dux'].includes(titreEtapeRecent.typeId)) {
    // - le statut de la démarche est terminé
    return 'ter'
  }

  // - le type de l’étape est saisine du préfet
  if (titreEtapeRecent.typeId === 'spp') {
    //  - le statut de la démarche est “en instruction”
    return 'ins'
  }

  // - sinon, le type de l’étape est initiation de la démarche
  // alors, le statut de la démarche est “initié”
  return 'ini'
}

const titreDemarcheDemandeStatutIdFind = (
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId?: string
) => {
  // filtre les types d'étapes qui ont un impact
  // sur le statut de la démarche de demande
  const titreEtapesDecisivesDemande = titreDemarcheEtapes.filter(titreEtape =>
    titreEtapesDecisivesDemandesTypes.includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indétrminé
  if (!titreEtapesDecisivesDemande.length) return 'ind'

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesDescSort(titreEtapesDecisivesDemande)[0]

  // calcule le statut de démarche pour les étapes communes
  const statutId = titresDemarcheCommunesStatutIdFind(
    titreEtapeRecent,
    titreTypeId
  )
  if (statutId) return statutId

  const titreEtapesPublication = titreDemarcheEtapes.filter(
    titreEtape =>
      //  - le type de l’étape est une publication ou une décision implicite (dim)
      titreEtapePublicationFilter(titreEtape.typeId, titreTypeId) ||
      titreEtape.typeId === 'dim'
  )

  if (titreEtapesPublication.length) {
    // si l'étape de publication la plus récente est
    const titreEtapePublicationRecent = titreEtapesDescSort(
      titreEtapesPublication
    )[0]

    // si l'étape de publication est de type unilatérale
    // alors la démarche a le statut accepté
    // sinon la démarche a le statut de l'étape (accepté ou rejeté)
    return titreEtapePublicationRecent.statutId === 'fai'
      ? 'acc'
      : titreEtapePublicationRecent.statutId
  }

  //  - le type de l’étape est décision expresse (dex)
  //  - et le statut de l’étape est rejeté (rej)
  if (
    ['dex', 'dux'].includes(titreEtapeRecent.typeId) &&
    titreEtapeRecent.statutId === 'rej'
  ) {
    //  - le statut de la démarche est rejeté (rej)
    return 'rej'
  }

  //  - le type de l’étape est désistement du demandeur (des)
  if (titreEtapeRecent.typeId === 'des') {
    //  - le statut de la démarche est “désisté”
    return 'des'
  }

  //  - le type de l’étape est classement sans suite (css)
  //  - le titre est une ARM
  //    - et le type de l’étape est avis de la commission ARM (aca)
  //    - ou le type de l’étape est recevabilité de la demande (mcr) (historique)
  //    - et le statut de l’étape est défavorable (def)
  if (
    titreTypeId === 'arm' &&
    titreEtapeRecent.typeId === 'aca' &&
    titreEtapeRecent.statutId === 'def'
  ) {
    //  - le statut de la démarche est classé sans suite (cls)
    return 'cls'
  }

  //  - le type de l’étape est recevabilité de la demande (mcr)
  //  - le type de l’étape est enregistrement de la demande (men)
  //  - le type de l’étape est décision explicite (dex)
  //  - la date de l'étape est inférieure à la date du jour
  //  OU
  //  - le type de l’étape est avis de la commission ARM (aca) (non défavorable)
  //  - le type de l’étape est décision de l'ONF (def) (non défavorable)
  if (
    ['mcr', 'men', 'dex', 'dux'].includes(titreEtapeRecent.typeId) ||
    (titreTypeId === 'arm' &&
      ['mdp', 'meo', 'mcp', 'def', 'aca'].includes(titreEtapeRecent.typeId))
  ) {
    //  - le statut de la démarche est “en instruction”
    return 'ins'
  }

  //  - le type de l’étape est dépôt de la demande (mdp)
  //  - il n’y a pas d’étape après
  if (titreEtapeRecent.typeId === 'mdp') {
    //  - le statut de la démarche est “déposé”
    return 'dep'
  }

  //  - le type de l’étape est formalisation de la demande (mfr)
  if (titreEtapeRecent.typeId === 'mfr') {
    //  - le statut de la démarche est “en construction”
    return 'eco'
  }

  // sinon le statut de la démarche est indéterminé
  return 'ind'
}

const titreDemarcheStatutIdFind = (
  demarcheTypeId: string,
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId?: string
) => {
  // si la démarche ne contient pas d'étapes
  // le statut est indétrminé
  if (!titreDemarcheEtapes.length) return 'ind'

  if (titreDemarchesDemandesTypes.includes(demarcheTypeId)) {
    //  1. la démarche fait l’objet d’une demande
    //  - le nom de la démarche est égal à
    //    octroi ou prolongation(1, 2 ou exceptionnelle)
    //    ou renonciation ou fusion (native ou virtuelle) ou extension du périmètre
    //    ou extension de substance ou mutation (native ou virtuelle) ou amodiation
    //    ou résiliation d’amodiation ou déplacement de périmètre
    return titreDemarcheDemandeStatutIdFind(titreDemarcheEtapes, titreTypeId)
  } else if (titreDemarchesUnilateralesTypes.includes(demarcheTypeId)) {
    //  2. la démarche ne fait pas l’objet d’une demande (unilatérale)
    //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation

    return titreDemarcheUnilateralStatutIdFind(titreDemarcheEtapes, titreTypeId)
  }

  //  3. sinon, le statut est indéterminé
  return 'ind'
}

export default titreDemarcheStatutIdFind
