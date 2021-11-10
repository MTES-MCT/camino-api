import {
  IAdministration,
  IDemarcheType,
  IEtapeType,
  IPermissionId,
  ITitre,
  ITitreTypeDemarcheTypeEtapeType
} from '../../src/types'

import { graphQLCall, queryImport } from './index'
import { administrationsWithRelations } from './administrations'

import Titres from '../../src/database/models/titres'
import DemarchesTypes from '../../src/database/models/demarches-types'
import options from '../../src/database/queries/_options'
import {
  etapeTypeGet,
  titreTypeDemarcheTypeEtapeTypeGet
} from '../../src/database/queries/metas'
import { titreEtapePropsIds } from '../../src/business/utils/titre-etape-heritage-props-find'
import { etapeTypeSectionsFormat } from '../../src/api/_format/etapes-types'

const visibleCheck = async (
  administrationId: string,
  visible: boolean,
  cible: 'titres' | 'demarches' | 'etapes',
  titreTypeId: string,
  locale: boolean,
  etapeTypeId?: string
) => {
  const titreQuery = queryImport('titre')

  const administration = administrationsWithRelations.find(
    a => a.id === administrationId
  )!

  const gestionnaire = administration.titresTypes?.some(
    tt => tt.id === titreTypeId && tt.gestionnaire
  )

  const titre = titreBuild(
    {
      titreId: `${titreTypeId}${
        locale ? '-local' : ''
      }-${cible}-admin-${administrationId}`,
      titreTypeId: titreTypeId
    },
    gestionnaire ? administrationId : undefined,
    locale ? administrationId : undefined,
    etapeTypeId
  )

  await Titres.query().insertGraph(titre, options.titres.update)

  const res = await graphQLCall(
    titreQuery,
    { id: titre.id },
    'admin',
    administration.id
  )

  if (cible === 'titres') {
    if (visible) {
      expect(res.body.data.titre).not.toBeNull()
      expect(res.body.data.titre.id).toEqual(titre.id)
    } else {
      expect(res.body.data.titre).toBeNull()
    }
  } else if (cible === 'demarches') {
    if (visible) {
      expect(res.body.data.titre.demarches).not.toBeNull()
      expect(res.body.data.titre.demarches![0]).not.toBeNull()
      expect(res.body.data.titre.demarches![0]!.id).toEqual(
        titre.demarches![0]!.id
      )
    } else {
      expect(res.body.data.titre ? res.body.data.titre.demarches : []).toEqual(
        []
      )
    }
  } else if (cible === 'etapes') {
    if (visible) {
      expect(res.body.data.titre.demarches![0]!.etapes).not.toBeNull()
      expect(res.body.data.titre.demarches![0]!.etapes![0]!.id).toEqual(
        titre.demarches![0]!.etapes![0]!.id
      )
    } else {
      expect(res.body.data.titre.demarches![0]!.etapes).toEqual([])
    }
  }

  expect(res.body.errors).toBeUndefined()
}

const creationCheck = async (
  administrationId: string,
  creer: boolean,
  cible: string,
  titreTypeId: string
) => {
  const administration = administrationsWithRelations.find(
    a => a.id === administrationId
  )!

  if (cible === 'titres') {
    const titre = {
      nom: `${titreTypeId}-${cible}-admin-${administrationId}`,
      typeId: titreTypeId,
      domaineId: titreTypeId.slice(-1)
    }

    const titreCreerQuery = queryImport('titre-creer')
    const res = await graphQLCall(
      titreCreerQuery,
      {
        titre
      },
      'admin',
      administration.id
    )

    if (creer) {
      expect(res.body.data).toMatchObject({
        titreCreer: { nom: titre.nom }
      })
    } else {
      expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
    }
  } else if (cible === 'demarches') {
    const titreCreated = await titreCreerSuper(administrationId, titreTypeId)
    const res = await demarcheCreerProfil(
      titreCreated.body.data.titreCreer.id,
      'admin',
      administration.id
    )

    if (creer) {
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({ demarcheCreer: {} })
    } else {
      expect(res.body.errors[0].message).toBe('droits insuffisants')
    }
  } else if (cible === 'etapes') {
    const titreCreated = await titreCreerSuper(administrationId, titreTypeId)

    const demarcheCreated = await demarcheCreerProfil(
      titreCreated.body.data.titreCreer.id,
      'super'
    )

    expect(demarcheCreated.body.errors).toBeUndefined()

    const etapeTypeId = 'mfr'
    const etapeType = (await etapeTypeGet(etapeTypeId, {
      fields: {}
    })) as IEtapeType

    const demarcheType = (await DemarchesTypes.query()
      .withGraphFetched(options.demarchesTypes.graph)
      .findById(
        demarcheCreated.body.data.demarcheCreer.demarches[0].type!.id
      )) as IDemarcheType

    const tde = (await titreTypeDemarcheTypeEtapeTypeGet(
      {
        titreTypeId: titreTypeId,
        demarcheTypeId: demarcheType.id,
        etapeTypeId: etapeType.id
      },
      { fields: { documentsTypes: { id: {} } } }
    )) as ITitreTypeDemarcheTypeEtapeType

    const sections = etapeTypeSectionsFormat(etapeType.sections, tde.sections)

    const heritageContenu = sections.reduce((acc, section) => {
      if (!acc[section.id]) {
        acc[section.id] = {}
      }

      section.elements?.forEach(e => {
        acc[section.id][e.id] = { actif: false }
      })

      return acc
    }, {} as any)

    const contenu = sections.reduce((acc, section) => {
      if (!acc[section.id]) {
        acc[section.id] = {}
      }

      section.elements?.forEach(e => {
        let value
        if (e.type === 'radio') {
          value = false
        } else if (e.type === 'text') {
          value = 'text'
        } else if (e.type === 'number' || e.type === 'integer') {
          value = 3
        } else if (e.type === 'select') {
          value = 'fakeId'
        }
        acc[section.id][e.id] = value
      })

      return acc
    }, {} as any)

    const titreDemarcheId =
      demarcheCreated.body.data.demarcheCreer.demarches[0].id

    const res = await graphQLCall(
      queryImport('titre-etape-creer'),
      {
        etape: {
          typeId: etapeTypeId,
          statutId: 'fai',
          titreDemarcheId,
          date: '',
          duree: 10,
          heritageProps: titreEtapePropsIds.reduce(
            (acc, prop) => {
              acc[prop] = { actif: false }

              return acc
            },
            {} as {
              [key: string]: { actif: boolean }
            }
          ),
          heritageContenu,
          contenu,
          substances: [{ id: 'auru' }],
          points: [
            {
              groupe: 1,
              contour: 1,
              point: 1,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 2,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 2 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 3,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 2, y: 1 } }
              ]
            },
            {
              groupe: 1,
              contour: 1,
              point: 4,
              references: [
                { geoSystemeId: '4326', coordonnees: { x: 1, y: 1 } }
              ]
            }
          ]
        }
      },
      'super'
    )

    if (creer) {
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({ etapeCreer: {} })
    } else {
      expect(res.body.errors[0].message).toBe(
        'droits insuffisants pour créer cette étape'
      )
    }
  }
}

