import { etapesTypesGet } from './_utils-test'
import {
  demarchesEtatsDefinitions,
  IEtapeTypeIdCondition
} from './demarches-etats-definitions'

const etapeTypeIdsGet = (contraintes?: IEtapeTypeIdCondition[][]) => {
  const etapeTypeIds = [] as string[]
  if (contraintes?.length) {
    contraintes.forEach(contrainte => {
      contrainte.forEach(c => {
        if (c.etapeTypeId) {
          etapeTypeIds.push(c.etapeTypeId)
        }
      })
    })
  }

  return etapeTypeIds
}

describe('vérifie la cohérence de tous les arbres', () => {
  demarchesEtatsDefinitions.forEach(demarchesEtatsDefinition => {
    demarchesEtatsDefinition.demarcheTypeIds.forEach(demarcheTypeId => {
      const demarcheEtatsEtapeTypeIds = demarchesEtatsDefinition.restrictions
        .reduce((acc, restriction) => {
          acc.push(restriction.etapeTypeId)
          if (restriction.separation) {
            acc.push(...restriction.separation)
          }
          acc.push(...etapeTypeIdsGet(restriction.avant))
          acc.push(...etapeTypeIdsGet(restriction.apres))
          acc.push(...etapeTypeIdsGet(restriction.justeApres))

          return acc
        }, [] as string[])
        .map(type => type.split('-')[0])

      const tdeEtapeTypeIds = etapesTypesGet(
        demarcheTypeId,
        demarchesEtatsDefinition.titreTypeId
      )
        .filter(etapeType => !etapeType.dateFin || etapeType.dateFin === '')
        .map(etapeType => etapeType.id)

      // on vérifie que toutes les étapes définies dans l’arbre existent dans TDE
      demarcheEtatsEtapeTypeIds.forEach(demarcheEtatsEtapeTypeId =>
        test(`vérifie que TDE d’une démarche "${demarcheTypeId}" des titres "${demarchesEtatsDefinition.titreTypeId}" contient l’étape "${demarcheEtatsEtapeTypeId}"`, () =>
          expect(tdeEtapeTypeIds).toContain(demarcheEtatsEtapeTypeId))
      )

      // on vérifie que toutes les étapes définies dans TDE existent dans l’arbre
      tdeEtapeTypeIds.forEach(tdeEtapeTypeId =>
        test(`vérifie que l’arbre des démarches "${demarcheTypeId}" des titres "${demarchesEtatsDefinition.titreTypeId}" contient l’étape "${tdeEtapeTypeId}"`, () =>
          expect(demarcheEtatsEtapeTypeIds).toContain(tdeEtapeTypeId))
      )
    })
  })

  demarchesEtatsDefinitions.forEach(demarchesEtatsDefinition => {
    demarchesEtatsDefinition.demarcheTypeIds.forEach(demarcheTypeId => {
      const demarcheEtatsEtapeTypeIds = demarchesEtatsDefinition.restrictions.map(
        r => r.etapeTypeId.split('-')[0]
      )

      const tdeEtapeTypeIds = etapesTypesGet(
        demarcheTypeId,
        demarchesEtatsDefinition.titreTypeId
      )
        .filter(etapeType => !etapeType.dateFin || etapeType.dateFin === '')
        .map(etapeType => etapeType.id)

      // on vérifie qu’il existe un bloc dans l’arbre par étapes définies dans TDE
      tdeEtapeTypeIds.forEach(tdeEtapeTypeId =>
        test(`vérifie qu’il existe un bloc "${tdeEtapeTypeId}" dans l’arbre des démarches "${demarcheTypeId}" des titres "${demarchesEtatsDefinition.titreTypeId}"`, () =>
          expect(demarcheEtatsEtapeTypeIds).toContain(tdeEtapeTypeId))
      )
    })
  })

  test.each(demarchesEtatsDefinitions)(
    '%# vérifie que chaque arbre contient une seule fois chaque étape',
    demarchesEtatsDefinition => {
      demarchesEtatsDefinition.restrictions.reduce((acc, restriction) => {
        expect(acc).not.toContain(restriction.etapeTypeId)
        acc.push(restriction.etapeTypeId)

        return acc
      }, [] as string[])
    }
  )
})
