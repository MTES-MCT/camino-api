import titreEtapesByTypeUpdate from './titre-etapes-by-type-update'

const titreDemarcheIdUpdate = (
  titreDemarcheOld,
  titre,
  titreDemarcheOrderNew
) => {
  const { id: titreDemarcheOldId } = titreDemarcheOld

  const titreDemarcheOldTypeId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheOldOrder = titreDemarcheOldId.slice(-2)

  titreDemarcheOrderNew = titreDemarcheOrderNew.toString().padStart(2, '0')

  if (
    // si le type d'une étape n'a pas changé
    titreDemarcheOldTypeId === titreDemarcheOld.typeId &&
    // et si l'ordre n'a pas changé
    titreDemarcheOldOrder === titreDemarcheOrderNew
  ) {
    return {}
  }

  // utilise la référence à l'étape liée à la référence du titre
  // pour la mise à jour
  const titreDemarcheNew = { ...titreDemarcheOld }

  // - change l'id de la nouvelle étape
  const titreDemarcheNewId = `${titreDemarcheOld.titreId}-${
    titreDemarcheOld.typeId
  }${titreDemarcheOrderNew}`

  titreDemarcheNew.id = titreDemarcheNewId

  titreDemarcheNew.etapes.forEach(titreEtape => {
    titreEtape.titreDemarcheId = titreDemarcheNewId
    delete titreEtape.type
  })

  delete titreDemarcheNew.type

  // mets à jour les ids des étapes et tables jointes
  const { titreProps } = titreEtapesByTypeUpdate(titreDemarcheNew.etapes, titre)

  // supprime la phase, elle sera recréée plus tard
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
