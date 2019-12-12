import 'dotenv/config'
import '../../../database/index'

import {
  administrationsGet,
  administrationsUpsert,
  administrationsUpdate
} from '../../../database/queries/administrations'

async function main() {
  const administrations = await administrationsGet()

  var conversion = {}

  const res = administrations.map(administration => {
    // const id = administration.id
    // administration.id = id.replace(
    //   id.substring(0, id.indexOf('-')),
    //   administration.typeId
    // )
    // conversion[id] = administration.id
    administration.service = 'service'

    return administration
  })

  await administrationsUpsert(res)

  // console.log(conversion)
}

main()
