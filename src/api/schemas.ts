import { buildSchema } from 'graphql'

import index from './schemas/index'
import metas from './schemas/metas'
import metasActivites from './schemas/metas-activites'
import territoires from './schemas/territoires'
import calendrier from './schemas/calendrier'
import titres from './schemas/titres'
import substances from './schemas/substances'
import geojson from './schemas/geojsons'
import points from './schemas/points'
import utilisateurs from './schemas/utilisateurs'
import administrations from './schemas/administrations'
import entreprises from './schemas/entreprises'
import titresActivites from './schemas/titres-activites'
import statistiques from './schemas/statistiques'

const schema = buildSchema(`
  ${index}

  ${metas}

  ${metasActivites}

  ${territoires}

  ${calendrier}

  ${titres}

  ${substances}

  ${geojson}

  ${points}

  ${utilisateurs}

  ${administrations}

  ${entreprises}

  ${titresActivites}

  ${statistiques}
`)

export default schema
