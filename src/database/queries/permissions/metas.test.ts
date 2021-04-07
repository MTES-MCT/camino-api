import { dbManager } from '../../../../tests/init-db-manager'
import {
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  ITitreTravaux,
  ITitreTravauxEtape,
  IUtilisateur
} from '../../../types'
import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresEtapes from '../../models/titres-etapes'
import Utilisateurs from '../../models/utilisateurs'
import TitresTravaux from '../../models/titres-travaux'
import TitresTravauxEtapes from '../../models/titres-travaux-etapes'
import { etapesTypesGet } from '../metas'
import { knex } from '../../../knex'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
  await Utilisateurs.query().delete()
  await Titres.query().delete()
  await TitresDemarches.query().delete()
  await TitresEtapes.query().delete()
  await TitresTravaux.query().delete()
  await TitresTravauxEtapes.query().delete()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

const mockUser = {
  id: '109f95',
  permissionId: 'entreprise',
  permission: { id: 'entreprise', nom: 'Entreprise', ordre: 5 },
  email: 'email',
  motDePasse: 'motdepasse'
} as IUtilisateur

const mockTravaux = {
  id: 'travauxId',
  titreId: 'monTitreId',
  typeId: 'aom'
} as ITitreTravaux

const mockEtapesTravaux = {
  id: 'etapeTravauxId',
  typeId: 'aow',
  titreTravauxId: 'travauxId',
  travaux: mockTravaux
} as ITitreTravauxEtape

const mockTitre = {
  id: 'monTitreId',
  nom: 'monTitreNom',
  domaineId: 'm',
  statutId: 'ech',
  typeId: 'arm',
  travaux: [mockTravaux]
} as ITitre

const titreDemarche = {
  id: `${mockTitre.id}-oct`,
  titreId: mockTitre.id,
  typeId: 'oct'
} as ITitreDemarche

const titreEtape = {
  id: `${mockTitre.id}-oct-mfr`,
  titreDemarcheId: `${mockTitre.id}-oct`,
  date: 'date',
  typeId: 'mfr',
  statutId: 'acc'
} as ITitreEtape

describe('etapesTypesGet', () => {
  test("Vérifie les types d'étapes", async () => {
    await Utilisateurs.query().insert(mockUser)
    await Titres.query().insertGraph(mockTitre)
    await TitresDemarches.query().insertGraph(titreDemarche)
    await TitresEtapes.query().insertGraph(titreEtape)

    await knex.schema.raw(
      `INSERT INTO titres_travaux_etapes(
	id, titre_travaux_id, type_id)
	VALUES ('${mockEtapesTravaux.id}', '${mockEtapesTravaux.titreTravauxId}', '${mockEtapesTravaux.typeId}');`
    )

    const etapesTypes = await etapesTypesGet(
      {
        titreDemarcheId: titreDemarche.id,
        titreEtapeId: titreEtape.id,
        titreTravauxId: 'travauxId',
        titreTravauxEtapeId: 'etapeTravauxId'
      },
      {},
      mockUser
    )

    const etapesTypesExpected = ['mfr', 'mdp']

    expect(etapesTypes.map(et => et.id)).toEqual(etapesTypesExpected)
  })
})
