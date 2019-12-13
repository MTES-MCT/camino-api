import 'dotenv/config'
import '../../../database/index'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'

async function main() {
  const abreviations = [
    {
      id: 'DGALN',
      value: 'DGALN/DEB/EARM2'
    },
    { id: 'DGEC', value: 'DGEC/DE/SD2/2A' },
    { id: 'DGPR', value: 'DGPR/SRT/SDRCP/BSSS' }
  ]

  const administrations = await administrationsGet()

  administrations.forEach(administration => {
    // écrit l'abréviation "DREAL - Grand Est - Siège de Metz" pour "Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Grand Est - Siège de Metz"
    administration.abreviation = administration.nom
      .substring(administration.nom.indexOf('('))
      .replace('(', '')
      .replace(')', '')

    // écrit l'abréviation sous forme d'acronyme fourni dans l'array 'abreviations'
    const abreviation =
      administration.service &&
      abreviations.find(abr => {
        return administration.service && administration.service.includes(abr.id)
      })
    if (abreviation) {
      administration.abreviation = abreviation.value
    }

    Promise.resolve(
      Administrations.query()
        .findById(administration.id)
        .patch({
          abreviation: administration.abreviation
        })
    )
  })
}

main()
