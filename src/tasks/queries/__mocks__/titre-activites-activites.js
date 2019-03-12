const titreVide = {}

const titreAvecActivites = {
  activites: [{ annee: 2018, frequenceElementId: 1 }]
}

const activiteTypeTrimestre = {
  id: 'test',
  frequence: { elementsNom: 'trimestres', trimestres: [{}, {}, {}, {}] }
}

const activiteTypeMois = {
  id: 'test',
  frequence: { elementsNom: 'mois', mois: [{}] }
}

export {
  titreVide,
  titreAvecActivites,
  activiteTypeTrimestre,
  activiteTypeMois
}
