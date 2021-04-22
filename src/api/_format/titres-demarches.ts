import { ITitreDemarche, IFields } from '../../types'

import { titreEtapeFormat } from './titres-etapes'
import { titreFormat } from './titres'
import { titreDemarcheFormatFields } from './_fields'

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
      titreEtapeFormat(
        te,
        titreTypeId,
        titreDemarche.type!.etapesTypes!,
        fields.etapes
      )
    )

    titreDemarche.etapes = titreEtapes
  }

  return titreDemarche
}

export { titreDemarcheFormatFields, titreDemarcheFormat }
