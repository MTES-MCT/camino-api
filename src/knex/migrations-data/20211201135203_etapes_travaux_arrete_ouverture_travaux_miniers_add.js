exports.up = async knex => {
  // Ajoute l'étape "Arrêté d'ouverture de travaux miniers"
  // à la démarche "Autorisation d'ouverture de travaux miniers".
  const titresTypes = await knex.select().table('titres_types')
  const etapeTypeId = 'wao'
  const demarcheTypeId = 'aom'

  await knex('etapes_types').insert({
    id: etapeTypeId,
    nom: "arrêté d'ouverture des travaux miniers",
    description: "Arrêté d'ouverture des travaux miniers",
    ordre: 1028,
    fondamentale: false
  })

  await knex('etapes_types__etapes_statuts').insert([
    {
      etapeTypeId,
      etapeStatutId: 'fai',
      ordre: 0
    }
  ])

  for (const t of titresTypes) {
    await knex('titres_types__demarches_types__etapes_types').insert({
      titreTypeId: t.id,
      demarcheTypeId,
      etapeTypeId,
      ordre: 260
    })
  }
}

exports.down = () => ({})
