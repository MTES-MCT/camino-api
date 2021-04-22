import { dateValidate } from '../../../tools/date-validate'
import { ITitreActivite, ITitreEtape } from '../../../types'

/**
 * Vérifie que les champs `date` d'une étape ou activité sont valides
 *
 * @param propsNames - Noms des propriétés date de l'étape ou activité
 * @param element - Étape ou activité dont on vérifie les propriétés date
 * @returns un tableau d'erreurs si au moins une date est invalide
 *
 */

const propsDatesCheck = <T extends ITitreActivite | ITitreEtape>(
  propsNames: [keyof T],
  element: T
) => {
  const errors = propsNames.reduce((errors: string[], propId) => {
    if (element[propId]) {
      const error = dateValidate((element[propId] as unknown) as string)
      if (error) {
        errors.push(`le champ "${propId}" n'est pas une date valide`)
      }
    }

    return errors
  }, [])

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export { propsDatesCheck }
