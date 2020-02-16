import { IGeoSysteme } from '../../types'
import { geoSystemesGet } from '../queries/metas'

let geoSystemes = [] as IGeoSysteme[]

const geoSystemesInit = async () => {
  geoSystemes = await geoSystemesGet()
}

export default geoSystemes

export { geoSystemesInit }
