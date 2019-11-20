const {
  readFileSync: read,
  writeFileSync: write,
  unlinkSync: remove
} = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

domainesIds.forEach(domaineId => {
  const oldFilePath = `./sources/titres-${domaineId}-titres-administrations-gestionnaires.json`
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