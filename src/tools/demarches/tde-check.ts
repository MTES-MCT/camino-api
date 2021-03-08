import { titresTypesDemarchesTypesEtapesTypesGet } from '../../database/queries/metas'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'

const titreTypeDemarcheTypeEtapeTypeCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification de TDE avec les démarches en bdd')
  console.info()

  const tde = await titresTypesDemarchesTypesEtapesTypesGet()

  const demarches = await titresDemarchesGet(
    {},
    {
      fields: {
        titre: { id: {} },
        etapes: { type: { id: {} } }
      }
    },
    'super'
  )

  let errorsNb = 0

  demarches.forEach(d => {
    const etapesTypes = d.etapes?.map(({ type }) => type)
    etapesTypes?.forEach(etapeType => {
      if (
        !tde.find(
          t =>
            t.titreTypeId === d.titre!.typeId &&
            t.demarcheTypeId === d.typeId &&
            t.etapeTypeId === etapeType!.id
        )
      ) {
        console.info(
          `erreur sur le titre https://camino.beta.gouv.fr/titres/${
            d.titre!.id
          }, TDE inconnu ${d.titre!.typeId} ${d.typeId} ${etapeType!.id} (${
            etapeType!.nom
          })`
        )
        errorsNb++
      }
    })
  })
  console.info(`erreurs : ${errorsNb} TDE inconnus`)
}

export { titreTypeDemarcheTypeEtapeTypeCheck }
