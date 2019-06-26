import { entrepriseUpdate as entrepriseUpdateQuery } from '../../database/queries/entreprises'
import { entrepriseEtablissementUpdate as entrepriseEtablissementUpdateQuery } from '../../database/queries/entreprises-etablissements'
import { objectsDiffer } from '../../tools'

const entrepriseUpdate = (entrepriseNew, entrepriseOld) => {
  const updated = !entrepriseOld || objectsDiffer(entrepriseNew, entrepriseOld)

  return updated
    ? entrepriseUpdateQuery(entrepriseNew).then(
        u => `Mise à jour: entreprise ${entrepriseNew.id}`
      )
    : null
}

const entrepriseEtablissementUpdate = (
  entrepriseEtablissementNew,
  entrepriseEtablissementOld
) => {
  const updated =
    !entrepriseEtablissementOld ||
    objectsDiffer(entrepriseEtablissementNew, entrepriseEtablissementOld)

  return updated
    ? entrepriseEtablissementUpdateQuery(entrepriseEtablissementNew).then(
        u =>
          `Mise à jour: entrepriseEtablissement ${entrepriseEtablissementNew.id}`
      )
    : null
}

export { entrepriseUpdate, entrepriseEtablissementUpdate }
