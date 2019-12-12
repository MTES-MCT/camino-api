import 'dotenv/config'
import '../../../database/index'

import {
  administrationsGet,
  administrationsUpsert
} from '../../../database/queries/administrations'

async function main() {
  const abreviation = {
    DGALN: 'DGALN/DEB/EARM2',
    DGEC: 'DGEC/DE/SD2/2A',
    DGPR: 'DGPR/SRT/SDRCP/BSSS'
  }

  const res = await administrationsGet()

  const administrations = res.map(administration => {
    // écrit l'abréviation "DREAL - Grand Est - Siège de Metz" pour "Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Grand Est - Siège de Metz"
    administration.abreviation = administration.nom
      .substring(administration.nom.indexOf('('))
      .replace('(', '')
      .replace(')', '')

    Object.keys(abreviation).forEach(id => {
      if (administration.service && administration.service.includes(id)) {
        administration.abreviation = abreviation[id]
      }
    })

    return administration
  })

  await administrationsUpsert(administrations)
}

main()
