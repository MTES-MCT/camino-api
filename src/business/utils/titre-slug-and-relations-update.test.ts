import { titreSlugAndRelationsUpdate } from './titre-slug-and-relations-update'
import { titreCreate, titreGet } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'
import { dbManager } from '../../../tests/db-manager'
import { ITitre } from '../../types'
import Titres from '../../database/models/titres'
import { objectClone } from '../../tools'

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

const titreAdd = async (titre: ITitre) =>
  titreCreate(titre, {
    fields: {
      type: { type: { id: {} } },
      demarches: {
        etapes: {
          points: { references: { id: {} } }
        }
      },
      travaux: {
        travauxEtapes: {
          id: {}
        }
      },
      activites: { id: {} }
    }
  })

describe('vérifie la mis à jour des slugs sur les relations d’un titre', () => {
  test('met à jour le slug d’un nouveau titre', async () => {
    await Titres.query().delete()

    const titre = await titreAdd({
      nom: 'titre-nom',
      domaineId: 'm',
      typeId: 'arm',
      propsTitreEtapesIds: {},
      slug: 'toto'
    } as ITitre)

    const { hasChanged, slug } = await titreSlugAndRelationsUpdate(titre)
    expect(hasChanged).toEqual(true)
    expect(slug).toEqual('m-ar-titre-nom-0000')

    const titreDb = await titreGet(titre.id, { fields: {} }, userSuper)
    expect(titreDb.slug).toEqual(slug)
  })

  test('ne met pas à jour le slug d’un titre existant', async () => {
    await Titres.query().delete()

    const titre = await titreAdd({
      nom: 'titre-nom',
      domaineId: 'm',
      typeId: 'arm',
      propsTitreEtapesIds: {},
      slug: 'm-ar-titre-nom-0000'
    } as ITitre)

    const { hasChanged, slug } = await titreSlugAndRelationsUpdate(titre)
    expect(hasChanged).toEqual(false)
    expect(slug).toEqual(titre.slug)

    const titreDb = await titreGet(titre.id, { fields: {} }, userSuper)
    expect(titreDb.slug).toEqual(slug)
  })

  test('génère un slug différent si le slug existe déjà', async () => {
    await Titres.query().delete()

    const titrePojo = {
      nom: 'titre-nom',
      domaineId: 'm',
      typeId: 'arm',
      propsTitreEtapesIds: {}
    } as ITitre

    let titre = await titreAdd(objectClone(titrePojo))
    const { slug: firstSlug } = await titreSlugAndRelationsUpdate(titre)
    titre = await titreAdd(titrePojo)

    const { hasChanged, slug: secondSlug } = await titreSlugAndRelationsUpdate(
      titre
    )
    expect(hasChanged).toEqual(true)
    expect(secondSlug).not.toEqual(firstSlug)
    expect(secondSlug.startsWith(firstSlug)).toBeTruthy()
  })

  test('génère un slug pour une démarche', async () => {
    await Titres.query().delete()

    const titre = await titreAdd({
      nom: 'titre-nom',
      domaineId: 'm',
      typeId: 'arm',
      propsTitreEtapesIds: {},
      slug: 'm-ar-titre-nom-0000',
      demarches: [
        {
          typeId: 'oct',
          statutId: 'dep',
          slug: 'slug'
        }
      ]
    } as ITitre)

    const { slug, hasChanged } = await titreSlugAndRelationsUpdate(titre)

    expect(hasChanged).toEqual(true)
    expect(slug).toEqual(titre.slug)

    const titreDb = await titreGet(
      titre.id,
      { fields: { demarches: { id: {} } } },
      userSuper
    )
    expect(titreDb.slug).toEqual(slug)
    expect(titreDb.demarches![0].slug).toEqual('m-ar-titre-nom-0000-oct01')
  })
})
