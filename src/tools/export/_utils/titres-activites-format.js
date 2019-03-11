const titreActiviteFormat = titreActivite =>
  titreActivite.map(e => {
    const contenu = {
      renseignements: {
        orBrut: e.contenu.orBrut,
        pelles: e.contenu.pelles,
        pompes: e.contenu.pompes,
        mercure: e.contenu.mercure,
        effectifs: e.contenu.effectifs,
        environnement: e.contenu.environnement,
        carburantDetaxe: e.contenu.carburantDetaxe,
        carburantConventionnel: e.contenu.carburantConventionnel
      },
      travaux: {
        janvier: Object.keys(e.contenu.travaux[0])
          .filter(k => e.contenu.travaux[0][k] && k !== 'id' && k !== 'nom')
          .toString(),
        fevrier: Object.keys(e.contenu.travaux[0])
          .filter(k => e.contenu.travaux[0][k] && k !== 'id' && k !== 'nom')
          .toString(),
        mars: Object.keys(e.contenu.travaux[0])
          .filter(k => e.contenu.travaux[0][k] && k !== 'id' && k !== 'nom')
          .toString()
      }
    }

    if (e.contenu.complement) {
      contenu.complement = {
        texte: e.contenu.complement
      }
    }
    console.log(contenu)
    e.contenu = contenu
    return e
  })

export default titreActiviteFormat
