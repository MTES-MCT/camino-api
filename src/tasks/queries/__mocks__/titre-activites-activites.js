const titreVide = {}

const titreAvecActivites = {
  activites: [{ annee: 2018, frequencePeriodeId: 1 }]
}

const activiteTypeTrimestre = {
  id: 'test',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
}

const activiteTypeMois = {
  id: 'test',
  frequence: { periodesNom: 'mois', mois: [...new Array(12)] }
}

export {
  titreVide,
  titreAvecActivites,
  activiteTypeTrimestre,
  activiteTypeMois
}
