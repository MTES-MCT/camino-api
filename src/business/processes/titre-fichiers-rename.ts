import fileRename from '../../tools/file-rename'
import { ITitre, ITitreDemarche, ITitreEtape, Index } from '../../types'

const titreEtapeFilePathPathBuild = (titreEtapeId: string) =>
  `demarches/${titreEtapeId}`

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

  const filePathNamesToUpdate = Object.keys(titreFilePathsNames).filter(
    filePathNameOld => filePathNameOld !== titreFilePathsNames[filePathNameOld]
  )

  // si on échange 2 étapes, on est obligé de passer par un dossier temporaire
  // car on ne peut pas utiliser le nom d’un un dossier non vide comme destination
  for (const filePathNameOld of filePathNamesToUpdate) {
    const pathOld = `files/${filePathNameOld}`
    const filePathNameNew = titreFilePathsNames[filePathNameOld]
    await fileRename(pathOld, `files/${filePathNameNew}_tmp`)
  }

  // renomme le dossier temporaire avec son nom définitif
  for (const filePathNameOld of filePathNamesToUpdate) {
    const filePathNameNew = titreFilePathsNames[filePathNameOld]
    await fileRename(`files/${filePathNameNew}_tmp`, `files/${filePathNameNew}`)
  }
}

export { titreFilePathsRename }
