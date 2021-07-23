import '../../init'

import { knex } from '../../knex'
import Titres from '../../database/models/titres'
import TitresDemarches from '../../database/models/titres-demarches'
import TitresEtapes from '../../database/models/titres-etapes'
import TitresPoints from '../../database/models/titres-points'
import TitresPointsReferences from '../../database/models/titres-points-references'
import TitresActivites from '../../database/models/titres-activites'
import TitresTravaux from '../../database/models/titres-travaux'
import TitresTravauxEtapes from '../../database/models/titres-travaux-etapes'
import {
  titreDelete,
  titresGet,
  titreUpsert
} from '../../database/queries/titres'
import { userSuper } from '../../database/user-super'
import { Index, ITitre } from '../../types'
import idsUpdate from './ids-update'
import Objection, { Model, transaction } from 'objection'
import { idGenerate } from '../../database/models/_format/id-create'
import * as fs from 'fs'
import fileRename from '../../tools/file-rename'

const titreIdUpdate = async (titreOldId: string, titre: ITitre) => {
  const knex = Titres.knex()

  return transaction(knex, async tr => {
    await titreDelete(titreOldId, tr)

    await titreUpsert(titre, { fields: {} }, tr)
  })
}

const idFind = idGenerate

const titreRelation = {
  name: 'titre',
  idFind,
  relations: [
    {
      name: 'demarches',
      props: ['titreId'],
      idFind,
      relations: [
        {
          name: 'etapes',
          props: ['titreDemarcheId'],
          idFind,
          relations: [
            {
              props: ['heritageProps'],
              path: ['demarches', 'etapes']
            },
            {
              props: ['heritageContenu'],
              path: ['demarches', 'etapes']
            },
            {
              props: ['propsTitreEtapesIds'],
              path: []
            },
            {
              props: ['contenusTitreEtapesIds'],
              path: []
            },
            {
              name: 'points',
              props: ['id', 'titreEtapeId'],
              idFind,
              relations: [
                {
                  name: 'references',
                  idFind,
                  props: ['id', 'titrePointId']
                }
              ]
            }
          ]
        },
        {
          name: 'phase',
          props: ['titreDemarcheId']
        }
      ]
    },
    {
      name: 'activites',
      idFind,
      props: ['id', 'titreId']
    },
    {
      name: 'travaux',
      props: ['titreId'],
      idFind,
      relations: [
        {
          name: 'travauxEtapes',
          props: ['titreTravauxId'],
          idFind
        }
      ]
    }
  ]
}

const titreIdAndRelationsUpdate = (titre: ITitre) => {
  // permet de référencer tous les changements d'ids par type de relation
  // un index nom de relations => (index nouveaux ids => anciens ids)
  const relationsIdsUpdatedIndex = {}

  // met à jour les ids par effet de bord
  // retourne true si un id a changé
  const hasChanged = idsUpdate(
    relationsIdsUpdatedIndex,
    titre,
    titreRelation,
    titre
  )

  // l'objet `titre` n'est retourné que pour les tests,
  // il est modifié par effet de bord de toute façon
  return {
    titre,
    hasChanged,
    relationsIdsUpdatedIndex: relationsIdsUpdatedIndex
  }
}

const titreIdsUpdate = async (titre: ITitre) => {
  // les transaction en bdd ne peuvent être effectuées en parallèle
  // comment ça se passe si plusieurs utilisateurs modifient des titres en même temps ?

  const titreOldId = titre.id

  try {
    // met à jour les ids de titre par effet de bord
    // (titre n'est retourné que pour les tests, mais il est modifié de toute façon)
    const { titre: titreNew, hasChanged } = titreIdAndRelationsUpdate(titre)

    if (!hasChanged) return null

    titre = titreNew

    await titreIdUpdate(titreOldId, titre)

    const log = {
      type: 'titre : id (mise à jour) ->',
      value: titre.id
    }

    console.info(log.type, log.value)

    return { [titre.id]: titreOldId }
  } catch (e) {
    console.error(`erreur: titreIdsUpdate ${titreOldId}`, e)

    return null
  }
}

const titresIdsUpdate = async () => {
  console.info()
  console.info('ids de titres, démarches, étapes et sous-éléments…')
  const titres = await titresGet(
    {},
    {
      fields: {
        type: { type: { id: {} } },
        references: { id: {} },
        administrationsGestionnaires: { id: {} },
        demarches: {
          etapes: {
            points: { references: { id: {} } },
            documents: { id: {} },
            administrations: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { id: {} },
            communes: { id: {} },
            forets: { id: {} },
            justificatifs: { id: {} }
          },
          phase: { id: {} }
        },
        travaux: {
          travauxEtapes: {
            documents: { id: {} }
          }
        },
        activites: { documents: { id: {} } }
      }
    },
    userSuper
  )

  // les transactions `titreIdUpdate` ne peuvent être exécutées en parallèle
  const titresUpdatedIndex = {} as Index<string>

  for (const titre of titres) {
    const titreUpdatedIndex = await titreIdsUpdate(titre)

    if (titreUpdatedIndex) {
      Object.assign(titresUpdatedIndex, titreUpdatedIndex)
    }
  }

  return titresUpdatedIndex
}

const filesRenameAndClean = async <M extends Model & { id: string }>(
  directory: string,
  queryGet: (slug: string) => Objection.QueryBuilder<M, M>
) => {
  for (const file of fs.readdirSync(`./files/${directory}`)) {
    const element = await queryGet(file)
    if (element) {
      await fileRename(
        `files/${directory}/${file}`,
        `files/${directory}/${element.id}`
      )
    } else {
      const files = fs.readdirSync(`files/${directory}/${file}`)
      if (!files || !files.length) {
        fs.rmdirSync(`files/${directory}/${file}`)
      } else {
        console.error(`files/${directory}/${file} a encore des fichiers`)
      }
    }
  }
}

async function main() {
  const tablesWithSlug = [
    Titres.tableName,
    TitresDemarches.tableName,
    TitresEtapes.tableName,
    TitresPoints.tableName,
    TitresPointsReferences.tableName,
    TitresActivites.tableName,
    TitresTravaux.tableName,
    TitresTravauxEtapes.tableName
  ]

  for (const tableName of tablesWithSlug) {
    await knex.schema.alterTable(tableName, table => {
      table.string('slug').index()
    })

    await knex.table(tableName).update({
      slug: knex.ref('id')
    })
  }

  await titresIdsUpdate()

  await filesRenameAndClean('travaux', slug =>
    TitresTravauxEtapes.query().where('slug', slug).first()
  )
  await filesRenameAndClean('demarches', slug =>
    TitresEtapes.query().where('slug', slug).first()
  )
  await filesRenameAndClean('activites', slug =>
    TitresActivites.query().where('slug', slug).first()
  )

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
