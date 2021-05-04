import '../../init'
import { knex } from '../../knex'
import fileCreate from '../../tools/file-create'
import xlsx from 'xlsx'
import { Index } from '../../types.js'

async function main() {
  const titres = await knex('titres')
    .where('dateFin', '>', '1990-01-01')
    .where('statutId', 'ech')

  const sheet = xlsx.utils.json_to_sheet(titres as Index<any>[])

  const fileContent = xlsx.utils.sheet_to_csv(sheet)

  await fileCreate('titres-echus.csv', fileContent)

  console.log(`fichier créé avec ${titres.length} lignes`)
  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
