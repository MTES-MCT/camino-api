const titreEtapesDescSort = require('./titre-etapes-desc-sort')

const titreDemarcheStatutIdFind = (titreDemarche, titreTypeId) => {
  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesDescSort(titreDemarche)[0]

  //  1. la démarche fait l’objet d’une demande
  //  - le nom de la démarche est égal à
  //    octroi ou prolongation(1, 2 ou exceptionnelle)
  //    ou renonciation ou fusion ou extension du périmètre
  //    ou extension de substance ou mutation ou amodiation
  //    ou résiliation d’amodiation
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
      'amo',
      'res',
      'ces'
    ].includes(titreDemarche.typeId)
  ) {
    //  - le type de l’étape est publication au JO (dpu) ou décision implicite (dim)
    //  - et le statut de l’étape est acceptée ou rejetée
    if (
      ['acc', 'rej'].includes(titreEtapeRecent.statutId) &&
        (['dpu', 'dim'].includes(titreEtapeRecent.typeId) ||
         titreTypeId === 'axm' && ['dex'].includes(titreEtapeRecent.typeId) ||
         titreTypeId === 'prx' && ['rpu'].includes(titreEtapeRecent.typeId))
    ) {
      //  - le statut de la démarche est égal au statut de l’étape:
      // accepté (acc) ou rejeté(rej)
      return titreEtapeRecent.statutId
    }

    //  - le type de l’étape est enregistrement de la demande (men)
    //  - la date de l'étape est inférieure à la date du jour
    if (
      titreEtapeRecent.typeId === 'men' &&
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      //  - le statut de la démarche est “en instruction”
      return 'ins'
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

    //  - le type de l’étape est formalisation de la demande (mfr)
    if (titreEtapeRecent.typeId === 'mfr') {
      //  - le statut de la démarche est “en construction”
      return 'eco'
    }

    //  - le type de l’étape est recevabilité de la demande (mre)
    //  - et le statut de l’étape est défavorable (def)
    if (
      titreEtapeRecent.typeId === 'mre' &&
      titreEtapeRecent.statutId === 'def'
    ) {
      //  - le statut de la démarche est classée sans suite (cls)
      return 'cls'
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

module.exports = titreDemarcheStatutIdFind
