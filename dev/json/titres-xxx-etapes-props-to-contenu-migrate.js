const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const deleteTitresIncertides = domaineId => {
  const fileName = decamelize(
    `titres-${domaineId}-titres-incertitudes.json`,
    '-'
  )
  const filePath = `./sources/${fileName}`

  try {
    const incertitudes = JSON.parse(fs.readFileSync(filePath).toString())

    let count = 0

    incertitudes.forEach(ti => {
      if (ti.engagement || ti.volume) {
        if (ti.engagement) {
          delete ti.engagement
        }

        if (ti.volume) {
          delete ti.volume
        }

        count += 1
      }
    })

    if (count > 0) {
      console.info(`${domaineId}: incertitudes modifiées ${count}`)

      fs.writeFileSync(filePath, JSON.stringify(incertitudes, null, 2))

      console.info(`${domaineId}: ${filePath} modifié`)
    } else {
      console.info(`${domaineId}: aucune modification de incertitudes`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.error(e.stack)
  }
}

const migrateTitresEtapesIds = domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres.json`, '-')
  const filePath = `./sources/${fileName}`

  try {
    const titres = JSON.parse(fs.readFileSync(filePath).toString())

    let count = 0

    titres.forEach(t => {
      const { type_id: typeId } = t

      const sectionId = typeId !== 'ar' ? typeId.replace(/.$/, 'x') : 'arm'

      if (
        t.engagement_titre_etape_id ||
        t.engagement_devise_id_titre_etape_id ||
        t.volume_titre_etape_id ||
        t.volume_unite_id_titre_etape_id
      ) {
        if (!t.props_titre_etapes_ids) {
          t.props_titre_etapes_ids = {}
        }

        if (!t.props_titre_etapes_ids[sectionId]) {
          t.props_titre_etapes_ids[sectionId] = {}
        }

        if (t.engagement_titre_etape_id) {
          t.props_titre_etapes_ids[sectionId].engagement =
            t.engagement_titre_etape_id
          delete t.engagement_titre_etape_id
        }

        if (t.engagement_devise_id_titre_etape_id) {
          t.props_titre_etapes_ids[sectionId].engagementDeviseId =
            t.engagement_devise_id_titre_etape_id
          delete t.engagement_devise_id_titre_etape_id
        }

        if (t.volume_titre_etape_id) {
          t.props_titre_etapes_ids[sectionId].volume = t.volume_titre_etape_id
          delete t.volume_titre_etape_id
        }

        if (t.volume_unite_id_titre_etape_id) {
          t.props_titre_etapes_ids[sectionId].volumeUniteId =
            t.volume_unite_id_titre_etape_id
          delete t.volume_unite_id_titre_etape_id
        }

        count += 1
      }
    })

    if (count > 0) {
      console.info(`${domaineId}: titres modifiées ${count}`)

      fs.writeFileSync(filePath, JSON.stringify(titres, null, 2))

      console.info(`${domaineId}: ${filePath} modifié`)
    } else {
      console.info(`${domaineId}: aucune modification de titres`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.error(e.stack)
  }
}

const migrateEtapesContenu = domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-etapes.json`, '-')
  const filePath = `./sources/${fileName}`

  try {
    const titresEtapes = JSON.parse(fs.readFileSync(filePath).toString())

    let count = 0

    titresEtapes.forEach(te => {
      const { id } = te

      const [, typeId] = id.match(/^.-(..)/)

      const sectionId = typeId !== 'ar' ? `${typeId}x` : 'arm'

      let modif = false

      if (
        te.engagement !== undefined ||
        te.engagement_devise_id !== undefined ||
        te.volume !== undefined ||
        te.volume_unite_id !== undefined
      ) {
        if (!te.contenu) {
          te.contenu = {}
        }
        if (!te.contenu[sectionId]) {
          te.contenu[sectionId] = {}
        }

        if (te.engagement !== undefined) {
          te.contenu[sectionId].engagement = te.engagement
          delete te.engagement
        }

        if (te.engagement_devise_id !== undefined) {
          te.contenu[sectionId].engagementDeviseId = te.engagement_devise_id
          delete te.engagement_devise_id
        }

        if (te.volume !== undefined) {
          te.contenu[sectionId].volume = te.volume
          delete te.volume
        }

        if (te.volume_unite_id !== undefined) {
          te.contenu[sectionId].volumeUniteId = te.volume_unite_id
          delete te.volume_unite_id
        }

        modif = true
      }

      if (te.contenu) {
        Object.keys(te.contenu).forEach(s => {
          // supprime les sections sans élément
          if (Object.keys(te.contenu[s]).length === 0) {
            delete te.contenu[s]

            modif = true
          }
        })

        // supprime le contenu sans section
        if (Object.keys(te.contenu).length === 0) {
          delete te.contenu

          modif = true
        }
      }

      if (modif) {
        count += 1
      }
    })

    if (count > 0) {
      console.info(`${domaineId}: étapes modifiées ${count}`)

      fs.writeFileSync(filePath, JSON.stringify(titresEtapes, null, 2))

      console.info(`${domaineId}: ${filePath} modifié`)
    } else {
      console.info(`${domaineId}: aucune modification d'étapes`)
    }
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.error(e.stack)
  }
}

domainesIds.forEach(domaineId => {
  migrateEtapesContenu(domaineId)
  migrateTitresEtapesIds(domaineId)
  deleteTitresIncertides(domaineId)
})
