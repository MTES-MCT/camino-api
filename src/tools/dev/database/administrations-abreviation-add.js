import 'dotenv/config'
import '../../../database/index'
import PQueue from 'p-queue'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'

async function main() {
  try {
    const abreviations = {
      DGALN: 'DGALN/DEB/EARM2',
      DGEC: 'DGEC/DE/SD2/2A',
      DGPR: 'DGPR/SRT/SDRCP/BSSS'
    }

    const administrations = await administrationsGet()

    const administrationPatchQueue = new PQueue()

    const administrationPatchQueries = administrations.map(administration => {
      const abreviationId =
        administration.service &&
        Object.keys(abreviations).find(id =>
          administration.service.includes(id)
        )

      const abreviation = abreviationId
        ? abreviations[abreviationId]
        : // in: Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Grand Est - Siège de Metz
          // out: DREAL - Grand Est - Siège de Metz
          administration.nom
            .substring(administration.nom.indexOf('('))
            .replace('(', '')
            .replace(')', '')

      return () =>
        Administrations.query()
          .findById(administration.id)
          .patch({ abreviation })
    })

    administrationPatchQueue.addAll(administrationPatchQueries)

    await administrationPatchQueue.onIdle()

    console.log('mise à jour terminée')

    process.exit()
  } catch (e) {
    console.log(e)
    process.exit()
  }
}

main()
