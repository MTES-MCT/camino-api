import '../../init'
import Titres from '../../database/models/titres'
import options from '../../database/queries/_options'
import {
  IContenu,
  IDemarcheType,
  IDocument,
  IEntreprise,
  IEtapeType,
  IFields,
  IHeritageContenu,
  IHeritageProps,
  ISubstance,
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  ITitreIncertitudes,
  ITitrePoint,
  ITitreSubstance
} from '../../types'
import DemarchesTypes from '../../database/models/demarches-types'
import TitresTypesDemarchesTypes from '../../database/models/titres-types--demarches-types'
import TitresTypesDemarchesTypesEtapesTypes from '../../database/models/titres-types--demarches-types-etapes-types'
import { titreDelete, titreGet } from '../../database/queries/titres'
import { objectClone } from '../../tools'
import { titreEtapePropsIds } from '../../business/utils/titre-etape-heritage-props-find'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'
import EtapesTypes from '../../database/models/etapes-types'
import { entreprisesGet } from '../../database/queries/entreprises'
import Entreprises from '../../database/models/entreprises'
import { userSuper } from '../../database/user-super'
import dirCreate from '../../tools/dir-create'
import fs from 'fs'
import { titreFichiersDelete } from '../../api/graphql/resolvers/_titre-document'
// import dirCreate from '../../tools/dir-create'
// import fileRename from '../../tools/file-rename'
import slugify from '@sindresorhus/slugify'
import cryptoRandomString from 'crypto-random-string'

/* eslint-disable camelcase */

interface IDemarcheMimausa {
  'nom titre': string
  type_titre: string
  date_dex_acte: string
  'type démarche': string
  'ref IRSN Mimausa': string
  statut_démarche: string
  superficie?: string
  durée?: string
  date_dpu_jorf: string
  date_fin?: string
  Camino?: string
  engagementinancier?: number
  type: string
  desc_doc: string
  nor: string
  'code fichier': string
  siren_titulaire: string
}

// TODO vérifier la reprise avec https://camino.beta.gouv.fr/titres/r-pr-lauziere-1979
// TODO vérifier la reprise avec https://camino.beta.gouv.fr/titres/r-px-tesson-la-garenne-1972

const demarches: IDemarcheMimausa[] = require('../../../sources/titres-demarches-mimausaon')
const domaineId = 'r'
let demarcheTypes = [] as IDemarcheType[]
let etapeTypeDPU = null as IEtapeType | null
let etapeTypeDEX = null as IEtapeType | null
let entrepriseNumber = 300000000

const titreFichiersDeleteFieldsAdd = (fields: IFields) => {
  if (!fields.demarches) {
    fields.demarches = {}
  }
  if (!fields.demarches.etapes) {
    fields.demarches.etapes = {}
  }
  if (!fields.demarches.etapes.documents) {
    fields.demarches.etapes.documents = {}
  }
  if (!fields.demarches.etapes.documents.type) {
    fields.demarches.etapes.documents.type = { id: {} }
  }

  if (!fields.travaux) {
    fields.travaux = {}
  }
  if (!fields.travaux.etapes) {
    fields.travaux.etapes = {}
  }
  if (!fields.travaux.etapes.documents) {
    fields.travaux.etapes.documents = {}
  }
  if (!fields.travaux.etapes.documents.type) {
    fields.travaux.etapes.documents.type = { id: {} }
  }

  if (!fields.activites) {
    fields.activites = {}
  }
  if (!fields.activites.documents) {
    fields.activites.documents = {}
  }
  if (!fields.activites.documents.type) {
    fields.activites.documents.type = { id: {} }
  }

  return fields
}

const titreIdGet = (
  domaineId: string,
  typeId: string,
  titreNom: string,
  date: string
) => {
  return slugify(`${domaineId}-${typeId}-${titreNom}-${date.slice(0, 4)}`)
}

const demarcheTypeIdGet = (demarcheTypeNom: string) => {
  const demarcheType = demarcheTypes.find(dt => dt.nom === demarcheTypeNom)

  if (demarcheType) {
    return demarcheType.id
  }
  throw new Error(`Type de démarche ${demarcheTypeNom} inconnu`)
}

