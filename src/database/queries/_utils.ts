// ajoute les champs nécessaire pour requêter le sous-objet titre

const stringSplit = (string: string) =>
  (string.match(/[a-zA-Z0-9À-ž-&*/]+|"(?:\\"|[^"])+"/g) || []).map(e =>
    e.replace(/^"(.*)"$/, '$1')
  )

export { stringSplit }
