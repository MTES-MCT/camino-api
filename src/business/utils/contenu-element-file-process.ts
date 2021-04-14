import { FileUpload } from 'graphql-upload'
import * as cryptoRandomString from 'crypto-random-string'
import { join } from 'path'
import {
  IContenu,
  IContenuElement,
  IContenuValeur,
  IDocumentRepertoire,
  ISection,
  ISectionElement,
  ITitreEtape
} from '../../types'
import dirCreate from '../../tools/dir-create'
import fileStreamCreate from '../../tools/file-stream-create'
import fileDelete from '../../tools/file-delete'

const sectionElementContenuAndFilesGet = (
  contenuValeur: IContenuValeur,
  sectionElement: ISectionElement
) => {
  const newFiles = [] as FileUpload[]
  let newValue = contenuValeur as IContenuValeur | null

  if (sectionElement.type === 'file') {
    const fileUpload = contenuValeur as {
      file: FileUpload
    }

    if (fileUpload?.file) {
      const fileName = `${cryptoRandomString({
        length: 4
      })}-${fileUpload.file.filename}`
      fileUpload.file.filename = fileName
      newFiles.push(fileUpload?.file)
      newValue = fileName
    }
  } else if (sectionElement?.type === 'multiple') {
    newValue = [] as IContenuElement[]
    const contenuValeurMultiple = contenuValeur as IContenuElement[]

    for (const childContenuValeur of contenuValeurMultiple) {
      const childContenuElement = {} as IContenuElement
      if (sectionElement.elements) {
        sectionElement.elements.forEach(childSectionElement => {
          const childResult = sectionElementContenuAndFilesGet(
            childContenuValeur[childSectionElement.id],
            childSectionElement
          )
          if (childResult.newValue) {
            childContenuElement[childSectionElement.id] = childResult.newValue
          }
          if (childResult.newFiles?.length) {
            newFiles.push(...childResult.newFiles)
          }
        })
        newValue.push(childContenuElement)
      }
    }
  }

  return { newValue, newFiles }
}

const sectionsContenuAndFilesGet = (
  contenu: IContenu | undefined | null,
  sections: ISection[]
) => {
  const newFiles = [] as FileUpload[]
  if (contenu) {
    Object.keys(contenu)
      .filter(sectionId => contenu![sectionId])
      .forEach(sectionId =>
        Object.keys(contenu![sectionId]).forEach(elementId => {
          const sectionElement = sections
            .find(s => s.id === sectionId)
            ?.elements?.find(e => e.id === elementId)

          if (sectionElement) {
            const sectionElementResult = sectionElementContenuAndFilesGet(
              contenu[sectionId][elementId],
              sectionElement
            )

            if (!sectionElementResult.newValue) {
              delete contenu[sectionId][elementId]
            } else {
              contenu[sectionId][elementId] = sectionElementResult.newValue
            }

            if (sectionElementResult.newFiles.length) {
              newFiles.push(...sectionElementResult.newFiles)
            }
          }
        })
      )
  }

  return { contenu, newFiles }
}

const contenuFilesGet = (
  contenu: IContenu | null | undefined,
  sections: ISection[]
) => {
  const files = [] as string[]
  if (contenu) {
    sections
      .filter(section => section.elements)
      .forEach(section =>
        section.elements!.forEach(element => {
          const contenuValeur = contenu[section.id]
            ? contenu[section.id][element.id]
            : null

          files.push(...sectionElementFilesGet(element, contenuValeur))
        })
      )
  }

  return files
}

const sectionElementFilesGet = (
  sectionElement: ISectionElement,
  contenuValeur: IContenuValeur | null
) => {
  const files = [] as string[]
  if (sectionElement.type === 'file') {
    if (contenuValeur) {
      files.push(contenuValeur as string)
    }
  } else if (sectionElement.type === 'multiple') {
    // si on est sur un element de type multiple,
    // on doit parcourir toutes les valeurs qui le composent sur chaque élément
    const contenuValeurMultiple = contenuValeur as IContenuElement[]
    if (contenuValeurMultiple?.length) {
      contenuValeurMultiple.forEach(childElement => {
        sectionElement.elements!.forEach(childSectionElement => {
          const childContenuElement = childElement[childSectionElement.id]
          files.push(
            ...sectionElementFilesGet(childSectionElement, childContenuElement)
          )
        })
      })
    }
  }

  return files
}

const contenuElementFilesCreate = async (
  newFiles: FileUpload[],
  repertoire: IDocumentRepertoire,
  parentId: string
) => {
  const dirPath = `files/${repertoire}/${parentId}`
  await dirCreate(join(process.cwd(), dirPath))
  // on enregistre tous les nouveaux fichiers sur le disque
  for (const file of newFiles) {
    if (file) {
      const { createReadStream } = file

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `${dirPath}/${file.filename}`)
      )
    }
  }
}

const contenuElementFilesDelete = async (
  repertoire: IDocumentRepertoire,
  parentId: string,
  sections: ISection[],
  etapes?: ITitreEtape[] | null,
  oldContenu?: IContenu | null
) => {
  const dirPath = `files/${repertoire}/${parentId}`

  // on récupère tous les fichiers présents sur le disque avant la mise à jour
  const oldFiles = contenuFilesGet(oldContenu, sections)

  // on récupère tous les fichiers actuels
  const files = etapes
    ? etapes.reduce((acc, etape) => {
        acc.push(...contenuFilesGet(etape.contenu, sections))

        return acc
      }, [] as string[])
    : []

  // on supprime les fichiers qui ne sont plus utiles
  for (const oldFile of oldFiles) {
    if (!files.includes(oldFile)) {
      const oldFilePath = `${dirPath}/${oldFile}`
      try {
        await fileDelete(join(process.cwd(), oldFilePath))
      } catch (e) {
        console.error(`impossible de supprimer le fichier: ${oldFilePath}`, e)
      }
    }
  }
}

export {
  contenuElementFilesCreate,
  contenuElementFilesDelete,
  sectionsContenuAndFilesGet
}
