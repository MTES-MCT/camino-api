import {
  ITitreEtape,
  DemarchesStatutsTypes as DemarchesStatuts,
  TitreEtapesTravauxTypes as Travaux
} from '../../types'

import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'
import { titreEtapePublicationCheck } from './titre-etape-publication-check'

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
  'ihi',
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

const titreDemarchesTravauxTypes = ['aom', 'dam', 'dot']

const titreEtapesDecisivesUnilateralesTypes = [
  'ide',
  'spp',
  'dup',
  'dux',
  'aof',
  'aco',
  ...titreEtapesDecisivesCommunesTypes
]

const titreDemarchesUnilateralesTypes = ['ret', 'prr', 'dec']

const titresDemarcheCommunesStatutIdFind = (titreEtapeRecent: ITitreEtape) => {
  //  - le type de l’étape est classement sans suite (css)
  //  - le titre est une ARM
  //    - et le type de l’étape est avis de la commission ARM (aca)
  //    - ou le type de l’étape est recevabilité de la demande (mcr) (historique)
  //    - et le statut de l’étape est défavorable (def)
  if (titreEtapeRecent.typeId === 'css') {
    //  - le statut de la démarche est classé sans suite (cls)
    return DemarchesStatuts.ClasseSansSuite
  }

  //  - le type de l’étape est retrait de la décision (rtd)
  //  - le type de l’étape est abrogation de la décision (abd)
  if (['rtd', 'abd'].includes(titreEtapeRecent.typeId)) {
    //  - le statut de la démarche repasse en “instruction”
    return DemarchesStatuts.EnInstruction
  }

  //  - le type de l’étape est annulation de la décision (and)
  if (titreEtapeRecent.typeId === 'and') {
    //  - si le statut est fait
    //  - alors, le statut de la démarche repasse en “instruction”
    //  - sinon, le statut de la démarche a celui l'étape (accepté ou rejeté)
    return titreEtapeRecent.statutId === 'fai'
      ? DemarchesStatuts.EnInstruction
      : titreEtapeRecent.statutId
  }

  return null
}

