import '../../init'
import {
  titreEtapeGet,
  titreEtapeUpsert,
  titresEtapesGet
} from '../../database/queries/titres-etapes'
import { ITitreEtape, ITitreIncertitudes } from '../../types'
import EtapesTypes from '../../database/models/etapes-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import TitresEtapes from '../../database/models/titres-etapes'
import TitresPoints from '../../database/models/titres-points'

const propertyValidate = (
  etape: ITitreEtape,
  etapePrecedenteFondamentale: ITitreEtape,
  prop: keyof ITitreEtape
) => {
  if (
    etapePrecedenteFondamentale[prop] &&
    etape[prop] &&
    etapePrecedenteFondamentale[prop] !== etape[prop]
  ) {
    return `${prop}; ${etapePrecedenteFondamentale[prop]}(${etapePrecedenteFondamentale.typeId}) --> ${etape[prop]}(${etape.typeId})`
  }

  return undefined
}

const incertitudesGet = (
  etape: ITitreEtape,
  etapeFondamentale: ITitreEtape,
  propId: keyof ITitreIncertitudes
) => {
  let incertitudes = etapeFondamentale.incertitudes

  if (etape.incertitudes) {
    if (!incertitudes) {
      incertitudes = {}
    }

    if (etape.incertitudes[propId]) {
      incertitudes[propId] = etape.incertitudes[propId]
    }
  }

  return incertitudes
}

const propertyArrayValidate = (
  etapePropValue: { id: string }[] | undefined | null,
  etapePrecedenteFondamentalePropValue: { id: string }[] | undefined | null,
  prop: keyof ITitreEtape
) => {
  let comparator = (({ id }: { id: string }) => id) as (obj: any) => string
  if (prop === 'points') {
    comparator = ({ coordonnees }: { coordonnees: string }) => coordonnees
  }

  if (
    etapePrecedenteFondamentalePropValue?.length &&
    etapePropValue?.length &&
    etapePropValue.map(comparator).sort().toString() !==
      etapePrecedenteFondamentalePropValue.map(comparator).sort().toString()
  ) {
    return `${prop}; ${etapePrecedenteFondamentalePropValue.map(
      ({ id }) => id
    )} --> ${etapePropValue.map(({ id }) => id)}`
  }

  return undefined
}

const etapePropUpdatedValidate = (
  etape: ITitreEtape,
  etapePrecedenteFondamentale: ITitreEtape
) => {
  const errors = [] as string[]
  const props = [
    'surface',
    'duree',
    'dateDebut',
    'dateFin'
  ] as (keyof ITitreEtape)[]
  props.forEach(prop => {
    // ajout d’une exception pour cette étape qui a des mauvaises données
    if (etape.id !== 'm-ax-crique-serpent-aval-2019-oct01-apo01') {
      const error = propertyValidate(etape, etapePrecedenteFondamentale, prop)
      if (error) {
        errors.push(error)
      }
    }
  })

  const propsArray = [
    'titulaires',
    'amodiataires',
    'substances',
    'points'
  ] as (keyof ITitreEtape)[]
  propsArray.forEach(prop => {
    const error = propertyArrayValidate(
      etape[prop] as { id: string }[],
      etapePrecedenteFondamentale[prop] as { id: string }[],
      prop
    )
    if (error) {
      errors.push(error)
    }
  })

  return errors
}

