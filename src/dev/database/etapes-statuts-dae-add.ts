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
      couleur: 'neutral'
    },
    {
      id: 'req',
      nom: 'requis',
      couleur: 'success'
    }
  ] as IEtapeStatut[]

  for (const ds of daeStatuts) {
    await EtapesStatuts.query().insert(ds)
  }

  await TitresEtapes.query()
    .patch({ statutId: 'req' })
    .where('typeId', 'dae')
    .andWhere('statutId', 'fav')

  await TitresEtapes.query()
    .patch({ statutId: 'exe' })
    .where('typeId', 'dae')
    .andWhere('statutId', 'def')

  await EtapesTypesEtapesStatuts.query()
    .patch({ etapeStatutId: 'req' })
    .where('etapeStatutId', 'fav')

  await EtapesTypesEtapesStatuts.query()
    .patch({ etapeStatutId: 'exe' })
    .where('etapeStatutId', 'def')

  process.exit(0)
}

main()
