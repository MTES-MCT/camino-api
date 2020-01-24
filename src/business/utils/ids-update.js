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
  let hasChanged = false

  const elementOldId = element.id

  // met à jour l'id de l'élément
  if (relation.idFind) {
    const elementNewId = relation.idFind(element, parent)
    // l'id de l'élément courant n'a pas changé
    if (elementNewId !== elementOldId) {
      element.id = elementNewId

      hasChanged = true
    }
  }

  // met à jour les propriétés
  if (relation.props && parent) {
    relation.props.forEach(prop => {
      if (element[prop] && element[prop].match(parentOldId)) {
        const elementOldProp = element[prop]
        element[prop] = elementOldProp.replace(parentOldId, parent.id)

        // TODO: à déplacer dans `titreIdUpdate` après `titreIdUpdateQuery`
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
      // si l'id du parent n'a pas changé
      // ou que l'id de la relation n'est pas calculé
      // alors on ne parcourt pas les relations
      if (!hasChanged && !relation.idFind) return

      const elementPointer = relation.path
        ? elementFromPathFind(relation.path, root)
        : element

      if (elementPointer[relation.name]) {
        let elements = elementPointer[relation.name]

        if (!Array.isArray(elements)) {
          elements = [elements]
        }

        hasChanged =
          elements.reduce(
            (hasChanged, e) =>
              idsUpdate(e, relation, root, element, elementOldId) || hasChanged,
            false
          ) || hasChanged
      }
    })
  }

  return hasChanged
}

export default idsUpdate
