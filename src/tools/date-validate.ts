const dateValidate = (str: string | undefined | null) => {
  if (!str) return 'Date manquante'

  const date = new Date(str)

  if (date.toString() === 'Invalid Date') {
    return 'Date invalide'
  }

  return null
}

export { dateValidate }
