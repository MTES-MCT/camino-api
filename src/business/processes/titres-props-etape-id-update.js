import PQueue from 'p-queue'
import { titrePropsUpdate, titrePropsEtapes } from '../queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const titresPropsEtapeIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((acc, titre) => {
    const props = titrePropsEtapes.reduce((props, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      console.log(propEtapeIdName, etapeId, titre[propEtapeIdName])

      return etapeId !== titre[propEtapeIdName]
        ? { ...props, [propEtapeIdName]: etapeId }
        : props
    }, {})

    console.log(props)

    return Object.keys(props).length
      ? [...acc, () => titrePropsUpdate(titre, props)]
      : acc
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({
      concurrency: 100
    })
    const logs = await queue.addAll(titresUpdatedRequests)
    console.log(logs.join(''))
  }

  return `Mise à jour: propriétés (étapes) de ${titresUpdatedRequests.length} titre(s).`
}

export default titresPropsEtapeIdsUpdate
