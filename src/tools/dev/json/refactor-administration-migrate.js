const {
  readFileSync: read,
  writeFileSync: write,
  unlinkSync: remove
} = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

domainesIds.forEach(domaineId => {
  const oldFilePath = `./sources/titres-${domaineId}-titres-administrations-centrales.json`
  const newFilePath = `./sources/titres-${domaineId}-titres-administrations-gestionnaires.json`
  const oldTitresAdm = JSON.parse(read(oldFilePath))

  const newTitresAdm = oldTitresAdm.map(titreAdm => {
    titreAdm.associee = titreAdm.subsidiaire
    delete titreAdm.subsidiaire

    return titreAdm
  })

  remove(oldFilePath)

  write(newFilePath, JSON.stringify(newTitresAdm, null, 2))
})

domainesIds.forEach(domaineId => {
  const filePath = `./sources/titres-${domaineId}-titres-administrations-locales.json`
  const oldTitresLoc = JSON.parse(read(filePath))

  const newTitresLoc = oldTitresLoc.map(titreLoc => {
    titreLoc.associee = titreLoc.subsidiaire
    delete titreLoc.subsidiaire

    return titreLoc
  })

  write(filePath, JSON.stringify(newTitresLoc, null, 2))
})
