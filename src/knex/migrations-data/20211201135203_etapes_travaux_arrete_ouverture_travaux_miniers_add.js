exports.up = async knex => {
  await knex('etapes_types').insert({
    id: 'wao',
    nom: "arrêté d'ouverture des travaux miniers",
    description: "Arrêté d'ouverture des travaux miniers",
    ordre: 1028,
    fondamentale: false
  })

  await knex('etapes_types__etapes_statuts').insert([
    {
      etapeTypeId: 'wao',
      etapeStatutId: 'fai',
      ordre: 0
    }
  ])
}

exports.down = () => ({})
