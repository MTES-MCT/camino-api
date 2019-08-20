const titreSansActivite = {
  id: 'h-cxx-courdemanges-1988',
  activites: [],
  taxes: [],
  titulaires: []
}

const titreActiviteSansContenu = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: null
    },
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: {}
    }
  ],
  taxes: [],
  titulaires: [{ categorie: 'GE' }]
}

const titreActiviteSansRenseignements = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 2,
      contenu: { renseignements: {} }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const titreActivite2017 = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2017,
      frequencePeriodeId: 1,
      contenu: {}
    },
    {
      annee: 2017,
      frequencePeriodeId: 2,
      contenu: { renseignements: { orExtrait: 300 } }
    },
    {
      annee: 2017,
      frequencePeriodeId: 3,
      contenu: { renseignements: { orExtrait: '' } }
    },
    {
      annee: 2017,
      frequencePeriodeId: 4,
      contenu: { renseignements: { orExtrait: 100 } }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: 'GE' }]
}

const titreActivite2017SansOr = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2017,
      frequencePeriodeId: 2,
      contenu: { renseignements: {} }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const titreActivite2018 = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: { renseignements: { orNet: 300 } }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const titreActivite2018SansOr = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: { renseignements: {} }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const titreActivite2018MauvaisePeriode = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 3,
      contenu: { renseignements: { orNet: 300 } }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const titreActiviteTaxeAConserver = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: { renseignements: { orNet: 100 } }
    }
  ],
  taxes: [
    {
      taxeTypeId: 'rco',
      contenu: {
        tonnageExtrait: 100
      },
      annee: 2018
    },
    {
      taxeTypeId: 'rco',
      contenu: {
        tonnageExtrait: 100
      },
      annee: 2019
    }
  ],
  titulaires: [{ categorie: '' }]
}

const titreActiviteTaxeARemplacer = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: { renseignements: { orNet: 100 } }
    }
  ],
  taxes: [
    {
      taxeTypeId: 'rdo',
      contenu: {
        tonnageExtrait: 500
      },
      annee: 2018
    },
    {
      taxeTypeId: 'rco',
      contenu: {
        tonnageExtrait: 140
      },
      annee: 2018
    }
  ],
  titulaires: [{ categorie: '' }]
}

const titreActivite2018PlafondInvest = {
  id: 'h-cxx-courdemanges-1988',
  activites: [
    {
      annee: 2018,
      frequencePeriodeId: 4,
      contenu: { renseignements: { orNet: 500000000 } }
    }
  ],
  taxes: [],
  titulaires: [{ categorie: '' }]
}

const taxeVide = {
  id: 'xxx',
  sections: []
}

const taxeRco = {
  id: 'rco',
  sections: [
    {
      taxeTypeId: 'rco-2018',
      dateDebut: '2018-01-01',
      entrepriseTypesIds: ['GE', 'PME'],
      tarif: 120,
      frequencePeriodeId: 12
    },
    {
      taxeTypeId: 'rco-2017',
      dateDebut: '2017-01-01',
      entrepriseTypesIds: ['GE', 'PME'],
      tarif: 100,
      frequencePeriodeId: 12
    }
  ]
}

const taxeTor = {
  id: 'tor',
  sections: [
    {
      taxeTypeId: 'tor-2018',
      dateDebut: '2018-01-01',
      entrepriseTypesIds: ['GE', 'PME'],
      tarif: 100,
      frequencePeriodeId: 12
    }
  ]
}

export {
  titreSansActivite,
  titreActiviteSansContenu,
  titreActiviteSansRenseignements,
  titreActivite2017,
  titreActivite2017SansOr,
  titreActivite2018,
  titreActivite2018SansOr,
  titreActivite2018MauvaisePeriode,
  titreActiviteTaxeAConserver,
  titreActiviteTaxeARemplacer,
  titreActivite2018PlafondInvest,
  taxeVide,
  taxeRco,
  taxeTor
}
