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

const titresAdministrationCentraleInexistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    administrationsCentrales: [
      {
        id: 'inexistante'
      }
    ]
  }
]

const titresAdministrationCentraleExistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    administrationsCentrales: [
      {
        id: 'dgec'
      }
    ]
  }
]

const titresArm = [
  {
    id: 'titre-id',
    typeId: 'arm',
    domaineId: 'm'
  }
]

const titresAxm = [
  {
    id: 'titre-id',
    typeId: 'axm',
    domaineId: 'm'
  }
]

export {
  administrations,
  titresAdministrationCentraleInexistante,
  titresAdministrationCentraleExistante,
  titresArm,
  titresAxm
}
