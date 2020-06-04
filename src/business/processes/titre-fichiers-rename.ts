import fileRename from '../../tools/file-rename'
import { ITitre, ITitreDemarche, ITitreEtape, Index } from '../../types'

const titreEtapeFilePathPathBuild = (titreEtapeId: string) =>
  `etapes/${titreEtapeId}`

const titreEtapesFilePathsNamesFind = (
  fichiersNames: Index<string>,
  titreEtapes: ITitreEtape[] | undefined | null,
  titreId: string,
  relationsIdsChangedIndex: Index<Index<string>>
) => {
  if (!titreEtapes?.length) {
    return fichiersNames
  }

  return titreEtapes.reduce((fichiersNames: Index<string>, titreEtape) => {
    const titreEtapeOldId = relationsIdsChangedIndex.etapes[titreEtape.id]

    if (titreEtapeOldId) {
      const hasDocumentsWithFiles = titreEtape.documents?.find(d => d.fichier)

      if (hasDocumentsWithFiles) {
        const filePathPathOld = titreEtapeFilePathPathBuild(titreEtapeOldId)
        const filePathPathNew = titreEtapeFilePathPathBuild(titreEtape.id)

        fichiersNames[filePathPathOld] = filePathPathNew
      }
    }

    return fichiersNames
  }, fichiersNames)
}

const titreFilePathsNamesFind = (
  titreDemarches: ITitreDemarche[] | undefined | null,
  titreId: string,
  relationsIdsChangedIndex: Index<Index<string>>
) => {
  if (!titreDemarches?.length) {
    return {}
  }

  return titreDemarches.reduce(
    (fichiersNames: Index<string>, titreDemarche) =>
      titreEtapesFilePathsNamesFind(
        fichiersNames,
        titreDemarche.etapes,
        titreId,
        relationsIdsChangedIndex
      ),
    {}
  )
}

const titreFilePathsRename = async (
  relationsIdsChangedIndex: Index<Index<string>>,
  titre: ITitre
) => {
  if (!relationsIdsChangedIndex.etapes) return

  const titreFilePathsNames = titreFilePathsNamesFind(
    titre.demarches,
    titre.id,
    relationsIdsChangedIndex
  )

  for (const filePathNameOld of Object.keys(titreFilePathsNames)) {
    const filePathNameNew = titreFilePathsNames[filePathNameOld]

    if (filePathNameNew !== filePathNameOld) {
      await fileRename(`files/${filePathNameOld}`, `files/${filePathNameNew}`)
    }
  }
}

export { titreFilePathsRename }
