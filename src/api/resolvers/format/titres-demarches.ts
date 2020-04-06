import { ITitreDemarche, IUtilisateur, IFields } from '../../../types'

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
  if (!fields) return titreDemarche

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
