const xlsx = require('xlsx')
const fs = require('fs')

const getDate = () => {
  const date = new Date()

  return `${date
    .toISOString()
    .slice(
      0,
      10
    )}-${date.getUTCHours()}h${date.getUTCMinutes()}min${date.getUTCSeconds()}s`
}

const date = getDate()
const filePath = `./dev/tmp/requêtes_TDE_configs_manquantes_${date}.csv`

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const titresEtapes = domainesIds.flatMap(domaineId =>
  require(`../../sources/titres-${domaineId}-titres-etapes.json`)
)

const titresDemarches = domainesIds.flatMap(domaineId =>
  require(`../../sources/titres-${domaineId}-titres-demarches.json`)
)

const titres = domainesIds.flatMap(domaineId =>
  require(`../../sources/titres-${domaineId}-titres.json`)
)

const etapesTypes = require(`../../sources/etapes-types.json`)

const tdeTypes = require(`../../sources/titres-types--demarches-types--etapes-types.json`)

const etapes = titresEtapes.reduce((acc, te) => {
  const etape = {}

  const demarche = titresDemarches.find(td => td.id === te.titre_demarche_id)

  const titre = titres.find(t => t.id === demarche.titre_id)

  const etapeType = etapesTypes.find(et => et.id === te.type_id)

  etape.id_complet_etape = te.id
  etape.nom_etape = etapeType.nom
  etape.type_titre_id = titre.type_id
  etape.type_demarche_id = demarche.type_id
  etape.type_etape_id = te.type_id
  etape.statut_etape_id = te.statut_id

  const tdeType = tdeTypes.find(
    tde =>
      tde.titre_type_id === etape.type_titre_id &&
      tde.demarche_type_id === etape.type_demarche_id &&
      tde.etape_type_id === etape.type_etape_id
  )

  if (tdeType) {
    return acc
  }

  acc.push(etape)

  return acc
}, [])

const sheet = xlsx.utils.json_to_sheet(etapes)
const contenu = xlsx.utils.sheet_to_csv(sheet)

fs.writeFileSync(`${filePath}`, contenu)

console.log(`fichier ${filePath} créé`)
