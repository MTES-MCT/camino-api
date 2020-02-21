import { ITitre, IDemarcheType, IUtilisateur } from '../../../types'

import metas from '../../../database/cache/metas'

import { titreDemarchePermissionAdministrationsCheck } from '../permissions/titre-edition'

const demarcheTypeFormat = (
  user: IUtilisateur | undefined,
  demarcheType: IDemarcheType,
  titreTypeId: string,
  titreStatutId: string
) => {
  const dt = metas.demarchesTypes.find(dt => dt.id === demarcheType.id)
  if (!dt) throw new Error(`${demarcheType.id} inexistant`)

  demarcheType.editable = titreDemarchePermissionAdministrationsCheck(
    user,
    titreTypeId,
    titreStatutId
  )

  return demarcheType
}

const demarchesTypesFormat = (
  user: IUtilisateur | undefined,
  demarchesTypes: IDemarcheType[],
  demarcheTypeId: string | null,
  titre: ITitre
) =>
  demarchesTypes.reduce((demarchesTypes: IDemarcheType[], dt) => {
    // si
    // - le param demarcheTypeId n'existe pas (-> création d'une démarche)
    //   ou ce param est différent de celui du type de démarche et
    // - le type démarche est unique et
    // - une autre démarche du même type existe au sein du titre
    // alors
    // - on ne l'ajoute pas à la liste des types de démarches disponibles
    if (
      (!demarcheTypeId || dt.id !== demarcheTypeId) &&
      dt.unique &&
      titre.demarches?.find(d => d.typeId === dt.id)
    ) {
      return demarchesTypes
    }

    dt = demarcheTypeFormat(user, dt, titre.typeId, titre.statutId!)

    if (dt.editable) {
      dt.titreTypeId = titre.typeId
      demarchesTypes.push(dt)
    }

    return demarchesTypes
  }, [])

export { demarcheTypeFormat, demarchesTypesFormat }
