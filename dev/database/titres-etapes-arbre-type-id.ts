import 'dotenv/config'
import '../../src/init'
import { arbresDemarches } from '../../src/business/arbres-demarches/arbres-demarches'
import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'
import { titreEtapeUpdate } from '../../src/database/queries/titres-etapes'
import { ITitreDemarche, ITitreEtape } from '../../src/types'

const armOctArbreTypeIdGet = (
  etape: ITitreEtape,
  etapes: ITitreEtape[],
  i: number,
  demarche: ITitreDemarche
) => {
  if (etape.typeId === 'mno') {
    // si c’est la dernière c’est la MNO qui notifie du statut de la demande
    if (i === etapes.length - 1) {
      if (demarche.statutId === 'css') {
        return 'mno-css'
      } else if (demarche.statutId === 'rej') {
        return 'mno-rej'
      } else if (etapes[i - 1].typeId === 'aco') {
        return 'mno-aco'
      } else {
        return 'mno-aca'
      }
    } else {
      return 'mno-aca'
    }
  } else if (etape.typeId === 'rco' || etape.typeId === 'mco') {
    return `${etape.typeId}-rde`
  } else if (
    etape.id === 'm-ar-crique-awa-2020-oct01-rif01' ||
    etape.id === 'm-ar-crique-awa-2020-oct01-mif01'
  ) {
    return `${etape.typeId.slice(0, 1)}co-rde`
  }

  return undefined
}

const armRenProArbreTypeIdGet = (
  etape: ITitreEtape,
  demarche: ITitreDemarche
) => {
  if (etape.typeId === 'mno') {
    if (demarche.statutId === 'css') {
      return 'mno-css'
    } else if (demarche.statutId === 'rej') {
      return 'mno-rej'
    } else {
      return 'mno-aco'
    }
  }

  return undefined
}

const axmOctArbreTypeIdGet = (etape: ITitreEtape) => {
  if (etape.typeId === 'rco' || etape.typeId === 'mco') {
    return `${etape.typeId}-mcr`
  }

  if (
    etape.id === 'm-ax-affluent-rive-gauche-de-crique-amadis-1-2020-oct01-mod01'
  ) {
    return 'mod-mdp'
  }

  return undefined
}

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

      const demarchesValid = demarches.filter(
        demarche => demarche.etapes!.reverse()[0].date > '2019-10-31'
      )
      for (const demarche of demarchesValid) {
        const etapes = demarche.etapes!
        for (let i = 0; i < etapes.length; i++) {
          const etape = etapes[i]
          if (etape.arbreTypeId) {
            continue
          }
          let arbreTypeId
          if (
            arbre.restrictions.map(r => r.arbreTypeId).includes(etape.typeId!)
          ) {
            arbreTypeId = etape.typeId
          } else {
            if (arbre.titreTypeId === 'arm') {
              if (demarche.typeId === 'oct') {
                arbreTypeId = armOctArbreTypeIdGet(etape, etapes, i, demarche)
              } else if (['ren', 'pro'].includes(demarche.typeId)) {
                arbreTypeId = armRenProArbreTypeIdGet(etape, demarche)
              }
            } else if (arbre.titreTypeId === 'axm') {
              if (demarche.typeId === 'oct') {
                arbreTypeId = axmOctArbreTypeIdGet(etape)
              }
            }
          }

          if (!arbreTypeId) {
            console.log(
              `https://camino.beta.gouv.fr/titres/${demarche.titreId} - démarche "${demarche.typeId}" - étape interdite : "${etape.typeId}"`
            )
            // await titreEtapeDelete(etape.id)
          } else {
            await titreEtapeUpdate(etape.id, { arbreTypeId })
          }
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
