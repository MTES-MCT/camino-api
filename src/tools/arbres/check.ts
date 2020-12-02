import { arbresDemarches } from '../../business/arbres-demarches/arbres-demarches'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheArbreValidate } from '../../business/utils/titre-arbre-type-validate'

const arbresCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des démarches avec les arbres d’instructions')
  console.info()

  let errorsNb = 0

  for (const arbre of arbresDemarches) {
    for (const demarcheTypeId of arbre.demarcheTypeIds) {
      const demarches = await titresDemarchesGet(
        {
          titresTypesIds: [arbre.titreTypeId.slice(0, 2)],
          titresDomainesIds: [arbre.titreTypeId.slice(2)],
          typesIds: [demarcheTypeId]
        },
        {
          fields: {
            titre: { id: {} },
            etapes: { id: {} },
            type: { id: {} }
          }
        }
      )

      demarches
        .filter(demarche => demarche.etapes![0].date > '2020-01-01')
        .forEach(demarche => {
          console.info(`test ${demarche.id}`)

          demarche.etapes!.forEach(e => {
            e.arbreTypeId = e.typeId
          })

          try {
            const errors = titreDemarcheArbreValidate(
              arbre,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )
            if (errors) {
              errorsNb++
              // throw new Error(errors)
            }
          } catch (e) {
            console.error(e)
            errorsNb++
          }
        })
    }
  }
  console.error(`Nb errors = ${errorsNb}`)
}

export default arbresCheck
