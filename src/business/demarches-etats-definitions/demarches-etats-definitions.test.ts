import { etapesTypesGet } from './_utils'
import {
  demarchesEtatsDefinitions,
  etatIdsGet,
  IEtatIdCondition
} from './demarches-etats-definitions'

const etapeTypeIdsGet = (contraintes?: IEtatIdCondition[][]) => {
  const etapeTypeIds = [] as string[]
  if (contraintes?.length) {
    contraintes.forEach(contrainte => {
      contrainte.forEach(c => {
        if (c.etatId) {
          etapeTypeIds.push(c.etatId)
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
          acc.push(restriction.etatId)
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
        r => r.etatId.split('-')[0]
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
        expect(acc).not.toContain(restriction.etatId)
        acc.push(restriction.etatId)

        return acc
      }, [] as string[])
    }
  )
})

describe('teste etatIdsGet', () => {
  test('le type "mfr" retourne que un résultat', () => {
    const etatIds = etatIdsGet('arm', 'oct', 'mfr')
    expect(etatIds).toHaveLength(1)
  })
  test('le type "mno" retourne que un résultat', () => {
    const etatIds = etatIdsGet('arm', 'oct', 'mno')
    expect(etatIds.length).toBeGreaterThan(1)
  })
  test('retourne le type si il n’y a pas d’arbre', () => {
    const etatIds = etatIdsGet('arm', 'aaa', 'mno')
    expect(etatIds).toHaveLength(1)
    expect(etatIds).toContain('mno')
  })
})
