import '../../init'

import EtapesStatuts from '../../database/models/etapes-statuts'
import TitresEtapes from '../../database/models/titres-etapes'
import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'
import { IEtapeStatut } from '../../types'

const main = async () => {
  const daeStatuts = [
    {
      id: 'exe',
      nom: 'exempté',
      couleur: 'success'
    },
    {
      id: 'req',
      nom: 'requis',
      couleur: 'neutral'
    }
  ] as IEtapeStatut[]

  await EtapesStatuts.query().insert(daeStatuts)

  await TitresEtapes.query()
    .patch({ statutId: 'exe' })
    .where('typeId', 'dae')
    .andWhere('statutId', 'fav')

  await TitresEtapes.query()
    .patch({ statutId: 'req' })
    .where('typeId', 'dae')
    .andWhere('statutId', 'def')

  await EtapesTypesEtapesStatuts.query()
    .patch({ etapeStatutId: 'exe' })
    .where('etapeStatutId', 'fav')
    .andWhere('etapeTypeId', 'dae')

  await EtapesTypesEtapesStatuts.query()
    .patch({ etapeStatutId: 'req' })
    .where('etapeStatutId', 'def')
    .andWhere('etapeTypeId', 'dae')

  process.exit(0)
}

main()
