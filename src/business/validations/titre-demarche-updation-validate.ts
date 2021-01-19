import { ITitreDemarche } from '../../types'

const titreDemarcheUpdationValidate = async (
  titreDemarcheNew: ITitreDemarche,
  titreDemarcheOld: ITitreDemarche
) => {
  const errors = [] as string[]

  if (
    titreDemarcheNew.typeId !== titreDemarcheOld.typeId &&
    titreDemarcheOld.etapes?.length
  ) {
    errors.push(
      'impossible de modifier le type d’une démarche si celle-ci a déjà une ou plusieurs étapes'
    )
  }

  return errors
}

export { titreDemarcheUpdationValidate }
