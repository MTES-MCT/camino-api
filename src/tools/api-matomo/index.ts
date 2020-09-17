import fetch from 'node-fetch'

interface IMatomoSectionData {
  label: string
  subtable?: {
    label: string
    // eslint-disable-next-line camelcase
    nb_events: number
  }[]
  // eslint-disable-next-line camelcase
  nb_events?: number
}

interface IMatomoResult {
  [month: string]: {
    // eslint-disable-next-line camelcase
    nb_searches: number
    // eslint-disable-next-line camelcase
    nb_actions_per_visit: number
    // eslint-disable-next-line camelcase
    avg_time_on_site: string
    // eslint-disable-next-line camelcase
    nb_downloads: number
    label: string
    subtable: []
  }
}

const matomoMainDataGet = async (duree: number) => {
  // Datas de la page 'Récapitulatif' des visites dans matomo
  // url
  const pathVisit = getPath('API.get', 'month', {
    date: `previous${duree}`,
    format_metrics: 1
  })

  // Matomo retourne un objet dont
  // les clés sont les mois,
  // les valeurs sont des objets dont les clés utiles aux stats sont
  // nb_searches : nombre de recherches (int)
  // nb_actions_per_visit : nombre moyen d'actions (int)
  // avg_time_on_site : temps de session moyen (string)
  // nb_downloads : nombre de téléchargements
  const response = await fetch(pathVisit)
  const matomoVisitData: IMatomoResult = await response.json()

  //Les clés de l’objet sont les mois { "2020-09": ...,}
  const monthsArray = Object.keys(matomoVisitData)

  // objet mois:nbr de recherches
  const recherches = monthsArray.map(key => {
    return {
      mois: key,
      quantite: (matomoVisitData[key].nb_searches || 0).toString()
    }
  })

  // données du dernier mois
  const dataCurrent = matomoVisitData[monthsArray[monthsArray.length - 1]]

  // nombre d'action du dernier mois
  const actions = dataCurrent.nb_actions_per_visit.toString()
  // temps de session du dernier mois
  const sessionDuree = timeFormat(dataCurrent.avg_time_on_site)
  // nombre de téléchargements du dernier mois
  const telechargements = dataCurrent.nb_downloads.toString()

  return { recherches, actions, sessionDuree, telechargements }
}

const erreursSignaleesCountGet = async () => {
  // calcul de la liste des dates (la requête s'effectue année par année, depuis la mise en place de Matomo cad 2020)
  const dateYears = getDateYears()
  const eventErreurActionRegex = /(?=.*signaler)(?=.*erreur)/g

  return (
    await getEventCounts(
      getPath('Events.getAction', 'year', { flat: 1 }),
      dateYears,
      data =>
        data.value.reduce(
          (
            acc: number,
            act: {
              label: string
              nb_events: number
            }
          ) => {
            if (act.label.match(eventErreurActionRegex)) {
              acc += act.nb_events
            }

            return acc
          },
          0
        )
    )
  ).reduce((acc: number, erreur) => (acc += erreur.quantite), 150)
}

const reutilisationsCountGet = async () => {
  const actionTitresFluxGeojson = 'titres-flux-geojson'
  // calcul de la liste des dates (la requête s'effectue année par année, depuis la mise en place de Matomo cad 2020)
  const dateYears = getDateYears()
  return (
    await getEventCounts(
      getPath('Live.getLastVisitsDetails', 'month'),
      dateYears,
      data =>
        data.value
          .map((e: { actionDetails: any }) => e.actionDetails)
          .filter(
            (ad: { title: string }) => ad.title === actionTitresFluxGeojson
          )
    )
  ).reduce((acc: number, reutilisation) => (acc += reutilisation.quantite), 6)
}

