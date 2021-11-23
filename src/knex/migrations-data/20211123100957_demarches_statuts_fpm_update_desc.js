exports.up = async knex => {
  await knex('demarches_statuts')
    .where({ id: 'fpm', description: 'TODO' })
    .update({ description: 'Fin de la police des mines' })
}

exports.down = () => ({})
