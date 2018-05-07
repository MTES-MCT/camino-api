// const titles = require('../../data/mock/books.json')
const TitlesModel = require('../database/models/titles')

// The resolvers
const resolvers = {
  titre: ({ name }) => TitlesModel.find({ name }),
  titres: () => TitlesModel.find({}),
  setTitle: ({ name }) => {
    const t = new TitlesModel({ name })
    t.save((err, t) => {
      if (err) return console.error(err)
      return t
    })
  }
}

// const resolvers = {
//   Query: {
//     author(root, args) {
//       return { id: 1, firstName: 'Hello', lastName: 'World' }
//     },
//     allAuthors() {
//       return [{ id: 1, firstName: 'Hello', lastName: 'World' }]
//     }
//   },
//   Author: {
//     posts(author) {
//       return [
//         { id: 1, title: 'A post', text: 'Some text', views: 2 },
//         { id: 2, title: 'Another post', text: 'Some other text', views: 200 }
//       ]
//     }
//   },
//   Post: {
//     author(post) {
//       return { id: 1, firstName: 'Hello', lastName: 'World' }
//     }
//   }
// }

module.exports = resolvers
