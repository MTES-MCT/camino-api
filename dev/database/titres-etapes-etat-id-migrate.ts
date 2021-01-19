import 'dotenv/config'
import '../../src/init'
import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'
import { titreEtapeUpdate } from '../../src/database/queries/titres-etapes'
import { ITitreDemarche, ITitreEtape } from '../../src/types'
import { demarchesEtatsDefinitions } from '../../src/business/demarches-etats-definitions/demarches-etats-definitions'
import { titreDemarcheDemandeDateFind } from '../../src/business/rules/titre-demarche-demande-date-find'

const armOctEtapeTypeIdGet = (
  etape: ITitreEtape,
  etapes: ITitreEtape[],
  i: number,
  demarche: ITitreDemarche
) => {
  if (etape.typeId === 'mno') {
    // si c’est la dernière c’est la MNO qui notifie du statut de la demande
    if (i === etapes.length - 1) {
      if (demarche.statutId === 'css') {
        return 'mnc'
      } else if (demarche.statutId === 'rej') {
        return 'mnd'
      } else if (etapes[i - 1].typeId === 'aco') {
        return 'mnv'
      } else {
        const aca = etapes.find(e => e.typeId === 'aca')
        if (aca?.statutId === 'ajo') {
          return 'mna'
        }

        return 'mnb'
      }
    } else {
      return 'mnb'
    }
  } else if (
    etape.typeId === 'rco' ||
    etape.typeId === 'mco' ||
    etape.id === 'm-ar-crique-awa-2020-oct01-rif01' ||
    etape.id === 'm-ar-crique-awa-2020-oct01-mif01'
  ) {
    return `${etape.typeId.slice(0, 1)}cb`
  }

  return undefined
}

const armRenProEtapeTypeIdGet = (
  etape: ITitreEtape,
  demarche: ITitreDemarche
) => {
  if (etape.typeId === 'mno') {
    if (demarche.statutId === 'css') {
      return 'mnc'
    } else if (demarche.statutId === 'rej') {
      return 'mnd'
    } else {
      return 'mnv'
    }
  }

  return undefined
}

const axmOctEtapeTypeIdGet = (etape: ITitreEtape) => {
  if (etape.typeId === 'rco' || etape.typeId === 'mco') {
    return `${etape.typeId.slice(0, 2)}a`
  }

  return undefined
}

// const prmOctEtapeTypeIdGet = (etape: ITitreEtape) => {
//   if (etape.typeId === 'rco' || etape.typeId === 'mco') {
//     return `${etape.typeId.slice(0, 2)}a`
//   }
//
//   return undefined
// }

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
        .filter(
          demarche =>
            titreDemarcheDemandeDateFind(demarche.etapes) > '2019-10-31'
        )

      for (const demarche of demarchesValid) {
        const etapes = demarche.etapes!
        for (let i = 0; i < etapes.length; i++) {
          const etape = etapes[i]
          let typeId

          if (demarchesEtatsDefinition.titreTypeId === 'arm') {
            if (demarche.typeId === 'oct') {
              typeId = armOctEtapeTypeIdGet(etape, etapes, i, demarche)
            } else if (['ren', 'pro'].includes(demarche.typeId)) {
              typeId = armRenProEtapeTypeIdGet(etape, demarche)
            }
          } else if (demarchesEtatsDefinition.titreTypeId === 'axm') {
            if (demarche.typeId === 'oct') {
              typeId = axmOctEtapeTypeIdGet(etape)
            }
          } else if (demarchesEtatsDefinition.titreTypeId === 'prm') {
            if (demarche.typeId === 'oct') {
              // FIXME
              // typeId = prmOctEtapeTypeIdGet(etape)
            }
          }

          if (typeId) {
            await titreEtapeUpdate(etape.id, { typeId })
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
