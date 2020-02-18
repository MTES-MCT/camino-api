import 'dotenv/config'
import '../../src/database/index'

import {
  entrepriseGet,
  entrepriseDelete
} from '../../src/database/queries/entreprises'

async function main() {
  const entreprisesIds = [
    'arkema-france',
    'cominor',
    'compagnie-des-mines-de-sel-de-poligny-solvay',
    'compagnie-des-salins-du-midi-et-des-salines-de-l-est',
    'compagnie-fermiere-de-salies-de-bearn',
    'cordier-mines',
    'corp-des-part-prenants-de-la-fontaine-salee',
    'csme',
    'elf-rhone-alpes-union',
    'garrot-chaillac',
    'imerys-ceramics-france',
    'novacarb',
    'saline-d-einville',
    'salines-cerebos-et-de-bayonne-solvay',
    'sgz-france-sas',
    'societe-des-mines-d-orbagnoux',
    'sodicapei',
    'solvay-electrolyse-france',
    'solvay-sa',
    'variscan-mines'
  ]

  for (const entrepriseId of entreprisesIds) {
    const entreprise = await entrepriseGet(entrepriseId)

    if (!entreprise) {
      console.log('entreprise absente:', entrepriseId)

      continue
    }

    console.log('suppression entreprise:', entrepriseId)

    await entrepriseDelete(entrepriseId)
  }

  process.exit()
}

main()
