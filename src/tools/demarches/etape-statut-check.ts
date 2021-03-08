import { titresEtapesGet } from '../../database/queries/titres-etapes'

const etapeStatutCheck = async () => {
  console.info()
  console.info('- - -')
  console.info('vérification des statuts des étapes en bdd')
  console.info()

  const etapes = await titresEtapesGet(
    {},
    {
      fields: {
        type: { etapesStatuts: { id: {} } },
        statut: { id: {} },
        demarche: { type: { id: {} } }
      }
    },
    'super'
  )

  let errorsNb = 0

  etapes.forEach(etape => {
    if (!etape.type!.etapesStatuts!.map(es => es.id).includes(etape.statutId)) {
      console.info(
        `erreur sur le titre https://camino.beta.gouv.fr/titres/${
          etape.demarche!.titreId
        }, étape « ${etape.type!.nom} » a un statut inconnu`
      )
      // console.log(
      //   `https://camino.beta.gouv.fr/titres/${etape.demarche!.titreId}, ${
      //     etape.demarche!.type!.nom
      //   }, ${etape.type!.nom} (${etape.typeId}),${etape.statut!.nom} (${
      //     etape.statutId
      //   }),${etape
      //     .type!.etapesStatuts!.map(s => `${s.nom} (${s.id})`)
      //     .join(' | ')}`
      // )
      errorsNb++
    }
  })
  console.info(`erreurs : ${errorsNb} statuts inconnus`)
}

export { etapeStatutCheck }
