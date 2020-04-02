import { ITitreDemarche, IUtilisateur, IFields } from '../../../types'

import metas from '../../../database/cache/metas'

import { demarcheTypeFormat } from './demarches-types'
import { titreEtapeFormatFields, titreEtapeFormat } from './titres-etapes'
import { titreFormatFields, titreFormat } from './titres'

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields,
  titre: titreFormatFields
} as IFields

const titreDemarcheFormat = (
  user: IUtilisateur | undefined,
  titreDemarche: ITitreDemarche,
  titreTypeId: string,
  titreStatutId: string,
  fields: IFields = titreDemarcheFormatFields
) => {
  // visibilité des démarches non publiques
  if (
    !(
      // si l'utilisateur a les permissions
      userHasPermission ||
      // sinon, les démarches visibles au public
      // ont le statut `acc` ou `ter`
      ['acc', 'ter'].includes(titreDemarche.statutId!) ||
      // sauf pour les AXM et ARM
      // dont les démarches `rej` sont aussi visibles
      (['axm', 'arm'].includes(titreTypeId) &&
        titreDemarche.statutId! === 'rej')
    )
  ) {
    return undefined
  }

  if (!fields) return titreDemarche

  const demarcheType = metas.demarchesTypes.find(
    demarcheType => demarcheType.id === titreDemarche.typeId
  )

  if (!demarcheType) {
    throw new Error(
      `${titreDemarche.type!.nom} inexistant pour un titre ${titreTypeId}`
    )
  }

  titreDemarche.type = demarcheTypeFormat(
    user,
    titreDemarche.type!,
    titreTypeId,
    titreStatutId!
  )

  if (fields.titre && titreDemarche.titre) {
    titreDemarche.titre = titreFormat(user, titreDemarche.titre, fields.titre)
  }

  if (fields.etapes && titreDemarche.etapes && titreDemarche.etapes.length) {
    const titreEtapes = titreDemarche.etapes.map(te =>
      titreEtapeFormat(
        user,
        te,
        titreTypeId,
        titreDemarche.type!,
        fields.etapes
      )
    )

    titreDemarche.etapes = titreEtapes
  }

  return titreDemarche
}

export { titreDemarcheFormatFields, titreDemarcheFormat }
