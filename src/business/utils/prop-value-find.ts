import { ITitreEtape, IPropId } from '../../types'

const propValueFind = (titreEtape: ITitreEtape, propId: IPropId) => {
  const value = titreEtape[propId]
  if (
    (Array.isArray(value) && value.length) ||
    (!Array.isArray(value) && (value || value === 0))
  ) {
    return value
  }

  return null
}

export { propValueFind }
