import titreEtapesTypesRestrictions from './titres-types-etapes-types-restrictions'
import { ITitreEtapeCondition } from '../../types'
import { etapesTypesGet } from './titres-types-etapes-types-restrictions/_utils'

const etapeTypeIdsGet = (contraintes?: ITitreEtapeCondition[]) => {
  const etapeTypeIds = []
  if (contraintes?.length) {
    for (const contrainte of contraintes) {
      etapeTypeIds.push(contrainte.typeId)
    }
  }

  return etapeTypeIds
}

describe('vérifie la cohérence de tous les arbres', () => {
  test.each(titreEtapesTypesRestrictions)(
    'vérifie que chaque arbre contient uniquement des étapes possibles',
    arbre => {
      for (const demarcheTypeId of arbre.demarcheTypeIds) {
        const arbreEtapeTypeIds = arbre.restrictions.reduce(
          (acc, restriction) => {
            acc.push(restriction.condition.etape.typeId)
            if (restriction.contraintes?.length) {
              for (const contrainte of restriction.contraintes) {
                acc.push(...etapeTypeIdsGet(contrainte.impossibleApres))
                acc.push(...etapeTypeIdsGet(contrainte.obligatoireApres))
              }
            }

            return acc
          },
          [] as string[]
        )

        const tdeArbreEtapeTypeIds = etapesTypesGet(
          demarcheTypeId,
          arbre.typeId
        ).map(etapeType => etapeType.id)

        arbreEtapeTypeIds.forEach(arbreEtapeTypeId => {
          expect(tdeArbreEtapeTypeIds).toContain(arbreEtapeTypeId)
        })
      }
    }
  )
})
