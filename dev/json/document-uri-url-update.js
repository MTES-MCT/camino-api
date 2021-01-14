const fs = require('fs')
const filePath = './sources/documents.json'

// intervertit les champs 'uri' et 'url' dans les documents
const run = () => {
  try {
    const documents = JSON.parse(fs.readFileSync(filePath).toString())
    documents.forEach(document => {
      const uri = document.uri
      const url = document.url
      document.uri = url
      document.url = uri
    })

    fs.writeFileSync(filePath, JSON.stringify(documents, null, 2))
  } catch (e) {
    console.error(e.message)
  }
}

run()