const main = async () => {
  // La def redevient fondamentale car elle est trop utilisée
  // de plus on met à jour sa date de fin pour l’utiliser le moins possible à l’avenir
  const etapesDef = await titresEtapesGet(
    { etapesTypesIds: ['def'] },
    {
      fields: {
        id: {}
      }
    },
    'super'
  )
  const latestEtapeDef = etapesDef.sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0]

  await EtapesTypes.query()
    .patch({ dateFin: latestEtapeDef.date, fondamentale: true })
    .orWhere('id', 'def')

  console.info(
    `L’étape type « def » est redevenu fondamentale et sa date de fin à été mis à jour: ${latestEtapeDef.date}`
  )

  // on bouge le date de fin présente sur les EOF en tant que date de l’étape
  // et on met l’ancienne date dans la nouvelle section
  const etapesEOF = await titresEtapesGet(
    { etapesTypesIds: ['eof'] },
    {
      fields: {
        demarche: { id: {} }
      }
    },
    'super'
  )
  let etapeEofMinDate = undefined as undefined | string
  let etapeEofMaxDate = undefined as undefined | string
  for (const etapeEOF of etapesEOF) {
    if (
      etapeEOF.titreDemarcheId.startsWith('m-ar') &&
      etapeEOF.demarche!.typeId === 'oct' &&
      etapeEOF.dateFin
    ) {
      const contenu = etapeEOF.contenu ? { ...etapeEOF.contenu } : {}
      if (!contenu.onf) {
        contenu.onf = {}
      }
      contenu.onf.dateDebut = etapeEOF.date

      await TitresEtapes.query()
        .patch({ date: etapeEOF.dateFin, dateFin: null, contenu })
        .where('id', etapeEOF.id)

      if (!etapeEofMinDate || etapeEofMinDate > etapeEOF.dateFin) {
        etapeEofMinDate = etapeEOF.dateFin
      }
      if (!etapeEofMaxDate || etapeEofMaxDate < etapeEOF.dateFin) {
        etapeEofMaxDate = etapeEOF.dateFin
      }

      console.info(`date de fin de l’étape ${etapeEOF.id} migrée`)
    }
  }

  // Ajouter une nouvelle section à l’eof pour les otrois d’ARM pour stocker la date du début de l’expertise
  const eofId = ['arm', 'oct', 'eof']
  const etapeTypeEOF = await TitresTypesDemarchesTypesEtapesTypes.query().findById(
    eofId
  )

  etapeTypeEOF
    .sections!.find(({ id }) => id === 'onf')!
    .elements!.push({
      id: 'dateDebut',
      nom: 'Date de début',
      type: 'date',
      description: 'Date de début de l’expertise',
      dateDebut: etapeEofMinDate,
      dateFin: etapeEofMaxDate
    })

  await TitresTypesDemarchesTypesEtapesTypes.query().patchAndFetchById(eofId, {
    sections: etapeTypeEOF.sections
  })

  console.info('Ajout d’une section pour l’eof des octrois d’ARM')

  let etapes = await titresEtapesGet(
    {},
    {
      fields: {
        type: { id: {} },
        incertitudes: { id: {} },
        titulaires: { id: {} },
        amodiataires: { id: {} },
        points: { references: { id: {} } },
        substances: { id: {} },
        demarche: {
          etapes: {
            id: {}
          }
        }
      }
    },
    'super'
  )
  etapes = etapes.filter(e => !e.type!.fondamentale)

  console.info(
    'Démarrage de la suppression des données fondamentales des étapes non fondamentales'
  )

  for (let i = 0; i < etapes.length; i++) {
    let errors = [] as string[]
    let etape = etapes[i] as ITitreEtape

    if (
      etape.titulaires?.length ||
      etape.amodiataires?.length ||
      etape.points?.length ||
      etape.substances?.length ||
      etape.surface ||
      etape.duree ||
      etape.dateDebut ||
      etape.dateFin
    ) {
      // On recharge l’étape, car sa démarche a peut-être été modifiée par une itération précédente
      etape = await titreEtapeGet(
        etape.id,
        {
          fields: {
            type: { id: {} },
            incertitudes: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            points: { references: { id: {} } },
            substances: { id: {} },
            demarche: {
              etapes: {
                type: { id: {} },
                titulaires: { id: {} },
                amodiataires: { id: {} },
                points: { id: {} },
                substances: { id: {} }
              }
            }
          }
        },
        'super'
      )

      if (!etape.demarche?.etapes) {
        throw new Error('pas possible')
      }

      let etapeFondamentale = undefined as ITitreEtape | undefined
      if (etape.demarche.etapes.length === 1) {
        errors.push('étape seule')
      } else if (
        etape.demarche.etapes.every(
          e =>
            !e.type!.fondamentale || !['acc', 'fai', 'fav'].includes(e.statutId)
        )
      ) {
        errors.push('pas d’autre étape fondamentale valide')
      } else {
        const index = etape.demarche.etapes.findIndex(
          ({ id }) => id === etape.id
        )
        const etapesPrecedentes = etape.demarche.etapes.slice(index + 1)
        const etapePrecedenteFondamentale = etapesPrecedentes.find(
          e =>
            e.type!.fondamentale && ['acc', 'fai', 'fav'].includes(e.statutId)
        )
        if (etapePrecedenteFondamentale) {
          errors = etapePropUpdatedValidate(etape, etapePrecedenteFondamentale)
          if (!errors.length) {
            etapeFondamentale = etapePrecedenteFondamentale
          }
        } else {
          const etapesSuivantes = etape.demarche.etapes.slice(0, index)
          const etapeSuivanteFondamentale = etapesSuivantes.find(
            e =>
              e.type!.fondamentale && ['acc', 'fai', 'fav'].includes(e.statutId)
          )
          if (etapeSuivanteFondamentale) {
            errors = etapePropUpdatedValidate(etapeSuivanteFondamentale, etape)
            if (!errors.length) {
              etapeFondamentale = etapeSuivanteFondamentale
            }
          }
        }
      }

      if (errors.length) {
        console.info(
          `https://camino.beta.gouv.fr/titres/${etape.demarche.titreId}; ${etape.id};`,
          errors.join('\n  - ')
        )
      }

      if (etapeFondamentale) {
        if (etape.surface) {
          etapeFondamentale.surface = etape.surface
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'surface'
          )
        }
        if (etape.duree) {
          etapeFondamentale.duree = etape.duree
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'duree'
          )
        }
        if (etape.dateDebut) {
          etapeFondamentale.dateDebut = etape.dateDebut
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'dateDebut'
          )
        }
        if (etape.dateFin) {
          etapeFondamentale.dateFin = etape.dateFin
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'dateFin'
          )
        }
        if (etape.titulaires?.length) {
          etapeFondamentale.titulaires = etape.titulaires
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'titulaires'
          )
        }
        if (etape.amodiataires?.length) {
          etapeFondamentale.amodiataires = etape.amodiataires
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'amodiataires'
          )
        }
        const pointsUpdated =
          etape.points?.length && !etapeFondamentale.points?.length
        if (pointsUpdated) {
          etapeFondamentale.points = etape.points!.map(p => {
            p.id = p.id.replace(etape.id, etapeFondamentale!.id)
            p.titreEtapeId = etapeFondamentale!.id

            p.references = p.references.map(r => {
              r.id = r.id.replace(etape.id, etapeFondamentale!.id)
              r.titrePointId = p.id

              return r
            })

            return p
          })
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'points'
          )
        }
        if (etape.substances?.length) {
          etapeFondamentale.substances = etape.substances
          etapeFondamentale.incertitudes = incertitudesGet(
            etape,
            etapeFondamentale,
            'substances'
          )
        }

        delete etapeFondamentale.type
        if (!pointsUpdated) {
          delete etapeFondamentale.points
        }
      }

      etape.surface = null
      etape.duree = null
      etape.dateDebut = null
      etape.dateFin = null
      etape.titulaires = []
      etape.amodiataires = []
      etape.substances = []

      if (etape.incertitudes) {
        etape.incertitudes.surface = null
        etape.incertitudes.duree = null
        etape.incertitudes.dateDebut = null
        etape.incertitudes.dateFin = null
        etape.incertitudes.titulaires = null
        etape.incertitudes.amodiataires = null
        etape.incertitudes.points = null
        etape.incertitudes.substances = null
      }

      delete etape.demarche
      delete etape.points

      await TitresPoints.query().delete().where('titreEtapeId', etape.id)
      await titreEtapeUpsert(etape)
      if (etapeFondamentale) {
        await titreEtapeUpsert(etapeFondamentale)
      }
      console.info(`migration de l’étape ${etape.id} terminée`)
    }
  }

  console.info(
    'Suppression des données fondamentales des étapes non fondamentales terminée'
  )
  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
