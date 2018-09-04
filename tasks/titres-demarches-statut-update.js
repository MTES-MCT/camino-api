const {
  titresDemarches,
  titresDemarcheStatutPatch
} = require('../postgres/queries/titres-demarches')

// classe les étapes selon leur ordre inverse: 3, 2, 1.
const titreEtapesSorted = td => td.etapes.sort((a, b) => a.ordre < b.ordre)

const titreDemarcheStatutIdSet = td => {
  let titreDemarcheStatut

  // L'étape la plus récente
  const titreEtapeRecent = titreEtapesSorted(td)[0]

  //  si --> 1. la démarche fait l’objet d’une demande
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
      'ren',
      'fus',
      'exp',
      'exs',
      'mut',
      'amo',
      'res'
    ].includes(td.demarcheId)
  ) {
    if (
      //  si
      //  - le type de l’étape est publication au JO(dpu) ou décision implicite(dim)
      //  - et le statut de l’étape est acceptée ou rejetée
      ['dpu', 'dim'].includes(titreEtapeRecent.etapeId) &&
      ['acc', 'rej'].includes(titreEtapeRecent.etapeStatutId)
    ) {
      //  alors
      //  - le statut de la démarche est égal au statut de l’étape: accepté(acc) ou rejeté(rej)
      titreDemarcheStatut = titreEtapeRecent.etapeStatutId
    } else if (
      //  sinon, si
      //  - le type de l’étape est enregistrement de la demande(men)
      //  - la date de l'étape est inférieure à la date du jour
      titreEtapeRecent.etapeId === 'men' &&
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      //  alors
      //  - le statut de la démarche est “en instruction”
      titreDemarcheStatut = 'ins'
    } else if (
      //  sinon si
      //  - le type de l’étape est retrait de la demande(ret)
      titreEtapeRecent.etapeId === 'ret'
    ) {
      //  alors
      //  - le statut de la démarche est “retirée”
      titreDemarcheStatut = 'ret'
    } else if (
      //  sinon si
      //  - le type de l’étape est dépôt de la demande(mdp)
      //  - il n’y a pas d’étape après
      titreEtapeRecent.etapeId === 'mdp'
    ) {
      //  alors
      //  - le statut de la démarche est “déposée”
      titreDemarcheStatut = 'dep'
    } else if (
      //  sinon, si
      //  - le type de l’étape est formalisation de la demande(mfr)
      titreEtapeRecent.etapeId === 'mfr'
    ) {
      //  alors
      //  - le statut de la démarche est “en construction”
      titreDemarcheStatut = 'eco'
    }
  } else if (
    //  sinon si --> 2. la démarche ne fait pas l’objet d’une demande (unilatérale)
    //  - le nom de la démarche est égal à retrait ou abrogation ou prorogation
    ['ret', 'abr', 'prr'].includes(td.demarcheId)
  ) {
    if (
      // si
      // - la date d’initiation de la procédure est inférieure à la date du jour
      new Date(titreEtapeRecent.date) < new Date()
    ) {
      // alors
      // - le statut de la démarche est “initiée”
      titreDemarcheStatut = 'ini'
    } else if (
      // sinon si
      // - le type de l’étape est publication au JO
      // - et le statut de l’étape est terminée
      titreEtapeRecent.etapeId === 'mfr' &&
      titreEtapeRecent.etapeStatutId === 'ter'
    ) {
      // alors
      // - le statut de la démarche est terminée
      titreDemarcheStatut = 'ter'
    }
  } else {
    //  sinon --> 3. base case
    //  - le statut de la démarche est indéterminé
    titreDemarcheStatut = 'ind'
  }

  return titreDemarcheStatut
}

const titresDemarchesStatutUpdate = async () =>
  titresDemarches({}).then(tds => {
    Promise.all([
      ...tds.map(td =>
        titresDemarcheStatutPatch({
          id: td.id,
          demarcheStatutId: titreDemarcheStatutIdSet(td)
        })
      )
    ]).then(r => {
      console.log('Mise à jour: statuts des démarches de tous les titres.')
    })
  })

module.exports = titresDemarchesStatutUpdate
