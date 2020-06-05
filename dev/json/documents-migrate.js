const fs = require('fs')
const { join, basename } = require('path')
const chalk = require('chalk')
const decamelize = require('decamelize')
const slugify = require('@sindresorhus/slugify')
const cryptoRandomString = require('crypto-random-string')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

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

const fileRename = (oldFileName, newFileName, repertoire, dossier) => {
  const oldPath = pathBuild(`files/${oldFileName}.pdf`)
  const newDirPath = `files/${repertoire}/${dossier}`
  const newPath = pathBuild(`${newDirPath}/${newFileName}.pdf`)

  mkdir(newDirPath)

  try {
    fs.renameSync(oldPath, newPath)

    const log = `fichier renommé: ${basename(oldPath)} -> ${basename(newPath)}`

    console.info(log)
  } catch (err) {
    console.error(`fichier non renommé: ${oldPath} => ${newPath} !`)
    console.error(err.message)

    errors.push({ type: 'rename', message: err.message })
  }
}

const elementsLoad = name => {
  try {
    const fileName = decamelize(`${name}.json`, '-')

    const filePath = `./sources/${fileName}`
    const elements = JSON.parse(fs.readFileSync(filePath).toString())

    return elements
  } catch (e) {
    console.error('fichier introuvable', e.message)
  }
}

const elementsSave = (name, elements) => {
  try {
    const fileName = decamelize(`${name}.json`, '-')

    const filePath = `./sources/${fileName}`

    fs.writeFileSync(filePath, JSON.stringify(elements, null, 2))
  } catch (e) {
    console.error('fichier impossible à sauvegarder', e.message)
  }
}

// renommer les fichiers json etapes-documents en documents

// dans le fichiers documents
// - changer l'id
// - ajouter la date
// - supprimer l'etape-id
// déterminer le répertoire en fonction du type de document
// renommer le fichier et le déplacer dans le sous dossier correspondant au repertoire
// créer les fichiers des tables de jointure
// - titres-etapes-documents
// - entreprises-documents
// - titres-activites-documents

const documentFichierMoveAndRename = (
  etapeDocumentId,
  documentId,
  repertoire,
  titreEtape,
  titresEtapesJustificatifs,
  entrepriseId
) => {
  if (repertoire === 'etapes') {
    fileRename(etapeDocumentId, documentId, repertoire, titreEtape.id)

    return true
  }

  if (repertoire === 'entreprises') {
    titresEtapesJustificatifs.push({
      titreEtapeId: titreEtape.id,
      documentId
    })

    fileRename(etapeDocumentId, documentId, repertoire, entrepriseId)

    return true
  }

  const message = `repertoire indéfini: ${repertoire}, ${titreEtape.id}, ${documentId}`

  console.error(message)

  errors.push({ type: 'move', message })
}

// les documents de ces types d'étapes sont visibles par les entreprises
const etapesDocsEntreprisesLecture = [
  'mfr',
  'mdp',
  'des',
  'pfd',
  'mod',
  'mco',
  'rco',
  'mif',
  'rif',
  'mcp',
  'apu',
  'rde',
  'vfd',
  'anf',
  'ane',
  'ppu',
  'epu',
  'dim',
  'dex',
  'dpu',
  'dux',
  'dup',
  'rpu',
  'rtd',
  'abd',
  'and',
  'mno',
  'pfc',
  'vfc',
  'sco',
  'aco'
]

const documentBuild = (etapeDocument, domaineId, titreEtape, entrepriseId) => {
  let hash = etapeDocument.id.split('-').pop()

  if (!hash) {
    hash = cryptoRandomString({ length: 8 })
  }

  // créer l'id du document
  const documentId = slugify(
    `${titreEtape.date}-${etapeDocument.type_id}-${hash}`
  )

  // on construit le document à partir d'etapeDocument
  const document = {
    id: documentId,
    type_id: etapeDocument.type_id,
    description: etapeDocument.description,
    fichier: etapeDocument.fichier,
    fichier_type_id: etapeDocument.fichier_type_id,
    url: etapeDocument.url,
    uri: etapeDocument.uri,
    jorf: etapeDocument.jorf,
    nor: etapeDocument.nor,
    // la date est celle de l'étape
    date: titreEtape.date,
    public_lecture: etapeDocument.public,
    entreprises_lecture:
      // par défaut, on met la même visibilité entreprise que pour le public
      etapeDocument.public ||
      // sinon, si c'est un document associé à une entreprise
      !!entrepriseId ||
      // sinon, si le document est dans une étape
      // dont les documents sont toujours visibles par l'entreprise
      etapesDocsEntreprisesLecture.includes(titreEtape.type_id)
  }

  if (entrepriseId) {
    document.entrepriseId = entrepriseId
  } else {
    document.titreEtapeId = titreEtape.id
  }
  document.titreActiviteId = null

  return document
}

