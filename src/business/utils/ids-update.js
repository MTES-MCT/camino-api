import { join } from 'path'
import fileRename from '../../tools/file-rename'

const elementFromPathFind = (path, root) =>
  path.reduce((acc, elementName) => {
    if (elementName) {
      acc = acc[elementName]
    }

    return acc
  }, root)

const idsUpdate = (
  element,
  relation,
  root,
  parent = null,
  parentOldId = ''
) => {
  const elementOldId = element.id

  if (relation.idFind) {
    const elementNewId = relation.idFind(element, parent)
    // l'id de l'élément courant n'a pas changé
    // il n'est pas nécessaire de mettre à jour ses relations
    if (elementNewId === elementOldId) {
      return null
    }

    element.id = elementNewId
  }

  // met à jour les propriétés
  if (relation.props && parent) {
    relation.props.forEach(prop => {
      if (element[prop] && element[prop].match(parentOldId)) {
        const elementOldProp = element[prop]
        element[prop] = elementOldProp.replace(parentOldId, parent.id)

        // TODO
        // à déplacer dans `titreIdUpdate` après `titreIdUpdateQuery`
        if (
          relation.name === 'documents' &&
          prop === 'id' &&
          element.fichier === true
        ) {
          fileRename(
            join(process.cwd(), `files/${elementOldProp}.pdf`),
            join(process.cwd(), `files/${element[prop]}.pdf`)
          )
        }
      }
    })
  }

  // met à jour les relations
  if (relation.relations) {
    relation.relations.forEach(relation => {
      const elementPointer = relation.path
        ? elementFromPathFind(relation.path, root)
        : element

      if (elementPointer[relation.name]) {
        Array.isArray(elementPointer[relation.name])
          ? elementPointer[relation.name].map(e =>
              idsUpdate(e, relation, root, element, elementOldId)
            )
          : idsUpdate(
              elementPointer[relation.name],
              relation,
              root,
              element,
              elementOldId
            )
      }
    })
  }
}

export default idsUpdate
