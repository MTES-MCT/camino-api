import 'dotenv/config'
import * as dateFormat from 'dateformat'
import '../../../database/index'
import fileCreate from '../../file-create'

import { titresGet } from '../../../database/queries/titres'

async function main() {
  const titres = await titresGet({
    typeIds: ['cxx', 'pxm', 'axm'],
    domaineIds: ['m'],
    statutIds: undefined,
    substances: undefined,
    noms: undefined,
    entreprises: undefined,
    references: undefined,
    territoires: ['guyane']
  })

  const titresFiltered = titres.filter(t => {
    const dateDebut = dateDebutFind(titreDemarchesPhasesFind(t.demarches))
    const dd = dateDebut && dateFormat(dateDebut, 'yyyy-mm-dd')

    return dd >= '2018-04-01'
  })

  console.log('titres:', titresFiltered.map(({ id }) => id))

  process.exit()
}

function dateDebutFind(titreDemarchesPhases) {
  return (
    (titreDemarchesPhases.length && titreDemarchesPhases[0].phase.dateDebut) ||
    null
  )
}

function titreDemarchesPhasesFind(demarches) {
  return demarches.filter(td => td.phase)
}

main()
