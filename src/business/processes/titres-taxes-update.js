import titreTaxesBuild from '../rules/titre-taxes-build'
import titreTaxesTypesFilter from '../utils/titre-activites-filter'
import { titreTaxesUpsert } from '../../database/queries/titres-taxes'

const titresTaxesUpdate = async (titres, taxesTypes) => {
  const titresTaxesNew = titres
    // formate les pays des titres
    .reduce((titresTaxes, titre) => {
      // filtre les types de taxes qui concernent le titre
      const titreTaxesTypes = titreTaxesTypesFilter(titre, taxesTypes)

      if (!titreTaxesTypes.length) return titresTaxes

      const titreTaxes = titreTaxesBuild(titre, titreTaxesTypes)
      if (titreTaxes.length) {
        titresTaxes.push(...titreTaxes)
      }

      return titresTaxes
    }, [])

  if (titresTaxesNew.length) {
    await titreTaxesUpsert(titresTaxesNew)
  }

  return titresTaxesNew
}

export default titresTaxesUpdate
