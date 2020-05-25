import { IGeoSysteme } from '../../types'
import { geoSystemesGet } from '../queries/metas'

const geo = {
  systemes: [] as IGeoSysteme[]
}

const geoSystemesInit = async () => {
  geo.systemes = await geoSystemesGet()
}

export default geo

export { geoSystemesInit }
