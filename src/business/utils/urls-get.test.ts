import { activitesUrlGet } from './urls-get'

describe('activitesUrlGet', () => {
  test.each`
    params                                    | url
    ${undefined}                              | ${`${process.env.UI_URL}/activites?page=1&intervalle=200&ordre=asc`}
    ${{ typesIds: ['toto'] }}                 | ${`${process.env.UI_URL}/activites?page=1&intervalle=200&ordre=asc&typesIds=toto`}
    ${{ typesIds: ['toto', 'tata'] }}         | ${`${process.env.UI_URL}/activites?page=1&intervalle=200&ordre=asc&typesIds=toto%2Ctata`}
    ${{ typesIds: ['toto'], annees: [2010] }} | ${`${process.env.UI_URL}/activites?page=1&intervalle=200&ordre=asc&typesIds=toto&annees=2010`}
  `(
    'test la construction de l url des activités',
    ({
      params,
      url
    }: {
      params: { typesIds?: string[]; statutsIds?: string[]; annees?: number[] }
      url: string
    }) => {
      expect(activitesUrlGet(params)).toEqual(url)
    }
  )
})
