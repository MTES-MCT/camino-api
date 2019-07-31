import titreStatutIdFind from './titre-statut-id-find'

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
        // filtre les démarches non acceptée, non terminée ou non en instruction
        // sauf si la démarche est un octroi
        (!['acc', 'ter'].includes(titreDemarche.statutId) &&
          titreDemarche.typeId !== 'oct')
      ) {
        return etapeId
      }

      const etape = titreDemarche.etapes.find(titreEtape => {
        // filtre les étapes acceptation, fait ou favorable
        const isEtapeValide =
          ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
          // Si la démarche est un octroi (demande initiale)
          // on prend en compte n'importe quelle étape
          (titreDemarche.typeId === 'oct' ||
            // sinon, on ne prend en compte que les démarches de décision
            ['dpu', 'dex', 'rpu', 'dim'].includes(titreEtape.typeId))
        if (!isEtapeValide) return false

        // trouve une étape qui contient la propriété
        const isPropFound =
          titreEtape[prop] &&
          (!Array.isArray(titreEtape[prop]) ||
            // la propriété ne doit pas être vide si c'est un tableau
            titreEtape[prop].length)
        if (!isPropFound) return false

        if (prop.match('amodiataires')) {
          const { dateFin } = titreEtape

          // si la date de fin de l'étape est passée
          // l'amodiataire n'est plus valide
          if (dateFin && new Date(dateFin) < new Date()) return false

          const titreStatutId = titreStatutIdFind({ demarches: titreDemarches })

          // sinon, si le titre a le statut modification en instance
          // l'amodiataire est encore valide (survie provisoire)
          // ou, si le titre a le statut échu
          // on affiche le dernier amodiataire
          return ['mod', 'ech'].includes(titreStatutId)
        }

        return true
      })

      // si l'étape existe, retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    }, null)

export default titrePropEtapeIdFind
