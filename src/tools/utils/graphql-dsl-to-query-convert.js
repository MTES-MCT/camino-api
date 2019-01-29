const fetch = require('node-fetch')
const { introspectionQuery } = require('graphql')
const fs = require('fs')
const url = `http://localhost:4000`

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: introspectionQuery })
})
  .then(res => res.json())
  .then(res =>
    fs.writeFileSync(
      'docs/graphql/schema.json',
      JSON.stringify(res.data, null, 2)
    )
  )
