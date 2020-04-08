const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const { renameSync: rename, existsSync: exists } = require('fs')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const dups = [
  'm-cx-dieu-merci-1891-dec01-dup01-d19bcf04',
  'm-cx-la-victoire-1891-dec01-dup01-cc32d49b',
  'm-cx-numero-135-1933-dec02-dup01-fc334344',
  'm-cx-numero-135-1933-dec01-dup01-7aa86305',
  'm-cx-numero-32-devez-1924-dec02-dup01-8586d675',
  'm-cx-numero-32-devez-1924-dec01-dup01-a5a766de',
  'm-cx-numero-651-central-bief-1908-dec02-dup01-b8c2f735',
  'm-cx-numero-651-central-bief-1908-dec01-dup01-fdcb591f',
  'm-cx-numero-86-devez-1930-dec02-dup01-fd957be1',
  'm-cx-numero-86-devez-1930-dec01-dup01-ac9154a6',
  'm-cx-renaissance-1889-dec01-dup01-19841ddf',
  'm-cx-saint-elie-1889-dec01-dup01-d9f661ac',
  'h-px-grandville-est-1990-prr01-dup01-b1c1c93c',
  'h-px-saucede-ledeuix-1985-prr01-dup01-451b173b',
  'h-px-vulaines-1988-prr01-dup01-750dc5f6'
]

const titresDocumentsIdsRename = domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-documents.json`, '-')
  const filePath = `./sources/${fileName}`

  try {
    const documents = JSON.parse(fs.readFileSync(filePath).toString())

    let count = 0

    documents.forEach(d => {
      // si l'id du document contient encore un type sur 3 caractères
      // alors on enlève le dernier caractère
      if (d.id.match(/^.-...-/)) {
        d.id = d.id.replace(/(.-..).-/, '$1-')

        count += 1
      }
    })

    if (count > 0) {
      console.info(`${domaineId}: documents modifiées ${count}`)

      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2))

      console.info(`${domaineId}: ${filePath} modifié`)
    } else {
      console.info(`${domaineId}: aucune modification de documents`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.error(e.stack)
  }
}

const titresDocumentsFilesMove = domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-documents.json`, '-')
  const filePath = `./sources/${fileName}`

  try {
    const documents = JSON.parse(fs.readFileSync(filePath).toString())

    let count = 0

    documents.forEach(d => {
      // si le document est une dpu non renommée en dup
      // alors on renomme le fichier en `dup`
      if (dups.includes(d.id)) {
        const documentNameOld = d.id.replace('dup01', 'dpu01')

        const pathNameOld = `./files/${documentNameOld}.pdf`
        const pathNameNew = `./files/${d.id}.pdf`

        if (exists(pathNameOld)) {
          try {
            rename(pathNameOld, pathNameNew)

            console.info(`${pathNameOld} => ${pathNameNew}`)

            count += 1
          } catch (e) {
            console.info(chalk.red(e.message.split('\n')[0]))
          }
        }
      }

      // si le document est une `mcp`
      // et que le fichieren `mcr` existe
      // alors on renomme le fichier de `mcr` en `mcp`
      if (d.id.match(/-mcp/)) {
        const documentNameOld = d.id.replace('mcp01', 'mcr01')

        const pathNameOld = `./files/${documentNameOld}.pdf`

        if (exists(pathNameOld)) {
          try {
            const pathNameNew = `./files/${d.id}.pdf`

            rename(pathNameOld, pathNameNew)

            console.info(`${pathNameOld} => ${pathNameNew}`)

            count += 1
          } catch (e) {
            console.info(chalk.red(e.message.split('\n')[0]))
          }
        }
      }
    })

    if (count > 0) {
      console.info(`${domaineId}: documents renommés ${count}`)

      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2))

      console.info(`${domaineId}: ${filePath} modifié`)
    } else {
      console.info(`${domaineId}: aucun renommage de documents`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.error(e.stack)
  }
}

domainesIds.forEach(domaineId => {
  titresDocumentsIdsRename(domaineId)
  titresDocumentsFilesMove(domaineId)
})
