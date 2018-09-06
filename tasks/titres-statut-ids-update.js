const { titresGet, titreStatutIdUpdate } = require('../postgres/queries/titres')

const titreStatutIdFind = require('./_utils/titre-statut-id-find')

const titresStatutIdsUpdate = async () => {
  const titres = await titresGet({})
  const statutIdsUpdate = titres.reduce((arr, t) => {
    const statutId = titreStatutIdFind(t)

    if (statutId !== t.statutId) {
      const titreUpdate = titreStatutIdUpdate({
        id: t.id,
        statutId
      }).then(u => {
        console.log(`Mise à jour: titre ${t.id}, statutId ${statutId}`)
        return u
      })

      arr = [...arr, titreUpdate]
    }

    return arr
  }, [])

  const update = await Promise.all([...statutIdsUpdate])

  console.log(`Mise à jour: statutId de ${statutIdsUpdate.length} titres.`)

  return update
}

module.exports = titresStatutIdsUpdate
