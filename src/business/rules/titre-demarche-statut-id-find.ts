import { ITitreDemarche } from '../../types'

import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

const titreEtapesDecisivesTypes = [
  'mfr',
  'mdp',
  'men',
  'meo',
  'ide',
  'ret',
  'mcr',
  'dim',
  'dex',
  'dux',
  'aca',
  'def',
  'sco',
  'aco',
  'apu',
  'rpu',
  'dpu',
  'dup',
  'rtd',
  'abd',
  'and'
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

const titreDemarcheStatutIdFind = (
  titreDemarche: ITitreDemarche,
  titreTypeId?: string
) => {
  // si la démarche ne contient pas d'étapes
  // le statut est indétrminé
  if (!titreDemarche.etapes || !titreDemarche.etapes.length) return 'ind'

  // filtre les types d'étapes qui ont un impact sur le statut de la démarche
  const titreEtapesDecisives = titreDemarche.etapes.filter(titreEtape =>
    titreEtapesDecisivesTypes.includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indétrminé
  if (!titreEtapesDecisives.length) return 'ind'

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesDescSort(titreEtapesDecisives)[0]

  //  - le type de l’étape est retrait de la décision (rtd)
  //  - le type de l’étape est abrogation de la décision (abd)
  //  - le type de l’étape est annulation de la décision (and)
  if (['rtd', 'abd', 'and'].includes(titreEtapeRecent.typeId)) {
    //  - le statut de la démarche est “rejetée”
    return 'rej'
  }

  //  1. la démarche fait l’objet d’une demande
  //  - le nom de la démarche est égal à
  //    octroi ou prolongation(1, 2 ou exceptionnelle)
  //    ou renonciation ou fusion (native ou virtuelle) ou extension du périmètre
  //    ou extension de substance ou mutation (native ou virtuelle) ou amodiation
  //    ou résiliation d’amodiation ou déplacement de périmètre
  if (titreDemarchesDemandesTypes.includes(titreDemarche.typeId)) {
    //  - le type de l’étape est une publication ou une décision implicite (dim)
    //  - et le statut de l’étape est acceptée ou rejetée
    if (
      ['acc', 'rej'].includes(titreEtapeRecent.statutId) &&
      (titreEtapeRecent.typeId === 'dim' ||
        titreEtapePublicationFilter(titreEtapeRecent.typeId, titreTypeId))
    ) {
      //  - le statut de la démarche est égal au statut de l’étape:
      // accepté (acc) ou rejeté(rej)
      return titreEtapeRecent.statutId
    }

    // l'étape de publication la plus récente
    const titreEtapePublicationRecent = titreEtapesDecisives.filter(te =>
      titreEtapePublicationFilter(te.typeId, titreTypeId)
    )[0]

    // s'il existe une étape de publication antérieure à l'étape
    if (
      titreEtapePublicationRecent &&
      ['acc', 'rej'].includes(titreEtapePublicationRecent.statutId)
    ) {
      // - le statut de la démarche est égal au statut de l'étape
      // accepté (acc) ou rejeté(rej)
      return titreEtapePublicationRecent.statutId
    }

    //  - le type de l’étape est convention ou avenant de convention d'ARM (sco, aco)
    //  - et le statut de l’étape est fait (fai)
    if (
      ['sco', 'aco'].includes(titreEtapeRecent.typeId) &&
      titreEtapeRecent.statutId === 'fai'
    ) {
      //  - le statut de la démarche est acceptée (acc)
      return 'acc'
    }

    //  - le type de l’étape est décision expresse (dex)
    //  - et le statut de l’étape est rejetée (rej)
    if (
      ['dex', 'dux'].includes(titreEtapeRecent.typeId) &&
      titreEtapeRecent.statutId === 'rej'
    ) {
      //  - le statut de la démarche est rejetée (rej)
      return 'rej'
    }

    //  - le type de l’étape est retrait de la demande (ret)
    if (titreEtapeRecent.typeId === 'ret') {
      //  - le statut de la démarche est “retirée”
      return 'ret'
    }

    //  - le type de l’étape est recevabilité de la demande (mcr)
    //  - le type de l’étape est avis de la commission ARM (aca)
    //  - et le statut de l’étape est défavorable (def)
    if (
      ['mcr', 'aca'].includes(titreEtapeRecent.typeId) &&
      titreEtapeRecent.statutId === 'def'
    ) {
      //  - le statut de la démarche est classée sans suite (cls)
      return 'cls'
    }

    //  - le type de l’étape est recevabilité de la demande (mcr) (non défavorable)
    //  - le type de l’étape est enregistrement de la demande (men)
    //  - le type de l’étape est décision explicite (dex)
    //  - la date de l'étape est inférieure à la date du jour
    //  OU
    //  - le type de l’étape est avis de la commission ARM (aca) (non défavorable)
    //  - le type de l’étape est décision de l'ONF (def) (non défavorable)
    if (
      ['mcr', 'men', 'dex', 'dux'].includes(titreEtapeRecent.typeId) ||
      (titreTypeId === 'arm' &&
        ['mdp', 'meo', 'def', 'aca'].includes(titreEtapeRecent.typeId))
    ) {
      //  - le statut de la démarche est “en instruction”
      return 'ins'
    }

    //  - le type de l’étape est dépôt de la demande (mdp)
    //  - il n’y a pas d’étape après
    if (titreEtapeRecent.typeId === 'mdp') {
      //  - le statut de la démarche est “déposée”
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

  //  2. la démarche ne fait pas l’objet d’une demande (unilatérale)
  //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation
  if (['ret', 'abr', 'prr', 'dec'].includes(titreDemarche.typeId)) {
    // - le type de l’étape est publication au JO unilatérale
    // - ou le type de l’étape est décision unilatérale
    // - et le statut de l’étape est terminée
    if (
      ['dup', 'dux'].includes(titreEtapeRecent.typeId) &&
      titreEtapeRecent.statutId === 'fai'
    ) {
      // - le statut de la démarche est terminée
      return 'ter'
    }

    // sinon, le statut de la démarche est “initiée”
    return 'ini'
  }

  //  3. sinon, le statut est indéterminé
  return 'ind'
}

export default titreDemarcheStatutIdFind
