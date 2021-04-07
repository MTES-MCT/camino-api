import '../../init'

import { administrationsUpsert } from '../../database/queries/administrations'

import { IAdministration } from '../../types'
// import { userGet } from '../../database/queries/utilisateurs'

const main = async () => {
  const administrationDgcl = {
    id: 'min-mctrct-dgcl-01',
    typeId: 'min',
    nom:
      'Ministère de la Cohésion des Territoires et des Relations avec les Collectivités Territoriales',
    abreviation: 'DGCL/SDFLAE/FL1',
    service: 'Bureau de la fiscalité locale',
    url:
      'https://www.cohesion-territoires.gouv.fr/direction-generale-des-collectivites-locales',
    telephone: '01 49 27 31 59',
    adresse1: '2 place des Saussaies',
    codePostal: '75800',
    commune: 'Paris'
  } as IAdministration

  await administrationsUpsert([administrationDgcl])

  process.exit(0)
}

main()
