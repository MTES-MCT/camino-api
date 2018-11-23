// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

const titrePropEtapeIdFind = (titreDemarches, prop) =>
  // filtre les démarches acceptée ou terminée
  titreDemarches
    .filter(titreDemarche => ['acc', 'ter'].includes(titreDemarche.statutId))
    // parcourt les démarches
    .reduce((etapeId, titreDemarche) => {
      if (!etapeId) {
        // filtre les étapes acceptation, fait ou favorable
        const etape = titreDemarche.etapes
          .filter(
            titreEtape =>
              ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
              ['dpu', 'dex'].includes(titreEtape.typeId)
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
      }

      return etapeId
    }, null)

module.exports = titrePropEtapeIdFind
