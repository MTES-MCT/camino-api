const INSERT_SIZE = 3000

module.exports = func => knex => {
  const del = table => {
    console.info(`suppression des données de la table "${table}"`)

    return knex(table).del()
  }

  const insert = (table, data) => {
    console.info(
      `insertion des données de la table "${table}", (${data.length} élément(s))`
    )

    const arrs = []
    for (let i = 0; i < data.length; i += INSERT_SIZE) {
      arrs.push(data.slice(i, i + INSERT_SIZE))
    }

    return Promise.all(arrs.map(arr => knex(table).insert(arr))).catch(e => {
      // si le message d'erreur est trop long
      // réduit la taille du message à 100 caractères
      const problem = e.message.split(' - ').pop()
      const message = `Table "${table}" - ${problem} - ${e.detail}`

      throw new Error(message)
    })
  }

  return func({ del, insert })
}