const etapeGet = async (
  typeId: string,
  statutId: string,
  titreDemarcheId: string,
  demarcheType: IDemarcheType,
  titreTypeId: string,
  date: string,
  dateFin: string | null,
  surface: string | null,
  duree: string | null,
  substances: ISubstance[] | null,
  titulaires: IEntreprise[] | null,
  document: IDocument | null,
  docCode?: string,
  points?: ITitrePoint[] | null,
  engagement?: number | null
) => {
  const incertitudes = {} as ITitreIncertitudes

  if (titulaires?.length) {
    incertitudes.titulaires = true
  }

  const id = `${titreDemarcheId}-${typeId}01`

  if (points?.length) {
    // on reset les ids
    points = objectClone(points).map((p: ITitrePoint) => {
      p.id = `${id}-${cryptoRandomString({ length: 8 })}`
      p.titreEtapeId = id

      p.references = p.references.map(r => {
        r.id = `${p.id}-${cryptoRandomString({ length: 8 })}`
        r.titrePointId = p.id

        return r
      })

      return p
    })
  }

  const sections = etapeTypeSectionsFormat(
    typeId === 'dpu' ? etapeTypeDPU! : etapeTypeDEX!,
    demarcheType.etapesTypes,
    titreTypeId
  )

  let contenu = null as IContenu | null
  if (engagement) {
    if (!sections.find(s => s.id === 'prx')) {
      console.error('engagement introuvable dans les sections')
    } else {
      contenu = { prx: { engagement, engagementDeviseId: 'FRF' } }
    }
  }

  let heritageContenu = null as IHeritageContenu | null
  if (sections) {
    heritageContenu = {}
    sections.forEach(s => {
      heritageContenu![s.id] = {}
      s.elements?.forEach(e => {
        heritageContenu![s.id][e.id] = { actif: false }
      })
    })
  }

  if (document) {
    const hash = cryptoRandomString({ length: 8 })
    document.id = `${date}-${document.typeId}-${hash}`
    document.date = date
    document.titreEtapeId = id

    const dirPath = `files/demarches/${document.titreEtapeId}`
    await dirCreate(dirPath)
    const docPath = `${dirPath}/${document.id}.${document.fichierTypeId}`

    if (!fs.existsSync(`sources/files-mimausa/${docCode}.pdf`)) {
      console.error(`sources/files-mimausa/${docCode}.pdf introuvable`)
    }
    fs.copyFileSync(`sources/files-mimausa/${docCode}.pdf`, docPath)
  }

  const documents = document ? [objectClone(document)] : null

  return {
    id,
    titreDemarcheId: titreDemarcheId,
    typeId,
    statutId,
    ordre: 1,
    date,
    dateFin,
    duree: duree ? parseInt(duree) * 12 : undefined,
    surface: surface ? parseFloat(surface.replace(',', '.')) : undefined,
    points,
    substances,
    titulaires,
    incertitudes,
    heritageProps: titreEtapePropsIds.reduce((acc, propId) => {
      acc[propId] = { actif: false }

      return acc
    }, {} as IHeritageProps),
    contenu,
    heritageContenu,
    documents
  }
}

