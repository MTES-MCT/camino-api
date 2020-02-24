const administrations = [
  {
    id: 'dgec',
    departementId: 1,
    domaines: [{ id: 'h' }]
  },
  {
    id: 'dgaln',
    domaines: [{ id: 'm' }]
  },
  {
    id: 'ope-ptmg-973-01',
    domaines: [{ id: 'm' }]
  },
  {
    id: 'ope-onf-973-01',
    departementId: '973'
  },
  {
    id: 'domaines-empty',
    domaines: []
  },
  {
    id: 'no-domaines'
  }
]

const titreH = {
  id: 'titre-id',
  typeId: 'cxh',
  domaineId: 'h'
}

const titreArm = {
  id: 'titre-id',
  typeId: 'arm',
  domaineId: 'm'
}

const titreAxm = {
  id: 'titre-id',
  typeId: 'axm',
  domaineId: 'm'
}

export { administrations, titreH, titreArm, titreAxm }
