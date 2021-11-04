import TitresEtapes from '../../database/models/titres-etapes'

exports.up = async knex => {
  const titresEtapes = await TitresEtapes.query().withGraphFetched(
    '[titulaires, amodiataires, points, substances]'
  )

  for (const titreEtape of titresEtapes) {
    let updated = false

    // copier/coller du traitement effectué dans le model TitresEtapes
    if (titreEtape.incertitudes) {
      Object.keys(titreEtape.incertitudes).forEach(id => {
        if (
          !titreEtape.incertitudes[id] ||
          !(titreEtape[id] || titreEtape[id] === 0) ||
          (Array.isArray(titreEtape[id]) && !titreEtape[id].length)
        ) {
          delete titreEtape.incertitudes[id]
          updated = true
        }
      })

      if (!Object.keys(titreEtape.incertitudes).length) {
        titreEtape.incertitudes = null
        updated = true
      }
      if (updated) {
        await knex('titres_etapes')
          .where('id', titreEtape.id)
          .update('incertitudes', titreEtape.incertitudes)

        console.log(`Incertitudes nettoyées ${titreEtape.slug}`)
      }
    }
  }
}

exports.down = () => ({})
