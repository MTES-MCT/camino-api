import { titreEtapesVirtuellesUpdate } from '../queries/titre-etapes'

const titreParentEtapeVirtuelleEtapeCreate = (
  titreParentEtapeVirtuelle,
  titreEnfantEtapeEtape
) => {
  const id = `${titreParentEtapeVirtuelle.id}-${titreEnfantEtapeEtape.typeId}`

  const titreParentEtapeVirtuelleEtape = {
    ...titreEnfantEtapeEtape,
    id,
    titreEtapeId: titreParentEtapeVirtuelle.id
  }

  return `Création: étape de démarche virtuelle ${id}`
}

const titreParentUpdate = (titreDemarcheEnfant, titreParent) => {
  const requests = []

  const { typeId: titreEtapeTypeId, etapes } = titreDemarcheEnfant

  const titreEnfantEtapeListe = ['mfr', 'men', 'dim', 'dex', 'dpu']

  const titreEnfantEtapes = etapes.filter(e =>
    titreEnfantEtapeListe.includes(e.typeId)
  )

  console.log({
    titreEnfantEtapes: titreEnfantEtapes.map(e => e.typeId)
  })

  const etapesToCreate = titreEnfantEtapes.reduce(
    (acc, e) =>
      !titreParentEtapeVirtuelle.etapes.find(pe => pe.typeId === e.typeId)
        ? [
            ...acc,
            titreParentEtapeVirtuelleEtapeCreate(titreParentEtapeVirtuelle, e)
          ]
        : acc,
    []
  )

  return [...requests, ...etapesToCreate]
}

const titresEtapesVirtuellesUpdate = async (titresEtapes, titres) => {
  const titresParentsEtapesVirtuellesUpdated = (await titresEtapes.reduce(
    (acc, titreEtape) => {
      if (!titreEtape.parents.length) return acc

      const titresParentsUpdated = titreEtape.parents.reduce(
        (acc, titreParent) => {
          titreParent = titres.find(t => t.id === titreParent.id)
          if (!titreParent) return acc

          const titreParentUpdated = titreParentUpdate(titreEtape, titreParent)

          return titreParentUpdated.length
            ? [...acc, ...titreParentUpdated]
            : acc
        },
        []
      )

      return titresParentsUpdated.length
        ? [...acc, ...titresParentsUpdated]
        : acc
    },
    []
  )).map(q => q.then(log => console.log(log)))

  await Promise.all(titresParentsEtapesVirtuellesUpdated)

  return `Mise à jour: ${
    titresParentsEtapesVirtuellesUpdated.length
  } étapes virtuelles.`
}

export default titresEtapesVirtuellesUpdate
