import { titreDemarcheInsert } from '../../database/queries/titres-demarches'

const titreParentDemarcheVirtuelleCreate = async (
  titreParent,
  titreEnfantDemarche
) => {
  const titreDemarcheVirtuelleTypeId = 'vto'

  const id = `${titreParent.id}-${titreDemarcheVirtuelleTypeId}`

  const titreDemarcheNew = {
    id,
    typeId: titreDemarcheVirtuelleTypeId,
    titreId: titreParent.id,
    statutId: 'ind',
    etapes: titreEnfantDemarche.etapes.map(e => ({
      ...Object.keys(e).reduce(
        (r, k) => (!Array.isArray(e[k]) ? { ...r, [k]: e[k] } : r),
        {}
      ),
      id: e.id.replace('oct', 'vto'),
      titreDemarcheId: e.titreDemarcheId.replace('oct', 'vto')
    }))
  }

  console.log(titreDemarcheNew.etapes[0])

  const titreParentDemarcheVirtuelle = await titreDemarcheInsert(
    titreDemarcheNew
  )

  return `Création: démarche virtuelle ${id}`
}

const titreDemarcheVirtuelleUpdate = (titreDemarcheEnfant, titreParent) => {
  const requests = []

  const { typeId: titreDemarcheTypeId, etapes } = titreDemarcheEnfant

  let titreParentDemarcheVirtuelle = titreParent.demarches.find(
    d => d.typeId === 'vto'
  )

  return !titreParentDemarcheVirtuelle
    ? [
        ...requests,
        titreParentDemarcheVirtuelleCreate(titreParent, titreDemarcheEnfant)
      ]
    : requests
}

export { titreDemarcheVirtuelleUpdate }

const titresDemarchesVirtuellesUpdate = async (titresDemarches, titres) => {
  const titresParentsDemarchesVirtuellesUpdated = (await titresDemarches.reduce(
    (acc, titreDemarche) => {
      if (!titreDemarche.parents.length) return acc

      const titresDemarchesVirtuellesUpdated = titreDemarche.parents.reduce(
        (acc, titreParent) => {
          titreParent = titres.find(t => t.id === titreParent.id)
          if (!titreParent) return acc

          const titreDemarcheVirtuelleUpdated = titreDemarcheVirtuelleUpdate(
            titreDemarche,
            titreParent
          )

          return titreDemarcheVirtuelleUpdated.length
            ? [...acc, ...titreDemarcheVirtuelleUpdated]
            : acc
        },
        []
      )

      return titresDemarchesVirtuellesUpdated.length
        ? [...acc, ...titresDemarchesVirtuellesUpdated]
        : acc
    },
    []
  )).map(q => q.then(log => console.log(log)))

  await Promise.all(titresParentsDemarchesVirtuellesUpdated)

  return titresParentsDemarchesVirtuellesUpdated
}

export default titresDemarchesVirtuellesUpdate
