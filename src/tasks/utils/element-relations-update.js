const elementRelationUpdate = (
  relations,
  titreElementNewId,
  titreElementOldId,
  elementIdProp
) => {
  return relations.map(relation => {
    if (relation.id && relation.id.match(titreElementOldId)) {
      relation.id = relation.id.replace(titreElementOldId, titreElementNewId)
    }

    if (
      relation[elementIdProp] &&
      relation[elementIdProp].match(titreElementOldId)
    ) {
      relation[elementIdProp] = titreElementNewId
    }

    return relation
  })
}

const elementRelationsUpdate = (
  element,
  titreElementNewId,
  titreElementOldId,
  titreElementsRelations
) => {
  return titreElementsRelations.reduce((element, prop) => {
    const relations = element[prop.name]
    if (!relations) return element

    if (prop.children) {
      element[prop.name] = relations.map(element =>
        elementRelationsUpdate(
          element,
          titreElementNewId,
          titreElementOldId,
          prop.children
        )
      )
    }

    element[prop.name] = elementRelationUpdate(
      relations,
      titreElementNewId,
      titreElementOldId,
      prop.elementIdProp
    )

    return element
  }, element)
}

export default elementRelationsUpdate
