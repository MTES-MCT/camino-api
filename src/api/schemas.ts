import { buildSchema } from 'graphql'

import index from './schemas/index'
import metas from './schemas/metas'
import geo from './schemas/geo'
import titres from './schemas/titres'
import substances from './schemas/substances'
import geojson from './schemas/geojsons'
import utilisateurs from './schemas/utilisateurs'
import administrations from './schemas/administrations'
import entreprises from './schemas/entreprises'
import titresActivites from './schemas/titres-activites'

const schema = buildSchema(`
  ${index}

  ${metas}

  ${geo}

  ${titres}

  ${substances}

  ${geojson}

  ${utilisateurs}

  ${administrations}

  ${entreprises}

  ${titresActivites}
`)

export default schema
