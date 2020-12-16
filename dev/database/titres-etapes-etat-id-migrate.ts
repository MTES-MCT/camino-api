import 'dotenv/config'
import '../../src/init'
import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'
import { titreEtapeUpdate } from '../../src/database/queries/titres-etapes'
import { ITitreDemarche, ITitreEtape } from '../../src/types'
import { demarchesEtatsDefinitions } from '../../src/business/demarches-etats-definitions/demarches-etats-definitions'

const armOctEtatIdGet = (
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
        const aca = etapes.find(e => e.typeId === 'aca')
        if (aca?.statutId === 'ajo') {
          return 'mno-sca'
        }

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

const armRenProEtatIdGet = (etape: ITitreEtape, demarche: ITitreDemarche) => {
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

const axmOctEtatIdGet = (etape: ITitreEtape) => {
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

const prmOctEtatIdGet = (etape: ITitreEtape) => {
  if (etape.typeId === 'rco' || etape.typeId === 'mco') {
    return `${etape.typeId}-mcr`
  }

  if (etape.typeId === 'mno') {
    return 'mno-npp'
  }

  return undefined
}

const main = async () => {
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
            titre: { id: {} },
            etapes: { id: {} },
            type: { id: {} }
          }
        },
        'super'
      )

      const demarchesValid = demarches
        .filter(d => d.etapes?.length)
        .filter(demarche => demarche.etapes!.reverse()[0].date > '2019-10-31')
      for (const demarche of demarchesValid) {
        const etapes = demarche.etapes!
        for (let i = 0; i < etapes.length; i++) {
          const etape = etapes[i]
          if (etape.etatId) {
            continue
          }
          let etatId
          if (
            demarchesEtatsDefinition.restrictions
              .map(r => r.etatId)
              .includes(etape.typeId!)
          ) {
            etatId = etape.typeId
          } else {
            if (demarchesEtatsDefinition.titreTypeId === 'arm') {
              if (demarche.typeId === 'oct') {
                etatId = armOctEtatIdGet(etape, etapes, i, demarche)
              } else if (['ren', 'pro'].includes(demarche.typeId)) {
                etatId = armRenProEtatIdGet(etape, demarche)
              }
            } else if (demarchesEtatsDefinition.titreTypeId === 'axm') {
              if (demarche.typeId === 'oct') {
                etatId = axmOctEtatIdGet(etape)
              }
            } else if (demarchesEtatsDefinition.titreTypeId === 'prm') {
              if (demarche.typeId === 'oct') {
                etatId = prmOctEtatIdGet(etape)
              }
            }
          }

          if (!etatId) {
            console.log(
              `https://camino.beta.gouv.fr/titres/${demarche.titreId} - démarche "${demarche.typeId}" - étape interdite : "${etape.typeId}"`
            )
            // await titreEtapeDelete(etape.id)
          } else {
            await titreEtapeUpdate(etape.id, { etatId })
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
