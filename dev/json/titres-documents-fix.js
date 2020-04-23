const chalk = require('chalk')
const decamelize = require('decamelize')

const {
  renameSync: rename,
  existsSync: exists,
  readdirSync: readdir,
  readFileSync: readFile,
  writeFileSync: writeFile
} = require('fs')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const ignoreList = [
  // démarches diff, à vérifier
  'm-cx-escaro-1962',
  'm-pr-loc-envel-2015',
  'm-pr-merleac-2014',
  'm-cx-oraas-1844',
  'm-ar-crique-mousse-2018',
  'm-ar-crique-amadis-aval-2019',
  'm-ar-crique-amadis-centre-2019',
  // même hash, à renommer
  'm-ax-crique-petit-inini-2014',
  'm-ax-crique-bois-bande-1-2016',
  // même hash, à renommer
  'm-ar-crique-kounamari-5-2018',
  'm-ar-crique-kounamari-6-2018'
]

const targets = []

const files = readdir('./files').map(file => file.split('.pdf')[0])

const hashGet = str => str.split('-').pop()

const matchFuzzy = (name, array, partGet = hashGet) => {
  const hash = name.split('-').pop()

  return array.reduce((r, key) => {
    // on ne garde pas les matches entiers pendant un fuzzy
    if (key === name) {
      return r
    }

    const part = partGet(key)

    if (part === hash) {
      r.push(key)
    }

    return r
  }, [])
}

const titresDocumentsIdsRename = async domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-documents.json`, '-')
  const filePath = `./sources/${fileName}`

  const documents = JSON.parse(readFile(filePath).toString())

  let count = 0

  await Promise.all(
    documents.map(async d => {
      if (!d.fichier) return

      if (!d.id.match(d.type_id)) {
        const parts = d.id.split('-')

        const hash = parts.pop()
        const etape = parts.join('-')

        const idOld = d.id
        const idNew = `${etape}-${d.type_id}-${hash}`

        console.info('<-', idOld)
        console.info('->', idNew)

        const pathNameOld = `./files/${idOld}.pdf`
        const pathNameNew = `./files/${idNew}.pdf`

        try {
          await rename(pathNameOld, pathNameNew)

          d.id = idNew

          count += 1
        } catch (e) {
          console.info('no such file', `${idOld}.pdf`)
        }
      }

      return
    })
  )

  if (count > 0) {
    console.info(
      `${domaineId}: id(s) de document(s) modifié(s) et fichier(s) renommé(s) ${count}`
    )

    writeFile(filePath, JSON.stringify(documents, null, 2))

    console.info(`${domaineId}: ${filePath} modifié`)
  } else {
    console.info(`${domaineId}: aucune modification de documents`)
  }
}

const titresDocumentsNoFileRename = async domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-documents.json`, '-')
  const filePath = `./sources/${fileName}`

  const documents = JSON.parse(readFile(filePath).toString())

  let count = 0

  await Promise.all(
    documents.map(async d => {
      if (!d.fichier) return

      const pathNameDoc = `./files/${d.id}.pdf`
      const oldExists = exists(pathNameDoc)

      // le fichier existe, on ne fait rien
      if (oldExists) return

      // cherche un fichier avec le même hash que le document
      const matches = matchFuzzy(d.id, files)

      if (!matches) {
        console.error('aucun fichier pour', d.id)
        return
      }

      if (matches.length > 1) {
        console.error(
          'plusieurs fichiers pour',
          d.id,
          ', impossible de décider seul'
        )
        console.error(matches.join('\n'))
        return
      }

      const pathNameOld = `./files/${matches[0]}.pdf`

      await rename(pathNameOld, pathNameDoc)

      count += 1

      return
    })
  )

  if (count > 0) {
    console.info(`${domaineId}: fichier(s) renommé(s) ${count}`)
  } else {
    console.info(`${domaineId}: aucun renommage de document`)
  }
}

Promise.all(
  domainesIds.map(async domaineId => {
    await titresDocumentsNoFileRename(domaineId)
    await titresDocumentsIdsRename(domaineId)
  })
).catch(e => {
  console.info(chalk.red(e.message.split('\n')[0]))
  console.error(e.stack)
})
