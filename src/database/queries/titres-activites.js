import titreActivites from '../models/titres-activites'
import options from './_options'
import { titreActiviteFormat } from './_format'

const titreActiviteGet = async id => {
  const ta = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .findById(id)
    .first()

  return titreActiviteFormat(ta)
}

const titresActivitesGet = async () => {
  const tas = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .skipUndefined()

  return tas.map(ta => titreActiviteFormat(ta))
}

const titreActiviteUpdate = async titreActivite => {
  const ta = await titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .patchAndFetchById(titreActivite.id, titreActivite)
  return titreActiviteFormat(ta)
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
