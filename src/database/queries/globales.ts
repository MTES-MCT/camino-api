import Globales from '../models/globales'

const globaleGet = async (id: string) => Globales.query().findById(id)

export { globaleGet }
