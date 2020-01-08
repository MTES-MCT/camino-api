import 'dotenv/config'
import '../../../database/index'

import {
  entreprisesGet,
  entreprisesUpsert
} from '../../../database/queries/entreprises'

async function main() {
  const entreprises = await entreprisesGet()

  const entreprisesToUpdate = entreprises.reduce(
    (entreprisesToUpdate, entreprise) => {
      const { id } = entreprise

      if (
        // salins du midi
        id === 'fr-400000001' ||
        // entreprises non françaises ou créées manuellement
        !id.match(/^fr-[1-8]/) ||
        // ayant déjà un siren
        entreprise.legalSiren
      ) {
        return entreprisesToUpdate
      }

      entreprise.legalSiren = id.replace('fr-', '')

      console.log(
        "Mise à jour du legal_siren de l'entreprise",
        id,
        entreprise.nom
      )

      entreprisesToUpdate.push(entreprise)

      return entreprisesToUpdate
    },
    []
  )

  await entreprisesUpsert(entreprisesToUpdate)

  process.exit(0)
}

main()
