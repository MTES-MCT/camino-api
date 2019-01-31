import { buildSchema } from 'graphql'

import index from './schemas/index'
import metas from './schemas/metas'
import titres from './schemas/titres'
import substances from './schemas/substances'
import geojson from './schemas/geojsons'
import utilisateurs from './schemas/utilisateurs'
import administrations from './schemas/administrations'
import entreprises from './schemas/entreprises'
import titresTravaux from './schemas/titres-travaux'

const schema = buildSchema(`
  ${index}

  ${metas}

  ${titres}

  ${substances}

  ${geojson}

  ${utilisateurs}

  ${administrations}

  ${entreprises}

  ${titresTravaux}
`)

export default schema
