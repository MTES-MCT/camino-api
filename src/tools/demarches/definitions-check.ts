import { demarchesDefinitions } from '../../business/rules-demarches/definitions'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheEtatValidate } from '../../business/validations/titre-demarche-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../../business/rules/titre-demarche-depot-demande-date-find'

const demarchesDefinitionsCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des démarches avec les arbres d’instructions')
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
        // .filter(d => ['oct'].includes(d.typeId) && demarcheDefinition.titreTypeId === 'axm')
        // On garde seulement les octroi d’AXM non terminées
        .filter(
          d =>
            demarcheDefinition.titreTypeId !== 'axm' ||
            (['oct'].includes(d.typeId) &&
              ['dep', 'aco', 'ins'].includes(d.statutId!))
        )
        .forEach(demarche => {
          // .some(demarche => {
          try {
            const errors = titreDemarcheEtatValidate(
              demarcheDefinition.restrictions,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )

            if (errors.length) {
              errorsNb++
              // console.info(
              //   demarche.etapes!.map(e => ({
              //     etapeTypeId: e.typeId,
              //     date: e.date,
              //     statutId: e.statutId
              //   }))
              // )
              console.error(
                `https://camino.beta.gouv.fr/titres/${demarche.titreId} => Démarche "${demarche.typeId}" : ${errors}`
              )

              return true
            }
          } catch (e) {
            console.error(`${demarche.id} Démarche invalide =>\n\t${e}`)
            errorsNb++

            return true
          }

          return false
        })
    }
  }
  console.error(`Nb errors = ${errorsNb}`)
}

export default demarchesDefinitionsCheck
