// const mappingRelationsGet = mappings => {
//   return Object.keys(mappings).reduce((relations, name) => {
//     const mapping = mappings[name]

//     const { modelClass: model, join } = mapping

//     if (join.through) {
//       return [
//         ...relations,
//         splitJoin(name, join.from, join.through.from),
//         splitJoin(name, join.through.to, join.to)
//       ]
//     }

//     return [...relations, splitJoin(name, join.from, join.to, true)]
//   }, [])
// }

const titresEager = fragments => {
  const titre = fragments.titreList
  if (titre.typeCondition.name.value !== 'Titre')
    console.log(
      `eager potentiellement faussé, le retour graphql ne correspond pas au retour d'un titre: ${titre.typeCondition.name.value}`
    )
  return eagerCleaner(`[${fieldSelection(titre, fragments)}]`)
}

const titreEager = fragments => {
  const titre = fragments.titre
  if (titre.typeCondition.name.value !== 'Titre')
    console.log(
      `eager potentiellement faussé, le retour graphql ne correspond pas au retour d'un titre`
    )
  return eagerCleaner(`[${fieldSelection(titre, fragments)}]`)
}

const fieldSelection = (titre, fragments) => {
  const selectionsTitre = titre.selectionSet.selections
  let eagerSelection = ``
  // let paysInversion = false
  selectionsTitre.forEach(field => {
    const nomSelection = field.name.value
    // Amélioration à faire, importer le modèle du titre pour ne pas faire de selection arbitraire, mais ne selectionner que les relations et pas les propriétés.
    if (
      nomSelection === 'id' ||
      nomSelection === 'nom' ||
      nomSelection === '__typename' ||
      nomSelection === 'dateDebut' ||
      nomSelection === 'dateFin' ||
      nomSelection === 'references'
    )
      return

    // On ne les veut pas car ne sont ni des propriétés, ni des relations
    if (
      nomSelection === 'geojsonMultiPolygon' ||
      nomSelection === 'geojsonPoints'
    )
      return

    // doit etre dans l'eager comme comm.dep.reg.pays, mais qui est la comme pays.reg.dep.comm
    // Soit résolution de ce probleme avec des exceptions, soit je trouve un moyen
    // if (nomSelection === 'pays') {
    //   paysInversion = true
    //   return
    // } else {
    //   paysInversion = false
    // }

    eagerSelection += nomSelection

    if (field.kind === 'Field' && field.selectionSet === undefined) {
      eagerSelection += `,`
      return
    }

    const eagerData = fieldFragmentations(field, fragments)
    eagerSelection += eagerData + `,`
  })
  return eagerSelection
}

const fieldFragmentations = (field, fragments) => {
  let eagerData = ``
  const fieldFragments =
    field.selectionSet !== undefined ? field : fragments[field.name.value]
  const selectionsField = fieldFragments.selectionSet.selections
  let eagerFields = []
  selectionsField.forEach(elem => {
    const nomElem = elem.name.value
    if (nomElem !== 'id' && nomElem !== 'nom' && nomElem !== '__typename') {
      if (elem.kind === 'Field' && elem.selectionSet === undefined) return

      eagerFields.push(
        fieldSelection(
          elem.selectionSet !== undefined ? elem : fragments[elem.name.value],
          fragments
        )
      )
    }
  })

  if (eagerFields.length === 1) {
    eagerData = `${eagerData}.${eagerFields[0]}`
  } else if (eagerFields.length >= 2) {
    let eagerAjout = `.[`
    eagerFields.forEach(field => (eagerAjout = `${eagerAjout}${field}`))
    eagerData = `${eagerData}${eagerAjout}]`
  }
  return eagerData
}

const eagerCleaner = eager => {
  // A chaque ",", si il y a un "]" ou une autre "," derriere, on la supprime
  // A chaque ".", si il y a un "," derriere, on le supprime
  return eager
    .replace(/,{3}/g, ',')
    .replace(/,{2}/g, ',')
    .replace(/,]/g, ']')
    .replace(/\.]/g, ']')
    .replace(/\.,/g, ',')
}

export { titreEager, titresEager }
