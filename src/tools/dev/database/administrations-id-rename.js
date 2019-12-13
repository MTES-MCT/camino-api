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

  administrations.forEach(administration => {
    conversion[administration.id] = administration.id.replace(
      administration.id.substring(0, administration.id.indexOf('-')),
      administration.typeId
    )

    administration.id = conversion[administration.id]

    Promise.resolve(Administrations.query().insert(administration))
  })

  // const res = administrations.map(administration => {
  //   // const id = administration.id
  //   // administration.id = id.replace(
  //   //   id.substring(0, id.indexOf('-')),
  //   //   administration.typeId
  //   // )
  //   // conversion[id] = administration.id

  //   return administration
  // })

  console.log(conversion)
}

main()