const titreDemarcheUnilateralStatutIdFind = (
  titreDemarcheEtapes: ITitreEtape[]
) => {
  // filtre les types d'étapes qui ont un impact
  // sur le statut de la démarche de demande
  const titreEtapesDecisivesUnilaterale = titreDemarcheEtapes.filter(
    titreEtape =>
      titreEtapesDecisivesUnilateralesTypes.includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indétrminé
  if (!titreEtapesDecisivesUnilaterale.length)
    return DemarchesStatuts.Indetermine

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesSortDesc(
    titreEtapesDecisivesUnilaterale
  )[0]

  // calcule le statut de démarche pour les étapes communes
  const statutId = titresDemarcheCommunesStatutIdFind(titreEtapeRecent)
  if (statutId) return statutId

  // - le type de l’étape est publication au JO unilatérale
  // - le type de l’étape est décision unilatérale
  if (['dup', 'dux'].includes(titreEtapeRecent.typeId)) {
    // - le statut de la démarche est terminé
    return DemarchesStatuts.Termine
  }

  // - le type de l’étape est saisine du préfet
  if (titreEtapeRecent.typeId === 'spp') {
    //  - le statut de la démarche est “en instruction”
    return DemarchesStatuts.EnInstruction
  }

  // - le type de l’étape est avenant à l’autorisation de recherche minière
  if (titreEtapeRecent.typeId === 'aco') {
    // - le statut de la démarche est "terminé"
    return DemarchesStatuts.Termine
  }

  // - le type de l’étape est l’avis de l’ONF défavorable
  if (
    titreEtapeRecent.typeId === 'aof' &&
    titreEtapeRecent.statutId === 'def'
  ) {
    // - le statut de la démarche est "classement sans suite"
    return DemarchesStatuts.ClasseSansSuite
  }

  // - si il y a plusieurs étapes
  if (titreDemarcheEtapes.length > 1) {
    // - le statut de la démarche est "en instruction"
    return DemarchesStatuts.EnInstruction
  }

  // - sinon, le type de l’étape est initiation de la démarche
  // alors, le statut de la démarche est “initié”
  return DemarchesStatuts.Initie
}

const titreDemarcheDemandeStatutIdFind = (
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId: string
) => {
  // filtre les types d'étapes qui ont un impact
  // sur le statut de la démarche de demande
  const titreEtapesDecisivesDemande = titreDemarcheEtapes.filter(titreEtape =>
    titreEtapesDecisivesDemandesTypes.includes(titreEtape.typeId)
  )

  // si aucune étape décisive n'est présente dans la démarche
  // le statut est indéterminé
  if (!titreEtapesDecisivesDemande.length) return DemarchesStatuts.Indetermine

  // l'étape la plus récente
  const titreEtapeRecent = titreEtapesSortDesc(titreEtapesDecisivesDemande)[0]

  // calcule le statut de démarche pour les étapes communes
  const statutId = titresDemarcheCommunesStatutIdFind(titreEtapeRecent)

  if (statutId) return statutId

  //  - le type de l’étape est une publication
  //  - ou une décision implicite (dim)
  //  - ou des informations historiques incomplètes
  const titreEtapesPublication = titreDemarcheEtapes.filter(
    titreEtape =>
      titreEtapePublicationCheck(titreEtape.typeId, titreTypeId) ||
      ['dim', 'ihi'].includes(titreEtape.typeId)
  )

  if (titreEtapesPublication.length) {
    // si l'étape de publication la plus récente est
    const titreEtapePublicationRecent = titreEtapesSortDesc(
      titreEtapesPublication
    )[0]

    // si l'étape de publication est de type unilatérale
    // alors la démarche a le statut accepté
    // sinon la démarche a le statut de l'étape (accepté ou rejeté)
    return titreEtapePublicationRecent.statutId === 'fai'
      ? DemarchesStatuts.Accepte
      : titreEtapePublicationRecent.statutId
  }

  //  - le type de l’étape est décision expresse (dex)
  //  - et le statut de l’étape est rejeté (rej)
  if (
    ['dex', 'dux'].includes(titreEtapeRecent.typeId) &&
    titreEtapeRecent.statutId === 'rej'
  ) {
    //  - le statut de la démarche est rejeté (rej)
    return DemarchesStatuts.Rejete
  }

  //  - le type de l’étape est désistement du demandeur (des)
  if (titreEtapeRecent.typeId === DemarchesStatuts.Desiste) {
    //  - le statut de la démarche est “désisté”
    return DemarchesStatuts.Desiste
  }

  //  - le type de l’étape est rejeté (rej)
  //  - le titre est une ARM
  //    - et le type de l’étape est avis de la commission ARM (aca)
  //    - et le statut de l’étape est défavorable (def)
  if (
    titreTypeId === 'arm' &&
    titreEtapeRecent.typeId === 'aca' &&
    titreEtapeRecent.statutId === 'def'
  ) {
    return DemarchesStatuts.Rejete
  }

  //  - le type de l’étape est recevabilité de la demande (mcr)
  //  - le type de l’étape est enregistrement de la demande (men)
  //  - le type de l’étape est décision explicite (dex)
  //  - la date de l'étape est inférieure à la date du jour
  //  OU
  //  - le type de l’étape est avis de la commission ARM (aca) (non défavorable)
  //  - le type de l’étape est décision de l'ONF (def) (non défavorable)
  if (
    ['mcr', 'dex', 'dux'].includes(titreEtapeRecent.typeId) ||
    (titreTypeId === 'arm' &&
      ['mdp', 'men', 'meo', 'mcp', 'def', 'aca'].includes(
        titreEtapeRecent.typeId
      ))
  ) {
    //  - le statut de la démarche est “en instruction”
    return DemarchesStatuts.EnInstruction
  }

  //  - le type de l’étape est dépôt de la demande (mdp)
  //  - il n’y a pas d’étape après
  if (titreEtapeRecent.typeId === 'mdp') {
    //  - le statut de la démarche est “déposé”
    return DemarchesStatuts.Depose
  }

  //  - le type de l’étape est formalisation de la demande (mfr)
  if (titreEtapeRecent.typeId === 'mfr') {
    //  - le statut de la démarche est “en construction”
    return DemarchesStatuts.EnConstruction
  }

  // sinon le statut de la démarche est indéterminé
  return DemarchesStatuts.Indetermine
}

const titreDemarcheTravauxStatutIdFind = (
  titreDemarcheEtapes: ITitreEtape[],
  demarcheTypeId: string
) => {
  if (titreDemarcheEtapes.length === 0) {
    return DemarchesStatuts.Indetermine
  }
  const titreEtapesRecent = titreEtapesSortDesc(titreDemarcheEtapes)[0]

  const statuts: {
    [travauxEtapeType: string]: DemarchesStatuts
  } = {
    [Travaux.DemandeAutorisationOuverture]: DemarchesStatuts.Depose,
    [Travaux.DeclarationOuverture]: DemarchesStatuts.Depose,
    [Travaux.DeclarationArret]: DemarchesStatuts.Depose,
    [Travaux.DepotDemande]: DemarchesStatuts.Depose,
    [Travaux.DemandeComplements]: DemarchesStatuts.EnInstruction,
    [Travaux.ReceptionComplements]: DemarchesStatuts.EnInstruction,
    [Travaux.Recevabilite]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisReception]: DemarchesStatuts.EnInstruction,
    [Travaux.SaisineAutoriteEnvironmentale]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisAutoriteEnvironmentale]: DemarchesStatuts.EnInstruction,
    [Travaux.ArretePrefectoralSursis]: DemarchesStatuts.EnInstruction,
    [Travaux.SaisineServiceEtat]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisServiceAdminLocal]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisDDTM]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisAutoriteMilitaire]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisARS]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisDRAC]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisPrefetMaritime]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisAutresInstances]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisRapportDirecteurREAL]: DemarchesStatuts.EnInstruction,
    [Travaux.TransPrescriptionsDemandeur]: DemarchesStatuts.EnInstruction,
    [Travaux.OuvertureEnquetePublique]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisServiceAdminLocal]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisDDTM]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisAutoriteMilitaire]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisARS]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisDRAC]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisPrefetMaritime]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisAutresInstances]: DemarchesStatuts.EnInstruction,
    [Travaux.MemoireReponseExploitant]: DemarchesStatuts.EnInstruction,
    [Travaux.ClotureEnquetePublique]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisRapportDirecteurREAL]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisCODERST]: DemarchesStatuts.EnInstruction,
    [Travaux.AvisPrescriptionsDemandeur]: DemarchesStatuts.EnInstruction,
    [Travaux.RapportDREAL]: DemarchesStatuts.EnInstruction,
    [Travaux.ArretePrescriptionComplementaire]: DemarchesStatuts.EnInstruction,
    [Travaux.ArretePrefectDonneActe1]: DemarchesStatuts.EnInstruction,
    [Travaux.MemoireFinTravaux]: DemarchesStatuts.EnInstruction,
    [Travaux.Recolement]: DemarchesStatuts.EnInstruction,
    [Travaux.ArreteOuvertureTravauxMiniers]: DemarchesStatuts.Accepte,
    [Travaux.DonneActeDeclaration]: DemarchesStatuts.Accepte,
    [Travaux.Abandon]: DemarchesStatuts.Desiste,
    [Travaux.ArretePrefectDonneActe2]: DemarchesStatuts.FinPoliceMines,
    [Travaux.PorterAConnaissance]: DemarchesStatuts.FinPoliceMines
  }

  if (titreEtapesRecent.typeId === Travaux.PubliDecisionRecueilActesAdmin) {
    switch (demarcheTypeId) {
      case 'aom':
        return DemarchesStatuts.Accepte
      case 'dam':
        return DemarchesStatuts.FinPoliceMines
    }
  }

  return statuts[titreEtapesRecent.typeId] || DemarchesStatuts.Indetermine
}

