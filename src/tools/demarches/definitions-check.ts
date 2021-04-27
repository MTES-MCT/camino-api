import {
  demarchesDefinitions,
  IEtapeTypeIdCondition
} from '../../business/rules-demarches/definitions'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheEtatValidate } from '../../business/validations/titre-demarche-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../../business/rules/titre-demarche-depot-demande-date-find'
import { userSuper } from '../../database/user-super'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'

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

const etapesTypesIdsGet = async (titreTypeId: string, demarcheTypeId: string) =>
  (
    await TitresTypesDemarchesTypesEtapesTypes.query()
      .withGraphFetched('etapeType')
      .where('titreTypeId', titreTypeId)
      .andWhere('demarcheTypeId', demarcheTypeId)
  )
    .map(tde => tde.etapeType!)
    .filter(etapeType => !etapeType.dateFin || etapeType.dateFin === '')
    .map(etapeType => etapeType.id)

const tdeValidate = async () => {
  const errors = [] as string[]
  for (const demarcheDefinition of demarchesDefinitions) {
    for (const demarcheTypeId of demarcheDefinition.demarcheTypeIds) {
      const demarcheEtatsEtapeTypeIds = Object.keys(
        demarcheDefinition.restrictions
      )
        .reduce((acc, etapeTypeId) => {
          acc.push(etapeTypeId)
          const restriction = demarcheDefinition.restrictions[etapeTypeId]
          if (restriction.separation) {
            acc.push(...restriction.separation)
          }
          acc.push(...etapeTypeIdsGet(restriction.avant))
          acc.push(...etapeTypeIdsGet(restriction.apres))
          acc.push(...etapeTypeIdsGet(restriction.justeApres))

          return acc
        }, [] as string[])
        .map(type => type.split('-')[0])

      const tdeEtapeTypeIds = await etapesTypesIdsGet(
        demarcheDefinition.titreTypeId,
        demarcheTypeId
      )

      // on vérifie que toutes les étapes définies dans l’arbre existent dans TDE
      demarcheEtatsEtapeTypeIds.forEach(demarcheEtatsEtapeTypeId => {
        if (!tdeEtapeTypeIds.includes(demarcheEtatsEtapeTypeId)) {
          errors.push(
            `titre "${demarcheDefinition.titreTypeId}" démarche "${demarcheTypeId}" étape "${demarcheEtatsEtapeTypeId}" présent dans l’arbre d’instructions mais pas dans TDE`
          )
        }
      })

      // on vérifie que toutes les étapes définies dans TDE existent dans l’arbre
      tdeEtapeTypeIds.forEach(tdeEtapeTypeId => {
        if (!demarcheEtatsEtapeTypeIds.includes(tdeEtapeTypeId)) {
          errors.push(
            `titre "${demarcheDefinition.titreTypeId}" démarche "${demarcheTypeId}" étape "${tdeEtapeTypeId}" présent dans TDE mais pas dans l’arbre d’instructions`
          )
        }
      })
    }
  }

  // on vérifie qu’il existe un bloc dans l’arbre par étapes définies dans TDE
  for (const demarcheDefinition of demarchesDefinitions) {
    for (const demarcheTypeId of demarcheDefinition.demarcheTypeIds) {
      const demarcheEtatsEtapeTypeIds = Object.keys(
        demarcheDefinition.restrictions
      )

      const tdeEtapeTypeIds = await etapesTypesIdsGet(
        demarcheDefinition.titreTypeId,
        demarcheTypeId
      )

      tdeEtapeTypeIds.forEach(tdeEtapeTypeId => {
        if (!demarcheEtatsEtapeTypeIds.includes(tdeEtapeTypeId)) {
          errors.push(
            `bloc manquant "${tdeEtapeTypeId}" dans l’arbre des démarches "${demarcheTypeId}" des titres "${demarcheDefinition.titreTypeId}"`
          )
        }
      })
    }
  }

  return errors
}

const demarchesValidate = async () => {
  const errors = [] as string[]
  for (const demarcheDefinition of demarchesDefinitions) {
    for (const demarcheTypeId of demarcheDefinition.demarcheTypeIds) {
      const demarches = await titresDemarchesGet(
        {
          titresTypesIds: [demarcheDefinition.titreTypeId.slice(0, 2)],
          titresDomainesIds: [demarcheDefinition.titreTypeId.slice(2)],
          typesIds: [demarcheTypeId]
        },
        {
          fields: {
            titre: { id: {}, demarches: { etapes: { id: {} } } },
            etapes: { id: {} },
            type: { id: {} }
          }
        },
        userSuper
      )

      demarches
        .filter(
          d =>
            d.etapes?.length &&
            titreDemarcheDepotDemandeDateFind(d.etapes) >
              demarcheDefinition.dateDebut
        )
        .forEach(demarche => {
          try {
            const errs = titreDemarcheEtatValidate(
              demarcheDefinition.restrictions,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )

            if (errs.length) {
              errors.push(
                `https://camino.beta.gouv.fr/titres/${demarche.titreId} => démarche "${demarche.typeId}" : ${errs}`
              )

              // console.log(
              //   '[',
              //   demarche
              //     .etapes!.map(
              //       e =>
              //         `{ typeId: '${e.typeId}', statutId: '${e.statutId}', date: '${e.date}' }`
              //     )
              //     .join(','),
              //   ']'
              // )
            }
          } catch (e) {
            errors.push(`${demarche.id} démarche invalide =>\n\t${e}`)
          }
        })
    }
  }

  return errors
}

const demarchesDefinitionsCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des démarches')
  console.info()

  let errorsNb = 0
  const tdeErrors = await tdeValidate()
  tdeErrors.forEach(e => {
    errorsNb++
    console.error(e)
  })

  const demarchesErrors = await demarchesValidate()
  demarchesErrors.forEach(e => {
    errorsNb++
    console.error(e)
  })

  console.info(`erreurs : ${errorsNb}`)
}

export default demarchesDefinitionsCheck
