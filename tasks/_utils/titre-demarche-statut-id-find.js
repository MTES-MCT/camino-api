const titreEtapesSortDesc = require('./titre-etapes-sort-desc')

const titreDemarcheStatutIdFind = (titreDemarche, titreIsAxm) => {
  let titreDemarcheStatutId

  // étape la plus récente
  const titreEtapeRecent = titreEtapesSortDesc(titreDemarche)[0]

  if (
    //  1. la démarche fait l’objet d’une demande
    //  - le nom de la démarche est égal à
    //    octroi ou prolongation(1, 2 ou exceptionnelle)
    //    ou renonciation ou fusion ou extension du périmètre
    //    ou extension de substance ou mutation ou amodiation
    //    ou résiliation d’amodiation
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
      'res'
    ].includes(titreDemarche.typeId)
  ) {
    if (
      //  - le type de l’étape est publication au JO (dpu) ou décision implicite (dim)
      //  - et le statut de l’étape est acceptée ou rejetée
      (['dpu', 'dim'].includes(titreEtapeRecent.typeId) &&
        ['acc', 'rej'].includes(titreEtapeRecent.statutId)) ||
      (titreIsAxm &&
        ['dex', 'dim'].includes(titreEtapeRecent.typeId) &&
        ['acc', 'rej'].includes(titreEtapeRecent.statutId))
    ) {
      //  - le statut de la démarche est égal au statut de l’étape:
      // accepté (acc) ou rejeté(rej)
      titreDemarcheStatutId = titreEtapeRecent.statutId
    } else if (
      //  - le type de l’étape est enregistrement de la demande (men)
      //  - la date de l'étape est inférieure à la date du jour
      titreEtapeRecent.typeId === 'men' &&
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      //  - le statut de la démarche est “en instruction”
      titreDemarcheStatutId = 'ins'
    } else if (
      //  - le type de l’étape est retrait de la demande (ret)
      titreEtapeRecent.typeId === 'ret'
    ) {
      //  - le statut de la démarche est “retirée”
      titreDemarcheStatutId = 'ret'
    } else if (
      //  - le type de l’étape est dépôt de la demande (mdp)
      //  - il n’y a pas d’étape après
      titreEtapeRecent.typeId === 'mdp'
    ) {
      //  - le statut de la démarche est “déposée”
      titreDemarcheStatutId = 'dep'
    } else if (
      //  - le type de l’étape est formalisation de la demande (mfr)
      titreEtapeRecent.typeId === 'mfr'
    ) {
      //  - le statut de la démarche est “en construction”
      titreDemarcheStatutId = 'eco'
    } else if (
      //  - le type de l’étape est recevabilité de la demande (mre)
      //  - et le statut de l’étape est défavorable (def)
      titreEtapeRecent.typeId === 'mre' &&
      titreEtapeRecent.statutId === 'def'
    ) {
      //  - le statut de la démarche est classée sans suite (cls)
      titreDemarcheStatutId = 'cls'
    } else if (
      //  - le type de l’étape est décision expresse (dex)
      //  - et le statut de l’étape est rejetée (rej)
      titreEtapeRecent.typeId === 'dex' &&
      titreEtapeRecent.statutId === 'rej'
    ) {
      //  - le statut de la démarche est rejetée (rej)
      titreDemarcheStatutId = 'rej'
    }
  } else if (
    //  2. la démarche ne fait pas l’objet d’une demande (unilatérale)
    //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation
    ['ret', 'abr', 'prr'].includes(titreDemarche.typeId)
  ) {
    if (
      // - la date d’initiation de la procédure est inférieure à la date du jour
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      // - le statut de la démarche est “initiée”
      titreDemarcheStatutId = 'ini'
    } else if (
      // - le type de l’étape est publication au JO
      // - et le statut de l’étape est terminée
      titreEtapeRecent.typeId === 'dpu' &&
      titreEtapeRecent.statutId === 'fai'
    ) {
      // - le statut de la démarche est terminée
      titreDemarcheStatutId = 'ter'
    }
  }

  return titreDemarcheStatutId || 'ind'
}

module.exports = titreDemarcheStatutIdFind
