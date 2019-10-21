const numberProps = ['duree', 'engagement', 'surface', 'volume']

const titreEtapeNumbersCheck = (titreEtape, sections) => {
  const errors = numberProps.reduce((errors, prop) => {
    if (titreEtape[prop] && titreEtape[prop] < 0) {
      errors.push(`le champs ${prop} ne peut avoir une valeur négative`)
    }

    return errors
  }, [])

  // TODO
  // prendre en compte les champs dont le type === 'number'
  // dans les sections

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapeNumbersCheck
