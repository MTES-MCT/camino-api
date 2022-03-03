export const titreUrlGet = (titreId: string) =>
  `${process.env.UI_URL}/titres/${titreId}`

export const activiteUrlGet = (activiteId: string) =>
  `${process.env.UI_URL}/activites/${activiteId}`

export const activitesUrlGet = (params?: {
  typesIds?: string[]
  statutsIds?: string[]
  annees?: number[]
}): string => {
  const url = new URL(`${process.env.UI_URL}/activites`)

  url.searchParams.append('page', '1')
  url.searchParams.append('intervalle', '200')
  url.searchParams.append('ordre', 'asc')

  if (params && Object.keys(params).length) {
    Object.entries(params).forEach(([key, values]) =>
      url.searchParams.append(key, values.join(','))
    )
  }

  return url.href
}
