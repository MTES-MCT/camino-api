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
        // Si le message d'erreur est trop long
        // Réduit la taille du message d'erreur à 100 caracters
        const problem = e.message.split(' - ').pop()
        const message = `Table "${table}" - ${problem}`

        throw new Error(message)
      })
  }

  return func({ del, insert })
}
