import { etapesTypesGet } from './_utils'
import { arbresDemarches, IArbreCondition } from './arbres-demarches'

const etapeTypeIdsGet = (contraintes?: IArbreCondition[][]) => {
  const etapeTypeIds = [] as string[]
  if (contraintes?.length) {
    contraintes.forEach(contrainte => {
      contrainte.forEach(c => {
        if (c.arbreTypeId) {
          etapeTypeIds.push(c.arbreTypeId)
        }
      })
    })
  }

  return etapeTypeIds
}

describe('vérifie la cohérence de tous les arbres', () => {
  arbresDemarches.forEach(arbre => {
    arbre.demarcheTypeIds.forEach(demarcheTypeId => {
      const arbreEtapeTypeIds = arbre.restrictions
        .reduce((acc, restriction) => {
          acc.push(restriction.arbreTypeId)
          if (restriction.separation) {
            acc.push(...restriction.separation)
          }
          acc.push(...etapeTypeIdsGet(restriction.avant))
          acc.push(...etapeTypeIdsGet(restriction.apres))
          acc.push(...etapeTypeIdsGet(restriction.justeApres))

          return acc
        }, [] as string[])
        .map(type => type.split('-')[0])

      const tdeArbreEtapeTypeIds = etapesTypesGet(
        demarcheTypeId,
        arbre.titreTypeId
      )
        .filter(etapeType => !etapeType.dateFin || etapeType.dateFin === '')
        .map(etapeType => etapeType.id)

      // on vérifie que toutes les étapes définies dans l’arbre existent dans TDE
      arbreEtapeTypeIds.forEach(arbreEtapeTypeId =>
        test(`vérifie que TDE d’une démarche "${demarcheTypeId}" des titres "${arbre.titreTypeId}" contient l’étape "${arbreEtapeTypeId}"`, () =>
          expect(tdeArbreEtapeTypeIds).toContain(arbreEtapeTypeId))
      )

      // on vérifie que toutes les étapes définies dans TDE existent dans l’arbre
      tdeArbreEtapeTypeIds.forEach(tdeArbreEtapeTypeId =>
        test(`vérifie que l’arbre des démarches "${demarcheTypeId}" des titres "${arbre.titreTypeId}" contient l’étape "${tdeArbreEtapeTypeId}"`, () =>
          expect(arbreEtapeTypeIds).toContain(tdeArbreEtapeTypeId))
      )
    })
  })

  arbresDemarches.forEach(arbre => {
    arbre.demarcheTypeIds.forEach(demarcheTypeId => {
      const arbreEtapeTypeIds = arbre.restrictions.map(
        r => r.arbreTypeId.split('-')[0]
      )

      const tdeArbreEtapeTypeIds = etapesTypesGet(
        demarcheTypeId,
        arbre.titreTypeId
      )
        .filter(etapeType => !etapeType.dateFin || etapeType.dateFin === '')
        .map(etapeType => etapeType.id)

      // on vérifie qu’il existe un bloc dans l’arbre par étapes définies dans TDE
      tdeArbreEtapeTypeIds.forEach(tdeArbreEtapeTypeId =>
        test(`vérifie qu’il existe un bloc "${tdeArbreEtapeTypeId}" dans l’arbre des démarches "${demarcheTypeId}" des titres "${arbre.titreTypeId}"`, () =>
          expect(arbreEtapeTypeIds).toContain(tdeArbreEtapeTypeId))
      )
    })
  })

  test.each(arbresDemarches)(
    '%# vérifie que chaque arbre contient une seule fois chaque étape',
    arbre => {
      arbre.restrictions.reduce((acc, restriction) => {
        expect(acc).not.toContain(restriction.arbreTypeId)
        acc.push(restriction.arbreTypeId)

        return acc
      }, [] as string[])
    }
  )
})
