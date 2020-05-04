const fileNameCreate = (name: string, type: string) => {
  const d = new Date()
  const dd = d
    .getDate()
    .toString()
    .padStart(2, '0')
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = d
    .getHours()
    .toString()
    .padStart(2, '0')
  const mi = d
    .getMinutes()
    .toString()
    .padStart(2, '0')

  return `${yyyy}${mm}${dd}-${hh}h${mi}-camino-${name}.${type}`
}

export { fileNameCreate }
