// fonction récursive qui parcourt les 'elements' (p.e.: 'titres')
// en descendant la chaîne de 'parents' (p.e.: ['demarches', 'etapes', 'points'])
// et retourne un tableau avec les éléments à convertir en 'rows'
// ceux dont le nom correspond à la dernière entrée parmi les parents
// (p.e.: des 'points')
// in:
// - elements: un tableau avec les éléments extraits de la bdd
// - parents: un tableau avec le nom des ancêtres ['grandParents', 'parents', 'elements']
// out
// - un tableau avec les éléments à convertir en 'rows'

const rowsCreate = (elements, parents, parentElement) => {
  // si il n'y a pas de parent
  if (!parents || !parents.length) {
    // si elements est un tableau
    // on le retourne tel quel
    // sinon, on l'insère dans un tableau
    return Array.isArray(elements)
      ? elements.map(element => ({ element, parent: parentElement }))
      : [{ element: elements, parent: parentElement }]
  }

  // si il existe au moins un parent
  // parcourt la liste d'éléments
  return elements.reduce((rows, element) => {
    // si il existe un element dont le nom correspond au premier parent
    const elementKey = parents[0]

    if (element[elementKey]) {
      // recursion sur rowsCreate avec cet élément
      // et la liste de parents moins le premier

      const childrenElements = element[elementKey]
      rows.push(...rowsCreate(childrenElements, parents.slice(1), element))
    }

    return rows
  }, [])
}

export default rowsCreate
