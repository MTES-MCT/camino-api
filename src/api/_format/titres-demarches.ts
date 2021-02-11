import { ITitreDemarche, IFields } from '../../types'

import { titreEtapeFormatFields, titreEtapeFormat } from './titres-etapes'
import { titreFormatFields, titreFormat } from './titres'

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields,
  titre: titreFormatFields
} as IFields

const titreDemarcheFormat = (
  titreDemarche: ITitreDemarche,
  titreTypeId: string,
  fields: IFields = titreDemarcheFormatFields
) => {
  if (!fields) return titreDemarche

  if (fields.titre && titreDemarche.titre) {
    titreDemarche.titre = titreFormat(titreDemarche.titre, fields.titre)
  }

  if (fields.etapes && titreDemarche.etapes && titreDemarche.etapes.length) {
    const titreEtapes = titreDemarche.etapes.map(te =>
      titreEtapeFormat(te, titreTypeId, titreDemarche.type!, fields.etapes)
    )

    titreDemarche.etapes = titreEtapes
  }

  return titreDemarche
}

export { titreDemarcheFormatFields, titreDemarcheFormat }
