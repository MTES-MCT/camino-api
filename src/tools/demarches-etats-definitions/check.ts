import { demarchesEtatsDefinitions } from '../../business/demarches-etats-definitions/demarches-etats-definitions'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheEtatValidate } from '../../business/utils/titre-demarche-etats-validate'

const demarchesEtatsDefinitionsCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des démarches avec les arbres d’instructions')
  console.info()

  let errorsNb = 0

  for (const demarchesEtatsDefinition of demarchesEtatsDefinitions) {
    for (const demarcheTypeId of demarchesEtatsDefinition.demarcheTypeIds) {
      const demarches = await titresDemarchesGet(
        {
          titresTypesIds: [demarchesEtatsDefinition.titreTypeId.slice(0, 2)],
          titresDomainesIds: [demarchesEtatsDefinition.titreTypeId.slice(2)],
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
        .filter(d => d.etapes?.length)
        .filter(demarche => demarche.etapes!.reverse()[0].date > '2019-10-31')
        // .filter(d => ['oct'].includes(d.typeId) && arbre.titreTypeId === 'axm')
        // On garde seulement les octroi d’AXM non terminées
        .filter(
          d =>
            demarchesEtatsDefinition.titreTypeId !== 'axm' ||
            (['oct'].includes(d.typeId) &&
              ['dep', 'aco', 'ins'].includes(d.statutId!))
        )
        .forEach(demarche => {
          // .some(demarche => {
          try {
            const errors = titreDemarcheEtatValidate(
              demarchesEtatsDefinition.restrictions,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )
            if (errors) {
              errorsNb++
              // console.log(
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

export default demarchesEtatsDefinitionsCheck
