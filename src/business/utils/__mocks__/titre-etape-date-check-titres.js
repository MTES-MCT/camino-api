const demarcheType = {
  etapesTypes: [
    {
      id: 'etape-avant',
      nom: 'etape-avant'
    },
    {
      id: 'etape-apres',
      nom: 'etape-apres'
    },
    {
      id: 'etape-premiere',
      nom: 'etape-premiere'
    },
    {
      id: 'etape-anterieure',
      nom: 'etape-anterieure'
    },
    {
      id: 'etape-posterieure',
      nom: 'etape-posterieure'
    },
    {
      id: 'etape-mecanisee',
      nom: 'etape-mecanisee'
    }
  ]
}

const titreEtapeHistorique = {
  date: '1900-01-01'
}

const titreEtapeAucuneRestriction = { typeId: 'etape-aucune-restriction' }

const titreDemarcheAucuneRestriction = {}

const titreEtapeAnterieureAvant = {
  typeId: 'etape-avant',
  date: '2020-01-01'
}

const titreEtapeAnterieureApres = {
  typeId: 'etape-avant',
  date: '2020-12-31'
}

const titreDemarcheAnterieure = {
  type: demarcheType,
  etapes: [
    {
      typeId: 'etape-anterieure',
      date: '2020-06-15',
      statutId: 'ok'
    }
  ]
}

const titreEtapePosterieureApres = {
  typeId: 'etape-apres',
  date: '2020-12-31'
}

const titreEtapePosterieureAvant = {
  typeId: 'etape-apres',
  date: '2020-01-01'
}

const titreDemarchePosterieure = {
  type: demarcheType,
  etapes: [
    {
      typeId: 'etape-posterieure',
      date: '2020-06-15'
    }
  ]
}

const titreEtapePremiereApres = {
  typeId: 'etape-premiere',
  date: '2020-12-31'
}

const titreEtapePremiereAvant = {
  typeId: 'etape-premiere',
  date: '2020-01-01'
}

const titreDemarchePremiere = {
  type: demarcheType,
  etapes: [
    {
      typeId: 'etape',
      date: '2020-06-15'
    }
  ]
}

const titreEtapeMecanisee = {
  typeId: 'etape-mecanisee',
  date: '2020-01-01'
}

const titreDemarcheMecanisee = {
  type: demarcheType,
  etapes: [{ contenu: { onf: { mecanisee: true } } }]
}

const titreAutre = { typeId: 'autre' }

const titreArm = { typeId: 'arm', demarches: [{ etapes: [] }] }

const titreArmMecanisee = { typeId: 'arm', demarches: [titreDemarcheMecanisee] }

export {
  titreEtapeHistorique,
  titreEtapeAucuneRestriction,
  titreDemarcheAucuneRestriction,
  titreEtapeAnterieureAvant,
  titreEtapeAnterieureApres,
  titreDemarcheAnterieure,
  titreEtapePosterieureApres,
  titreEtapePosterieureAvant,
  titreDemarchePosterieure,
  titreEtapePremiereApres,
  titreEtapePremiereAvant,
  titreDemarchePremiere,
  titreEtapeMecanisee,
  titreDemarcheMecanisee,
  titreAutre,
  titreArm,
  titreArmMecanisee
}
