const propsNumbersCheck = <T>(props: [keyof T], element: T) => {
  const errors = props.reduce((errors: string[], prop) => {
    if (element[prop] && ((element[prop] as unknown) as number) < 0) {
      errors.push(`le champ "${prop}" ne peut pas avoir une valeur négative`)
    }

    return errors
  }, [])

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default propsNumbersCheck
