import { dateValidate } from '../../../tools/date-validate'

const propsDatesCheck = <T>(props: [keyof T], element: T) => {
  const errors = props.reduce((errors: string[], prop) => {
    if (element[prop]) {
      const error = dateValidate((element[prop] as unknown) as string)
      if (error) {
        errors.push(`le champ "${prop}" n'est pas une date valide`)
      }
    }

    return errors
  }, [])

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default propsDatesCheck
