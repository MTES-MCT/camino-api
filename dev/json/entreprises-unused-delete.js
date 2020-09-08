const fs = require('fs')
const chalk = require('chalk')

const entrepriseIdsToDelete = [
  'fr-973000002',
  'fr-488562166',
  'fr-572023281',
  'fr-498658004',
  'xx-000000019',
  'fr-623820651',
  'fr-110068012',
  'fr-568500649',
  'fr-805315355',
  'fr-030000008',
  'fr-517430310',
  'fr-030000006',
  'arkema-france',
  'cominor',
  'compagnie-des-mines-de-sel-de-poligny-solvay',
  'compagnie-des-salins-du-midi-et-des-salines-de-l-est',
  'compagnie-fermiere-de-salies-de-bearn',
  'cordier-mines',
  'corp-des-part-prenants-de-la-fontaine-salee',
  'csme',
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

try {
  const filePath = './sources/entreprises.json'

  const entreprises = JSON.parse(fs.readFileSync(filePath).toString())

  const unusedEntreprises = entreprises.filter(e =>
    entrepriseIdsToDelete.includes(e.id)
  )

  if (unusedEntreprises.length > 0) {
    console.info(
      'entreprises supprimées:',
      unusedEntreprises.map(e => e.id)
    )

    const usedEntreprises = entreprises.filter(
      e => !entrepriseIdsToDelete.includes(e.id)
    )

    fs.writeFileSync(filePath, JSON.stringify(usedEntreprises, null, 2))

    const usedEntrepriseIds = entreprises
      .filter(e => !entrepriseIdsToDelete.includes(e.id))
      .map(e => e.id)

    // On supprime tous les établissements des entreprises supprimées
    const etablissementsFilePath = './sources/entreprises-etablissements.json'
    const etablissements = JSON.parse(
      fs.readFileSync(etablissementsFilePath).toString()
    )
    const usedEtablissements = etablissements.filter(e =>
      usedEntrepriseIds.includes(e.entreprise_id)
    )
    fs.writeFileSync(
      etablissementsFilePath,
      JSON.stringify(usedEtablissements, null, 2)
    )

    // On supprime tous les documents des entreprises supprimées
    const documentsFilePath = './sources/documents.json'
    const documents = JSON.parse(fs.readFileSync(documentsFilePath).toString())
    const usedDocuments = documents.filter(
      e => !e.entreprise_id || usedEntrepriseIds.includes(e.entreprise_id)
    )
    fs.writeFileSync(documentsFilePath, JSON.stringify(usedDocuments, null, 2))

    console.info(`entreprises supprimées ${unusedEntreprises.length}`)
    console.info(
      `établissements supprimés ${
        etablissements.length - usedEtablissements.length
      }`
    )
    console.info(
      `documents supprimés ${documents.length - usedDocuments.length}`
    )
  } else {
    console.info(`aucune entreprise à supprimer`)
  }
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.error(e.stack)
}
