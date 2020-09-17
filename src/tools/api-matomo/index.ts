import fetch from 'node-fetch'

interface IMatomoSectionData {
  label: string
  subtable?: {
    label: string
    // eslint-disable-next-line camelcase
    nb_events: number
  }[]
  // eslint-disable-next-line camelcase
  nb_events: number
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

const nbEventsByLabelGet = async (label: string): Promise<number> => {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  // ces évenements ont débuté à partir de 2020
  const pathVisit = getPath('Events.getAction', 'range', {
    date: `2020-01-01,${tomorrowDate.toISOString().slice(0, 10)}`,
    label
  })

  const response = await fetch(pathVisit)
  const matomoVisitData: IMatomoSectionData[] = await response.json()

  return matomoVisitData.length > 0 ? matomoVisitData[0].nb_events : 0
}

const erreursSignaleesCountGet = async () => {
  const nbEvents = await nbEventsByLabelGet('titre-erreur_signaler')

  // historiquement il y a déjà eu 150 erreurs signalées et 4 erreurs avec un ancien label
  return 150 + 4 + nbEvents
}

const reutilisationsCountGet = async () => {
  const nbEvents = await nbEventsByLabelGet('titres-flux-geojson')

  // historiquement il y a déjà eu 6 réutilisations
  return 6 + nbEvents
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

export { matomoData }