const entrepriseIdGet = (
  titreDemarcheId,
  etapeDocumentId,
  titresTitulaires
) => {
  const titulairesIds = titresTitulaires.reduce((titulairesIds, t) => {
    if (t.titre_etape_id.match(titreDemarcheId)) {
      titulairesIds.add(t.entreprise_id)
    }

    return titulairesIds
  }, new Set())

  const entreprisesIds = [...titulairesIds]

  if (!entreprisesIds.length) {
    const message = `pas de titulaire ! ${etapeDocumentId}`

    console.warn(message)

    errors.push({ type: 'move', message })

    return false
  }

  if (entreprisesIds.length > 1) {
    const message = `plusieurs titulaires ! ${etapeDocumentId}, ${entreprisesIds}`

    console.warn(message)

    errors.push({ type: 'move', message })
  }

  const [entrepriseId] = entreprisesIds

  return entrepriseId
}

const errors = []

let documentsTotal = 0
let filesTotal = 0

mkdir('files/etapes')

mkdir('files/entreprises')

mkdir('files/activites')

mkdir('files/travaux')

// pour déterminer le répertoire du document en fonction du type
const documentsTypes = elementsLoad(`documents-types`)

const documents = domainesIds.reduce((documents, domaineId) => {
  console.info('renommage du domaine', domaineId)

  let documentsDomaineTotal = 0
  let fichiersDomaineTotal = 0

  try {
    const etapesDocuments = elementsLoad(`titres-${domaineId}-titres-documents`)

    // pour récupérer la date de l'étape
    const titresEtapes = elementsLoad(`titres-${domaineId}-titres-etapes`)

    // pour récupérer le titulaire du document
    const titresTitulaires = elementsLoad(
      `titres-${domaineId}-titres-titulaires`
    )

    const titresEtapesJustificatifs = etapesDocuments.reduce(
      (titresEtapesJustificatifs, etapeDocument) => {
        const titreEtapeId = etapeDocument.titre_etape_id

        const titreEtape = titresEtapes.find(t => t.id === titreEtapeId)

        // détermine le répertoire en fonction du type de document
        const documentType = documentsTypes.find(
          d => d.id === etapeDocument.type_id
        )

        const { repertoire } = documentType

        let entrepriseId
        if (repertoire === 'entreprises') {
          entrepriseId = entrepriseIdGet(
            titreEtape.titre_demarche_id,
            etapeDocument.id,
            titresTitulaires
          )
        }

        const document = documentBuild(
          etapeDocument,
          domaineId,
          titreEtape,
          entrepriseId
        )

        documents.push(document)

        documentsDomaineTotal += 1
        documentsTotal += 1

        if (etapeDocument.fichier) {
          const renamed = documentFichierMoveAndRename(
            etapeDocument.id,
            document.id,
            repertoire,
            titreEtape,
            titresEtapesJustificatifs,
            entrepriseId
          )

          if (renamed) {
            fichiersDomaineTotal += 1
            filesTotal += 1
          }
        }

        return titresEtapesJustificatifs
      },
      []
    )

    elementsSave(
      `titres-${domaineId}-titres-etapes-justificatifs`,
      titresEtapesJustificatifs
    )

    console.info(
      'renommage du domaine',
      domaineId,
      'terminé,',
      documentsDomaineTotal,
      'documents traités',
      fichiersDomaineTotal,
      'fichiers renommés'
    )
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.info(chalk.red(e.stack))

    errors.push({ type: 'global', message: e.message })
  }

  return documents
}, [])

elementsSave('documents', documents)

console.info('renommages terminés')
console.info(documentsTotal, 'documents traités')
console.info(filesTotal, 'fichiers renommés')

console.info('erreurs:', errors.length)
errors.forEach(e => {
  console.info(e.type, e.message)
})

// X modifier les seed

// import
// x importer depuis documents au lieu de etape-documents
// x importer la tables de jointure titre-etapes-justificatifs

// export
// x exporter vers documents au lieu de titres-documents
// x exporter les tables de jointure titre-etapes-justificatifs

// API étapes
// x modifier permissions d'affichage des documents
// x modifier permissions téléchargement
// x modifier upload

// - renommer le fichier lors du changement de date

// API activités
// - ajout de fichier dans les activités
// - téléchargement de fichier dans les activités

// - renommage d'id (dossiers)
