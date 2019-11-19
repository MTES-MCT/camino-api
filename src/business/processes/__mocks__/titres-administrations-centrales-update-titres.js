const administrations = [
  {
    id: 'dgec'
  },
  {
    id: 'dgaln'
  },
  {
    id: 'ptmg'
  }
]

const titresAdministrationCentraleVide = [
  {
    id: 'titre-id',
    domaineId: 'm'
  }
]

const titresAdministrationCentraleInexistante = [
  {
    id: 'titre-id',
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
    administrationsCentrales: [
      {
        id: 'dgec'
      }
    ]
  }
]

export {
  administrations,
  titresAdministrationCentraleVide,
  titresAdministrationCentraleInexistante,
  titresAdministrationCentraleExistante
}
