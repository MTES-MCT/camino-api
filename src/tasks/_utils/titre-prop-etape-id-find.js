// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

const titrePropEtapeIdFind = (titreDemarches, prop) =>
  // filtre les démarches acceptée, terminée ou en instruction
  titreDemarches
    .filter(titreDemarche => ['acc', 'ter', 'ins'].includes(titreDemarche.statutId))
    // parcourt les démarches
    .reduce((etapeId, titreDemarche) => {
      // Si la démarche est en instruction,
      // on ne prend en compte que l'octroi (demande initiale)
      if (etapeId || titreDemarche.statutId === 'ins' && titreDemarche.typeId !== 'oct') {
        return etapeId
      }

      // filtre les étapes acceptation, fait ou favorable
      const etape = titreDemarche.etapes
        .filter(
          titreEtape =>
            ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
            (['dpu', 'dex', 'rpu'].includes(titreEtape.typeId) ||
              // Si l'étape est une formalisation de la demande,
              // on ne prend en compte que pour un octroi (demande initiale)
              titreEtape.typeId === 'mfr' && titreDemarche.typeId === 'oct')
        )
        // trouve une étape qui contient la propriété
        .find(
          titreEtape =>
            (titreEtape[prop] &&
              Array.isArray(titreEtape[prop]) &&
              titreEtape[prop].length) ||
              (titreEtape[prop] && !Array.isArray(titreEtape[prop]))
        )

      // si l'étape existe, retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || (!etape && null)
    }, null)

module.exports = titrePropEtapeIdFind
