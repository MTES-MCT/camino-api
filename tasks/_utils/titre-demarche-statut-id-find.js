const titreEtapesSortDesc = require('./titre-etapes-sort-desc')

const titreDemarcheStatutIdFind = titreDemarche => {
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
    ].includes(titreDemarche.demarcheId)
  ) {
    if (
      //  - le type de l’étape est publication au JO (dpu) ou décision implicite (dim)
      //  - et le statut de l’étape est acceptée ou rejetée
      ['dpu', 'dim'].includes(titreEtapeRecent.etapeId) &&
      ['acc', 'rej'].includes(titreEtapeRecent.etapeStatutId)
    ) {
      //  - le statut de la démarche est égal au statut de l’étape:
      // accepté (acc) ou rejeté(rej)
      titreDemarcheStatutId = titreEtapeRecent.etapeStatutId
    } else if (
      //  - le type de l’étape est enregistrement de la demande (men)
      //  - la date de l'étape est inférieure à la date du jour
      titreEtapeRecent.etapeId === 'men' &&
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      //  - le statut de la démarche est “en instruction”
      titreDemarcheStatutId = 'ins'
    } else if (
      //  - le type de l’étape est retrait de la demande (ret)
      titreEtapeRecent.etapeId === 'ret'
    ) {
      //  - le statut de la démarche est “retirée”
      titreDemarcheStatutId = 'ret'
    } else if (
      //  - le type de l’étape est dépôt de la demande (mdp)
      //  - il n’y a pas d’étape après
      titreEtapeRecent.etapeId === 'mdp'
    ) {
      //  - le statut de la démarche est “déposée”
      titreDemarcheStatutId = 'dep'
    } else if (
      //  - le type de l’étape est formalisation de la demande (mfr)
      titreEtapeRecent.etapeId === 'mfr'
    ) {
      //  - le statut de la démarche est “en construction”
      titreDemarcheStatutId = 'eco'
    }
  } else if (
    //  2. la démarche ne fait pas l’objet d’une demande (unilatérale)
    //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation
    ['ret', 'abr', 'prr'].includes(titreDemarche.demarcheId)
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
      titreEtapeRecent.etapeId === 'mfr' &&
      titreEtapeRecent.etapeStatutId === 'ter'
    ) {
      // - le statut de la démarche est terminée
      titreDemarcheStatutId = 'ter'
    }
  }

  return titreDemarcheStatutId || 'ind'
}

module.exports = titreDemarcheStatutIdFind
