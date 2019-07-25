const INSERT_SIZE = 5000

module.exports = func => knex => {
  const del = table => {
    console.info(`suppression des données de la table "${table}"`)

    return knex(table).del()
  }

  const insert = (table, data) => {
    console.log(
      `insertion des données de la table "${table}", (${data.length} élément(s))`
    )

    const arrs = []
    for (let i = 0, j = data.length; i < j; i += INSERT_SIZE) {
      arrs.push(data.slice(i, i + INSERT_SIZE))
    }

    return Promise.all(arrs.map(arr => knex(table).insert(arr))).catch(e => {
      // Si le message d'erreur est trop long
      // Réduit la taille du message d'erreur à 100 caracters
      const problem = e.message.split(' - ').pop()
      const message = `Table "${table}" - ${problem}`

      throw new Error(message)
    })
  }

  return func({ del, insert })
}
