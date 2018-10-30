const { titresGet, titrePropsUpdate } = require('../../postgres/queries/titres')

const titreStatutIdFind = require('../_utils/titre-statut-id-find')

const titresStatutIdsUpdate = async () => {
  const titres = await titresGet({})
  const titreUpdateRequests = titres.reduce((arr, t) => {
    const statutId = titreStatutIdFind(t)

    if (statutId !== t.statutId) {
      const titreUpdateRequest = titrePropsUpdate({
        id: t.id,
        props: { statutId }
      }).then(u => {
        console.log(`Mise à jour: titre ${t.id}, statutId ${statutId}`)
        return u
      })

      arr = [...arr, titreUpdateRequest]
    }

    return arr
  }, [])

  await Promise.all([...titreUpdateRequests])

  return `Mise à jour: ${titreUpdateRequests.length} statuts de titres.`
}

module.exports = titresStatutIdsUpdate
