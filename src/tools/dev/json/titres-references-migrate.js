const { readFileSync: read, writeFileSync: write } = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

domainesIds.forEach(domaineId => {
  const titresFilePath = `./sources/titres-${domaineId}-titres.json`
  const titres = JSON.parse(read(titresFilePath))
  const titresReferences = []

  titres.forEach(titre => {
    if (titre.references) {
      Object.keys(titre.references).forEach(key => {
        titresReferences.push({
          titre_id: titre.id,
          type_id: key.toLowerCase().substr(0, 3),
          nom: titre.references[key]
        })
      })
    }

    delete titre.references
  })

  write(titresFilePath, JSON.stringify(titres, null, 2))
  write(
    `./sources/titres-${domaineId}-titres-references.json`,
    JSON.stringify(titresReferences, null, 2)
  )

  titresReferences.forEach(tr => {
    console.log(`${tr.type_id}: ${tr.nom}`)
  })
})
