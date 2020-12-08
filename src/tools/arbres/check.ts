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
            titre: { id: {}, demarches: { etapes: { id: {} } } },
            etapes: { id: {} },
            type: { id: {} }
          }
        },
        'super'
      )

      demarches
        .filter(demarche => demarche.etapes!.reverse()[0].date > '2019-10-31')
        // fixme à corriger
        // .filter(
        //   demarche =>
        //     ![
        //       'm-ar-crique-amadis-sud-2020-oct01',
        //       'm-ar-crique-aoma-2020-oct01',
        //       'm-ar-crique-petites-tortues-2020-oct01',
        //       'm-ar-crique-pain-de-sucre-2-2020-oct01',
        //       'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019-oct01',
        //     ].includes(demarche.id)
        // )
        .filter(d => ['oct'].includes(d.typeId) && arbre.titreTypeId === 'axm')
        .filter(d => ['dep', 'aco', 'ins'].includes(d.statutId!))
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
              // console.log('toto', demarche.titre!.contenu, demarche.statutId)
              console.error(
                `https://camino.beta.gouv.fr/titres/${demarche.titreId}`
              )
              // console.error(errors)

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

export default arbresCheck
