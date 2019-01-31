import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesGet = async ({ demarchesIds, titresIds }) =>
  TitresDemarches.query()
    .skipUndefined()
    .eager(options.demarches.eager)
    .orderBy('ordre')
    .whereIn('titresDemarches.typeId', demarchesIds)
    .whereIn('titresDemarches.titreId', titresIds)

const titreDemarcheGet = async demarcheId =>
  TitresDemarches.query()
    .eager(options.demarches.eager)
    .findById(demarcheId)

const titreDemarcheStatutIdUpdate = async ({ id, statutId }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ statutId })

const titreDemarcheOrdreUpdate = async ({ id, ordre }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ ordre })

export {
  titreDemarcheGet,
  titresDemarchesGet,
  titreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate
}
