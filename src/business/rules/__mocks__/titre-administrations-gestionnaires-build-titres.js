const administrations = [
  {
    id: 'dgec',
    departementId: 1,
    titresTypes: [{ id: 'cxh', domaineId: 'h', gestionnaire: true }]
  },
  {
    id: 'dgaln',
    titresTypes: [
      { id: 'arm', domaineId: 'm', gestionnaire: true, associee: true }
    ]
  },
  {
    id: 'ope-ptmg-973-01',
    titresTypes: [{ id: 'arm', domaineId: 'm', gestionnaire: true }]
  },
  {
    id: 'ope-onf-973-01',
    departementId: '973',
    titresTypes: [{ id: 'axm', domaineId: 'm', gestionnaire: false }]
  },
  {
    id: 'titresTypes-empty',
    titresTypes: []
  },
  {
    id: 'no-titresTypes'
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