/**
 * Retourne l'id du statut d'une démarche
 * @param demarcheTypeId - id du type de la démarche
 * @param titreDemarcheEtapes - étapes de la démarche
 * @param titreTypeId - id du type de titre
 */

const titreDemarcheStatutIdFind = (
  demarcheTypeId: string,
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId: string
) => {
  // si la démarche ne contient pas d'étapes
  // -> le statut est indétrminé
  if (!titreDemarcheEtapes.length) return DemarchesStatuts.Indetermine

  // si la démarche est pour des travaux
  if (titreDemarchesTravauxTypes.includes(demarcheTypeId)) {
    return titreDemarcheTravauxStatutIdFind(titreDemarcheEtapes, demarcheTypeId)
  }

  //  si la démarche fait l’objet d’une demande
  // (son type est :
  //  - octroi ou prolongation(1, 2 ou exceptionnelle)
  //  - renonciation ou fusion (native ou virtuelle) ou extension du périmètre
  //  - extension de substance ou mutation (native ou virtuelle) ou amodiation
  //  - résiliation d’amodiation ou déplacement de périmètre)
  if (titreDemarchesDemandesTypes.includes(demarcheTypeId)) {
    return titreDemarcheDemandeStatutIdFind(titreDemarcheEtapes, titreTypeId)
  }

  //  si la démarche ne fait pas l’objet d’une demande (unilatérale)
  //  (son type est retrait ou abrogation ou prorogation)
  else if (titreDemarchesUnilateralesTypes.includes(demarcheTypeId)) {
    return titreDemarcheUnilateralStatutIdFind(titreDemarcheEtapes)
  }

  //  sinon, le statut est indéterminé
  return DemarchesStatuts.Indetermine
}

export { titreDemarcheStatutIdFind }
