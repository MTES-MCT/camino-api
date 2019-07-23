import TitreActivites from '../models/titres-activites'
import options from './_options'
import { titreActiviteFormat } from './_format'
// import * as sqlFormatter from 'sql-formatter'

const titreActiviteGet = async id => {
  const ta = await TitreActivites.query()
    .eager(options.titresActivites.eager)
    .findById(id)
    .first()

  return ta && titreActiviteFormat(ta)
}

const titresActivitesGet = async () => {
  const tas = await TitreActivites.query().eager(options.titresActivites.eager)

  return tas.map(ta => titreActiviteFormat(ta))
}

const titreActivitesUpsert = async titreActivites => {
  const tas = await TitreActivites.query()
    .eager(options.titresActivites.eager)
    .upsertGraph(titreActivites, { insertMissing: true })

  return tas.map(ta => titreActiviteFormat(ta))
}

const titreActiviteUpdate = async (id, props) => {
  const ta = await TitreActivites.query()
    .eager(options.titresActivites.eager)
    .patchAndFetchById(id, props)

  return ta && titreActiviteFormat(ta)
}

export {
  titreActiviteGet,
  titreActivitesUpsert,
  titresActivitesGet,
  titreActiviteUpdate
}
