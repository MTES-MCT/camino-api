import slugify from '@sindresorhus/slugify'

import {
  ITitre,
  ITitreActivite,
  ITitreDemarche,
  ITitreEtape,
  ITitrePoint,
  ITitrePointReference,
  IUtilisateur
} from '../../types'

import titreDemarcheSortAsc from './titre-elements-sort-asc'
import titreEtapesSortAsc from './titre-etapes-sort-asc'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'
import { titresGet, titreUpdate } from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'
import cryptoRandomString from 'crypto-random-string'
import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import {
  titrePointReferenceUpdate,
  titrePointUpdate
} from '../../database/queries/titres-points'
import { titreActiviteUpdate } from '../../database/queries/titres-activites'

const titreSlugFind = (titre: ITitre) => {
  const { domaineId, type, nom } = titre
  const demarcheOctroiDateDebut = titreDemarcheOctroiDateDebutFind(
    titre.demarches
  )

  return slugify(
    `${domaineId}-${type!.typeId}-${nom}-${demarcheOctroiDateDebut.slice(0, 4)}`
  )
}

const titreDemarcheSlugFind = (
  titreDemarche: ITitreDemarche,
  titre: ITitre
) => {
  const titreDemarcheTypeOrder =
    titreDemarcheSortAsc(
      titre.demarches!.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.slug}-${titreDemarche.typeId}${titreDemarcheTypeOrder
    .toString()
    .padStart(2, '0')}`
}

const titreDemarcheEtapeSlugFind = (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche
) => titreEtapeSlugFind(titreEtape, titreDemarche, titreDemarche.etapes!)

const titreEtapeSlugFind = (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  etapes: ITitreEtape[]
) => {
  const titreEtapeTypeOrder =
    titreEtapesSortAsc(
      etapes.filter(e => e.typeId === titreEtape.typeId)
    ).findIndex(e => e === titreEtape) + 1

  return `${titreDemarche.slug}-${titreEtape.typeId}${titreEtapeTypeOrder
    .toString()
    .padStart(2, '0')}`
}

const titrePointSlugFind = (titrePoint: ITitrePoint, titreEtape: ITitreEtape) =>
  `${titreEtape.slug}-g${titrePoint.groupe
    .toString()
    .padStart(2, '0')}-c${titrePoint.contour
    .toString()
    .padStart(2, '0')}-p${titrePoint.point.toString().padStart(3, '0')}`

const titrePointReferenceSlugFind = (
  titrePointReference: ITitrePointReference,
  titrePoint: ITitrePoint
) => `${titrePoint.slug}-${titrePointReference.geoSystemeId}`

const titreActiviteSlugFind = (titreActivite: ITitreActivite, titre: ITitre) =>
  `${titre.slug}-${titreActivite.typeId}-${
    titreActivite.annee
  }-${titreActivite.periodeId.toString().padStart(2, '0')}`

interface ITitreRelation {
  name: string
  slugFind: (...args: any[]) => string
  update:
    | ((
        id: string,
        element: { slug: string },
        user: IUtilisateur
      ) => Promise<any>)
    | ((
        id: string,
        element: { slug: string },
        user: IUtilisateur,
        titreId: string
      ) => Promise<any>)
  relations?: ITitreRelation[]
}

const titreRelations: ITitreRelation[] = [
  {
    name: 'demarches',
    slugFind: titreDemarcheSlugFind,
    update: titreDemarcheUpdate,
    relations: [
      {
        name: 'etapes',
        slugFind: titreDemarcheEtapeSlugFind,
        update: titreEtapeUpdate,
        relations: [
          {
            name: 'points',
            slugFind: titrePointSlugFind,
            update: titrePointUpdate,
            relations: [
              {
                name: 'references',
                update: titrePointReferenceUpdate,
                slugFind: titrePointReferenceSlugFind
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'activites',
    update: titreActiviteUpdate,
    slugFind: titreActiviteSlugFind
  }
]

const relationsSlugsUpdate = async (
  parent: any,
  relations: ITitreRelation[],
  titreId: string
): Promise<boolean> => {
  let hasChanged = false
  for (const relation of relations) {
    for (const element of parent[relation.name]) {
      const slug = relation.slugFind(element, parent)
      if (slug !== element.slug) {
        await relation.update(element.id, { slug }, userSuper, titreId)
        hasChanged = true
      }
      if (relation.relations) {
        hasChanged =
          (await relationsSlugsUpdate(
            { ...element, slug },
            relation.relations,
            titreId
          )) || hasChanged
      }
    }
  }

  return hasChanged
}

const titreSlugAndRelationsUpdate = async (
  titre: ITitre
): Promise<{ hasChanged: boolean; slug: string }> => {
  let slug = titreSlugFind(titre)
  let doublonTitreId: string | null = null
  let hasChanged = false

  const titreWithTheSameSlug = await titresGet(
    { slugs: [slug] },
    { fields: { id: {} } },
    userSuper
  )

  if (
    titreWithTheSameSlug?.length > 1 ||
    (titreWithTheSameSlug?.length === 1 &&
      titreWithTheSameSlug[0].id !== titre.id)
  ) {
    if (!titre.slug?.startsWith(slug)) {
      slug += `-${cryptoRandomString({ length: 8 })}`
      doublonTitreId = titreWithTheSameSlug[0].id
    } else {
      slug = titre.slug
    }
  }

  if (titre.slug !== slug) {
    await titreUpdate(titre.id, { slug, doublonTitreId })
    hasChanged = true
  }

  hasChanged =
    (await relationsSlugsUpdate(
      { ...titre, slug },
      titreRelations,
      titre.id
    )) || hasChanged

  return { hasChanged, slug }
}

export { titreSlugAndRelationsUpdate }
