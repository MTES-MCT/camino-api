import * as dateFormat from 'dateformat'

import {
  titresActiviteGet,
  titreActiviteUpdate
} from '../../database/queries/titres-activites'
import {
  utilisateurGet,
  utilisateursGet
} from '../../database/queries/utilisateurs'
import { titreGet } from '../../database/queries/titres'

import permissionsCheck from './_permissions-check'

import { titreActiviteRowUpdate } from '../../tools/export/titre-activite'

import emailsSend from '../../tools/emails-send'

const titreActiviteModifier = async ({ activite }, context, info) => {
  const errors = []
  const titre = await titreGet(activite.titreId)
  const user = await utilisateurGet(context.user.id)
  const activiteOld = await titresActiviteGet(activite.id)
  const isAmodiataire = titre.amodiataires.some(t => t.id === user.entrepriseId)
  const isTitulaire = titre.titulaires.some(t => t.id === user.entrepriseId)

  if (
    !(
      permissionsCheck(context.user, ['super', 'admin']) ||
      (permissionsCheck(context.user, ['entreprise']) &&
        (isAmodiataire || (!titre.amodiataires.length && isTitulaire)))
    )
  ) {
    errors.push("droits insuffisants pour effectuer l'opération")
  }

  if (
    !activiteOld.type.types.find(
      type => type.domaineId === titre.domaineId && type.id === titre.typeId
    )
  ) {
    errors.push("ce titre ne peut pas recevoir d'activite")
  }

  if (activiteOld && activiteOld.statut.id === 'dep') {
    errors.push('cette activite a été validé et ne peux plus être modifiée')
  }

  if (!errors.length) {
    activite.utilisateurId = context.user.id

    const res = await titreActiviteUpdate({
      titreActivite: activite
    })

    titreActiviteRowUpdate(activite)
    if (activite.statutId === 'dep') {
      const utilisateurs = await utilisateursGet({
        entrepriseIds: isAmodiataire
          ? titre.amodiataires.map(t => t.id)
          : titre.titulaires.map(t => t.id),
        noms: undefined,
        administrationIds: undefined,
        permissionIds: undefined
      })
      const emails = utilisateurs.reduce(
        (res, u) => (u.email ? [...res, u.email] : res),
        // si la variable d'environnement existe,
        // on ajoute un email générique pour recevoir une copie
        process.env.ACTIVITES_RAPPORTS_EMAIL
          ? [process.env.ACTIVITES_RAPPORTS_EMAIL]
          : []
      )

      const subject = `[Camino] Rapport trimestriel ${titre.nom}, ${
        activite.contenu.trimestre
      } trimestre ${activite.contenu.annee}`
      const html = emailFormat(titre, user, activite)

      await emailsSend(emails, subject, html)
    }

    return 'success'
  } else {
    throw new Error(errors.join(', '))
  }
}

const emailFormat = (titre, user, { contenu, titreId, date }) => {
  const header = `
<h1>Rapport trimestriel ${titre.nom}, ${contenu.trimestre} trimestre ${
    contenu.annee
  }</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/titres/${titreId} <br>

<b>Rempli par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>

<b>Date</b> : ${dateFormat(date, 'dd-mm-yyyy')} <br>

<hr>
<ul>
`
  const orNet = contenu.orNet
    ? `
  <li><b>Or net extrait (g)</b> : ${contenu.orNet}</li>
`
    : ''

  const body = `
  <li><b>Or brut extrait (g)</b> : ${contenu.orBrut}</li>
  <li><b>Mercure récupéré (g)</b> : ${contenu.mercure}</li>
  <li><b>Carburant détaxé (l)</b> : ${contenu.carburantDetaxe}</li>
  <li><b>Carburant conventionnel (l)</b> : ${
    contenu.carburantConventionnel
  }</li>
  <li><b>Pompes actives</b> : ${contenu.pompes}</li>
  <li><b>Pelles actives</b> : ${contenu.pelles}</li>
  <li><b>Effectifs</b> : ${contenu.effectifs}</li>
  <li>
    <b>Dépenses relatives à la protection de l’environnement (euros)</b> : ${
      contenu.environnement
    }
  </li>
</ul>

<hr>

<h2>Travaux</h2>`

  const travaux = contenu.travaux.reduce(
    (res, mois) => `
${res}
    
<hr>

<h3>${mois.nom} ${contenu.annee}</h3>

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

  const footer = contenu.complement
    ? `<hr>

<h2>Informations complémentaires</h2>

<p>${contenu.complement}</p>
`
    : ''

  return `
${header}
${orNet}
${body}
${travaux}
${footer}
`
}

export { titreActiviteModifier }
