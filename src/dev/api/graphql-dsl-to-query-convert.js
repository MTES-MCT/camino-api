const fetch = require('node-fetch')
const { getIntrospectionQuery } = require('graphql')
const fs = require('fs')
const makeDir = require('make-dir')
const url = `http://localhost:4000`

const dir = 'docs-sources/api'

fs.rm(`./${dir}`, { recursive: true, force: true }, err => {
  if (err) {
    throw err
  }
  makeDir(`./${dir}`)
})

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: getIntrospectionQuery() })
})
  .then(res => res.json())
  .then(res =>
    fs.writeFileSync(`${dir}/schema.json`, JSON.stringify(res.data, null, 2))
  )
