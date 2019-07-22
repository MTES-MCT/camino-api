import { titreDemarcheUpdate as titreDemarcheUpdateQuery } from '../../database/queries/titres-demarches'

// met à jour la propriété 'ordre' de toutes les démarches d'un titre
const titreDemarcheUpdate = async (titreDemarcheId, props) => {
  await titreDemarcheUpdateQuery(titreDemarcheId, props)

  return `Mise à jour: démarche ${titreDemarcheId}, ${JSON.stringify(props)}`
}

export { titreDemarcheUpdate }
