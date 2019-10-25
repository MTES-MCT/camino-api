const titreSansDemarche = {
  id: 'test'
}

const titreDemarcheIndefini = {
  id: 'test',
  demarches: [
    {
      statutId: 'ind'
    }
  ]
}

const titreValide = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      annulationTitreDemarcheId: null,
      etapes: [
        {
          id: 'm-prx-saint-pierre-2014-oct01-dex01',
          titreDemarcheId: 'm-prx-saint-pierre-2014-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1,
          date: '2014-04-01',
          dateDebut: null,
          dateFin: '3014-04-01'
        }
      ]
    }
  ]
}

const titreEchu = {
  id: 'm-prx-saint-pierre-1914',
  demarches: [
    {
      id: 'm-prx-saint-pierre-1914-oct01',
      titreId: 'm-prx-saint-pierre-1914',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      etapes: [
        {
          id: 'm-prx-saint-pierre-2014-oct01-dex01',
          titreDemarcheId: 'm-prx-saint-pierre-2014-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1,
          date: '1014-04-01',
          dateDebut: null,
          dateFin: '2014-04-01'
        }
      ]
    }
  ]
}

const titreOctroiInstruction = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'ins',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

const titreOctroiDepose = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'dep',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

const titreOctroiRejete = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'rej',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

const titreOctroiClasse = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'cls',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

const titreOctroiRetire = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'ret',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

const titreDemarcheInstruction = {
  id: 'm-prx-saint-pierre-2014',
  demarches: [
    {
      id: 'm-prx-saint-pierre-2014-mut01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'mut',
      statutId: 'ins',
      ordre: 1,
      annulationTitreDemarcheId: null
    },
    {
      id: 'm-prx-saint-pierre-2014-oct01',
      titreId: 'm-prx-saint-pierre-2014',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      annulationTitreDemarcheId: null
    }
  ]
}

export {
  titreSansDemarche,
  titreDemarcheIndefini,
  titreValide,
  titreEchu,
  titreOctroiInstruction,
  titreOctroiDepose,
  titreOctroiRejete,
  titreOctroiClasse,
  titreOctroiRetire,
  titreDemarcheInstruction
}