const etapesGet = async (
  demarche: IDemarcheMimausa,
  titreDemarcheId: string,
  titreTypeId: string,
  demarcheType: IDemarcheType,
  points?: ITitrePoint[] | null
): Promise<ITitreEtape[]> => {
  const surface =
    demarche.superficie && demarche.superficie !== 'NULL'
      ? demarche.superficie
      : null
  const duree =
    demarche.durée && demarche.durée !== 'NULL' ? demarche.durée : null
  const dateFin =
    demarche.date_fin && demarche.date_fin !== 'NULL' ? demarche.date_fin : null

  const statutId = demarche.statut_démarche === 'rejeté' ? 'rej' : 'acc'

  const substances = ['uran', 'rxxx', 'scor'].map(
    (s, index) =>
      ({
        id: s,
        ordre: index
      } as ITitreSubstance)
  )

  const engagement = demarche.engagementinancier
    ? Number(demarche.engagementinancier)
    : null

  const document: IDocument = {
    // l’id, l’etapeId et la date sont mis dans l’étape
    id: '',
    date: '',
    titreEtapeId: '',
    typeId: demarche.type,
    fichierTypeId: 'pdf',
    description: demarche.desc_doc,
    nor: demarche.nor,
    fichier: true,
    publicLecture: true,
    entreprisesLecture: true
  }

  let titulaires = [] as IEntreprise[]

  if (demarche.siren_titulaire) {
    let entreprises = await entreprisesGet(
      { noms: demarche.siren_titulaire },
      { fields: {} },
      userSuper
    )
    if (!entreprises?.length) {
      console.info(`Nouvelle entreprise ${demarche.siren_titulaire}`)
      const titulaireId = `xx-${entrepriseNumber}`
      entrepriseNumber++
      const newEntreprise = await Entreprises.query().insertGraphAndFetch({
        id: titulaireId,
        nom: demarche.siren_titulaire,
        archive: true
      })
      entreprises = [newEntreprise]
    }
    titulaires = entreprises
  }

  const etapes = [
    await etapeGet(
      'dpu',
      statutId,
      titreDemarcheId,
      demarcheType,
      titreTypeId,
      demarche.date_dpu_jorf,
      dateFin,
      surface,
      duree,
      substances,
      titulaires,
      document,
      demarche['code fichier'],
      points,
      engagement
    ),
    await etapeGet(
      'dex',
      statutId,
      titreDemarcheId,
      demarcheType,
      titreTypeId,
      demarche.date_dex_acte,
      null,
      null,
      null,
      null,
      null,
      null
    )
  ]

  return etapes
}

const demarcheGet = async (
  demarche: IDemarcheMimausa,
  titreId: string,
  titreTypeId: string,
  oldTitre: ITitre,
  index: number
): Promise<ITitreDemarche> => {
  const typeId = demarcheTypeIdGet(demarche['type démarche'])
  const id = `${titreId}-${typeId.slice(0, 3)}0${index}`

  let points = null as ITitrePoint[] | null | undefined
  if (oldTitre) {
    const oldDemarche = oldTitre.demarches?.find(d => d.typeId === typeId)
    if (oldDemarche) {
      points = oldDemarche.etapes!.find(e => e.typeId === 'dpu')!.points
    }
  }

  const demarcheType = await DemarchesTypes.query()
    .findById(typeId)
    .withGraphFetched('etapesTypes')

  return {
    id,
    titreId,
    typeId,
    statutId: 'ind',
    etapes: await etapesGet(demarche, id, titreTypeId, demarcheType, points)
  }
}

