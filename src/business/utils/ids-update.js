const elementFromPathFind = (path, root) =>
  path.reduce((acc, name) => acc.flatMap(a => a[name]), [root])

const objectIdsUpdate = (element, parentOldId, parentId) =>
  Object.keys(element).forEach(prop => {
    const elementPropOld = element[prop]

    if (typeof elementPropOld === 'object' && elementPropOld !== null) {
      return objectIdsUpdate(elementPropOld, parentOldId, parentId)
    }

    if (
      elementPropOld &&
      typeof elementPropOld === 'string' &&
      elementPropOld.match(parentOldId)
    ) {
      const elementPropNew = elementPropOld.replace(parentOldId, parentId)

      element[prop] = elementPropNew
    }
  })

const idsUpdate = (
  relationsIdsUpdatedIndex,
  element,
  relation,
  root,
  parent = null,
  parentOldId = ''
) => {
  let hasChanged = false

  const elementOldId = element.id

  // met à jour l'id de l'élément
  if (relation.idFind) {
    const elementNewId = relation.idFind(element, parent)

    // l'id de l'élément courant n'a pas changé
    if (elementNewId !== elementOldId) {
      element.id = elementNewId

      hasChanged = true

      if (!relationsIdsUpdatedIndex[relation.name]) {
        relationsIdsUpdatedIndex[relation.name] = {}
      }

      relationsIdsUpdatedIndex[relation.name][elementNewId] = elementOldId
    }
  }

  // met à jour les propriétés qui utilisent une id qui a changée
  // - heritageProps sur les étapes
  // - propsTitreEtapesIds sur le titre
  if (relation.props && parent) {
    relation.props
      .filter(prop => element[prop])
      .forEach(prop => {
        objectIdsUpdate(element[prop], parentOldId, parent.id)
      })
  }

  // met à jour les relations
  if (relation.relations) {
    relation.relations.forEach(r => {
      // si l'id du parent n'a pas changé
      // ou que l'id de la relation n'est pas calculé
      // alors on ne parcourt pas les relations
      if (!hasChanged && !r.idFind) return

      let parentElements = []

      if (r.path) {
        parentElements = elementFromPathFind(r.path, root)
      } else if (r.name && element[r.name]) {
        parentElements = element[r.name]
      }

      if (!Array.isArray(parentElements)) {
        parentElements = [parentElements]
      }

      parentElements.forEach(parentElement => {
        hasChanged =
          idsUpdate(
            relationsIdsUpdatedIndex,
            parentElement,
            r,
            root,
            element,
            elementOldId
          ) || hasChanged
      })
    })
  }

  return hasChanged
}

export default idsUpdate
