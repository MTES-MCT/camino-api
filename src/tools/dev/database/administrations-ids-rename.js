import 'dotenv/config'
import '../../../database/index'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'
import PQueue from 'p-queue/dist'

const idNewFind = (id, typeId) =>
  id.replace(id.substring(0, id.indexOf('-')), typeId)

async function main() {
  try {
    const administrations = await administrationsGet()

    const administrationsPatchQueue = administrations.reduce(
      (administrationsPatchQueue, administration) => {
        const idNew = idNewFind(administration.id, administration.typeId)

        if (idNew === administration.id) {
          return administrationsPatchQueue
        }

        administrationsPatchQueue.add(() =>
          Administrations.query()
            .findById(administration.id)
            .patch({ id: idNew })
        )

        return administrationsPatchQueue
      },
      new PQueue({
        concurrency: 100
      })
    )

    console.log('patch les administrations')
    await administrationsPatchQueue.onIdle()
  } catch (e) {
    console.log(e)
  } finally {
    process.exit()
  }
}

main()
