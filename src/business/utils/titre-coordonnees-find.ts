import { ITitrePoint } from '../../types'

import { geojsonCenter } from '../../tools/geojson'

const titreCoordonneesFind = (titrePoints?: ITitrePoint[] | null) => {
  if (!titrePoints?.length) return null

  const [x, y] = geojsonCenter(titrePoints)

  return { x, y }
}

export { titreCoordonneesFind }
