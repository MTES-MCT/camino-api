import { globaleGet } from '../queries/globales'

const globales = {
  chargement: false
}

const globalesInit = async () => {
  const globaleChargement = await globaleGet('chargement')
  globales.chargement = globaleChargement ? globaleChargement.valeur : false
}

export { globales, globalesInit }
