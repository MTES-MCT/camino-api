import fetch from 'node-fetch'

interface IMatomoSectionData {
  label: string
  subtable?: {
    label: string
    // eslint-disable-next-line prettier/prettier
    nb_events: number
  }[]
  // eslint-disable-next-line prettier/prettier
  nb_events?: number
}

const matomoData = async () => {
  // calcul du mois de départ
  const monthStart = parseInt(process.env.API_MATOMO_MONTHS!) - 1

  const date = new Date()
  date.setMonth(date.getMonth() - monthStart)
  date.setDate(1)
  const dateStart = date.toISOString().slice(0, 10)

  // Datas de la page 'Récapitulatif' des visites dans matomo
  // url
  const pathVisit = `${process.env
    .API_MATOMO_URL!}/index.php?date=${dateStart},today&expanded=1&filter_limit=-1&format=JSON&format_metrics=1&idSite=${process
    .env
    .API_MATOMO_ID!}&method=API.get&module=API&period=month&token_auth=${process
    .env.API_MATOMO_TOKEN!}`

  // Matomo retourne un objet dont
  // les clés sont les mois,
  // les valeurs sont des objets dont les clés utiles aux stats sont
  // nb_searches : nombre de recherches (int)
  // nb_actions_per_visit : nombre moyen d'actions (int)
  // avg_time_on_site : temps de session moyen (string)
  // nb_downloads : nombre de téléchargements
  const response = await fetch(pathVisit)
  const matomoVisitData: {
    [month: string]: {
      // eslint-disable-next-line camelcase
      nb_searches: number
      // eslint-disable-next-line camelcase
      nb_actions_per_visit: number
      // eslint-disable-next-line camelcase
      avg_time_on_site: string
      // eslint-disable-next-line camelcase
      nb_downloads: number
    }
  } = await response.json()

  // tableau des mois
  const months = Object.keys(matomoVisitData)
  // mois courant
  const monthCurrent = months[months.length - 1]
  // données du mois courant
  const dataCurrent = matomoVisitData[monthCurrent]
  // objet mois:nbr de recherches

  const recherches = Object.keys(matomoVisitData).map(key => {
    return {
      month: key,
      value: (matomoVisitData[key].nb_searches || 0).toString()
    }
  })

  // nombre d'action du mois courant
  const actions = dataCurrent.nb_actions_per_visit.toString()
  // temps de session du mois courant
  const sessionDuree = timeFormat(dataCurrent.avg_time_on_site)
  // nombre de téléchargements du mois courant
  const telechargements = dataCurrent.nb_downloads.toString()

  // nombre d'erreurs signalées

  // calcul de la liste des dates (la requête s'effectue année par année, depuis la mise en place de Matomo cad 2020)
  const dateYears = getDateYears()
  const eventErreurActionRegex = /(?=.*signaler)(?=.*erreur)/g

  const signalements = (
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
  ).reduce((acc: number, erreur) => (acc += erreur.value), 150)

  // nombre de réutilisations
  const actionTitresFluxGeojson = 'titres-flux-geojson'

  const reutilisations = (
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
  ).reduce((acc: number, reutilisation) => (acc += reutilisation.value), 6)

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
  const tDate = new Date()
  tDate.setMonth(9)
  tDate.setDate(1)
  const dateToggle = tDate.toISOString().slice(0, 10)

  const eventActionsArray = [
    'titre-editer',
    'titre-demarche_ajouter',
    'titre-demarche_editer',
    'titre-demarche_supprimer',
    'titre-etape_ajouter',
    'titre-etape_editer',
    'titre-etape_supprimer',
    'titre-etape-doc_ajouter'
  ]

  const eventActionRegex = /titre-[a-z-]*enregistrer/g

  // calcul de la liste des dates (la requête s'effectue mois par mois)
  const dates = getDates(monthStart)

  // retourne un tableau de nombre de maj des titres en fonction de mois(dates),
  // de eventActions qui est un tableau de noms d'action d'évènements Matomo
  // de eventActionRegex une regex que les noms d'action d'évènements Matomo doivent vérifier (titre-xxx-enregistrer),
  // et de dateToggle, la date de prise en compte de ces nouvelles actions (plus fiable)
  const titresModifies = await getEventCounts(
    getPath('Events.getCategory', 'month'),
    dates,
    data =>
      data.value
        .find((cat: { label: string }) => cat.label === 'titre-sections')!
        .subtable!.reduce(
          (
            acc: number,
            eventAction: {
              label: string
              nb_events: number
            }
          ) => {
            if (Date.parse(data.month) < Date.parse(dateToggle)) {
              if (eventActionsArray.includes(eventAction.label)) {
                acc += eventAction.nb_events
              }
            } else if (eventAction.label.match(eventActionRegex)) {
              acc += eventAction.nb_events
            }

            return acc
          },
          0
        )
  )

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

  return index === -1 ? time : time.substring(0, index + 3).replace(' ', '')
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
      return { month: month, value: 0 }
    }
    const nbEvent = matomoResultToNbEvent(data)

    return { month: month, value: nbEvent }
  })

export { matomoData }
