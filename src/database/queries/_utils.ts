// sépare une chaîne de caractère à chaque espace
// supprime les parenthèses
// retourne un tableau

const stringSplit = (string: string) =>
  (string.match(/[a-zA-Z0-9À-ž-&*/]+|"(?:\\"|[^"])+"/g) || []).map(e =>
    e.replace(/^"(.*)"$/, '$1')
  )

export { stringSplit }
