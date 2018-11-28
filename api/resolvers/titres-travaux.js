const mailer = require('../../tools/mailer/index')
const dateFormat = require('dateformat')

const {
  titreTravauxRapportAdd
} = require('../../database/queries/titres-travaux')

const { utilisateurGet } = require('../../database/queries/utilisateurs')

const { titreGet } = require('../../database/queries/titres')

const permissionsCheck = require('./_permissions-check')

const {
  titreTravauxRapportRowAdd
} = require('../../tools/export/titre-travaux-rapport')

const resolvers = {
  async titreTravauxRapportAjouter({ rapport }, context, info) {
    const errors = []
    const titre = await titreGet(rapport.titreId)
    const user = await utilisateurGet(context.user.id)

    if (
      permissionsCheck(context.user, ['entreprise']) &&
      !titre.titulaires.find(t => t.id === user.entrepriseId) &&
      !permissionsCheck(context.user, ['super', 'admin'])
    ) {
      errors.push("droits insuffisants pour effectuer l'opération")
    }

    if (
      !(
        titre.domaineId === 'm' &&
        (titre.typeId === 'cxx' ||
          titre.typeId === 'pxm' ||
          titre.typeId === 'axm')
      )
    ) {
      errors.push('ce titre ne peut pas recevoir de rapport')
    }

    if (!errors.length) {
      try {
        titreTravauxRapportRowAdd(rapport)
      } catch (e) {
        console.log("erreur lors de l'ajout d'une ligne dans la spreasheet", e)
      }

      const subject = `[Camino] Rapport trimestriel ${titre.nom}, ${
        rapport.contenu.trimestre
      } trimestre ${rapport.contenu.annee}`
      const html = emailFormat(titre, user, rapport)

      try {
        mailer(user.email, subject, html)
      } catch (e) {
        return "erreur lors de l'envoi d'email"
      }

      return titreTravauxRapportAdd({ titreTravauxRapport: rapport })
    } else {
      throw new Error(errors.join(', '))
    }
  }
}

const emailFormat = (titre, user, rapport) => `
<h1>Rapport trimestriel ${titre.nom}, ${rapport.contenu.trimestre} trimestre ${
  rapport.contenu.annee
}</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/${rapport.titreId} <br>

<b>Rempli par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>

<b>Date</b> : ${dateFormat(rapport.date, 'dd-mm-yyyy')} <br>

<hr>

<ul>
  <li><b>Or net extrait (g)</b> : ${rapport.contenu.or}</li>
  <li><b>Mercure récupéré (g)</b> : ${rapport.contenu.mercure}</li>
  <li><b>Carburant détaxé (l)</b> : ${rapport.contenu.carburantDetaxe}</li>
  <li><b>Carburant conventionnel (l)</b> : ${
    rapport.contenu.carburantConventionnel
  }</li>
  <li><b>Pompes actives</b> : ${rapport.contenu.pompes}</li>
  <li><b>Pelles actives</b> : ${rapport.contenu.pelles}</li>
  <li><b>Effectifs</b> : ${rapport.contenu.effectifs}</li>
  <li>
    <b>Dépenses relatives à la protection de l’environnement (euros)</b> : ${
      rapport.contenu.environnement
    }
  </li>
</ul>

<hr>

<h2>Travaux</h2>

<hr>

<h3>${rapport.contenu.travaux[0].nom} ${rapport.contenu.annee}</h3>

<ul>
  <li>Non débutés : ${
    rapport.contenu.travaux[0].nonDebutes ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[0].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt temporaire : ${
    rapport.contenu.travaux[0].arretTemporaire ? 'Oui' : 'Non'
  }</li>
  <li>Réhabilitation : ${
    rapport.contenu.travaux[0].rehabilitation ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[0].arretDefinitif ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt définitif (après réhabilitation) : ${
    rapport.contenu.travaux[0].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
</ul>

<hr>

<h3>${rapport.contenu.travaux[1].nom} ${rapport.contenu.annee}</h3>

<ul>
  <li>Non débutés : ${
    rapport.contenu.travaux[1].nonDebutes ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[1].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt temporaire : ${
    rapport.contenu.travaux[1].arretTemporaire ? 'Oui' : 'Non'
  }</li>
  <li>Réhabilitation : ${
    rapport.contenu.travaux[1].rehabilitation ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[1].arretDefinitif ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt définitif (après réhabilitation) : ${
    rapport.contenu.travaux[1].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
</ul>

<hr>

<h3>${rapport.contenu.travaux[2].nom} ${rapport.contenu.annee}</h3>

<ul>
  <li>Non débutés : ${
    rapport.contenu.travaux[2].nonDebutes ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[2].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt temporaire : ${
    rapport.contenu.travaux[2].arretTemporaire ? 'Oui' : 'Non'
  }</li>
  <li>Réhabilitation : ${
    rapport.contenu.travaux[2].rehabilitation ? 'Oui' : 'Non'
  }</li>
  <li>Exploitation en cours : ${
    rapport.contenu.travaux[2].arretDefinitif ? 'Oui' : 'Non'
  }</li>
  <li>Arrêt définitif (après réhabilitation) : ${
    rapport.contenu.travaux[2].exploitationEnCours ? 'Oui' : 'Non'
  }</li>
</ul>

<hr>

<h2>Informations complémentaires</h2>

<p>${rapport.contenu.complement}</p>
`

module.exports = resolvers
