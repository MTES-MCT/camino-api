import { titresTypesDemarchesTypesEtapesTypesGet } from '../../database/queries/metas'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { ITitreTypeDemarcheTypeEtapeType } from '../../types'

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
  const errorsTDE = [] as ITitreTypeDemarcheTypeEtapeType[]

  demarches.forEach(d => {
    const etapesTypes = d.etapes?.map(({ type }) => type)
    etapesTypes?.forEach(etapeType => {
      if (
        !tde.find(
          t =>
            t.titreTypeId === d.titre!.typeId &&
            t.demarcheTypeId === d.typeId &&
            t.etapeTypeId === etapeType!.id
        ) &&
        !errorsTDE.find(
          t =>
            t.titreTypeId === d.titre!.typeId &&
            t.demarcheTypeId === d.typeId &&
            t.etapeTypeId === etapeType!.id
        )
      ) {
        console.log(
          `erreur sur le titre https://camino.beta.gouv.fr/titres/${
            d.titre!.id
          }, TDE inconnu ${d.titre!.typeId} ${d.typeId} ${etapeType!.id} (${
            etapeType!.nom
          })`
        )
        errorsTDE.push({
          titreTypeId: d.titre!.typeId,
          demarcheTypeId: d.typeId,
          etapeTypeId: etapeType!.id,
          ordre: 0
        })
        errorsNb++
      }
    })
  })
  console.info(`erreurs : ${errorsNb} TDE inconnus`)
}

export { titreTypeDemarcheTypeEtapeTypeCheck }
