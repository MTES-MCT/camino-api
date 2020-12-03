import 'dotenv/config'
import '../../src/init'
import { arbresDemarches } from '../../src/business/arbres-demarches/arbres-demarches'
import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'
import { titreEtapeUpdate } from '../../src/database/queries/titres-etapes'

const main = async () => {
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
        },
        'super'
      )

      const demarchesValid = demarches
        .filter(demarche => demarche.etapes!.reverse()[0].date > '2019-10-31')
        .filter(demarche => demarche.typeId === 'oct')
      for (const demarche of demarchesValid) {
        const etapes = demarche.etapes!.filter(e => !e.arbreTypeId)
        for (let i = 0; i < etapes.length; i++) {
          const etape = etapes[i]
          let arbreTypeId
          if (
            arbre.restrictions.map(r => r.arbreTypeId).includes(etape.typeId!)
          ) {
            arbreTypeId = etape.typeId
          } else if (etape.typeId === 'mno') {
            // si c’est la dernière c’est la MNO qui notifie du statut de la demande
            if (i === etapes.length - 1) {
              if (demarche.statutId === 'css') {
                arbreTypeId = 'mno-css'
              } else if (demarche.statutId === 'rej') {
                arbreTypeId = 'mno-rej'
              } else if (etapes[i - 1].typeId === 'aco') {
                arbreTypeId = 'mno-aco'
              } else {
                arbreTypeId = 'mno-aca'
              }
            } else {
              arbreTypeId = 'mno-aca'
            }
          } else if (etape.typeId === 'rco' || etape.typeId === 'mco') {
            arbreTypeId = `${etape.typeId}-mcp`
          } else if (
            etape.id === 'm-ar-crique-awa-2020-oct01-rif01' ||
            etape.id === 'm-ar-crique-awa-2020-oct01-mif01'
          ) {
            arbreTypeId = `${etape.typeId.slice(0, 1)}co-rde`
          }

          if (!arbreTypeId) {
            console.log(
              `https://camino.beta.gouv.fr/titres/${demarche.titreId} - ${etape.typeId}`
            )
            // await titreEtapeDelete(etape.id)
          }

          await titreEtapeUpdate(etape.id, { arbreTypeId })
        }
      }
    }
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
