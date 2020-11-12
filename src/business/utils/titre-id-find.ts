import { ITitre } from '../../types'
import * as slugify from '@sindresorhus/slugify'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'

const titreIdFind = (titre: ITitre) => {
  const { domaineId, type, nom } = titre

  const demarcheOctroiDateDebut = titreDemarcheOctroiDateDebutFind(
    titre.demarches
  )

  const titreId = slugify(
    `${domaineId}-${type!.typeId}-${nom}-${demarcheOctroiDateDebut.slice(0, 4)}`
  )

  return titreId
}

export default titreIdFind
