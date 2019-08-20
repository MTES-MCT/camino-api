import taxeOrCheckAndCalc from './titre-taxes-or-calc'

const taxesCheckAndCalcFonctions = {
  tor: taxeOrCheckAndCalc,
  rco: taxeOrCheckAndCalc,
  rdo: taxeOrCheckAndCalc
}

const titreTaxesBuild = (titre, titreTaxesTypes) =>
  titreTaxesTypes.reduce((titreTaxesTypesTaxes, titreTaxesType) => {
    const taxeCheckAndCalc = taxesCheckAndCalcFonctions[titreTaxesType.id]
    if (!taxeCheckAndCalc) {
      return titreTaxesTypesTaxes
    }

    const titreTaxes = taxeCheckAndCalc(titre, titreTaxesType)
    if (titreTaxes) {
      titreTaxesTypesTaxes.push(...titreTaxes)
    }

    return titreTaxesTypesTaxes
  }, [])

export default titreTaxesBuild
