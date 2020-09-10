import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { matomoData } from '../../../tools/api-matomo/index'

const ACTIVITE_ANNEE_DEBUT = 2018

const statistiquesGlobales = async () => {
  try {
    const titresActivites = await titresActivitesGet({}, {}, 'super')

    const titresActivitesDepose = titresActivites.filter(
      titreActivite =>
        titreActivite.annee >= ACTIVITE_ANNEE_DEBUT &&
        titreActivite.statutId === 'dep'
    ).length

    const titresActivitesBeneficesEntreprise = Math.round(
      (titresActivitesDepose * 2) / 7
    )

    const titresActivitesBeneficesAdministration = Math.round(
      (titresActivitesDepose * 1) / 7
    )

    const {
      nbSearchArray,
      nbMajTitresArray,
      nbAction,
      timeSession,
      nbDonwload,
      nbErreur,
      nbReutilisation
    } = await matomoData()

    const nbDemarche = titresActivites.filter(titreActivite => {
      const dateSaisie = titreActivite.dateSaisie

      return (
        dateSaisie &&
        dateSaisie.slice(0, 4) === new Date().getFullYear().toString()
      )
    }).length

    return {
      titresActivitesBeneficesEntreprise,
      titresActivitesBeneficesAdministration,
      nbSearchArray,
      nbMajTitresArray,
      nbAction,
      timeSession,
      nbDonwload,
      nbDemarche,
      nbErreur,
      nbReutilisation
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const tbGuyane = async () => {
  try {
    const currentAnnee = new Date().getFullYear()
    const anneesArray = []
    for (let i = 5; i >= 0; i--) {
      anneesArray.push(currentAnnee - i)
    }

    const _titres = await titresGet(
      { statutsIds: ['val'], territoires: 'guyane' },
      {
        fields: {
          type: { type: { id: {} } },
          surfaceEtape: { id: {} },
          activites: { id: {} }
        }
      },
      'super'
    )

    const _titresActivites = await titresActivitesGet(
      {},
      {
        fields: {
          titre: { id: {} }
        }
      },
      'super'
    )

    const anneesTbGuyane = anneesArray
      .map(annee => {
        const regex = new RegExp(annee.toString(), 'g')
        const titres = _titres.filter(titre => titre.id.match(regex))
        const titresActivites = _titresActivites.filter(
          titreActivite => titreActivite.annee === annee
        )

        return { annee, titres, titresActivites }
      })
      .map(ta => {
        const annee = ta.annee
        const dataTb = {
          nbArm: ta.titres.filter(titre => titre.typeId === 'arm').length,
          nbPrm: ta.titres.filter(titre => titre.typeId === 'prm').length,
          nbAxm: ta.titres.filter(titre => titre.typeId === 'axm').length,
          nbPxm: ta.titres.filter(titre => titre.typeId === 'pxm').length,
          nbCxm: ta.titres.filter(titre => titre.typeId === 'cxm').length,
          surfaceExploration:
            ta.titres
              .filter(titre => titre.typeId === 'arm' || titre.typeId === 'prm')
              .reduce((acc, titre) => {
                if (titre.surfaceEtape && titre.surfaceEtape.surface) {
                  acc += titre.surfaceEtape?.surface
                }

                return acc
              }, 0) * 100, // conversion 1 km² = 100 ha
          surfaceExploitation:
            ta.titres
              .filter(
                titre =>
                  titre.typeId === 'axm' ||
                  titre.typeId === 'pxm' ||
                  titre.typeId === 'cxm'
              )
              .reduce((acc, titre) => {
                if (titre.surfaceEtape && titre.surfaceEtape.surface) {
                  acc += titre.surfaceEtape?.surface
                }

                return acc
              }, 0) * 100, // conversion 1 km² = 100 ha
          productionOr: Math.floor(
            ta.titresActivites
              .filter(titreActivite => titreActivite.typeId === 'grp')
              .reduce((acc, titreActivite) => {
                if (
                  titreActivite.contenu &&
                  titreActivite.contenu.renseignements &&
                  titreActivite.contenu.renseignements.orBrut
                ) {
                  const orBrut = titreActivite.contenu.renseignements.orBrut
                  if (typeof orBrut === 'number') {
                    acc += orBrut
                  }
                }

                return acc
              }, 0) / 1000
          ), // conversion 1000g = 1kg
          energie: Math.round(
            ta.titresActivites
              .filter(titreActivite => titreActivite.typeId === 'grp')
              .reduce((acc, titreActivite) => {
                if (
                  titreActivite.contenu &&
                  titreActivite.contenu.renseignements
                ) {
                  if (titreActivite.contenu.renseignements.carburantDetaxe) {
                    const carburantDetaxe =
                      titreActivite.contenu.renseignements.carburantDetaxe
                    if (typeof carburantDetaxe === 'number') {
                      acc += carburantDetaxe
                    }
                  }
                  if (
                    titreActivite.contenu.renseignements.carburantConventionnel
                  ) {
                    const carburantConventionnel =
                      titreActivite.contenu.renseignements
                        .carburantConventionnel
                    if (typeof carburantConventionnel === 'number') {
                      acc += carburantConventionnel
                    }
                  }
                }

                return acc
              }, 0)
          ),
          mercure: ta.titresActivites
            .filter(titreActivite => titreActivite.typeId === 'grp')
            .reduce((acc, titreActivite) => {
              if (
                titreActivite.contenu &&
                titreActivite.contenu.renseignements &&
                titreActivite.contenu.renseignements.mercure
              ) {
                const mercure = titreActivite.contenu.renseignements.mercure

                if (typeof mercure === 'number') {
                  acc += Math.abs(mercure)
                }
              }

              return acc
            }, 0),
          environnementCout: Math.round(
            ta.titresActivites
              .filter(titreActivite => titreActivite.typeId === 'grp')
              .reduce((acc, titreActivite) => {
                if (
                  titreActivite.contenu &&
                  titreActivite.contenu.renseignements &&
                  titreActivite.contenu.renseignements.environnement
                ) {
                  const environnement =
                    titreActivite.contenu.renseignements.environnement
                  if (typeof environnement === 'number') {
                    acc += environnement
                  }
                }

                return acc
              }, 0)
          ),
          nbSalaries: Math.round(
            ta.titresActivites
              .filter(
                titreActivite =>
                  titreActivite.typeId === 'grp' &&
                  (titreActivite.titre!.typeId === 'axm' ||
                    titreActivite.titre!.typeId === 'pxm' ||
                    titreActivite.titre!.typeId === 'cxm')
              )
              .reduce((acc, titreActivite) => {
                if (
                  titreActivite.contenu &&
                  titreActivite.contenu.renseignements &&
                  titreActivite.contenu.renseignements.effectifs
                ) {
                  const effectif =
                    titreActivite.contenu.renseignements.effectifs
                  if (typeof effectif === 'number') {
                    acc += effectif
                  }
                  if (typeof effectif === 'string') {
                    acc += parseFloat(effectif)
                  }
                }

                return acc
              }, 0)
          ),
          moyEnginsMotorises: Math.round(
            ta.titresActivites
              .filter(titreActivite => titreActivite.typeId === 'grp')
              .reduce((acc, titreActivite) => {
                if (
                  titreActivite.contenu &&
                  titreActivite.contenu.renseignements
                ) {
                  if (titreActivite.contenu.renseignements.pelles) {
                    const pelles = titreActivite.contenu.renseignements.pelles
                    if (typeof pelles === 'number') {
                      acc += pelles
                    }
                  }
                  if (titreActivite.contenu.renseignements.pompes) {
                    const pompes = titreActivite.contenu.renseignements.pompes
                    if (typeof pompes === 'number') {
                      acc += pompes
                    }
                  }
                }

                return acc
              }, 0) /
              ta.titresActivites.filter(
                titreActivite => titreActivite.typeId === 'grp'
              ).length
          ),
          nbRapportProductionOrDeposes: ta.titresActivites.filter(
            titreActivite =>
              titreActivite.typeId === 'grp' && titreActivite.statutId === 'dep'
          ).length,
          nbRapportProductionOrTotal: Math.round(
            (ta.titresActivites.filter(
              titreActivite =>
                titreActivite.typeId === 'grp' &&
                titreActivite.statutId === 'dep'
            ).length *
              100) /
              ta.titresActivites.filter(
                titreActivite => titreActivite.typeId === 'grp'
              ).length
          )
        }

        return { annee, dataTb }
      })

    return { anneesTbGuyane }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGlobales, tbGuyane }
