const titreVide = {}

const titreModificationEnInstance = {
  statutId: 'mod'
}

const titreAvecActivite201801 = {
  activites: [{ typeId: 'grp', annee: 2018, frequencePeriodeId: 1 }]
}

const activiteTypeXxx = {
  id: 'xxx',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
}

const activiteTypeGrp = {
  id: 'grp',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] }
}

export {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
}
