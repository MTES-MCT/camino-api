exports.up = async knex => {
  const demarcheTypeId = 'dam' // déclaration d'arrêt définitif des travaux
  const etapeTypeId = 'wpa' // publication au recueil des actes administratifs
  const titresTypes = await knex.select().table('titres_types')

  for (const t of titresTypes) {
    await knex('titres_types__demarches_types__etapes_types').insert({
      titreTypeId: t.id,
      demarcheTypeId,
      etapeTypeId,
      ordre: 230
    })
  }
}

exports.down = () => ({})