const nbEventsBySectionGet = (
  monthData: IMatomoSectionData,
  month: string
): number => {
  // Datas des évènements, catégorie 'titres-sections', actions:
  // titre-editer
  // titre-demarche_ajouter
  // titre-demarche_editer
  // titre-demarche_supprimer
  // titre-etape_ajouter
  // titre-etape_editer
  // titre-etape_supprimer
  // titre-etape-doc_ajouter
  // jusqu'au 01/10/2020
  // et
  // titre-xxx-enregistrer
  // à partir du 01/10/2020
  const toggleDate = new Date(2020, 9, 1)

  const eventOldActionsArray = [
    'titre-editer',
    'titre-demarche_ajouter',
    'titre-demarche_editer',
    'titre-demarche_supprimer',
    'titre-etape_ajouter',
    'titre-etape_editer',
    'titre-etape_supprimer',
    'titre-etape-doc_ajouter'
  ]
  const eventNewActionRegex = /titre-[a-z-]*enregistrer/g

  if (monthData.label === 'titre-sections') {
    return monthData.subtable!.reduce(
      (
        nbEventsByAction: number,
        eventAction: {
          label: string
          nb_events: number
        }
      ) => {
        if (Date.parse(month) < Date.parse(toggleDate.toString())) {
          if (eventOldActionsArray.includes(eventAction.label)) {
            nbEventsByAction += eventAction.nb_events
          }
        } else if (eventAction.label.match(eventNewActionRegex)) {
          nbEventsByAction += eventAction.nb_events
        }

        return nbEventsByAction
      },
      0
    )
  }
  return 0
}
const titresModifiesCountGet = async (duree: number) => {
  const pathVisit = getPath('Events.getCategory', 'month', {
    date: `previous${duree}`
  })
  const response = await fetch(pathVisit)
  const matomoVisitData = await response.json()

  //Retourne un tableau par mois
  return Object.keys(matomoVisitData).reduce(
    (acc: { mois: string; quantite: number }[], month) => {
      const monthDataArray = (matomoVisitData[
        month
      ] as unknown) as IMatomoSectionData[]

      const nbEvents = monthDataArray.reduce((nbEventsByMonth, monthData) => {
        const nbEventsBySection = nbEventsBySectionGet(monthData, month)
        return nbEventsByMonth + nbEventsBySection
      }, 0)

      acc.push({ mois: month, quantite: nbEvents })

      return acc
    },
    []
  )
}

const matomoData = async () => {
  // nombre de mois pour lesquels on souhaite des stats
  const duree = 12

  const matomoResults = await Promise.all([
    matomoMainDataGet(duree),
    erreursSignaleesCountGet(),
    reutilisationsCountGet(),
    titresModifiesCountGet(duree)
  ])
  const {
    recherches,
    actions,
    sessionDuree,
    telechargements
  } = matomoResults[0]

  // nombre d'erreurs signalées
  const signalements = matomoResults[1]

  // nombre de réutilisations
  const reutilisations = matomoResults[2]

  const titresModifies = matomoResults[3]

  return {
    recherches,
    titresModifies,
    actions,
    sessionDuree,
    telechargements,
    signalements,
    reutilisations
  }
}

const timeFormat = (time: string) => {
  // si le temps ne présente que des secondes, l'afficher ainsi
  // sinon, ne garder que les minutes
  const index = time.search('min')

  return index === -1 ? time : time.substring(0, index).replace(' ', '')
}

const getDateYears = () => {
  const dateYears = []

  // année de départ : 2020
  const startYear = 2020

  // nombre d'année entre 2019 et l'année courante
  const dateCurrent = new Date()
  const anneeCount = dateCurrent.getFullYear() - startYear

  for (let i = anneeCount; i >= 0; i--) {
    const date = new Date()
    date.setFullYear(dateCurrent.getFullYear() - i)
    dateYears[anneeCount - i] = date.toISOString().slice(0, 10)
  }

  return dateYears
}

const getDates = (nbrMonth: number) => {
  const dates = []

  for (let i = 0; i <= nbrMonth; i++) {
    const dateStart = new Date()
    dateStart.setMonth(dateStart.getMonth() - i)
    dateStart.setDate(1)
    dates[nbrMonth - i] = dateStart.toISOString().slice(0, 10)
  }

  return dates
}

const getPath = (
  method: string,
  period: string,
  params?: { [param: string]: string | number }
) => {
  const _params = params
    ? Object.entries(params).reduce(
        (acc, param) => (acc = `${acc}&${param[0]}=${param[1]}`),
        ''
      )
    : ''

  return `${process.env.API_MATOMO_URL}/index.php?expanded=1${_params}&filter_limit=-1&format=JSON&idSite=${process.env.API_MATOMO_ID}&method=${method}&module=API&period=${period}&token_auth=${process.env.API_MATOMO_TOKEN}`
}

const getEventCounts = async (
  path: string,
  dates: string[],
  matomoResultToNbEvent: (arg: any) => number
) =>
  (
    await Promise.all(
      dates.map(async date => {
        const matomoSectionData: IMatomoSectionData[] = await (
          await fetch(`${path}&date=${date}`)
        ).json()

        return {
          month: date,
          value: matomoSectionData
        }
      })
    )
  ).map(data => {
    const month = data.month.slice(0, 7)
    if (!data.value || !data.value.length) {
      return { mois: month, quantite: 0 }
    }
    const nbEvent = matomoResultToNbEvent(data)

    return { mois: month, quantite: nbEvent }
  })

export { matomoData }