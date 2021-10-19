import Administrations from '../../database/models/administrations'
import '../../init'

const main = async () => {
  const admin = await Administrations.query()
    .where('id', 'pre-13203-01')
    .withGraphFetched({ activitesTypesEmails: {} })
  console.log(admin[0].activitesTypesEmails!.map(({ email }) => email))
  process.exit(0)
}

main()
