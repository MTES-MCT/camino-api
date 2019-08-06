const elementsLinkedAccumulate = (root, path) => {
  const { elementsLinked } = path.split('/').reduce(
    (acc, name, i, path) => {
      if (i === path.length - 1 && acc.root[name]) {
        let items = acc.root[name]
        items = !Array.isArray(items) ? [items] : items

        acc.elementsLinked = acc.elementsLinked.concat(items)
      }

      acc.root = acc.root[name]

      return acc
    },
    { root, elementsLinked: [] }
  )

  return elementsLinked
}

const elementRelationsUpdate = (
  element,
  params,
  root,
  parent = null,
  parentIdOld = ''
) => {
  let hasChanged = false

  const elementIdOld = element.id

  // met à jour l'id
  if (params.idUpdate) {
    const elementIdNew = params.idUpdate(
      element,
      parent,
      parentIdOld,
      parent && parent.id
    )

    // l'id de l'élément courant n'a pas changé
    // il n'est pas nécessaire de mettre à jour ses relations
    if (elementIdNew === elementIdOld) {
      return false
    }

    element.id = elementIdNew
    hasChanged = true
  }

  // met à jour les propriétés basée sur l'id parent
  if (params.props && parent) {
    params.props.forEach(prop => {
      if (element[prop] && element[prop].match(parentIdOld)) {
        element[prop] = element[prop].replace(parentIdOld, parent.id)
        hasChanged = true
      }
    })
  }

  // met à jour les tables en relation avec l'élément courant
  if (params.links) {
    params.links.forEach(link => {
      const elementsLinked =
        link.path[0] === '/'
          ? elementsLinkedAccumulate(root, link.path.slice(1))
          : elementsLinkedAccumulate(element, link.path)

      if (elementsLinked && elementsLinked.length) {
        elementsLinked.forEach(elementLinked => {
          hasChanged =
            elementRelationsUpdate(
              elementLinked,
              link,
              root,
              element,
              elementIdOld
            ) || hasChanged
        })
      }
    })
  }

  return hasChanged
}

export default elementRelationsUpdate
