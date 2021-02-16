import { IPropsHeritage, IFields } from '../../../types'
import { titreEtapeGet } from '../../queries/titres-etapes'

const propsRelations = ['titulaires']

const propsHeritageFormat = async (propsHeritage: IPropsHeritage) => {
  for (const propId of Object.keys(propsHeritage)) {
    if (propsHeritage[propId]?.etapeId) {
      const fields = { id: {} } as IFields
      if (propsRelations.includes(propId)) {
        fields[propId] = { id: {} }
      }

      const titreEtape = await titreEtapeGet(
        propsHeritage[propId].etapeId!,
        { fields },
        'super'
      )

      propsHeritage[propId].etape = titreEtape
    }
  }

  return propsHeritage
}

export { propsHeritageFormat }
