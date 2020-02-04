const titresTypes = require('../../../../sources/titres-types.json')
// eslint-disable-next-line camelcase
const titresTypes__demarchesTypes = require('../../../../sources/titres-types--demarches-types.json')

titresTypes__demarchesTypes.forEach(td => {
  const d = titresTypes.find(tt => tt.id === td.titre_type_id)
  console.log(d)
  if (!d) {
    console.log(td)
  }
})
