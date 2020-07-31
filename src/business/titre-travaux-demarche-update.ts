import { titreGet } from '../database/queries/titres'

const titreTravauxUpdate = async (
  titreTravauxId: string | null,
  titreId: string
) => {
  try {
    const titre = await titreGet(
      titreId,
      {
        fields: { travaux: { etapes: { id: {} } } }
      },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }
  } catch (e) {
    console.error(`erreur: titreDemarcheUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxUpdate
