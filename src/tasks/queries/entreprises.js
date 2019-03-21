import { entrepriseUpdate as entrepriseUpdateQuery } from '../../database/queries/entreprises'

const entrepriseUpdate = entreprise => entrepriseUpdateQuery(entreprise)

export { entrepriseUpdate }
