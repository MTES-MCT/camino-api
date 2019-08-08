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
const rowsCreate = (elements, parents, parentElement) =>
  // si il existe au moins un parent
  parents && parents.length
    ? // parcourt la liste d'éléments
      elements.reduce((rows, element) => {
        // si il existe un element dont le nom correspond au premier parent
        if (element[parents[0]]) {
          // recursion sur rowsCreate avec cet élément
          // et la liste de parents moins le premier
          rows.push(
            ...rowsCreate(element[parents[0]], parents.slice(1), element)
          )
        }

        return rows
      }, [])
    : // si il n'y a pas de parent
    // si elements est un tableau
    Array.isArray(elements)
    ? // le retourne tel quel
      elements.map(element => ({ element, parent: parentElement }))
    : // sinon, l'insère dans un tableau
      [{ element: elements, parent: parentElement }]

export default rowsCreate
