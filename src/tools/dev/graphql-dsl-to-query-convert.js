import * as fetch from 'node-fetch'
import { introspectionQuery } from 'graphql'
import * as fs from 'fs'
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
