import titreEtapesByTypeUpdate from './titre-etapes-by-type-update'

const titreDemarcheIdUpdate = (titreDemarcheOld, titre, i) => {
  const { id: titreDemarcheOldId } = titreDemarcheOld

  const titreDemarcheTypeId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheOrder = titreDemarcheOldId.slice(-2)

  const titreDemarcheOrderString = (i + 1).toString().padStart(2, '0')

  if (
    // si le type d'une étape n'a pas changé
    titreDemarcheTypeId === titreDemarcheOld.typeId &&
    // et si l'ordre n'a pas changé
    titreDemarcheOrder === titreDemarcheOrderString
  ) {
    return null
  }

  // utilise la référence à l'étape liée à la référence du titre
  // pour la mise à jour
  const titreDemarcheNew = { ...titreDemarcheOld }

  // - change l'id de la nouvelle étape
  const titreDemarcheNewId = `${titreDemarcheOld.titreId}-${
    titreDemarcheOld.typeId
  }${titreDemarcheOrderString}`

  titreDemarcheNew.id = titreDemarcheNewId

  titreDemarcheNew.etapes.forEach(titreEtape => {
    titreEtape.titreDemarcheId = titreDemarcheNewId
    delete titreEtape.type
  })

  delete titreDemarcheNew.type

  // mets à jour les ids des étapes et tables jointes
  titreEtapesByTypeUpdate(titreDemarcheNew.etapes, titre)

  // supprime la phase, elle sera recréée plus tard
  if (
    titreDemarcheNew.phase &&
    titreDemarcheNew.phase.titreDemarcheId === titreDemarcheOldId
  ) {
    delete titreDemarcheNew.phase
  }

  return titreDemarcheNew
}

const titreDemarchesByTypeUpdate = (titreDemarches, titre) =>
  titreDemarches.reduce(
    (acc, titreDemarcheOld, i) => {
      const { id: titreDemarcheOldId } = titreDemarcheOld

      const titreDemarcheNew = titreDemarcheIdUpdate(titreDemarcheOld, titre, i)

      return titreDemarcheNew
        ? {
            titreDemarchesOldIds: [
              ...acc.titreDemarchesOldIds,
              titreDemarcheOldId
            ],
            titreDemarchesNew: [...acc.titreDemarchesNew, titreDemarcheNew]
          }
        : acc
    },
    { titreDemarchesOldIds: [], titreDemarchesNew: [] }
  )

export default titreDemarchesByTypeUpdate
