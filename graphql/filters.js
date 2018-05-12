const titleFilter = title => {
  const lib = {
    name: {
      aex: "autorisation d'exploitation",
      con: 'concession',
      per: 'permis exclusif de recherches'
    },
    domain: {
      m: 'minéraux et métaux',
      h: 'substances énergétiques',
      s: 'stockage',
      g: 'géothermie'
    }
  }

  const titleNew = {}

  Object.assign(titleNew, title)

  titleNew['type'] = {
    id: title['type'],
    nom: lib.name[title['type']]
  }

  titleNew['domaine'] = {
    id: title['domaine'],
    nom: lib.domain[title['domaine']]
  }
  console.log('----------iii ', title, titleNew)
  return titleNew
}
