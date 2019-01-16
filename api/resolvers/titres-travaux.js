const emailsBatch = require('../../tools/mailer/batch')
const dateFormat = require('dateformat')

const {
  titresTravauxRapportGet,
  titreTravauxRapportUpdate
} = require('../../database/queries/titres-travaux')

const {
  utilisateurGet,
  utilisateursGet
} = require('../../database/queries/utilisateurs')

const { titreGet } = require('../../database/queries/titres')

const permissionsCheck = require('./_permissions-check')

const {
  titreTravauxRapportRowUpdate
} = require('../../tools/export/titre-travaux-rapport')

const resolvers = {
  async titreTravauxRapportModifier({ rapport }, context, info) {
    const errors = []
    const titre = await titreGet(rapport.titreId)
    const user = await utilisateurGet(context.user.id)
    const rapportOld = await titresTravauxRapportGet(rapport.id)

    if (
      !(
        permissionsCheck(context.user, ['super', 'admin']) ||
        (permissionsCheck(context.user, ['entreprise']) &&
          titre.titulaires.find(t => t.id === user.entrepriseId))
      )
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

    if (rapportOld && rapportOld.confirmation) {
      errors.push('ce rapport a été validé et ne peux plus être modifié')
    }

    if (!errors.length) {
      titreTravauxRapportRowUpdate(rapport)

      if (rapport.confirmation) {
        const utilisateurs = await utilisateursGet({
          entrepriseIds: titre.titulaires.map(t => t.id),
          noms: undefined,
          administrationIds: undefined,
          permissionIds: undefined
        })
        const emails = utilisateurs.reduce(
          (res, u) => (u.email ? [...res, u.email] : res),
          // si la variable d'environnement existe,
          // on ajoute un email générique pour recevoir une copie
          process.env.TRAVAUX_RAPPORTS_EMAIL
            ? [process.env.TRAVAUX_RAPPORTS_EMAIL]
            : []
        )
        const subject = `[Camino] Rapport trimestriel ${titre.nom}, ${
          rapport.contenu.trimestre
        } trimestre ${rapport.contenu.annee}`
        const html = emailFormat(titre, user, rapport)

        await emailsBatch(emails, subject, html)
      }

      return titreTravauxRapportUpdate({
        titreTravauxRapport: rapport
      })
    } else {
      throw new Error(errors.join(', '))
    }
  }
}

const emailFormat = (titre, user, rapport) => {
  const header = `
<h1>Rapport trimestriel ${titre.nom}, ${rapport.contenu.trimestre} trimestre ${
    rapport.contenu.annee
  }</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/titres/${rapport.titreId} <br>

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

<h2>Travaux</h2>`

  const body = rapport.contenu.travaux.reduce(
    (res, mois) => `
${res}
    
<hr>

<h3>${mois.nom} ${rapport.contenu.annee}</h3>

<ul>
  <li>Non débutés : ${mois.nonDebutes ? 'Oui' : 'Non'}</li>
  <li>Exploitation en cours : ${mois.exploitationEnCours ? 'Oui' : 'Non'}</li>
  <li>Arrêt temporaire : ${mois.arretTemporaire ? 'Oui' : 'Non'}</li>
  <li>Réhabilitation : ${mois.rehabilitation ? 'Oui' : 'Non'}</li>
  <li>Arrêt définitif (après réhabilitation) : ${
    mois.arretDefinitif ? 'Oui' : 'Non'
  }</li>
</ul>`,
    ''
  )

  const footer = rapport.contenu.complement
    ? `<hr>

<h2>Informations complémentaires</h2>

<p>${rapport.contenu.complement}</p>
`
    : ''

  return `
${header}
${body}
${footer}
`
}

module.exports = resolvers
