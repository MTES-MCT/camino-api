import '../../init'

import EtapesStatuts from '../../database/models/etapes-statuts'
import TitresEtapes from '../../database/models/titres-etapes'
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

  const titresEtapesDaeFav = await TitresEtapes.query()
    .where('typeId', 'dae')
    .andWhere('statutId', 'fav')

  const titresEtapesDaeDef = await TitresEtapes.query()
    .where('typeId', 'dae')
    .andWhere('statutId', 'def')

  await Promise.all(
    titresEtapesDaeFav.map(async tef => {
      await TitresEtapes.query().patch({ statutId: 'req' }).where('id', tef.id)
      titresEtapesDaeDef.map(async ted => {
        await TitresEtapes.query()
          .patch({ statutId: 'exe' })
          .where('id', ted.id)
      })
    })
  )

  process.exit(0)
}

main()
