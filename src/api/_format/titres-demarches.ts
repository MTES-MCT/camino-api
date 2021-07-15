import { IFields, ITitreDemarche } from '../../types'

import { titreEtapeFormat } from './titres-etapes'
import { titreFormat } from './titres'
import { titreDemarcheFormatFields } from './_fields'

const titreDemarcheFormat = (
  titreDemarche: ITitreDemarche,
  fields: IFields = titreDemarcheFormatFields
) => {
  if (!fields) return titreDemarche

  if (fields.titre && titreDemarche.titre) {
    titreDemarche.titre = titreFormat(titreDemarche.titre, fields.titre)
  }

  if (fields.etapes && titreDemarche.etapes && titreDemarche.etapes.length) {
    titreDemarche.etapes = titreDemarche.etapes.map(te =>
      titreEtapeFormat(te, fields.etapes)
    )
  }

  return titreDemarche
}

export { titreDemarcheFormatFields, titreDemarcheFormat }
