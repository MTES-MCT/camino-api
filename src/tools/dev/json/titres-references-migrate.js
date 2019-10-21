'use strict'

const { readFileSync: read, writeFileSync: write } = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

// Constitue l'ojet 'references'
const references = {}

// parse le json de chaque domaine de titres
domainesIds.forEach(domaineId => {
  const titresFilePath = `./sources/titres-${domaineId}-titres.json`
  const titreArray = JSON.parse(read(titresFilePath))

  const titresReferencesFilePath = `./sources/titres-${domaineId}-titres-references.json`
  const titresReferencesArray = []

  // pour chaque titre, trouve le(s) référence(s)
  titreArray.forEach(titre => {
    if (titre.references) {
      Object.keys(titre.references).forEach(key => {
        // 'references-type.json' (pas de doblons)
        console.log(key.toUpperCase() + ' --> ' + titre.references[key])
        references[key.toLowerCase().substr(0, 3)] = key.toUpperCase()

        // 'titres_references.json' par domaine
        titresReferencesArray.push({
          nom: titre.references[key],
          titre_id: titre.id,
          type_id: key.toLowerCase().substr(0, 3)
        })
      })
    }
    // retire les références dans chaque titre
    delete titre.references
  })
  // écrase chaque fichier 'titres-...-titres.json'
  write(`${titresFilePath}`, JSON.stringify(titreArray, null, 2))
  // écrase ou crée le fichier 'titres-...-titres-references.json'
  write(
    `${titresReferencesFilePath}`,
    JSON.stringify(titresReferencesArray, null, 2)
  )
})

// ajout des références dans 'references-types.json'
// parcours l'objet 'references'
const referencesFilePath = './sources/references-types.json'

const referencesRes = Object.keys(references)
  .sort()
  .map(key => ({
    id: key,
    nom: references[key]
  }))
write(`${referencesFilePath}`, JSON.stringify(referencesRes, null, 2))
