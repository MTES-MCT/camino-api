const activiteTypeTrimestre = {
  id: 'tri',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
}

const activiteTypeMois = {
  id: 'moi',
  frequence: { periodesNom: 'mois', mois: [...new Array(12)] }
}

const titreVide = {}

const titreAvecActivites = {
  activites: [
    {
      activiteTypeId: activiteTypeTrimestre.id,
      annee: 2018,
      frequencePeriodeId: 1
    }
  ]
}

export {
  activiteTypeTrimestre,
  activiteTypeMois,
  titreVide,
  titreAvecActivites
}
