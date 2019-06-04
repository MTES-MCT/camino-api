module.exports = func => knex => {
  const del = table => {
    console.info(`Suppression des données de la table "${table}"`)

    return knex(table).del()
  }

  const insert = (table, data) => {
    console.log(
      `Insertion des données de la table "${table}", (${
        data.length
      } élément(s))`
    )

    return knex(table)
      .insert(data)
      .catch(e => {
        // Récupère le message d'erreur provenant de la base de données
        // ex : `value too long for type character varying(255)`
        const problem = e.message.split(' - ').pop()
        const message = `Table "${table}" - ${problem}`

        throw new Error(message)
      })
  }

  return func({ del, insert })
}
