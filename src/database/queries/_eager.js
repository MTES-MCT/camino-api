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

// const titresEager = fragments => {
//   const types = `[demarchesTypes.demarchesStatuts]`
//   const domaines = `[types.[demarchesTypes.demarchesStatuts]]`
//   const substances = `legales.[code, domaine]`
//   const entreprises = `[utilisateurs.permission, etablissements(orderDesc)]`
//   const administrations = `[utilisateurs.permission, domaines, type]`
//   const demarches = `[type.[etapesTypes(orderDesc).etapesStatuts], statut, phase.statut, titreType, etapes(orderDesc).[points.references.geoSysteme, type, statut, documents, substances.legales.[code, domaine],titulaires.[utilisateurs.permission, etablissements(orderDesc)],amodiataires.[utilisateurs.permission, etablissements(orderDesc)],administrations.[utilisateurs.permission, domaines, type], emprises, engagementDevise, volumeUnite, communes.departement.region.pays, incertitudes], parents.^1, enfants.^1]`
//   const communes = `departement.region.pays`
//   const titresActivites = `[type.[pays, frequence.[mois, trimestres.mois], types], statut, utilisateur]`
//   const eager = `[type.${types}, domaine.${domaines}, statut, points, substances.${substances}, titulaires.${entreprises}, amodiataires.${entreprises}, administrations.${administrations}, demarches(orderDesc).${demarches}, surfaceEtape, volumeEtape, volumeUnite, engagementEtape, engagementDevise, communes.${communes}, activites(orderByDateDesc).${titresActivites}]`
//   return eager
// }

const titreEager = fragments => {
  let eager = `[`
  const titre = fragments.titre
  if (titre.typeCondition.name.value !== 'Titre')
    console.log(
      `eager potentiellement faussé, le retour graphql ne correspond pas au retour d'un titre`
    )

  fieldSelection(titre, eager, fragments)
  eager += `]`
  return eager
}

const fieldSelection = (titre, eager, fragments) => {
  const selectionsTitre = titre.selectionSet.selections
  let eagerSelection = ``
  let paysInversion = false
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
    if (nomSelection === 'pays') {
      paysInversion = true
      return
    } else {
      paysInversion = false
    }

    eagerSelection += nomSelection

    if (field.selectionSet === undefined) {
      eagerSelection += `,`
      return
    }

    // ICI LE WHILE
    const eagerData = fieldFragmentations(field, eagerSelection, fragments)
    eagerSelection += eagerData + `,`
  })
  if (paysInversion) {
    let eagerPays = ``
    const tablePays = eagerSelection.split(',').reverse()
    tablePays.forEach(elem => (eagerPays += elem + `,`))
    eager += eagerPays
  } else {
    eager += eagerSelection
  }
  // console.log(eager)
}

const fieldFragmentations = (field, eager, fragments) => {
  let conditionSortie = true
  let eagerData = ``
  while (conditionSortie) {
    const selectionsField = field.selectionSet.selections
    let eagerFields = []
    selectionsField.forEach(elem => {
      const nomElem = elem.name.value
      if (nomElem !== 'id' && nomElem !== 'nom' && nomElem !== '__typename') {
        eagerFields.append(``)
        fieldSelection(
          elem.selectionSet !== undefined ? elem : fragments[elem.name.value],
          eagerFields[-1],
          fragments
        )
      }
    })
    if (eagerFields.length === 1) conditionSortie = false
    else if (eagerFields.length === 1) {
      eagerData = `${eagerData}.${eagerFields[0]}`
    } else eagerData = `${eagerData}.${JSON.stringify(eagerFields)}`
  }
  return eagerData
}

export { titreEager }
