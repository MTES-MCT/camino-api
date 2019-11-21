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

const titresAdministrationGestionnaireVide = [
  {
    id: 'titre-id',
    domaineId: 'm'
  }
]

const titresAdministrationGestionnaireInexistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [
      {
        id: 'inexistante'
      }
    ]
  }
]

const titresAdministrationGestionnaireExistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [
      {
        id: 'dgec'
      }
    ]
  }
]

export {
  administrations,
  titresAdministrationGestionnaireVide,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante
}
