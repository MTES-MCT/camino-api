import fileRename from '../../tools/file-rename'
import {
  ITitres,
  ITitresDemarches,
  ITitresEtapes,
  ITitresDocuments
} from '../../types'

interface Index {
  [id: string]: any
}

const titreDocumentsFichiersNamesFind = (
  titreDocuments: ITitresDocuments[] | undefined,
  titreId: string,
  oldTitreId: string
) => {
  if (!titreDocuments || !titreDocuments.length) {
    return []
  }

  return titreDocuments.reduce((fileNames, titreDocument) => {
    if (titreDocument.fichier) {
      const oldTitreDocumentId = titreDocument.id.replace(titreId, oldTitreId)

      fileNames.push({
        [`${titreDocument.id}.${titreDocument.fichierTypeId}`]: `${oldTitreDocumentId}.${titreDocument.fichierTypeId}`
      })
    }

    return fileNames
  }, [] as Index[])
}

const titreEtapesFichiersNamesFind = (
  titreEtapes: ITitresEtapes[] | undefined,
  titreId: string,
  oldTitreId: string
) => {
  if (!titreEtapes || !titreEtapes.length) {
    return []
  }

  return titreEtapes.reduce((fileNames, titreEtape) => {
    const titreEtapeFileNames = titreDocumentsFichiersNamesFind(
      titreEtape.documents,
      titreId,
      oldTitreId
    )

    fileNames.push(...titreEtapeFileNames)

    return fileNames
  }, [] as Index[])
}

const titreFichiersNamesFind = (
  titreDemarches: ITitresDemarches[] | undefined,
  titreId: string,
  oldTitreId: string
) => {
  if (!titreDemarches || !titreDemarches.length) {
    return []
  }

  return titreDemarches.reduce((fileNames, titreDemarche) => {
    const titreDemarcheFileNames = titreEtapesFichiersNamesFind(
      titreDemarche.etapes,
      titreId,
      oldTitreId
    )

    fileNames.push(...titreDemarcheFileNames)

    return fileNames
  }, [] as Index[])
}

const titreFichiersRename = async (oldTitreId: string, titre: ITitres) => {
  const filesNames = titreFichiersNamesFind(
    titre.demarches,
    titre.id,
    oldTitreId
  )

  filesNames.forEach(async fileNames => {
    for (const [fileName, oldFileName] of Object.entries(fileNames)) {
      await fileRename(oldFileName, fileName)
    }
  })
}

export { titreFichiersRename }
