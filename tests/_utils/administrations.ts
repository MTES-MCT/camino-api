import {
  IAdministration,
  IEtapeType,
  ITitreEtape,
  ITitreStatut,
  ITitreType
} from '../../src/types'

const administrations = require('../../sources/administrations.json')

const titresTypes = require('../../sources/titres-types.json')
const titresStatuts = require('../../sources/titres-statuts.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes = require('../../sources/administrations--titres-types.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__titresStatuts = require('../../sources/administrations--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__etapesTypes = require('../../sources/administrations--titres-types--etapes-types.json')

const etapesTypes = require('../../sources/etapes-types.json')

const administrationsWithRelations = (administrations as IAdministration[]).map(
  (a: IAdministration) => {
    a.titresTypes = administrations__titresTypes
      .filter(
        (att: {
          administrationId: string
          titreTypeId: string
          gestionnaire: boolean
          associee: boolean
        }) => att.administrationId === a.id
      )
      .map(
        (att: {
          administrationId: string
          titreTypeId: string
          gestionnaire: boolean
          associee: boolean
        }) => {
          const titreType = titresTypes.find(
            (tt: ITitreType) => att.titreTypeId === tt.id
          )
          if (att.associee) {
            titreType.associee = true
          }

          if (att.gestionnaire) {
            titreType.gestionnaire = true
          }

          return titreType
        }
      )

    a.titresTypesTitresStatuts = administrations__titresTypes__titresStatuts
      .filter(
        (attts: {
          administrationId: string
          titreTypeId: string
          titreStatutId: string
        }) => attts.administrationId === a.id
      )
      .map(
        (attts: {
          administrationId: string
          titreTypeId: string
          titreStatutId: string
          titreType?: ITitreType
          titreStatut?: ITitreStatut
        }) => {
          attts.titreType = titresTypes.find(
            (tt: ITitreType) => tt.id === attts.titreTypeId
          )
          attts.titreStatut = titresStatuts.find(
            (ts: ITitreStatut) => ts.id === attts.titreStatutId
          )

          return attts
        }
      )

    a.titresTypesEtapesTypes = administrations__titresTypes__etapesTypes
      .filter(
        (attet: {
          administrationId: string
          titreTypeId: string
          etapeTypeId: string
        }) => attet.administrationId === a.id
      )
      .map(
        (attet: {
          administrationId: string
          titreTypeId: string
          etapeTypeId: string
          titreType?: ITitreType
          etapeType?: IEtapeType
        }) => {
          attet.titreType = titresTypes.find(
            (tt: ITitreType) => tt.id === attet.titreTypeId
          )
          attet.etapeType = etapesTypes.find(
            (te: ITitreEtape) => te.id === attet.etapeTypeId
          )

          return attet
        }
      )

    return a
  }
)

export default administrationsWithRelations
