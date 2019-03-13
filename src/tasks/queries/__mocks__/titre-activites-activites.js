const titreVide = {}

const titreAvecActivites = {
  activites: [{ annee: 2018, frequencePeriodeId: 1 }]
}

const activiteTypeTrimestre = {
  id: 'test',
  frequence: { periodesNom: 'trimestres', trimestres: [{}, {}, {}, {}] }
}

const activiteTypeMois = {
  id: 'test',
  frequence: { periodesNom: 'mois', mois: [{}] }
}

export {
  titreVide,
  titreAvecActivites,
  activiteTypeTrimestre,
  activiteTypeMois
}
