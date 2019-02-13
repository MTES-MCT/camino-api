const titreValide = {
  "id": "m-prx-saint-pierre-2014",
  "demarches": [
    {
      "id": "m-prx-saint-pierre-2014-oct01",
      "titreId": "m-prx-saint-pierre-2014",
      "typeId": "oct",
      "statutId": "acc",
      "ordre": 1,
      "annulationDemarcheId": null,
      "etapes": [
        {
          "id": "m-prx-saint-pierre-2014-oct01-dpu01",
          "titreDemarcheId": "m-prx-saint-pierre-2014-oct01",
          "typeId": "dpu",
          "statutId": "acc",
          "ordre": 2,
          "date": "2014-11-01T23:00:00.000Z",
          "dateDebut": null,
          "dateFin": null,
          "duree": 5
        },
        {
          "id": "m-prx-saint-pierre-2014-oct01-dex01",
          "titreDemarcheId": "m-prx-saint-pierre-2014-oct01",
          "typeId": "dex",
          "statutId": "acc",
          "ordre": 1,
          "date": "2014-04-01T22:00:00.000Z",
          "dateDebut": null,
          "dateFin": null,
          "duree": 5
        }
      ]
    }
  ],
}

const titreEchu = {
  "id": "m-prx-saint-pierre-1914",
  "demarches": [
    {
      "id": "m-prx-saint-pierre-1914-oct01",
      "titreId": "m-prx-saint-pierre-1914",
      "typeId": "oct",
      "statutId": "acc",
      "ordre": 1,
      "annulationDemarcheId": null,
      "etapes": [
        {
          "id": "m-prx-saint-pierre-1914-oct01-dpu01",
          "titreDemarcheId": "m-prx-saint-pierre-1914-oct01",
          "typeId": "dpu",
          "statutId": "acc",
          "ordre": 2,
          "date": "1914-11-01T23:00:00.000Z",
          "dateDebut": null,
          "dateFin": null,
          "duree": 5
        },
        {
          "id": "m-prx-saint-pierre-1914-oct01-dex01",
          "titreDemarcheId": "m-prx-saint-pierre-1914-oct01",
          "typeId": "dex",
          "statutId": "acc",
          "ordre": 1,
          "date": "1914-04-01T22:00:00.000Z",
          "dateDebut": null,
          "dateFin": null,
          "duree": 5
        }
      ]
    }
  ],
}

const titreOctroiDepose = {
  "id": "m-prx-saint-pierre-2014",
  "demarches": [
    {
      "id": "m-prx-saint-pierre-2014-oct01",
      "titreId": "m-prx-saint-pierre-2014",
      "typeId": "oct",
      "statutId": "dep",
      "ordre": 1,
      "annulationDemarcheId": null
    }
  ],
}

const titreOctroiRejete = {
  "id": "m-prx-saint-pierre-2014",
  "demarches": [
    {
      "id": "m-prx-saint-pierre-2014-oct01",
      "titreId": "m-prx-saint-pierre-2014",
      "typeId": "oct",
      "statutId": "rej",
      "ordre": 1,
      "annulationDemarcheId": null
    }
  ],
}

const titreDemarcheInstruction = {
  "id": "m-prx-saint-pierre-2014",
  "demarches": [
    {
      "id": "m-prx-saint-pierre-2014-oct01",
      "titreId": "m-prx-saint-pierre-2014",
      "typeId": "mut",
      "statutId": "ins",
      "ordre": 1,
      "annulationDemarcheId": null
    }
  ],
}

export {
  titreValide,
  titreEchu,
  titreOctroiDepose,
  titreOctroiRejete,
  titreDemarcheInstruction
}
