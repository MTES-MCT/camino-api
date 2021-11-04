exports.up = async knex => {
  await knex('etapes_statuts').insert([
    {
      id: 'com',
      nom: 'complet',
      couleur: 'success'
    },
    {
      id: 'inc',
      nom: 'incomplet',
      couleur: 'error'
    }
  ])

  await knex('etapes_types__etapes_statuts').insert([
    {
      etape_type_id: 'mcp',
      etape_statut_id: 'com',
      ordre: 1
    },
    {
      etape_type_id: 'mcp',
      etape_statut_id: 'inc',
      ordre: 2
    }
  ])

  await knex('titres_etapes')
    .where('type_id', 'mcp')
    .where('statut_id', 'fav')
    .update('statut_id', 'com')

  await knex('titres_etapes')
    .where('type_id', 'mcp')
    .where('statut_id', 'def')
    .update('statut_id', 'inc')

  await knex('etapes_types__etapes_statuts')
    .where('etape_type_id', 'mcp')
    .where('etape_statut_id', 'fav')
    .del()

  return knex('etapes_types__etapes_statuts')
    .where('etape_type_id', 'mcp')
    .where('etape_statut_id', 'def')
    .del()
}

exports.down = () => ({})
