// TODO: ajouter un cas si les activités ont un délai null (champ vide)
const titreActiviteStatutIdFind = titreActivite => {
  const dateDelai =
    new Date(titreActivite.date).getTime() +
    new Date(0, titreActivite.type.delaiMois).getTime()

  return dateDelai < Date.now() ? 'fer' : titreActivite.activiteStatutId
}

export default titreActiviteStatutIdFind
