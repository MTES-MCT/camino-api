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
      recherches,
      titresModifies,
      actions,
      sessionDuree,
      telechargements,
      signalements,
      reutilisations
    } = await matomoData()

    const demarches = titresActivites.filter(titreActivite => {
      const dateSaisie = titreActivite.dateSaisie

      return (
        dateSaisie &&
        dateSaisie.slice(0, 4) === new Date().getFullYear().toString()
      )
    }).length

    return {
      titresActivitesBeneficesEntreprise,
      titresActivitesBeneficesAdministration,
      recherches,
      titresModifies,
      actions,
      sessionDuree,
      telechargements,
      demarches,
      signalements,
      reutilisations
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const statistiquesGuyane = async () => {
  try {
    const currentAnnee = new Date().getFullYear()
    const anneesArray = (annee => {
      const anneesArray = []
      for (let i = 5; i >= 0; i--) {
        anneesArray.push(annee - i)
      }

      return anneesArray
    })(currentAnnee)

    const titres = await titresGet(
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

    const titresActivites = await titresActivitesGet(
      {},
      {
        fields: {
          titre: { id: {} }
        }
      },
      'super'
    )

    const anneesStatistiquesGuyane = anneesArray.map(annee => {
      const regex = new RegExp(annee.toString(), 'g')
      const titresFiltered = titres.filter(titre => titre.id.match(regex))
      const titresActivitesFiltered = titresActivites.filter(
        ta => ta.annee === annee
      )

      const statistiqueGuyane = {
        titrersArm: titresFiltered.filter(titre => titre.typeId === 'arm')
          .length,
        titrersPrm: titresFiltered.filter(titre => titre.typeId === 'prm')
          .length,
        titrersAxm: titresFiltered.filter(titre => titre.typeId === 'axm')
          .length,
        titrersPxm: titresFiltered.filter(titre => titre.typeId === 'pxm')
          .length,
        titrersCxm: titresFiltered.filter(titre => titre.typeId === 'cxm')
          .length,
        surfaceExploration:
          titresFiltered.reduce((acc, titre) => {
            if (
              (titre.typeId === 'arm' || titre.typeId === 'prm') &&
              titre.surfaceEtape &&
              titre.surfaceEtape.surface
            ) {
              acc += titre.surfaceEtape?.surface
            }

            return acc
          }, 0) * 100, // conversion 1 km² = 100 ha
        surfaceExploitation:
          titresFiltered.reduce((acc, titre) => {
            if (
              (titre.typeId === 'axm' ||
                titre.typeId === 'pxm' ||
                titre.typeId === 'cxm') &&
              titre.surfaceEtape &&
              titre.surfaceEtape.surface
            ) {
              acc += titre.surfaceEtape?.surface
            }

            return acc
          }, 0) * 100, // conversion 1 km² = 100 ha
        productionOr: Math.floor(
          titresActivitesFiltered.reduce((acc, titreActivite) => {
            if (
              titreActivite.typeId === 'grp' &&
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
        carburantConventionnel: Math.round(
          titresActivitesFiltered.reduce((acc, titreActivite) => {
            if (
              titreActivite.typeId === 'grp' &&
              titreActivite.contenu &&
              titreActivite.contenu.renseignements &&
              titreActivite.contenu.renseignements.carburantConventionnel
            ) {
              const carburantConventionnel =
                titreActivite.contenu.renseignements.carburantConventionnel
              if (typeof carburantConventionnel === 'number') {
                acc += carburantConventionnel
              }
            }

            return acc
          }, 0) / 1000
        ), // milliers de litres
        carburantDetaxe: Math.round(
          titresActivitesFiltered.reduce((acc, titreActivite) => {
            if (
              titreActivite.typeId === 'grp' &&
              titreActivite.contenu &&
              titreActivite.contenu.renseignements &&
              titreActivite.contenu.renseignements.carburantDetaxe
            ) {
              const carburantDetaxe =
                titreActivite.contenu.renseignements.carburantDetaxe
              if (typeof carburantDetaxe === 'number') {
                acc += carburantDetaxe
              }
            }

            return acc
          }, 0) / 1000
        ), // milliers de litres
        mercure: titresActivitesFiltered.reduce((acc, titreActivite) => {
          if (
            titreActivite.typeId === 'grp' &&
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
          titresActivitesFiltered.reduce((acc, titreActivite) => {
            if (
              titreActivite.typeId === 'grp' &&
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
        salaries: Math.round(
          titresActivitesFiltered.reduce((acc, titreActivite) => {
            if (
              titreActivite.typeId === 'grp' &&
              (titreActivite.titre!.typeId === 'axm' ||
                titreActivite.titre!.typeId === 'pxm' ||
                titreActivite.titre!.typeId === 'cxm') &&
              titreActivite.contenu &&
              titreActivite.contenu.renseignements &&
              titreActivite.contenu.renseignements.effectifs
            ) {
              const effectif = titreActivite.contenu.renseignements.effectifs
              if (typeof effectif === 'number') {
                acc += effectif
              }
              if (typeof effectif === 'string') {
                acc += parseFloat(effectif)
              }
            }

            return acc
          }, 0) / 4 // somme des effectifs sur 4 trimestre
        ),
        rapportProductionOrDeposes: titresActivitesFiltered.filter(
          titreActivite =>
            titreActivite.typeId === 'grp' && titreActivite.statutId === 'dep'
        ).length,
        rapportProductionOrRatio: Math.round(
          (titresActivitesFiltered.filter(
            titreActivite =>
              titreActivite.typeId === 'grp' && titreActivite.statutId === 'dep'
          ).length *
            100) /
            titresActivitesFiltered.filter(
              titreActivite => titreActivite.typeId === 'grp'
            ).length
        )
      }

      return { annee, statistiqueGuyane }
    })

    return { anneesStatistiquesGuyane }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGlobales, statistiquesGuyane }
