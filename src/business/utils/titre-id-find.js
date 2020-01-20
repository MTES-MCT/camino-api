import * as slugify from '@sindresorhus/slugify'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'

const titreIdFind = titre => {
  const { domaineId, typeId, nom } = titre

  const demarcheOctroiDateDebut = titreDemarcheOctroiDateDebutFind(
    titre.demarches
  )

  return slugify(
    `${domaineId}-${typeId}-${nom}-${demarcheOctroiDateDebut.slice(0, 4)}`
  )
}

export default titreIdFind
