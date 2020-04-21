import { ITitreEtape, IEtapeType } from '../../types'

import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const titreDemarcheEntrepriseLectureFind = (
  entrepriseLecture: boolean,
  demarcheTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreEtape: ITitreEtape,
  titreTypeId?: string
) => {
  // si le type d'étape est une demande
  // alors la démarche est visible pour les entreprises
  if (titreEtape.typeId === 'mfr') {
    entrepriseLecture = true
  }

  // les autres cas sont couverts par la visibilité au public

  return entrepriseLecture
}

const titreDemarchePublicLectureFind = (
  publicLecture: boolean,
  demarcheTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreEtape: ITitreEtape,
  titreTypeId?: string
) => {
  // si le type de démarche est retrait de la demande ou déchéance
  // et que le type d'étape est saisine du préfet
  // alors la démarche est publique
  if (['ret', 'dec'].includes(demarcheTypeId) && titreEtape.typeId === 'spp') {
    publicLecture = true
  }

  // si le type d'étape est un classement sans suite
  // et le type de titre n'est ni ARM ni AXM
  // alors la démarche n'est pas publique
  if (
    titreEtape.typeId === 'css' &&
    (!titreTypeId || !['arm', 'axm'].includes(titreTypeId))
  ) {
    publicLecture = false
  }

  // si le type d'étape est recevabilité de la demande
  // et que le type de titre n'est pas ARM
  // et que la démarche ne peut contenir de mise en concurrence au JORF ou JOUE
  // alors la démarche est publique
  if (
    titreEtape.typeId === 'mcr' &&
    ((!titreTypeId || titreTypeId !== 'arm') &&
      !demarcheTypeEtapesTypes.find(et => ['anf', 'ane'].includes(et.id)))
  ) {
    publicLecture = true
  }

  // si le type d'étape est mise en concurrence au JORF ou JOUE
  // alors la démarche est publique
  if (['anf', 'ane'].includes(titreEtape.typeId)) {
    publicLecture = true
  }

  // si le type d'étape est participation du public
  // alors la démarche est publique
  if (titreEtape.typeId === 'ppu') {
    publicLecture = true
  }

  // si le type d'étape est publication de l'avis de décision implicite
  // alors la démarche est publique
  if (titreEtape.typeId === 'apu') {
    publicLecture = true
  }

  // si le type de titre est ARM
  // et que le type d'étape est saisine de la commission des ARM
  //    ou avis de la commission des ARM (si pas de saisine)
  //    ou décision de l'ONF (étape historique)
  // alors la démarche est publique
  if (
    titreTypeId === 'arm' &&
    (titreEtape.typeId === 'sca' || ['aca', 'def'].includes(titreEtape.typeId))
  ) {
    publicLecture = true
  }

  // si le type d'étape est décision implicite
  //    ou décision de l'adminisrtation
  // et que le statut est rejeté
  // et que le type de titre n'est pas AXM
  // alors la démarche n'est pas (plus) publique
  if (
    ['dim', 'dex'].includes(titreEtape.typeId) &&
    titreEtape.statutId === 'rej' &&
    (!titreTypeId || !['axm'].includes(titreTypeId))
  ) {
    publicLecture = false
  }

  // si le type d'étape est décision implicite
  //    ou décision de l'adminisrtation
  //    ou publication au JORF
  // et que le statut est accepté
  // alors la démarche est publique
  if (
    ['dim', 'dex', 'dpu'].includes(titreEtape.typeId) &&
    titreEtape.statutId === 'acc'
  ) {
    publicLecture = true
  }

  // si le type d'étape est publication de décision unilatérale au JORF
  //    ou décision unilatérale de l'administration
  //    ou publication de décision au recueil des actes administratifs
  // alors la démarche est publique
  if (['dup', 'dux', 'rpu'].includes(titreEtape.typeId)) {
    publicLecture = true
  }

  // si le type de titre est ARM
  // et que le type d'étape est signature de l'autorisation de recherche minière
  //    ou signature de l'avenant à l'autorisation de recherche minière
  // alors la démarche est publique
  if (titreTypeId === 'arm' && ['sco', 'aco'].includes(titreEtape.typeId)) {
    publicLecture = true
  }

  //  - le type de l’étape est annulation de la décision (and)
  //  - et si le statut est favorable
  if (['and'].includes(titreEtape.typeId) && titreEtape.statutId === 'fav') {
    //  - alors, la démarche est publique
    publicLecture = true
  }

  return publicLecture
}

const titreDemarchePublicFind = (
  demarcheTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreDemarcheEtapes: ITitreEtape[],
  titreTypeId?: string
) =>
  // on parcourt successivement toutes les étapes
  // pour calculer la visibilité de la démarche
  // en fonction de l'historique
  titreDemarcheEtapes.reduce(
    ({ publicLecture, entrepriseLecture }, titreEtape) => {
      // on calcule la visibilité au public
      publicLecture = titreDemarchePublicLectureFind(
        publicLecture,
        demarcheTypeId,
        demarcheTypeEtapesTypes,
        titreEtape,
        titreTypeId
      )

      // si la démarche n'est pas visible au public
      // alors on calcule la visibilité spéciale pour les entreprises
      entrepriseLecture =
        publicLecture ||
        titreDemarcheEntrepriseLectureFind(
          entrepriseLecture,
          demarcheTypeId,
          demarcheTypeEtapesTypes,
          titreEtape,
          titreTypeId
        )

      return { publicLecture, entrepriseLecture }
    },
    { publicLecture: false, entrepriseLecture: false }
  )

export default titreDemarchePublicFind
