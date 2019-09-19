const { readFileSync: read, writeFileSync: write } = require('fs')

const dmsToDec = angle => {
  // Check si il s'agit d'un angle en decimal ou en degre
  if (angle.indexOf('°') === -1) {
    return parseFloat(angle.replace(/,/g, '.').replace(/ /g, ''))
  }

  let negativite = false

  const latSep = angle.split('°')
  if (latSep[0].slice(0, 1) === '-') {
    negativite = !negativite
  }

  const deg = parseFloat(latSep[0])
  const min = parseFloat(latSep[1].split("'")[0])

  // differentes possibilités d'ecrire un angle seconde, donc on les teste
  let sec = parseFloat(
    angle
      .split('°')[1]
      .replace(',', "'")
      .split("'")[1]
  )

  // au cas ou le fichier n'a pas d'angle seconde
  if (isNaN(sec)) {
    sec = 0
  }

  // On applique une addition différente en fonction de la positivité de l'angle
  const dec = negativite
    ? deg - min / 60 - sec / 3600
    : deg + min / 60 + sec / 3600

  return dec
}

const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

const unites = {
  métrique: 'mètre',
  angulaire: 'degré'
}

const geoSystemes = JSON.parse(read('./sources/geo-systemes.json'))
const systemesIndex = geoSystemes.reduce((index, system) => {
  index[system.id] = unites[system.unite_type]

  return index
}, {})

console.log(geoSystemes[0])
console.log(systemesIndex)

domainesIds.forEach(domaineId => {
  const filePath = `./sources/titres-${domaineId}-titres-points-references.json`

  const references = JSON.parse(read(filePath))

  console.log(domaineId, references.length)

  console.log(references[0])

  references.forEach(reference => {
    reference.coordonnees = reference.coordonnees.map(dmsToDec).join(',')
    reference.unite = systemesIndex[reference.geo_systeme_id]
  })

  console.log(references[0])

  write(`${filePath}`, JSON.stringify(references, null, 2))
})
