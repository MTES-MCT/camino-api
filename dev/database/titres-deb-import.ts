import 'dotenv/config'
import '../../src/init'

import * as fs from 'fs'
import { join } from 'path'

import {
  titresGet,
  titreGet,
  titreUpsert
} from '../../src/database/queries/titres'
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

const log = (...res) => console.info(res.join('\t'))

const etapeFind = (etapeDeb, etapesCamino = []) =>
  etapesCamino.find(
    etapeCamino =>
      // même type d'étape
      etapeDeb.typeId === etapeCamino.typeId &&
      // même date (donc même étape)
      etapeDeb.date === etapeCamino.date
  )

const demarcheFind = (demarcheDeb, demarchesCamino = []) =>
  demarchesCamino.find(
    demarcheCamino =>
      // même type de démarche
      demarcheCamino.typeId === demarcheDeb.typeId &&
      (demarcheDeb.typeId === 'oct' ||
        demarcheDeb.etapes.find(etapeDeb =>
          etapeFind(etapeDeb, demarcheCamino.etapes)
        ))
  )

const main = async () => {
  const { titres, entreprises } = JSON.parse(
    fs.readFileSync('./deb-titres-entreprises.json').toString()
  )

  const entreprisesImported = []

  log('entreprises:', entreprises.length)

  for (const entrepriseDeb of entreprises) {
    const entrepriseCamino = await entrepriseGet(entrepriseDeb.id, {}, 'super')

    if (!entrepriseCamino) {
      log(
        'entreprise',
        'not found in Camino',
        entrepriseDeb.id,
        entrepriseDeb.nom
      )

      await entrepriseUpsert(entrepriseDeb)

      entreprisesImported.push({ id: entrepriseDeb.id, nom: entrepriseDeb.nom })
    } else {
      log(
        'entreprise',
        'found in Camino',
        entrepriseCamino.id,
        entrepriseCamino.nom
      )
    }
  }

  log()

  log('titres', titres.length)

  const titresImported = []
  const demarchesImported = []
  const etapesImported = []
  const documentsImported = []
  const fichiersImported = []

  const files = new Map()
  const filesImported = []

  const errors = []

  const importTitre = async titreDeb => {
    if (!titreDeb.demarches?.length) {
      log('titre', 'sans demarche', titreDeb.id)

      return
    }

    if (titreDeb.demarches) {
      titreDeb.demarches.forEach(demarche => {
        delete demarche.annulationTitreDemarcheId

        if (demarche.etapes) {
          demarche.etapes.forEach(etape => {
            if (etape.documents) {
              etape.documents.forEach(d => {
                files.set(d.id, d.fileName)

                delete d.fileName
              })
            }
          })
        }
      })
    }

    const referenceDeb = titreDeb.references.find(r => r.typeId === 'deb').nom
    const referenceRntm = (
      titreDeb.references.find(r => r.typeId === 'rnt') || {}
    ).nom

    const titresCamino = await titresGet(
      { references: referenceDeb },
      {
        fields: {
          references: { id: {} },
          demarches: { etapes: { id: {} } }
        }
      },
      'super'
    )

    const titreCamino = titresCamino?.find(t =>
      t.references?.find(r => r.nom === referenceDeb)
    )

    const titreCaminoById = await titreGet(
      titreDeb.id,
      {
        fields: {
          references: { id: {} },
          demarches: { etapes: { id: {} } }
        }
      },
      'super'
    )

    log('by ref: ', titreCamino?.id)
    log('by id: ', titreCaminoById?.id)

    if (!titreCamino && !titreCaminoById) {
      log('titre', 'not found in Camino by ref/id:', titreDeb.id, referenceDeb)

      try {
        await titreUpsert(titreDeb, {}, null, 'super')

        titresImported.push({
          id: titreDeb.id,
          referenceDeb,
          referenceRntm,
          titre: titreDeb.id
        })
      } catch (e) {
        errors.push({ titre: titreDeb.id, e })
      }
    } else if (!titreCaminoById) {
      log(
        'titre',
        'found in Camino:',
        titreCamino.id,
        referenceDeb,
        ', camino id deb:',
        titreDeb.id
      )
    } else {
      // titreCamino = titreCaminoById

      log('titre', 'found in Camino by id:', titreDeb.id, referenceDeb)
    }

    for (const demarcheDeb of titreDeb.demarches) {
      await importDemarche(demarcheDeb, titreDeb, referenceDeb, titreCamino)
    }

    log()

    // break
  }

  const importDemarche = async (
    demarcheDeb,
    titreDeb,
    referenceDeb,
    titreCamino
  ) => {
    if (!demarcheDeb.etapes?.length) {
      log('demarche', 'sans etape', demarcheDeb.id)

      return
    }

    const demarcheCamino = demarcheFind(demarcheDeb, titreCamino?.demarches)

    // on insert la démarche que si le titre existe déjà
    // (car sinon elle est insérée avec le titre au dessus)
    if (!demarcheCamino && titreCamino) {
      log('demarche', 'not found in Camino', demarcheDeb.id)

      demarcheDeb.titreId = titreCamino.id

      try {
        await titreDemarcheUpsert(demarcheDeb)

        demarchesImported.push({
          id: demarcheDeb.id,
          referenceDeb,
          titre: titreDeb.id
        })
      } catch (e) {
        errors.push({ demarche: demarcheDeb.id, e })
      }
    } else if (demarcheCamino) {
      log('demarche', 'found in Camino', demarcheCamino.id)
    }

    for (const etapeDeb of demarcheDeb.etapes) {
      await importEtape(
        etapeDeb,
        demarcheDeb,
        titreDeb,
        referenceDeb,
        demarcheCamino
      )
    }
  }

  const importEtape = async (
    etapeDeb,
    demarcheDeb,
    titreDeb,
    referenceDeb,
    demarcheCamino
  ) => {
    const etapeCamino = etapeFind(etapeDeb, demarcheCamino?.etapes)

    if (!etapeCamino) {
      const docs = etapeDeb.documents
      const fichiers = etapeDeb.documents?.filter(d => d.fichier) || []

      fichiers.forEach(f => {
        const fileName = files.get(f.id)

        filesImported.push({
          id: f.id,
          fileName,
          referenceDeb,
          titre: titreDeb.id
        })

        const dirPath = `files/demarches/${etapeDeb.id}`

        try {
          mkdir(dirPath)

          log('répertoire', dirPath, 'créé')
        } catch (e) {
          console.error(e)
        }

        try {
          fs.copyFileSync(`files-deb/${fileName}`, `${dirPath}/${f.id}.pdf`)

          log('fichier', `files-deb/${fileName} => ${dirPath}/${f.id}.pdf`)
        } catch (e1) {
          try {
            fs.copyFileSync(
              `files-deb/noconvert/${fileName}`,
              `${dirPath}/${f.id}.pdf`
            )

            log(
              'fichier',
              `files-deb/noconvert/${fileName} => ${dirPath}/${f.id}.pdf`
            )

            errors.push({ file: fileName, e: e1 })
          } catch (e2) {
            errors.push({ file: fileName, e: e2 })
          }
        }
      })

      // on insert l'étape que si la démarche existe déjà
      // (car sinon elle est insérée avec la démarche au dessus)
      // (ou avec le titre plus au dessus)
      if (demarcheCamino) {
        log(
          'etape',
          'not found in Camino',
          etapeDeb.id,
          '(docs:',
          docs?.length | 0,
          ')'
        )

        etapeDeb.titreDemarcheId = demarcheCamino.id

        try {
          await titreEtapeUpsert(etapeDeb)

          etapesImported.push({
            id: etapeDeb.id,
            referenceDeb,
            titre: titreDeb.id
          })
          documentsImported.push(
            ...docs?.map(d => ({ id: d.id, referenceDeb, titre: titreDeb.id }))
          )
          fichiersImported.push(
            ...fichiers?.map(f => ({
              id: f.id,
              referenceDeb,
              titre: titreDeb.id,
              name: files.get(f.id)
            }))
          )
        } catch (e) {
          errors.push({ etape: etapeDeb.id, e })
        }
      }
    } else {
      log('etape', 'found in Camino', etapeCamino.id)
    }
  }

  for (const titreDeb of titres) {
    await importTitre(titreDeb)
  }

  log('entreprises imported', entreprisesImported.length)
  log('titres      imported', titresImported.length)
  log('demarches   imported', demarchesImported.length)
  log('etapes      imported', etapesImported.length)
  log('documents   imported', documentsImported.length)
  log('fichiers    imported', fichiersImported.length)
  log('files       all     ', files.size)
  log('files       in etape', filesImported.length)
  log()

  log('errors:', errors.length)
  errors.forEach(({ e, ...rest }) =>
    log(JSON.stringify(rest), e.message, e.stack)
  )

  // fs.writeFileSync('deb-files.json', JSON.stringify(filesImported, null, 2))
  fs.writeFileSync(
    'deb-reprise-rapport.json',
    JSON.stringify(
      {
        entreprisesImported,

        titresImported,
        demarchesImported,
        etapesImported,
        documentsImported,
        fichiersImported,
        filesImported,

        errors
      },
      null,
      2
    )
  )

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
