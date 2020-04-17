const fs = require('fs')

const errorFind = (a, b, pivotA, pivotB = 'id') => {
  let fileA
  let fileB

  try {
    fileA = JSON.parse(fs.readFileSync(a).toString())
  } catch (e) {
    console.error('no such file:', a)

    process.exit(1)
  }

  try {
    fileB = JSON.parse(fs.readFileSync(b).toString())
  } catch (e) {
    console.error('no such file:', b)

    process.exit(1)
  }

  fileB.forEach(b => {
    const a = fileA.find(a => a[pivotB] === b[pivotA])

    if (!a) {
      console.error(b)
    }
  })
}

const [a, b, pivot] = process.argv.slice(2)

if (!a || !b || !pivot) {
  console.error(
    'usage: node error-find ./path/to/file-a ./path/to/file-b pivot-from-b-to-a [pivot-from-a-t-b]'
  )
  process.exit(1)
}

errorFind(a, b, pivot)
