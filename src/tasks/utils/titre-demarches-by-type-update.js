import titreEtapesByTypeUpdate from './titre-etapes-by-type-update'
import elementRelationsUpdate from './element-relations-update'

const titreDemarchesRelations = [
  {
    name: 'etapes',
    elementIdProp: 'titreDemarcheId',
    children: [
      {
        name: 'points',
        elementIdProp: 'titreEtapeId',
        children: [
          {
            name: 'references',
            elementIdProp: 'titrePointId'
          }
        ]
      },
      {
        name: 'documents',
        elementIdProp: 'titreEtapeId'
      },
      {
        name: 'erreurs',
        elementIdProp: 'titreEtapeId'
      }
    ]
  },
  {
    name: 'phases',
    elementIdProp: 'titreDemarcheId'
  }
]

//
const titreDemarcheIdUpdate = (
  titreDemarcheOld,
  titre,
  titreDemarcheOrderNew
) => {
  const { id: titreDemarcheOldId } = titreDemarcheOld

  const titreDemarcheOldTypeId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheOldOrder = titreDemarcheOldId.slice(-2)

  titreDemarcheOrderNew = titreDemarcheOrderNew.toString().padStart(2, '0')

  // si le type et l'ordre de la démarche n'ont pas changé
  if (
    titreDemarcheOldTypeId === titreDemarcheOld.typeId &&
    titreDemarcheOldOrder === titreDemarcheOrderNew
  ) {
    return {}
  }

  // utilise la référence à l'étape liée à la référence du titre
  // pour la mise à jour
  let titreDemarcheNew = { ...titreDemarcheOld }

  // - change l'id de la nouvelle démarche
  const titreDemarcheNewId = `${titreDemarcheOld.titreId}-${
    titreDemarcheOld.typeId
  }${titreDemarcheOrderNew}`

  titreDemarcheNew.id = titreDemarcheNewId

  // - change l'id des tables liées (id de la ligne si basé sur l'id de la démarche)
  titreDemarcheNew = elementRelationsUpdate(
    titreDemarcheNew,
    titreDemarcheNewId,
    titreDemarcheOldId,
    titreDemarchesRelations
  )

  // mets à jour les ids des étapes et tables jointes par référence
  const { titreProps } = titreEtapesByTypeUpdate(titreDemarcheNew.etapes, titre)

  // supprime la phase
  // les phases seront recréées ensuite
  if (
    titreDemarcheNew.phase &&
    titreDemarcheNew.phase.titreDemarcheId === titreDemarcheOldId
  ) {
    delete titreDemarcheNew.phase
  }

  return { titreDemarcheNew, titreProps }
}

const titreDemarchesByTypeUpdate = (titreDemarches, titre) =>
  titreDemarches.reduce(
    (acc, titreDemarcheOld, i) => {
      const { id: titreDemarcheOldId } = titreDemarcheOld

      const { titreDemarcheNew, titreProps } = titreDemarcheIdUpdate(
        titreDemarcheOld,
        titre,
        i + 1
      )

      return titreDemarcheNew
        ? {
            titreDemarchesOldIds: [
              ...acc.titreDemarchesOldIds,
              titreDemarcheOldId
            ],
            titreDemarchesNew: [...acc.titreDemarchesNew, titreDemarcheNew],
            titreProps: { ...acc.titreProps, ...titreProps }
          }
        : acc
    },
    { titreDemarchesOldIds: [], titreDemarchesNew: [], titreProps: {} }
  )

export default titreDemarchesByTypeUpdate
