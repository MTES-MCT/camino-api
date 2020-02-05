// TODO: ajouter un cas si les activités ont un délai null (champ vide)
const titreActiviteStatutIdFind = titreActivite => {
  // si l'activité a un statut différent de "déposé" ou "fermé"
  if (!['dep', 'fer'].includes(titreActivite.statutId)) {
    const dateDepot = new Date(titreActivite.date)

    const dateDelai = new Date(dateDepot)

    dateDelai.setMonth(dateDepot.getMonth() + titreActivite.type.delaiMois)

    // si le délai de remplissage est dépassé
    // passe le statut de l'activité à "fermé"
    if (Date.now() > dateDelai) {
      return 'fer'
    }
  }

  // sinon retourne le statut de l'activité
  return titreActivite.statutId
}

export default titreActiviteStatutIdFind
