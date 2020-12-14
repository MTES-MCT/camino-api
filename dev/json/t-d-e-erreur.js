const tde = require(`../../sources/titres-types--demarches-types--etapes-types.json`)

const run = () => {
  try {
    const ids = {}

    tde.forEach(tde => {
      const id = `${tde.titre_type_id}-${tde.demarche_type_id}-${tde.etape_type_id}`

      if (ids[id] === undefined) {
        ids[id] = 0
      } else {
        ids[id]++
      }
    })

    Object.keys(ids).forEach(id => {
      if (ids[id]) {
        console.error(id, ids[id])
      }
    })
  } catch (e) {
    console.error(e.message)
  }
}

run()
