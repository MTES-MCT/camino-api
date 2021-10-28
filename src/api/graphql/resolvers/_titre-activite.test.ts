import {
  productionCheck,
  titreActiviteAdministrationsEmailsGet
} from './_titre-activite'
import { IAdministration } from '../../../types'

describe('teste la construction des emails lors du dépôt d’une activité', () => {
  describe('teste le calcul des emails des administrations', () => {
    test.each`
      administrations
      ${null}
      ${undefined}
      ${[]}
      ${[{ activitesTypesEmails: null }]}
      ${[{ activitesTypesEmails: undefined }]}
      ${[{ activitesTypesEmails: [] }]}
      ${[{ activitesTypesEmails: [{ id: 'grx', email: '' }] }]}
      ${[{ activitesTypesEmails: [{ id: 'gra', email: 'toto@foo.bar' }] }]}
      ${[{ typeId: 'aut', activitesTypesEmails: [{ id: 'grx', email: 'toto@foo.bar' }] }]}
    `('qu’on envoie pas d’emails', ({ administrations }) => {
      expect(
        titreActiviteAdministrationsEmailsGet(administrations, 'grx', undefined)
      ).toHaveLength(0)
    })

    test.each`
      typeId   | envoie
      ${'min'} | ${true}
      ${'dre'} | ${true}
      ${'dea'} | ${true}
      ${'pre'} | ${false}
      ${'ope'} | ${false}
      ${'aut'} | ${false}
    `(
      'si la production est nulle on envoie des emails que aux ministères et au DREAL',
      ({ typeId, envoie }) => {
        expect(
          titreActiviteAdministrationsEmailsGet(
            [
              {
                typeId,
                activitesTypesEmails: [{ id: 'grx', email: 'toto@foo.bar' }]
              } as IAdministration
            ],
            'grx',
            undefined
          )
        ).toHaveLength(envoie ? 1 : 0)
      }
    )
  })

  describe('teste le calcul de la production', () => {
    test.each`
      typeId   | positive
      ${'pma'} | ${true}
      ${'pmd'} | ${true}
      ${'pmb'} | ${true}
      ${'pmc'} | ${true}
      ${'grx'} | ${false}
      ${'wrp'} | ${false}
      ${'grp'} | ${false}
      ${'gra'} | ${false}
    `(
      'la production est positive sur les type d’activités sans exploitation',
      ({ typeId, positive }) => {
        expect(productionCheck(typeId, undefined)).toEqual(!!positive)
      }
    )

    test.each`
      contenu                                          | positive
      ${undefined}                                     | ${false}
      ${{}}                                            | ${false}
      ${{ substancesFiscales: undefined }}             | ${false}
      ${{ substancesFiscales: {} }}                    | ${false}
      ${{ substancesFiscales: { auru: 0 } }}           | ${false}
      ${{ substancesFiscales: { auru: 10 } }}          | ${true}
      ${{ substancesFiscales: { iiii: 0, auru: 10 } }} | ${true}
    `('teste la production des GRX et GRA', ({ contenu, positive }) => {
      ;['grx', 'gra'].forEach(typeId =>
        expect(productionCheck(typeId, contenu)).toEqual(!!positive)
      )
    })

    test.each`
      contenu                                         | positive
      ${undefined}                                    | ${false}
      ${{}}                                           | ${false}
      ${{ renseignements: undefined }}                | ${false}
      ${{ renseignements: {} }}                       | ${false}
      ${{ renseignements: { orExtrait: undefined } }} | ${false}
      ${{ renseignements: { orExtrait: 0 } }}         | ${false}
      ${{ renseignements: { orExtrait: 232 } }}       | ${true}
    `('teste la production des GRP', ({ contenu, positive }) => {
      expect(productionCheck('grp', contenu)).toEqual(!!positive)
    })

    test.each`
      contenu                                                                                      | positive
      ${undefined}                                                                                 | ${false}
      ${{}}                                                                                        | ${false}
      ${{ renseignementsProduction: undefined }}                                                   | ${false}
      ${{ renseignementsProduction: {} }}                                                          | ${false}
      ${{ renseignementsProduction: { masseGranulatsExtrait: 0, volumeGranulatsExtrait: 0 } }}     | ${false}
      ${{ renseignementsProduction: { masseGranulatsExtrait: 222, volumeGranulatsExtrait: 0 } }}   | ${true}
      ${{ renseignementsProduction: { masseGranulatsExtrait: 0, volumeGranulatsExtrait: 232 } }}   | ${true}
      ${{ renseignementsProduction: { masseGranulatsExtrait: 222, volumeGranulatsExtrait: 232 } }} | ${true}
    `('teste la production des WRP', ({ contenu, positive }) => {
      expect(productionCheck('wrp', contenu)).toEqual(!!positive)
    })
  })
})
