export default `


"Pays"
type Pays {
  """
  L'__id__ du pays composé de 3 lettres (code INSEE)
  """
  id: ID!

  "Le nom du pays"
  nom: String!

  "La liste des régions"
  regions: [Region]
}

"Région"
type Region {
  """
  L'__id__ de la région composé de 2 chiffres (code INSEE)
  """
  id: ID!

  "Le nom de la région"
  nom: String!

  "La liste des départements"
  departements: [Departement]
}

"Département"
type Departement {
  """
  L'__id__ du département composé de 2 ou 3 chiffres (code INSEE)
  """
  id: ID!

  "Le nom du département"
  nom: String!

  "La liste des communes"
  communes: [Commune]
}


"Commune"
type Commune {
  """
  L'__id__ de la commune composée de 5 chiffres (code INSEE)
  """
  id: ID!

  "Le nom de la commune"
  nom: String!
}
`
