import { dbManager } from '../../../../tests/init-db-manager'
import { IEntreprise, ITitre, IUtilisateur } from '../../../types'
import Entreprises from '../../models/entreprises'
import Utilisateurs from '../../models/utilisateurs'
import Permissions from '../../models/permissions'
import { entreprisesQueryModify, entreprisesTitresQuery } from './entreprises'
import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresEtapes from '../../models/titres-etapes'
import { knex } from '../../../knex'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
  await Entreprises.query().delete()
  await Utilisateurs.query().delete()
  await Permissions.query().delete()
  await Titres.query().delete()
  await TitresDemarches.query().delete()
  await TitresEtapes.query().delete()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

const mockEntreprise1 = {
  id: 'monEntrepriseId',
  nom: 'monEntrepriseNom'
} as IEntreprise

const mockUser = {
  id: '109f95',
  permissionId: 'entreprise',
  permission: { id: 'entreprise', nom: 'Entreprise', ordre: 5 },
  entreprises: [mockEntreprise1],
  email: 'email',
  motDePasse: 'motdepasse'
} as IUtilisateur

const mockTitre = {
  id: 'monTitreId',
  nom: 'monTitreNom',
  domaineId: 'm',
  statutId: 'ech',
  typeId: 'arm'
} as ITitre

describe('entreprisesQueryModify', () => {
  test("Vérifie l'écriture de la requête sur le droit 'modification' d'une entreprise", async () => {
    await Utilisateurs.query().insertGraph(mockUser)

    const q = entreprisesQueryModify(Entreprises.query(), {}, mockUser)

    expect(await q.first()).toMatchObject(
      Object.assign(mockEntreprise1, { modification: true })
    )
  })
})

describe('entreprisesTitresQuery', () => {
  beforeEach(async () => {
    await Entreprises.query().delete()
    await Titres.query().delete()
    await TitresDemarches.query().delete()
    await TitresEtapes.query().delete()
  })

  test("Vérifie l'écriture de la requête sur les droits des entreprises titulaires sur un titre", async () => {
    await Titres.query().insertGraph(
      Object.assign(mockTitre, {
        propsTitreEtapesIds: {
          titulaires: `${mockTitre.id}-oct-mfr`
        }
      })
    )

    await TitresDemarches.query().insertGraph({
      id: `${mockTitre.id}-oct`,
      titreId: mockTitre.id,
      typeId: 'oct'
    })

    await TitresEtapes.query().insertGraph({
      id: `${mockTitre.id}-oct-mfr`,
      titreDemarcheId: `${mockTitre.id}-oct`,
      date: 'date',
      typeId: 'mfr',
      statutId: 'acc',
      titulaires: [{ id: mockEntreprise1.id, nom: mockEntreprise1.nom }]
    })

    await knex.schema.raw(`DELETE FROM titres_titulaires;`)
    await knex.schema.raw(
      `INSERT INTO titres_titulaires(titre_etape_id, entreprise_id)	VALUES ('${mockTitre.id}-oct-mfr', '${mockEntreprise1.id}');`
    )

    const qEntreprisesTitres = entreprisesTitresQuery(
      [mockEntreprise1.id],
      'titres',
      {
        isTitulaire: true
      }
    )

    const q = Titres.query().whereExists(qEntreprisesTitres)

    expect(await q.first()).toMatchObject(mockTitre)
  })
  test("Vérifie l'écriture de la requête sur les droits des entreprises amodiataires sur un titre", async () => {
    await Titres.query().insertGraph(
      Object.assign(mockTitre, {
        propsTitreEtapesIds: {
          amodiataires: `${mockTitre.id}-oct-mfr`
        }
      })
    )

    await TitresDemarches.query().insertGraph({
      id: `${mockTitre.id}-oct`,
      titreId: mockTitre.id,
      typeId: 'oct'
    })

    await TitresEtapes.query().insertGraph({
      id: `${mockTitre.id}-oct-mfr`,
      titreDemarcheId: `${mockTitre.id}-oct`,
      date: 'date',
      typeId: 'mfr',
      statutId: 'acc',
      amodiataires: [{ id: mockEntreprise1.id, nom: mockEntreprise1.nom }]
    })

    await knex.schema.raw(`DELETE FROM titres_amodiataires;`)
    await knex.schema.raw(
      `INSERT INTO titres_amodiataires(titre_etape_id, entreprise_id)	VALUES ('${mockTitre.id}-oct-mfr', '${mockEntreprise1.id}');`
    )

    const qEntreprisesTitres = entreprisesTitresQuery(
      [mockEntreprise1.id],
      'titres',
      {
        isAmodiataire: true
      }
    )

    const q = Titres.query().whereExists(qEntreprisesTitres)

    expect(await q.first()).toMatchObject(mockTitre)
  })
})
