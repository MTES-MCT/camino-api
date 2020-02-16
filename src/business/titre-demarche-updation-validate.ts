import { ITitreDemarche } from '../types'

const titreDemarcheUpdationValidate = async (
  titreDemarcheNew: ITitreDemarche
) => {
  const errors = [] as string[]
  // vérifie
  // - si le statut de la démarche est possible sur ce type de démarche
  // - si la démarche contient des étapes qui ne sont pas recevables

  return errors
}

export default titreDemarcheUpdationValidate
