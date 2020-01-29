// TODO: ajouter un cas si les activités ont un délai null (champ vide)
const titreActiviteStatutIdFind = titreActivite => {
  const dateDepot = new Date(titreActivite.date)

  const dateDelai = new Date(dateDepot)

  dateDelai.setMonth(dateDepot.getMonth() + titreActivite.type.delaiMois)

  return dateDelai < Date.now() ? 'fer' : titreActivite.activiteStatutId
}

export default titreActiviteStatutIdFind
