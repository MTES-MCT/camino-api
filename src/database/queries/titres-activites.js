import titreActivites from '../models/titres-activites'
import options from './_options'
import { titreActiviteFormat } from './_format'
// import * as sqlFormatter from 'sql-formatter'

const titreActiviteGet = async id => {
  const ta = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .findById(id)
    .first()

  return ta && titreActiviteFormat(ta)
}

const titresActivitesGet = async () => {
  const tas = await titreActivites.query().eager(options.titresActivites.eager)

  return tas.map(ta => titreActiviteFormat(ta))
}

const titreActiviteUpdate = async (id, props) => {
  const ta = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .patchAndFetchById(id, props)

  return ta && titreActiviteFormat(ta)
}

const titreActiviteInsert = async titreActivite => {
  const ta = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .insert(titreActivite)

  return titreActiviteFormat(ta)
}

export {
  titreActiviteGet,
  titreActiviteInsert,
  titresActivitesGet,
  titreActiviteUpdate
}
