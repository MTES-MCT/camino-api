import { ITitre, TitreProp, TitreEtapeProp } from '../../types'
import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'communes',
  'surface'
].map(prop => ({
  prop,
  name: `${prop}TitreEtapeId`
})) as {
  prop: TitreEtapeProp
  name: TitreProp
}[]

const titresPropsEtapeIdsUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresIdsUpdated: string[], titre) => {
    const props = titrePropsEtapes.reduce(
      (props: Partial<ITitre>, { prop, name }) => {
        const value = titrePropEtapeIdFind(
          titre.demarches!,
          titre.statutId!,
          prop
        )

        // si
        // - la valeur de la prop est différente de celle du titre
        // - la valeur existe ou elle existe dans le titre
        if (value !== titre[name] && (titre[name] || value)) {
          props[name] = value
        }

        return props
      },
      {}
    )

    if (Object.keys(props).length) {
      queue.add(async () => {
        const titreUpdated = await titreUpdate(titre.id, props)

        console.info(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )

        titresIdsUpdated.push(titreUpdated.id)
      })
    }

    return titresIdsUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
