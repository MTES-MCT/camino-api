'use strict'

const { readFileSync: read, writeFileSync: write } = require('fs')
const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

// Constitue l'ojet 'references'
const references = {}
let refId, refNom, titreId, refValue

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
        // refId est la clé de 'references-types'
        // refNom est la valeur
        // titreId est l'id du titre
        // refValue est la valeur du type de référence
        refId = key.toLowerCase().substr(0, 3)
        refNom = key.toUpperCase()
        titreId = titre.id
        refValue = titre.references[key]

        // stocke refId,refNom dans 'references-type.json' (pas de doblons)
        console.log(key.toUpperCase() + ' --> ' + titre.references[key])
        references[key.toLowerCase().substr(0, 3)] = refNom

        // stocke titreId,refId,refValue dans les 'titres_references.json' par domaine
        const myTitreRef = {}
        myTitreRef.titre_id = titreId
        myTitreRef.type_id = refId
        myTitreRef.nom = refValue
        titresReferencesArray.push(myTitreRef)
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
const ref = []

// todo : à faire en mode JS, avec des reduce, etc...
Object.keys(references)
  .sort()
  .forEach(key => {
    const myRef = {}
    myRef.id = key
    myRef.nom = references[key]
    ref.push(myRef)
    write(`${referencesFilePath}`, JSON.stringify(ref, null, 2))
    console.log(key + ' ## ' + references[key])
  })
