import { demarchesDefinitions } from '../../business/rules-demarches/definitions'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheEtatValidate } from '../../business/validations/titre-demarche-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../../business/rules/titre-demarche-depot-demande-date-find'

const demarchesDefinitionsCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des démarches')
  console.info()

  let errorsNb = 0

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
        'super'
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
            const errors = titreDemarcheEtatValidate(
              demarcheDefinition.restrictions,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )

            if (errors.length) {
              errorsNb++
              console.error(
                `https://camino.beta.gouv.fr/titres/${demarche.titreId} => démarche "${demarche.typeId}" : ${errors}`
              )
            }
          } catch (e) {
            console.error(`${demarche.id} démarche invalide =>\n\t${e}`)
            errorsNb++
          }
        })
    }
  }
  console.info(`erreurs : ${errorsNb}`)
}

export default demarchesDefinitionsCheck
