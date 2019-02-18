// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

const titrePropEtapeIdFind = (titreDemarches, prop) =>
  titreDemarches
    // parcourt les démarches
    .reduce((etapeId, titreDemarche) => {
      if (
        // si une étape a déjà été trouvée
        etapeId ||
        // filtre les démarches acceptée, terminée ou en instruction
        !['acc', 'ter', 'ins'].includes(titreDemarche.statutId) ||
        // Si la démarche est en instruction,
        // on ne prend en compte que l'octroi (demande initiale)
        (titreDemarche.statutId === 'ins' && titreDemarche.typeId !== 'oct')
      ) {
        return etapeId
      }

      const etape = titreDemarche.etapes.find(
        titreEtape =>
          // filtre les étapes acceptation, fait ou favorable
          ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
          (['dpu', 'dex', 'rpu', 'dim'].includes(titreEtape.typeId) ||
            // Si l'étape est une formalisation de la demande,
            // on ne prend en compte que pour un octroi (demande initiale)
            (titreEtape.typeId === 'mfr' && titreDemarche.typeId === 'oct')) &&
          // trouve une étape qui contient la propriété
          (titreEtape[prop] &&
            (!Array.isArray(titreEtape[prop]) ||
              // la propriété ne doit pas être vide si c'est un tableau
              titreEtape[prop].length))
      )

      // si l'étape existe, retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    }, null)

export default titrePropEtapeIdFind
