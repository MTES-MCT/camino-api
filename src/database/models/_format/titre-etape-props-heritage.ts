import { IHeritageProps, IFields } from '../../../types'
import { titreEtapeGet } from '../../queries/titres-etapes'

const heritagePropsFormat = async (heritageProps: IHeritageProps) => {
  for (const propId of Object.keys(heritageProps)) {
    if (heritageProps[propId]?.etapeId) {
      const fields = { type: { id: {} }, statut: { id: {} } } as IFields
      if (propId === 'points') {
        fields.points = { references: { geoSysteme: { unite: { id: {} } } } }
      } else if (propId === 'substances') {
        fields.substances = { legales: { code: { id: {} } } }
      } else if (['titulaires', 'amodiataires'].includes(propId)) {
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
