const elementsLinkedAccumulate = (root, path) => {
  const { elementsLinked } = path.split('/').reduce(
    (acc, name, i, path) => {
      if (i === path.length - 1 && acc.root[name]) {
        let items = acc.root[name]
        items = !Array.isArray(items) ? [items] : items

        acc.elementsLinked = [...acc.elementsLinked, ...items]
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
  const elementIdOld = element.id

  // met à jour l'id
  if (params.idUpdate) {
    const elementIdNew = params.idUpdate(
      element,
      parent,
      parentIdOld,
      parent && parent.id
    )

    // l'id de l'élément n'a pas changé
    // aucune mise à jour n'est nécessaire
    if (elementIdNew === elementIdOld) {
      return
    }

    element.id = elementIdNew
  }

  // met à jour les propriétés basée sur l'id parent
  if (params.props && parent) {
    params.props.forEach(prop => {
      // if (prop.match('TitreEtapeId')) delete element[prop]

      if (element[prop] && element[prop].match(parentIdOld)) {
        element[prop] = element[prop].replace(parentIdOld, parent.id)
      }
    })
  }

  // met à jour les tables en relation avec l'élément courant
  if (params.links) {
    params.links.forEach(link => {
      let elementsLinked

      elementsLinked =
        link.path[0] === '/'
          ? elementsLinkedAccumulate(root, link.path.slice(1))
          : elementsLinkedAccumulate(element, link.path)

      if (elementsLinked && elementsLinked.length) {
        elementsLinked.forEach(elementLinked => {
          elementRelationsUpdate(
            elementLinked,
            link,
            root,
            element,
            elementIdOld
          )
        })
      }
    })
  }
}

export default elementRelationsUpdate
