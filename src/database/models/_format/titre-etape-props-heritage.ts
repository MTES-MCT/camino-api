import { IHeritageProps, IFields } from '../../../types'
import { titreEtapeGet } from '../../queries/titres-etapes'

const propsRelations = ['titulaires']

const heritagePropsFormat = async (heritageProps: IHeritageProps) => {
  for (const propId of Object.keys(heritageProps)) {
    if (heritageProps[propId]?.etapeId) {
      const fields = { type: { id: {} }, statut: { id: {} } } as IFields
      if (propsRelations.includes(propId)) {
        fields[propId] = { id: {} }
      }

      const titreEtape = await titreEtapeGet(
        heritageProps[propId].etapeId!,
        { fields },
        'super'
      )

      heritageProps[propId].etape = titreEtape
    }
  }

  return heritageProps
}

export { heritagePropsFormat }
