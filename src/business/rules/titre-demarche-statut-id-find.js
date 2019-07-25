import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const titreDemarcheStatutIdFind = (titreDemarche, titreTypeId) => {
  // si la démarche ne contient pas d'étapes
  // le statut est indétrminé
  if (!titreDemarche.etapes || !titreDemarche.etapes.length) return 'ind'

  // filtre les types d'étapes qui ont un impact sur le statut de la démarche
  const titreEtapesDecisives = titreDemarche.etapes.filter(titreEtape =>
    [
      'mfr',
      'mdp',
      'men',
      'ide',
      'ret',
      'mcr',
      'dim',
      'dex',
      'def',
      'apu',
      'rpu',
      'dpu'
    ].includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indétrminé
  if (!titreEtapesDecisives.length) return 'ind'

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesDescSort(titreEtapesDecisives)[0]

  //  1. la démarche fait l’objet d’une demande
  //  - le nom de la démarche est égal à
  //    octroi ou prolongation(1, 2 ou exceptionnelle)
  //    ou renonciation ou fusion (native ou virtuelle) ou extension du périmètre
  //    ou extension de substance ou mutation (native ou virtuelle) ou amodiation
  //    ou résiliation d’amodiation ou déplacement de périmètre
  if (
    [
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
    ].includes(titreDemarche.typeId)
  ) {
    //  - le type de l’étape est publication au JO (dpu) ou décision implicite (dim)
    //  - et le statut de l’étape est acceptée ou rejetée
    if (
      ['acc', 'rej'].includes(titreEtapeRecent.statutId) &&
      (['dpu', 'dim'].includes(titreEtapeRecent.typeId) ||
        (titreTypeId === 'axm' &&
          ['dex', 'rpu'].includes(titreEtapeRecent.typeId)) ||
        (titreTypeId === 'arm' && ['def'].includes(titreEtapeRecent.typeId)) ||
        (titreTypeId === 'prx' && ['rpu'].includes(titreEtapeRecent.typeId)))
    ) {
      //  - le statut de la démarche est égal au statut de l’étape:
      // accepté (acc) ou rejeté(rej)
      return titreEtapeRecent.statutId
    }

    //  - le type de l’étape est retrait de la demande (ret)
    if (titreEtapeRecent.typeId === 'ret') {
      //  - le statut de la démarche est “retirée”
      return 'ret'
    }

    //  - le type de l’étape est dépôt de la demande (mdp)
    //  - il n’y a pas d’étape après
    if (titreEtapeRecent.typeId === 'mdp') {
      //  - le statut de la démarche est “déposée”
      return 'dep'
    }

    //  - le type de l’étape est recevabilité de la demande (mcr)
    //  - et le statut de l’étape est défavorable (def)
    if (
      titreEtapeRecent.typeId === 'mcr' &&
      titreEtapeRecent.statutId === 'def'
    ) {
      //  - le statut de la démarche est classée sans suite (cls)
      return 'cls'
    }

    //  - le type de l’étape est recevabilité de la demande (mcr) (non défavorable)
    //  - le type de l’étape est enregistrement de la demande (men)
    //  - la date de l'étape est inférieure à la date du jour
    if (
      (titreEtapeRecent.typeId === 'mcr' ||
        titreEtapeRecent.typeId === 'men' ||
        (titreEtapeRecent.typeId === 'mfr' && titreTypeId === 'arm')) &&
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      //  - le statut de la démarche est “en instruction”
      return 'ins'
    }

    //  - le type de l’étape est formalisation de la demande (mfr)
    if (titreEtapeRecent.typeId === 'mfr') {
      //  - le statut de la démarche est “en construction”
      return 'eco'
    }

    //  - le type de l’étape est décision expresse (dex)
    //  - et le statut de l’étape est rejetée (rej)
    if (
      titreEtapeRecent.typeId === 'dex' &&
      titreEtapeRecent.statutId === 'rej'
    ) {
      //  - le statut de la démarche est rejetée (rej)
      return 'rej'
    }

    // sinon le statut de la démarche est indéterminé
    return 'ind'
  }

  //  2. la démarche ne fait pas l’objet d’une demande (unilatérale)
  //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation
  if (['ret', 'abr', 'prr', 'dec'].includes(titreDemarche.typeId)) {
    // - le type de l’étape est publication au JO
    // - et le statut de l’étape est terminée
    if (
      titreEtapeRecent.typeId === 'dpu' &&
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
