import 'dotenv/config'
import '../../src/init'

import * as fs from 'fs'
import { join } from 'path'

import { titresGet, titreUpsert } from '../../src/database/queries/titres'
import { titreDemarcheUpsert } from '../../src/database/queries/titres-demarches'
import { titreEtapeUpsert } from '../../src/database/queries/titres-etapes'
import {
  entrepriseGet,
  entrepriseUpsert
} from '../../src/database/queries/entreprises'

const pathBuild = filePath => join(process.cwd(), filePath)

const mkdir = path => {
  try {
    const dossierPath = pathBuild(path)

    fs.mkdirSync(dossierPath)
  } catch (e) {
    // console.error('mkdir error:', path)
    // console.error(e.message)
  }
}

const etapeFind = (etapeDeb, etapesCamino = []) =>
  etapesCamino.find(
    etapeCamino =>
      // même type d'étape
      etapeDeb.typeId === etapeCamino.typeId &&
      // même date (donc même étape)
      etapeDeb.date === etapeCamino.date
  )

const demarcheFind = (demarcheDeb, demarchesCamino) =>
  demarchesCamino.find(
    demarcheCamino =>
      // même type de démarche
      demarcheCamino.typeId === demarcheDeb.typeId &&
      (
        demarcheDeb.typeId === 'oct' ||
        demarcheDeb.etapes.find(etapeDeb =>
          etapeFind(etapeDeb, demarcheCamino.etapes)
        )
      )
  )

const main = async () => {
  let { titres, entreprises } = JSON.parse(
    fs.readFileSync('./deb-titres-entreprises.json').toString()
  )

  if (false)
    titres = titres.filter(t => {
      try {
        return t.demarches[0]?.etapes[0]?.typeId === 'ihi'
      } catch (e) {
        console.error(e)
        console.error(t)

        process.exit(1)
      }
    }).slice(0, 10)

  if (false)
    console.log(titres[0])

  if (false)
    titres = titres.filter(t => t.references[0].nom === '2013-0021-MI')

  let entreprisesImported = []

  console.log('entreprises:', entreprises.length)

  for (const entrepriseDeb of entreprises) {
    const entrepriseCamino = await entrepriseGet(entrepriseDeb.id, {}, 'super')

    if (!entrepriseCamino) {
      console.log(
        'entreprise: not found in Camino',
        entrepriseDeb.id,
        entrepriseDeb.nom
      )

      await entrepriseUpsert(entrepriseDeb)

      entreprisesImported.push({ id: entrepriseDeb.id, nom: entrepriseDeb.nom })
    } else {
      console.log(
        'entreprise:     found in Camino',
        entrepriseCamino.id,
        entrepriseCamino.nom
      )
    }
  }

  console.log()

  console.log('titres:', titres.length)

  let titresImported = []
  let demarchesImported = []
  let etapesImported = []
  let documentsImported = []
  let fichiersImported = []

  const files = new Map()
  const filesImported = []

  const errors = []

  for (const titreDeb of titres) {
    titreDeb.demarches &&
      titreDeb.demarches.forEach(demarche => {
        demarche.etapes &&
          demarche.etapes.forEach(etape => {
            etape.documents &&
              etape.documents.forEach(d => {
                files.set(d.id, d.fileName)
                delete d.fileName
              })
          })
      })

    const reference = titreDeb.references[0].nom

    const titresCamino = await titresGet(
      { references: reference },
      {
        fields: {
          references: { id: {} },
          demarches: { etapes: { id: {} } }
        }
      },
      'super'
    )

    const titreCamino = titresCamino?.find(
      t => t.references?.find(r => r.nom === reference)
    )

    if (!titreCamino) {
      console.log('titre: not found in Camino:', titreDeb.id, reference)

      try {
        await titreUpsert(titreDeb, {}, null, 'super')

        titresImported.push({ id: titreDeb.id, reference })
      } catch (e) {
        errors.push({ titre: titreDeb.id, e })
      }

      // break

      continue
    } else {
      console.log('titre:    found in Camino:', titreCamino.id)
    }

    for (const demarcheDeb of titreDeb.demarches) {
      const demarcheCamino = demarcheFind(demarcheDeb, titreCamino?.demarches)

      if (!demarcheCamino) {
        console.log('demarche: not found in Camino', demarcheDeb.id)

        demarcheDeb.titreId = titreCamino.id

        try {
          await titreDemarcheUpsert(demarcheDeb)

          demarchesImported.push({ id: demarcheDeb.id, reference })
        } catch (e) {
          errors.push({ demarche: demarcheDeb.id, e })
        }
      } else {
        console.log('demarche:     found in Camino', demarcheCamino.id)
      }

      for (const etapeDeb of demarcheDeb.etapes) {
        const etapeCamino = etapeFind(etapeDeb, demarcheCamino?.etapes)

        if (!etapeCamino) {
          const docs = etapeDeb.documents
          const fichiers = etapeDeb.documents?.filter(d => d.fichier) || []

          fichiers.forEach(f => {
            const fileName = files.get(f.id)

            filesImported.push({ id: f.id, fileName, reference })

            const dirPath = `files/etapes/${etapeDeb.id}`

            try {
              mkdir(dirPath)

              console.log(`répertoire créé : ${dirPath}`)
            } catch (e) { }

            try {
              fs.copyFileSync(`files-deb/${fileName}`, `${dirPath}/${f.id}.pdf`)
            } catch (e) {
              errors.push({ file: fileName, e })
            }
          })

          console.log(
            'etape: not found in Camino',
            etapeDeb.id,
            '(docs:',
            docs?.length | 0,
            ')'
          )

          if (demarcheCamino) {
            etapeDeb.titreDemarcheId = demarcheCamino.id
          }

          try {
            await titreEtapeUpsert(etapeDeb)

            etapesImported.push({ id: etapeDeb.id, reference })
            documentsImported.push(...docs?.map(d => ({ id: d.id, reference })))
            fichiersImported.push(...fichiers?.map(f => ({ id: f.id, reference })))
          } catch (e) {
            errors.push({ etape: etapeDeb.id, e })
          }

          continue
        }

        console.log('etape:     found in Camino', etapeCamino.id)
      }
    }

    console.log()
  }

  console.log('entreprises imported:', entreprisesImported.length)
  console.log('titres      imported:', titresImported.length)
  console.log('demarches   imported:', demarchesImported.length)
  console.log('etapes      imported:', etapesImported.length)
  console.log('documents   imported:', documentsImported.length)
  console.log('fichiers    imported:', fichiersImported.length)
  console.log('files:', files.size)
  console.log('files       imported:', filesImported.length)
  console.log()

  console.log('errors:', errors.length)
  errors.forEach(({ e, ...rest }) =>
    console.log(JSON.stringify(rest), e.message, e.stack)
  )

  fs.writeFileSync('deb-files.json', JSON.stringify(filesImported, null, 2))
  fs.writeFileSync('deb-reprise-rapport.json', JSON.stringify({
    entreprisesImported,
    titresImported,
    demarchesImported,
    etapesImported,
    documentsImported,
    fichiersImported,
    filesImported
  }, null, 2))

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
