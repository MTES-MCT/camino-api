import 'dotenv/config'
import '../../src/database/index'

import { titresGet } from '../../src/database/queries/titres'

async function main() {
  const titres = await titresGet({
    typesIds: ['cxx', 'pxm', 'axm'],
    domainesIds: ['m'],
    statutsIds: undefined,
    substances: undefined,
    noms: undefined,
    entreprises: undefined,
    references: undefined,
    territoires: 'guyane'
  })

  const titresFiltered = titres.filter(t => {
    const dateDebut = dateDebutFind(titreDemarchesPhasesFind(t.demarches))

    return dateDebut && dateDebut >= '2018-04-01'
  })

  console.log(
    'titres:',
    titresFiltered.map(({ id }) => id)
  )

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
