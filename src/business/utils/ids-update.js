const elementFromPathFind = (path, root) =>
  path.reduce((acc, elementName) => {
    if (elementName) {
      acc = acc[elementName]
    }

    return acc
  }, root)

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

  // met à jour les propriétés
  if (relation.props && parent && !relation.depth) {
    relation.props.forEach(prop => {
      const elementPropOld = element[prop]

      if (!elementPropOld || !elementPropOld.match(parentOldId)) return

      const elementPropNew = elementPropOld.replace(parentOldId, parent.id)

      element[prop] = elementPropNew
    })
  }

  // met à jour les propriétés de propsTitreEtapesIds
  if (relation.props && parent && relation.depth === '1') {
    relation.props.forEach(prop => {
      if (!element[prop]) return

      Object.keys(element[prop]).forEach(elementId => {
        const elementPropOld = element[prop][elementId]

        if (!elementPropOld || !elementPropOld.match(parentOldId)) return

        const elementPropNew = elementPropOld.replace(parentOldId, parent.id)

        element[prop][elementId] = elementPropNew
      })
    })
  }

  // met à jour les contenus s'ils font référence à des ids
  if (relation.props && parent && relation.depth === '2') {
    relation.props.forEach(prop => {
      if (!element[prop]) return

      Object.keys(element[prop]).forEach(sectionId => {
        if (!element[prop][sectionId]) return

        Object.keys(element[prop][sectionId]).forEach(elementId => {
          const elementPropOld = element[prop][sectionId][elementId]

          if (!elementPropOld || !elementPropOld.match(parentOldId)) return

          const elementPropNew = elementPropOld.replace(parentOldId, parent.id)

          element[prop][sectionId][elementId] = elementPropNew
        })
      })
    })
  }

  // met à jour les relations
  if (relation.relations) {
    relation.relations.forEach(r => {
      // si l'id du parent n'a pas changé
      // ou que l'id de la relation n'est pas calculé
      // alors on ne parcourt pas les relations
      if (!hasChanged && !r.idFind) return

      const elementPointer = r.path
        ? elementFromPathFind(r.path, root)
        : element

      if (elementPointer[r.name]) {
        let elements = elementPointer[r.name]

        if (!Array.isArray(elements)) {
          elements = [elements]
        }

        hasChanged =
          elements.reduce(
            (hasChanged, e) =>
              idsUpdate(
                relationsIdsUpdatedIndex,
                e,
                r,
                root,
                element,
                elementOldId
              ) || hasChanged,
            false
          ) || hasChanged
      }
    })
  }

  return hasChanged
}

export default idsUpdate
