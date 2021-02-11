import 'dotenv/config'
import '../../src/init'

import { ITitreActivite } from '../../src/types'
import TitresActivites from '../../src/database/models/titres-activites'
import { titreActiviteSectionsBuild } from '../../src/business/rules/titre-activites-build'
import ActivitesTypes from '../../src/database/models/activites-types'
import { titresGet } from '../../src/database/queries/titres'

const titreGraIds = [
  'm-pr-beauvoir-2015',
  'm-ax-berge-conrad-2016',
  'm-cx-courbesseaux-1973',
  'm-cx-dieu-merci-1891',
  'm-cx-numero-215-166-1911',
  'm-cx-numero-215-226-1946',
  'm-cx-numero-219-elysee-1948',
  'm-cx-dombasle-ii-2004',
  'm-cx-la-victoire-1891',
  'm-cx-numero-208-nicole-providence-1911',
  'm-cx-la-madeleine-ii-1980',
  'm-cx-numero-214-167-dagobert-1911',
  'm-cx-numero-32-devez-1924',
  'm-cx-numero-6-boulanger-1889',
  'm-cx-numero-651-central-bief-1908',
  'm-cx-numero-82-repentir-1909',
  'm-cx-numero-86-devez-1930',
  'm-cx-placer-union-1907',
  'm-cx-renaissance-1889',
  'm-cx-rosieres-aux-salines-1845',
  'm-cx-numero-250-169-sophie-1911',
  'm-cx-numero-260-170-boeuf-mort-1912',
  'm-cx-saint-elie-1889'
]

const main = async () => {
  const titresActivitesWrp = await TitresActivites.query().where(
    'typeId',
    'wrp'
  )

  for (const ta of titresActivitesWrp) {
    const dateAnnee = Number(ta.date.slice(0, 4))

    if (dateAnnee === ta.annee) {
      const patch = {} as Partial<ITitreActivite>
      patch.date = `${dateAnnee + 1}${ta.date.slice(4)}`

      if (ta.dateSaisie && patch.date > ta.dateSaisie) {
        patch.dateSaisie = patch.date
      }

      await TitresActivites.query().patch(patch).where('id', ta.id)
      console.info(ta.id)
    }
  }

  console.info('* * *')

  const titresGra = await titresGet(
    { ids: titreGraIds },
    {
      fields: {
        demarches: {
          etapes: {
            substances: { legales: { fiscales: { unite: { id: {} } } } }
          }
        },
        activites: { id: {} }
      }
    },
    'super'
  )

  const activitesTypeGra = await ActivitesTypes.query()
    .where('id', 'gra')
    .first()!

  for (const t of titresGra) {
    if (
      t.activites?.length &&
      t.activites.some(ta => ta.typeId === 'gra' || ta.typeId === 'grx')
    ) {
      for (const ta of t.activites) {
        if (ta.typeId === 'gra' || ta.typeId === 'grx') {
          const sections = titreActiviteSectionsBuild(
            ta.typeId,
            activitesTypeGra.sections,
            ta.periodeId,
            ta.date,
            t.demarches!,
            t.typeId
          )

          await TitresActivites.query().patch({ sections }).where('id', ta.id)
          console.info(ta.id)
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
