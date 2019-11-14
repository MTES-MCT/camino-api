'use strict'

const { readFileSync: read, writeFileSync: write } = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

// Constitue l'ojet 'references'
const references = {}

// parse le json de chaque domaine de titres
domainesIds.forEach(domaineId => {
  const titresFilePath = `./sources/titres-${domaineId}-titres.json`
  const titres = JSON.parse(read(titresFilePath))
  const titresReferences = []

  // pour chaque titre, trouve le(s) référence(s)
  titres.forEach(titre => {
    if (titre.references) {
      Object.keys(titre.references).forEach(key => {
        // 'references-type.json' (pas de doblons)
        // console.log(key.toUpperCase() + ' --> ' + titre.references[key])
        // references[key.toLowerCase().substr(0, 3)] = key.toUpperCase()
        console.log(key + ' --> ' + titre.references[key])
        references[key.substr(0, 3)] = key

        // 'titres_references.json' par domaine
        titresReferences.push({
          nom: titre.references[key],
          titre_id: titre.id,
          // type_id: key.toLowerCase().substr(0, 3)
          type_id: key.substr(0, 3)
        })
      })
    }
    // retire les références dans chaque titre
    delete titre.references
  })
  // écrase chaque fichier 'titres-...-titres.json'
  write(titresFilePath, JSON.stringify(titres, null, 2))

  // écrase ou crée le fichier 'titres-...-titres-references.json'
  const titresReferencesFilePath = `./sources/titres-${domaineId}-titres-references.json`
  write(
    `${titresReferencesFilePath}`,
    JSON.stringify(titresReferences, null, 2)
  )
})
