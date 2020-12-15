import { arbresDemarches } from '../../business/arbres-demarches/arbres-demarches'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreDemarcheArbreValidate } from '../../business/utils/titre-arbre-type-validate'

const arbresDemarchesCheck = async () => {
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
            arbre.titreTypeId !== 'axm' ||
            (['oct'].includes(d.typeId) &&
              ['dep', 'aco', 'ins'].includes(d.statutId!))
        )
        .forEach(demarche => {
          // .some(demarche => {
          // demarche.etapes!.forEach(e => (e.arbreTypeId = e.typeId))
          try {
            const errors = titreDemarcheArbreValidate(
              arbre,
              demarche.type!,
              demarche.etapes!,
              demarche.titre!
            )
            if (errors) {
              errorsNb++
              // console.log(
              //   demarche.etapes!.map(e => ({
              //     arbreTypeId: e.arbreTypeId,
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

export default arbresDemarchesCheck
