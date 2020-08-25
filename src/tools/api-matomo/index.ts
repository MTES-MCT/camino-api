/* eslint-disable camelcase */
import fetch from 'node-fetch'

const matomoData = async () => {
  // calcul du mois de départ

  const statsNbrMonth = parseInt(process.env.STATS_NBR_MONTH!) - 1

  const date = new Date()
  date.setMonth(date.getMonth() - statsNbrMonth)
  date.setDate(1)
  const startDate = date.toISOString().slice(0, 10)

  // Datas de la page 'Récapitulatif' des visites dans matomo
  // url
  const pathVisit = `${process.env
    .API_MATOMO_URL!}?date=${startDate},today&expanded=1&filter_limit=-1&format=JSON&format_metrics=1&idSite=${process
    .env
    .API_MATOMO_ID!}&method=API.get&module=API&period=month&token_auth=${process
    .env.API_MATOMO_TOKEN!}`

  // Matomo retourne un objet dont les clés sont les mois, et les valeurs sont des objets dont les clés utiles aux stats sont
  // nb_searches : nombre de recherches (int)
  // nb_actions_per_visit : nombre moyen d'actions (int)
  // avg_time_on_site : temps de session moyen (string)
  // nb_downloads : nombre de téléchargements
  const matomoVisitData = await fetch(pathVisit).then(res => res.json())

  // tableau des mois
  const months = Object.keys(matomoVisitData)
  // mois courant
  const currentMonth = months[months.length - 1]
  // données du mois courant
  const currentData = matomoVisitData[currentMonth]
  // objet mois:nbr de recherches
  const nbSearchObject = JSON.parse(JSON.stringify(matomoVisitData))
  const nbSearchArray: {
    month: string
    value: string
  }[] = []
  Object.keys(nbSearchObject).forEach(key => {
    nbSearchObject[key] = (nbSearchObject[key].nb_searches || 0).toString()
    nbSearchArray.push({
      month: key,
      value: nbSearchObject[key]
    })
  })

  // nombre d'action du mois courant
  const nbAction = currentData.nb_actions_per_visit.toString()
  // temps de session du mois courant
  const timeSession = formatTime(currentData.avg_time_on_site)
  // nombre de téléchargements du mois courant
  const nbDonwload = currentData.nb_downloads.toString()

  // Datas des évènements, catégorie 'titres-sections', actions:
  // titre-ajouter (n'existe pas actuellement)
  // titre-editer
  // titre-demarche_ajouter
  // titre-demarche_editer
  // titre-demarche_supprimer
  // titre-etape_ajouter
  // titre-etape_editer
  // titre-etape_supprimer
  // titre-etape-doc_ajouter
  // titre-etape-doc_editer (n'existe pas actuellement)
  const eventActionsArray = [
    'titre-ajouter',
    'titre-editer',
    'titre-demarche_ajouter',
    'titre-demarche_editer',
    'titre-demarche_supprimer',
    'titre-etape_ajouter',
    'titre-etape_editer',
    'titre-etape_supprimer',
    'titre-etape-doc_ajouter',
    'titre-etape-doc_editer'
  ]

  // calcul de la liste des dates (la requête s'effectue mois par mois)
  const dateArray = getDateArray(statsNbrMonth)

  const nbMajTitresArray = await Promise.all(
    dateArray.map(async date => {
      // url
      const pathSection = `${process.env.API_MATOMO_URL}?date=${date}&expanded=1&filter_limit=-1&format=JSON&idSite=${process.env.API_MATOMO_ID}&method=Events.getCategory&module=API&period=month&segment=&token_auth=${process.env.API_MATOMO_TOKEN}`

      const matomoSectionData = await fetch(pathSection).then(res => res.json())

      return { month: date, value: matomoSectionData }
    })
  ).then(res => {
    // Matomo retourne un tableau d'objets dont les clés utiles aux stats sont
    // label : le nom de la catégorie d'évènement
    // subtable : tableau d'objets dont les clés utiles aux stats sont
    //   |->   label : le nom de l'action de l'évènement
    //   |->   nb_events : le nombre d'action de l'évènement

    return res.map(data => {
      const month = data.month.slice(0, 7)
      if (!data.value || !data.value.length) {
        return { month: month, value: 0 }
      }
      const nbMaj = data.value
        .find((cat: { label: string }) => cat.label == 'titre-sections')
        .subtable.reduce((acc: any[], eventAction: { label: string }) => {
          if (eventActionsArray.includes(eventAction.label)) {
            acc.push(eventAction)
          }

          return acc
        }, [])
        .map((eventAction: { nb_events: any }) => eventAction.nb_events)
        .reduce((total: number, nbEvent: number) => (total += nbEvent), 0)

      return { month: month, value: nbMaj }
    })
  })

  return {
    nbSearchArray,
    nbMajTitresArray,
    nbAction,
    timeSession,
    nbDonwload
  }
}

const formatTime = (time: string) => {
  // si le temps ne présente que des secondes, l'afficher ainsi
  // sinon, ne garder que les minutes
  const index = time.search('min')

  return index == -1 ? time : time.substring(0, index + 3).replace(' ', '')
}

const getDateArray = (nbrMonth: number) => {
  const dateArray = []

  for (let i = 0; i <= nbrMonth; i++) {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - i)
    startDate.setDate(1)
    dateArray[nbrMonth - i] = startDate.toISOString().slice(0, 10)
  }

  return dateArray
}

export { matomoData }
