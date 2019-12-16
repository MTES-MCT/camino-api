import 'dotenv/config'
import PQueue from 'p-queue'
import knex from '../../../database/index'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'

// in
// - id (String): l'id de l'administration
// - typeId (String): typeId de l'administration
// out
// - nouvel id de l'administration
// ex:
//       id              |  type_id   --> idNew
// 'dea-bfc-01'          | 'dre'      --> 'dre-bfc-01'
// 'prefecture-01053-01' | 'pre'      --> 'pre-01053-01'
// 'ope-onf-973-01'      | 'ope'      --> inchangé

const idNewFind = (id, typeId) =>
  id.replace(id.substring(0, id.indexOf('-')), typeId)

async function main() {
  try {
    // array des tables de relation concernées
    const relationTable = [
      'administrations__domaines',
      'restrictions__etapes_types__administrations',
      'restrictions__types__administrations',
      'restrictions__types__statuts__administrations',
      'titres_administrations_gestionnaires',
      'titres_administrations_locales',
      'utilisateurs__administrations'
    ]

    // const relations = [
    //   'administrations__domaines',
    //   'restrictions__etapes_types__administrations',
    //   'restrictions__types__administrations',
    //   'restrictions__types__statuts__administrations',
    //   'titres_administrations_gestionnaires',
    //   'titres_administrations_locales',
    //   'utilisateurs__administrations'
    // ]

    const administrations = await administrationsGet()

    const {
      administrationsNewInsertQueue,
      administrationDeleteQueue,
      administrationsRelationsInsertQueue
    } = administrations.reduce(
      (
        {
          administrationsNewInsertQueue,
          administrationDeleteQueue,
          administrationsRelationsInsertQueue
        },
        administration
      ) => {
        const idNew = idNewFind(administration.id, administration.typeId)

        if (idNew === administration.id) {
          return {
            administrationsNewInsertQueue,
            administrationDeleteQueue,
            administrationsRelationsInsertQueue
          }
        }

        const idOld = administration.id
        administration.id = idNew

        administrationsNewInsertQueue.add(() =>
          Administrations.query().insert(administration)
        )

        administrationDeleteQueue.add(async () =>
          Administrations.query().deleteById(idOld)
        )

        administrationsRelationsInsertQueue.addAll(
          relationTable.map(table => () =>
            knex(table)
              .update('administration_id', idNew)
              .where('administration_id', '=', idOld)
          )
        )

        return {
          administrationsNewInsertQueue,
          administrationDeleteQueue,
          administrationsRelationsInsertQueue
        }
      },
      {
        administrationsNewInsertQueue: new PQueue({
          concurrency: 100,
          autoStart: false
        }),
        administrationDeleteQueue: new PQueue({
          concurrency: 100,
          autoStart: false
        }),
        administrationsRelationsInsertQueue: new PQueue({
          concurrency: 100,
          autoStart: false
        })
      }
    )

    console.log('insert les nouvelles administrations')
    await administrationsNewInsertQueue.start()
    await administrationsNewInsertQueue.onIdle()

    console.log('insert les relations')
    await administrationsRelationsInsertQueue.start()
    await administrationsRelationsInsertQueue.onIdle()

    console.log('supprime les anciennes administrations')
    await administrationDeleteQueue.start()
    await administrationDeleteQueue.onIdle()

    console.log('mise à jour terminée')

    process.exit()
  } catch (e) {
    process.exit()
    console.log(e)
  }
}
main()
