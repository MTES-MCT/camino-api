const { titreEtapeUpdate } = require('../postgres/queries/titres-etapes')

module.exports = (id, props) =>
  titreEtapeUpdate({
    id,
    props
  }).then(u => {
    console.log(`Mise à jour: étape ${id}, ${JSON.stringify(props)}`)
    return u
  })
