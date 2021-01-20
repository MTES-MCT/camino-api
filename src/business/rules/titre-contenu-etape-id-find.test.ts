import { ITitreDemarche } from '../../types'
import { titreContenuEtapeIdFind } from './titre-contenu-etape-id-find'

describe("id de l'étape qui a un contenu", () => {
  test("retourne null si aucune étape n'est trouvé", () => {
    const etapeId1 = titreContenuEtapeIdFind(
      [{ id: 'demarche-id', etapes: [{ id: 'etape-id' }] }] as ITitreDemarche[],
      'val',
      'arm',
      'mecanisee'
    )

    const etapeId2 = titreContenuEtapeIdFind(
      [
        {
          id: 'demarche-id',
          statutId: 'acc',
          etapes: [{ id: 'etape-id', statutId: 'bof' }]
        }
      ] as ITitreDemarche[],
      'val',
      'arm',
      'mecanisee'
    )

    const etapeId3 = titreContenuEtapeIdFind(
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'pro',
          phase: {
            dateDebut: '2020-01-01',
            dateFin: '2020-01-02',
            statutId: 'val',
            titreDemarcheId: 'demarche-id'
          },
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-01',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        }
      ] as ITitreDemarche[],
      'mod',
      'arm',
      'mecanisee'
    )

    expect(etapeId1).toBeNull()
    expect(etapeId2).toBeNull()
    expect(etapeId3).toBeNull()
  })

  test("retourne l'id de l'étape si elle existe", () => {
    const etapeId1 = titreContenuEtapeIdFind(
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'oct',
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-03',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        },
        {
          id: 'demarche-id-2',
          titreId: 'titre-id',
          typeId: 'pro',
          etapes: [
            {
              id: 'etape-id-2',
              titreDemarcheId: 'demarche-id',
              typeId: 'dex',
              date: '2020-01-01',
              statutId: 'dex'
            }
          ]
        }
      ] as ITitreDemarche[],
      'val',
      'arm',
      'mecanisee'
    )

    const etapeId2 = titreContenuEtapeIdFind(
      [
        {
          id: 'demarche-id',
          titreId: 'titre-id',
          typeId: 'pro',
          etapes: [
            {
              id: 'etape-id',
              titreDemarcheId: 'demarche-id',
              typeId: 'dpu',
              date: '2020-01-01',
              statutId: 'acc',
              contenu: { arm: { mecanisee: true } }
            }
          ]
        }
      ] as ITitreDemarche[],
      'mod',
      'arm',
      'mecanisee'
    )

    expect(etapeId1).toEqual('etape-id')
    expect(etapeId2).toEqual('etape-id')
  })
})
