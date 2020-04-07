import { ITitreActivite, IFields, IUtilisateur } from '../../types'

import graphFormat from './graph/format'
import { fieldTitreAdd } from './graph/fields-add'
import graphBuild from './graph/build'

import TitresActivites from '../models/titres-activites'
import options from './_options'
import { titreActivitePermissionQueryBuild } from './permissions/titres-activites'
import { userGet } from './utilisateurs'

const titreActivitesQueryBuild = (
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  if (!user?.permissionId) return null

  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'activite', graphFormat)
    : options.titresActivites.graph

  const q = TitresActivites.query().withGraphFetched(graph)

  titreActivitePermissionQueryBuild(q, user)

  q.groupBy('titresActivites.id')

  return q
}

const titreActiviteGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titreActivitesQueryBuild({ fields }, user)
  if (!q) return undefined

  return (await q.findById(id)) as ITitreActivite
}

const titresActivitesGet = async (
  { typeId, annee }: { typeId?: string; annee?: number },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titreActivitesQueryBuild({ fields }, user)
  if (!q) return []

  if (typeId) {
    q.where('titresActivites.typeId', typeId)
  }

  if (annee) {
    q.where('titresActivites.annee', Number(annee))
  }

  return q
}

const titreActivitesUpsert = async (titreActivites: ITitreActivite[]) =>
  TitresActivites.query()
    .withGraphFetched(options.titresActivites.graph)
    .upsertGraph(titreActivites, { insertMissing: true })

const titreActiviteUpdate = async (
  id: string,
  props: Partial<ITitreActivite>,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'activite', graphFormat)
    : options.titresActivites.graph

  return TitresActivites.query()
    .withGraphFetched(graph)
    .patchAndFetchById(id, props)
}

export {
  titreActiviteGet,
  titreActivitesUpsert,
  titresActivitesGet,
  titreActiviteUpdate
}
