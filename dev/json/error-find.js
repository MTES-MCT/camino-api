const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const errorFind = (a, b, join) => {
  const elementsA = domainesIds.flatMap(domaineId =>
    require(`../../sources/titres-${domaineId}-titres-${a}.json`)
  )

  const elementsB = domainesIds.flatMap(domaineId =>
    require(`../../sources/titres-${domaineId}-titres-${b}.json`)
  )

  elementsB.reduce((index, r) => {
    const p = elementsA.find(p => p.id === r[join])

    if (!p) {
      console.log(r)
    }

    return index
  }, {})
}

errorFind('etapes', 'documents', 'titre_etape_id')
