import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { matomoData } from '../../../tools/api-matomo/index'
import { ITitre, ITitreActivite } from '../../../types'

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

const statistiqueGuyaneBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => ({
  annee,
  titresArm: titres.filter(t => t.typeId === 'arm').length,
  titresPrm: titres.filter(t => t.typeId === 'prm').length,
  titresAxm: titres.filter(t => t.typeId === 'axm').length,
  titresPxm: titres.filter(t => t.typeId === 'pxm').length,
  titresCxm: titres.filter(t => t.typeId === 'cxm').length,
  surfaceExploration:
    titres.reduce((acc, t) => {
      if (
        (t.typeId === 'arm' || t.typeId === 'prm') &&
        t.surfaceEtape &&
        t.surfaceEtape.surface
      ) {
        acc += t.surfaceEtape?.surface
      }

      return acc
    }, 0) * 100, // conversion 1 km² = 100 ha
  surfaceExploitation:
    titres.reduce((acc, t) => {
      if (
        (t.typeId === 'axm' || t.typeId === 'pxm' || t.typeId === 'cxm') &&
        t.surfaceEtape &&
        t.surfaceEtape.surface
      ) {
        acc += t.surfaceEtape?.surface
      }

      return acc
    }, 0) * 100, // conversion 1 km² = 100 ha
  productionOr: Math.floor(
    titresActivites.reduce((acc, ta) => {
      if (
        ta.typeId === 'grp' &&
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements.orBrut
      ) {
        const orBrut = ta.contenu.renseignements.orBrut
        if (typeof orBrut === 'number') {
          acc += orBrut
        }
      }

      return acc
    }, 0) / 1000
  ), // conversion 1000g = 1kg
  carburantConventionnel: Math.round(
    titresActivites.reduce((acc, ta) => {
      if (
        ta.typeId === 'grp' &&
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements.carburantConventionnel
      ) {
        const carburantConventionnel =
          ta.contenu.renseignements.carburantConventionnel

        if (typeof carburantConventionnel === 'number') {
          acc += carburantConventionnel
        }
      }

      return acc
    }, 0) / 1000
  ), // milliers de litres
  carburantDetaxe: Math.round(
    titresActivites.reduce((acc, ta) => {
      if (
        ta.typeId === 'grp' &&
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements.carburantDetaxe
      ) {
        const carburantDetaxe = ta.contenu.renseignements.carburantDetaxe

        if (typeof carburantDetaxe === 'number') {
          acc += carburantDetaxe
        }
      }

      return acc
    }, 0) / 1000
  ), // milliers de litres
  mercure: titresActivites.reduce((acc, ta) => {
    if (
      ta.typeId === 'grp' &&
      ta.contenu &&
      ta.contenu.renseignements &&
      ta.contenu.renseignements.mercure
    ) {
      const mercure = ta.contenu.renseignements.mercure

      if (typeof mercure === 'number') {
        acc += Math.abs(mercure)
      }
    }

    return acc
  }, 0),
  environnementCout: Math.round(
    titresActivites.reduce((acc, ta) => {
      if (
        ta.typeId === 'grp' &&
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements.environnement
      ) {
        const environnement = ta.contenu.renseignements.environnement

        if (typeof environnement === 'number') {
          acc += environnement
        }
      }

      return acc
    }, 0)
  ),
  salaries: Math.round(
    titresActivites.reduce((acc, ta) => {
      if (
        ta.typeId === 'grp' &&
        (ta.titre!.typeId === 'axm' ||
          ta.titre!.typeId === 'pxm' ||
          ta.titre!.typeId === 'cxm') &&
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements.effectifs
      ) {
        const effectif = ta.contenu.renseignements.effectifs
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
  rapportProductionOrDeposes: titresActivites.filter(
    ta => ta.typeId === 'grp' && ta.statutId === 'dep'
  ).length,
  rapportProductionOrRatio: Math.round(
    (titresActivites.filter(ta => ta.typeId === 'grp' && ta.statutId === 'dep')
      .length *
      100) /
      titresActivites.filter(ta => ta.typeId === 'grp').length
  )
})

const statistiquesGuyane = async () => {
  try {
    const currentAnnee = new Date().getFullYear()
    // un tableau avec les 5 dernières années
    const anneesArray = Array.from(Array(6).keys())
      .map(e => currentAnnee - e)
      .reverse()

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

    return anneesArray.map(annee => {
      const regex = new RegExp(annee.toString(), 'g')
      const titresFiltered = titres.filter(titre => titre.id.match(regex))
      const titresActivitesFiltered = titresActivites.filter(
        ta => ta.annee === annee
      )

      return statistiqueGuyaneBuild(
        titresFiltered,
        titresActivitesFiltered,
        annee
      )
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGlobales, statistiquesGuyane }