const modificationCheck = async (
  administrationId: string,
  modifier: boolean,
  cible: string,
  titreTypeId: string,
  locale?: boolean,
  etapeTypeId?: string
) => {
  const administration = administrationsWithRelations.find(
    a => a.id === administrationId
  )!

  const gestionnaire = administration.titresTypes?.some(
    tt => tt.id === titreTypeId && tt.gestionnaire
  )
  const titre = titreBuild(
    {
      titreId: `${titreTypeId}${
        locale ? '-local' : ''
      }${etapeTypeId}-${cible}-modification-admin-${administrationId}`,
      titreTypeId: titreTypeId
    },
    gestionnaire ? administrationId : undefined,
    locale ? administrationId : undefined,
    etapeTypeId
  )
  await Titres.query().insertGraph(titre, options.titres.update)

  const res = await graphQLCall(
    queryImport('titre'),
    { id: titre.id },
    'admin',
    administration.id
  )

  if (cible === 'titres') {
    if (modifier) {
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data.titre).toMatchObject({
        modification: true
      })
    } else {
      expect(
        res.body.data.titre ? res.body.data.titre.modification : null
      ).toBeNull()
    }
  } else if (cible === 'demarches') {
    if (modifier) {
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data.titre.demarches![0]).toMatchObject({
        modification: true
      })
    } else {
      expect(res.body.errors).toBeUndefined()
      const demarches = res.body.data.titre.demarches
      const check = !demarches.length || !demarches[0].modification
      expect(check).toBeTruthy()
    }
  } else if (cible === 'etapes') {
    if (modifier) {
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data.titre.demarches![0]!.etapes![0]).toMatchObject({
        modification: true
      })
    } else {
      const etapes = res.body.data.titre.demarches![0]!.etapes
      const check = !etapes.length || !etapes[0].modification
      expect(check).toBeTruthy()
    }
  }
}

const titreCreerSuper = async (administrationId: string, titreTypeId: string) =>
  graphQLCall(
    queryImport('titre-creer'),
    {
      titre: {
        nom: `titre-${titreTypeId!}-cree-${administrationId!}`,
        typeId: titreTypeId!,
        domaineId: titreTypeId!.slice(-1)
      }
    },
    'super'
  )

const demarcheCreerProfil = async (
  titreId: string,
  profil: IPermissionId,
  administrationId?: string
) =>
  graphQLCall(
    queryImport('titre-demarche-creer'),
    { demarche: { titreId, typeId: 'oct' } },
    profil!,
    administrationId
  )

const titreBuild = (
  {
    titreId,
    titreTypeId
  }: {
    titreId: string
    titreTypeId: string
  },
  administrationIdGestionnaire?: string,
  administrationIdLocale?: string,
  etapeTypeId?: string
) => {
  const titre = {
    id: titreId,
    nom: 'nom titre',
    typeId: titreTypeId,
    statutId: 'val',
    domaineId: titreTypeId.slice(-1),
    propsTitreEtapesIds: { administrations: `${titreId}-demarche-id-etape-id` },
    demarches: [
      {
        id: `${titreId}-demarche-id`,
        titreId: titreId,
        typeId: 'oct',
        etapes: [
          {
            id: `${titreId}-demarche-id-etape-id`,
            typeId: etapeTypeId || 'mcr',
            ordre: 0,
            titreDemarcheId: `${titreId}-demarche-id`,
            statutId: 'enc',
            date: '2020-01-01',
            administrations: administrationIdLocale
              ? [{ id: administrationIdLocale }]
              : ([] as IAdministration[])
          }
        ]
      }
    ],
    publicLecture: false
  } as ITitre

  if (administrationIdGestionnaire) {
    titre.administrationsGestionnaires = [
      { id: administrationIdGestionnaire }
    ] as IAdministration[]
  }

  return titre
}

export { visibleCheck, creationCheck, modificationCheck }
