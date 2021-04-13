import { FileUpload } from 'graphql-upload'
import dirCreate from '../../../tools/dir-create'
import * as cryptoRandomString from 'crypto-random-string'
import fileStreamCreate from '../../../tools/file-stream-create'
import { join } from 'path'
import {
  IContenu,
  IContenuElement,
  IContenuValeur,
  IDocumentRepertoire,
  ISection,
  ISectionElement
} from '../../../types'
import fileDelete from '../../../tools/file-delete'

type IFileElementNew = {
  [elementId: string]:
    | { file: FileUpload; fileName: string }
    | IFileElementNew[]
}
type IFileNew = {
  [sectionId: string]: IFileElementNew
}

const stes = (
  contenuValeur: IContenuValeur,
  sectionElement: ISectionElement
) => {
  if (sectionElement.type === 'file') {
    let newValue: undefined | string

    const fileUpload = contenuValeur as {
      file: FileUpload
    }
    let fileName

    if (fileUpload?.file) {
      fileName = `${cryptoRandomString({
        length: 4
      })}-${fileUpload.file.filename}`
    } else {
      fileName = contenuValeur as string
    }

    const newFile = {
      fileName,
      file: fileUpload?.file
    }

    if (!fileName) {
      newValue = undefined
    } else {
      newValue = fileName
    }

    return { newFile, newValue }
  } else if (sectionElement?.type === 'multiple') {
    const newValue = [] as IContenuElement[]
    const newFile = [] as IFileElementNew[]
    const multiContenuValeur = contenuValeur as IContenuElement[]
    for (let i = 0; i < multiContenuValeur.length; i++) {
      const tt = multiContenuValeur[i]
      newValue.push({})
      newFile.push({})
      if (sectionElement.elements) {
        for (const ttt of sectionElement.elements) {
          const res = stes(tt[ttt.id], ttt)
          if (res.newValue) {
            newValue[i][ttt.id] = res.newValue
          }
          if (res.newFile) {
            newFile[i][ttt.id] = res.newFile
          }
        }
      }
    }

    return { newValue, newFile }
  }

  return { newValue: contenuValeur }
}

const contenuElementFileGet = async (
  contenu: IContenu | undefined | null,
  sections: ISection[]
) => {
  const newFiles = {} as IFileNew
  if (contenu) {
    for (const sectionId of Object.keys(contenu)) {
      if (contenu![sectionId]) {
        for (const elementId of Object.keys(contenu![sectionId])) {
          const sectionElement = sections
            .find(s => s.id === sectionId)
            ?.elements?.find(e => e.id === elementId)

          if (sectionElement) {
            const { newValue, newFile } = stes(
              contenu![sectionId][elementId],
              sectionElement
            )

            if (!newValue) {
              delete contenu![sectionId][elementId]
            } else {
              contenu![sectionId][elementId] = newValue
            }

            if (newFile) {
              if (!newFiles[sectionId]) {
                newFiles[sectionId] = {}
              }
              newFiles[sectionId][elementId] = newFile
            }
          }
        }
      }
    }
  }

  return { contenu, newFiles }
}

const contenuElementsFileProcess = async (
  fileElement: { file: FileUpload; fileName: string } | IFileElementNew[],
  sectionElement: ISectionElement,
  repertoire: string,
  parentId: string,
  oldContenu?: IContenuElement
) => {
  if (sectionElement.type === 'file') {
    const fileUpload = fileElement as { file: FileUpload; fileName: string }

    const dirPath = `files/${repertoire}/${parentId}`

    if (fileUpload.file) {
      await dirCreate(dirPath)
      const { createReadStream } = await fileUpload.file

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `${dirPath}/${fileUpload.fileName}`)
      )
    }

    if (oldContenu && oldContenu[sectionElement.id] !== fileUpload.fileName) {
      try {
        await fileDelete(`${dirPath}/${oldContenu[sectionElement.id]}`)
      } catch (e) {}
    }
  } else if (sectionElement.type === 'multiple') {
    if (sectionElement.elements) {
      const ttoo = fileElement as IFileElementNew[]
      for (let i = 0; i < ttoo.length; i++) {
        const ee = ttoo[i]
        for (const element of sectionElement.elements) {
          const ol = oldContenu
            ? (oldContenu[element.id] as IContenuElement[])
            : undefined
          await contenuElementsFileProcess(
            ee[element.id],
            element,
            repertoire,
            parentId,
            ol ? ol[i] : undefined
          )
        }
      }
    }
  }
}

const contenuElementFileProcess = async (
  fileNew: IFileNew,
  repertoire: IDocumentRepertoire,
  parentId: string,
  sections: ISection[],
  oldContenu?: IContenu | null
) => {
  if (fileNew) {
    for (const sectionId of Object.keys(fileNew)) {
      for (const elementId of Object.keys(fileNew[sectionId])) {
        const sectionElement = sections
          .find(s => s.id === sectionId)
          ?.elements?.find(e => e.id === elementId)

        if (sectionElement) {
          await contenuElementsFileProcess(
            fileNew[sectionId][elementId],
            sectionElement,
            repertoire,
            parentId,
            oldContenu ? oldContenu[sectionId] : undefined
          )
        }
      }
    }
  }
}

export { contenuElementFileProcess, contenuElementFileGet }