const main = async () => {
  console.time('Import Titres Mimausa')

  // Ajout des titresTypes_demarchesTypes manquants
  await TitresTypesDemarchesTypes.query().insertGraph({
    titreTypeId: 'prr',
    demarcheTypeId: 'exs',
    delaiRecours: 2
  })
  await TitresTypesDemarchesTypes.query().insertGraph({
    titreTypeId: 'pxr',
    demarcheTypeId: 'prr',
    delaiRecours: 2
  })
  await TitresTypesDemarchesTypes.query().insertGraph({
    titreTypeId: 'prr',
    demarcheTypeId: 'prr',
    delaiRecours: 2
  })

  const tdeManquants = [
    { titreTypeId: 'prr', demarcheTypeId: 'prr' },
    { titreTypeId: 'pxr', demarcheTypeId: 'prr' },
    { titreTypeId: 'prr', demarcheTypeId: 'exs' },
    { titreTypeId: 'prr', demarcheTypeId: 'ret' }
  ]

  for (const { titreTypeId, demarcheTypeId } of tdeManquants) {
    await TitresTypesDemarchesTypesEtapesTypes.query().insertGraph({
      titreTypeId,
      demarcheTypeId,
      etapeTypeId: 'dex',
      ordre: 50
    })
    await TitresTypesDemarchesTypesEtapesTypes.query().insertGraph({
      titreTypeId,
      demarcheTypeId,
      etapeTypeId: 'dpu',
      ordre: 100
    })
  }

  demarcheTypes = await DemarchesTypes.query()
  etapeTypeDPU = await EtapesTypes.query().findById('dpu')
  etapeTypeDEX = await EtapesTypes.query().findById('dex')

  console.info(`${demarches.length} démarches à importer`)

  demarches.sort((a, b) => {
    if (a['nom titre'] > b['nom titre']) {
      return 1
    }
    if (a['nom titre'] < b['nom titre']) {
      return -1
    }
    if (a.type_titre > b.type_titre) {
      return 1
    }
    if (a.type_titre < b.type_titre) {
      return -1
    }
    if (a.date_dex_acte > b.date_dex_acte) {
      return 1
    }
    if (a.date_dex_acte < b.date_dex_acte) {
      return -1
    }

    if (
      (a['type démarche'] === 'mutation' ||
        b['type démarche'] === 'mutation') &&
      a['type démarche'] !== b['type démarche']
    ) {
      return 0
    }
    console.error(
      `2 démarches le même jour ${a['nom titre']} le ${a.date_dex_acte}`
    )

    return 0
  })

  const newTitres = []
  let prevTitreId = null
  let titre = null as ITitre | null
  let oldTitre = null as ITitre | null
  for (let i = 0; i < demarches.length; i++) {
    const demarche = demarches[i]

    const titreId = demarche.type_titre + demarche['nom titre']

    if (demarche.Camino?.length) {
      // récupération des périmètres déjà enregistrés en prod

      const oldId = demarche.Camino.slice(35)
      oldTitre = await titreGet(
        oldId,
        {
          fields: {
            demarches: { etapes: { points: { references: { id: {} } } } }
          }
        },
        userSuper
      )
      if (!oldTitre) {
        console.error(
          demarche.Camino,
          'url de Camino contenant un id inconnu de titre'
        )
      }
    } else {
      oldTitre = null
    }

    // Si on change de titre
    if (prevTitreId !== titreId || demarche['type démarche'] === 'octroi') {
      prevTitreId = titreId
      // Enregistre le titre en cours de création qui est maintenant complet
      if (titre) {
        newTitres.push(objectClone(titre))
      }

      if (demarche['type démarche'] !== 'octroi') {
        console.error('un titre doit commencer par un octroi')
        titre = null
      } else {
        const id = titreIdGet(
          domaineId,
          demarche.type_titre,
          demarche['nom titre'],
          demarche.date_dpu_jorf
        )

        const references = demarche['ref IRSN Mimausa']
          ? [
              {
                titreId: id,
                typeId: 'irs',
                nom: demarche['ref IRSN Mimausa']
              }
            ]
          : []

        const titreTypeId = `${demarche.type_titre}${domaineId}`
        // Nouveau titre
        titre = {
          id,
          nom: demarche['nom titre'],
          domaineId,
          statutId: 'ind',
          references,
          typeId: titreTypeId,
          demarches: [
            await demarcheGet(demarche, id, titreTypeId, oldTitre!, 0)
          ]
        } as ITitre
      }
    } else {
      // Nouvelle demarche sur le titre courant
      titre!.demarches!.push(
        await demarcheGet(
          demarche,
          titre!.id,
          titre!.typeId,
          oldTitre!,
          titre!.demarches!.length
        )
      )
    }
  }

  // On ajoute le dernier titre
  newTitres.push(objectClone(titre))

  for (const newTitre of newTitres) {
    const fields = titreFichiersDeleteFieldsAdd({ demarches: { id: {} } })

    const bddTitre = await titreGet(
      newTitre.id,
      {
        fields
      },
      userSuper
    )

    if (bddTitre) {
      bddTitre.demarches!.forEach(d => {
        if (
          !newTitre.demarches
            .map(({ typeId }: ITitreDemarche) => typeId)
            .includes(d.typeId)
        ) {
          console.warn(
            `le titre ${newTitre.id} va perdre la demarche ${d.typeId}`
          )
        }
      })
      await titreFichiersDelete(bddTitre)
      await titreDelete(newTitre.id)
    }
    // else {
    //     console.warn(`titre ${newTitre.id} introuvable`)
    //   }

    await Titres.query().insertGraph(newTitre, options.titres.update)
  }
  console.info(`${newTitres.length} titres importés`)
  console.timeEnd('Import Titres Mimausa')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
