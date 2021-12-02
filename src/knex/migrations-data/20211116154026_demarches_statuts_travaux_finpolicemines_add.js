exports.up = async knex => {
  await knex('demarches_statuts').insert([
    {
      id: 'fpm',
      nom: 'fin de la police des mines',
      description: 'Fin de la police des mines',
      couleur: 'success',
      ordre: 11
    }
  ])
}

exports.down = () => ({})
