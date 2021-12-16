import { ITitreDemarche, ITitreEtape } from '../../types'

import { titreEtapeUpsert } from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { userSuper } from '../../database/user-super'
import dateFormat from 'dateformat'
import titreEtapeUpdateTask from '../titre-etape-update'
import {
  titreEtapeAdministrationsEmailsSend,
  titreEtapeUtilisateursEmailsSend
} from '../../api/graphql/resolvers/_titre-etape-email'
import { titreDemarcheDepotDemandeDateFind } from '../rules/titre-demarche-depot-demande-date-find'
import { demarcheDefinitionFind } from '../rules-demarches/definitions'

export const titreEtapeDepotCreate = async (titreDemarche: ITitreDemarche) => {
  let titreEtapeDepot = {
    titreDemarcheId: titreDemarche.id,
    typeId: 'mdp',
    statutId: 'fai',
    date: dateFormat(new Date(), 'yyyy-mm-dd')
  } as ITitreEtape

  titreEtapeDepot = await titreEtapeUpsert(
    titreEtapeDepot,
    userSuper,
    titreDemarche.titreId
  )
  await titreEtapeUpdateTask(
    titreEtapeDepot.id,
    titreEtapeDepot.titreDemarcheId,
    userSuper
  )
  await titreEtapeAdministrationsEmailsSend(
    titreEtapeDepot,
    titreEtapeDepot.type!,
    titreDemarche.typeId,
    titreDemarche.titreId,
    titreDemarche.titre!.typeId,
    userSuper
  )
  await titreEtapeUtilisateursEmailsSend(
    titreEtapeDepot,
    titreEtapeDepot.type!,
    titreDemarche.typeId,
    titreDemarche.titreId
  )
}
export const titresEtapesDepotCreate = async (demarcheId: string) => {
  console.info()
  console.info('dépôt d’une démarche…')

  const titreDemarche = await titreDemarcheGet(
    demarcheId,
    {
      fields: {
        etapes: { id: {} },
        titre: { id: {} }
      }
    },
    userSuper
  )

  if (!titreDemarche) {
    return false
  }

  const demarcheDefinition = demarcheDefinitionFind(
    titreDemarche.titre!.typeId,
    titreDemarche.typeId
  )
  // On peut déposer automatiquement seulement les démarches qui possèdent un arbre d’instructions
  if (
    !demarcheDefinition ||
    titreDemarcheDepotDemandeDateFind(titreDemarche.etapes!) <=
      demarcheDefinition.dateDebut
  )
    return false

  if (titreDemarche.titre!.typeId === 'arm' && titreDemarche.typeId === 'oct') {
    // Si on a pas de demande faite
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'mfr' && e.statutId === 'fai'
      )
    ) {
      return false
    }

    // Si on a déjà un dépot de la demande
    if (titreDemarche.etapes?.find(e => e.typeId === 'mdp')) {
      return false
    }

    // Il faut donc créer automatiquement le dépôt de la demande
    await titreEtapeDepotCreate(titreDemarche)

    return true
  } else if (
    titreDemarche.titre!.typeId === 'axm' &&
    titreDemarche.typeId === 'oct'
  ) {
    // https://cacoo.com/diagrams/Yb0HWsbldfgf7kt1/249D0
    // Si on a pas de demande faite
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'mfr' && e.statutId === 'fai'
      )
    ) {
      return false
    }
    // Si on a pas de décision de la mission d’autorité environnementale exemptée
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'dae' && e.statutId === 'exe'
      )
    ) {
      return false
    }
    // Si on a pas de décision du propriétaire du sol favorable avec ou sans réserve
    if (
      !titreDemarche.etapes?.find(
        e => e.typeId === 'asl' && ['fav', 'fre'].includes(e.statutId)
      )
    ) {
      return false
    }
    // Si on a déjà un dépot de la demande
    if (titreDemarche.etapes?.find(e => e.typeId === 'mdp')) {
      return false
    }

    // Il faut donc créer automatiquement le dépôt de la demande
    await titreEtapeDepotCreate(titreDemarche)

    return true
  }

  return false
}
