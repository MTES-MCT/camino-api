import { ITitre, ITitrePropsTitreEtapesIds } from '../../types'
import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titreContenuEtapeIdFind from '../rules/titre-contenu-etape-id-find'

const titresPropsContenuUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresUpdated: ITitre[], titre) => {
    if (!titre.type?.propsEtapesTypes) return titresUpdated

    const propsTitreEtapesIds = titre.type.propsEtapesTypes.reduce(
      (
        propsTitreEtapesIds: ITitrePropsTitreEtapesIds,
        { sectionId, elementId }
      ) => {
        const titreEtapeId = titreContenuEtapeIdFind(
          titre.demarches!,
          titre.statutId!,
          sectionId,
          elementId
        )

        // si
        // - la valeur de la prop est différente de celle du titre
        // - la valeur existe ou elle existe dans le titre
        if (
          (!titre.propsTitreEtapesIds ||
            !titre.propsTitreEtapesIds[sectionId] ||
            titreEtapeId !== titre.propsTitreEtapesIds[sectionId][elementId]) &&
          ((titre.propsTitreEtapesIds &&
            titre.propsTitreEtapesIds[sectionId] &&
            titre.propsTitreEtapesIds[sectionId][elementId]) ||
            titreEtapeId)
        ) {
          if (!propsTitreEtapesIds[sectionId]) {
            propsTitreEtapesIds[sectionId] = {}
          }

          if (titreEtapeId) {
            propsTitreEtapesIds[sectionId][elementId] = titreEtapeId
          } else {
            delete propsTitreEtapesIds[sectionId][elementId]
          }
        }

        return propsTitreEtapesIds
      },
      {}
    )

    if (Object.keys(propsTitreEtapesIds).length) {
      queue.add(async () => {
        const titreUpdated = await titreUpdate(titre.id, {
          propsTitreEtapesIds
        })

        console.log(
          `mise à jour: titre ${titre.id} contenu: ${JSON.stringify(
            propsTitreEtapesIds
          )}`
        )

        titresUpdated.push(titreUpdated)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export default titresPropsContenuUpdate
