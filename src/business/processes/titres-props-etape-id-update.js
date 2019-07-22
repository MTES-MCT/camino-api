import PQueue from 'p-queue'
import { titrePropsUpdate, titrePropsEtapes } from '../queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const titresPropsEtapeIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((acc, titre) => {
    const props = titrePropsEtapes.reduce((props, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      return etapeId !== titre[propEtapeIdName]
        ? { ...props, [propEtapeIdName]: etapeId }
        : props
    }, {})

    return Object.keys(props).length
      ? [...acc, () => titrePropsUpdate(titre.id, props).then(console.log)]
      : acc
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresUpdatedRequests)
  }

  return `Mise à jour: propriétés (étapes) de ${titresUpdatedRequests.length} titre(s).`
}

export default titresPropsEtapeIdsUpdate
