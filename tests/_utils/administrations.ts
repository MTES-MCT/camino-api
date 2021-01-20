/* eslint-disable camelcase */
import {
  IAdministration,
  IAdministrationTitreType,
  IAdministrationTitreTypeEtapeType,
  IAdministrationTitreTypeTitreStatut,
  IEtapeType,
  ITitreStatut,
  ITitreType
} from '../../src/types'

import { readFileSync } from 'fs'
import { join } from 'path'
interface ISources {
  administrations: {
    path: string
    data: (IAdministration & { type_id: string })[]
  }
  titresTypes: {
    path: string
    data: (ITitreType & { domaine_id: string; type_id: string })[]
  }
  titresStatuts: { path: string; data: ITitreStatut[] }
  administrations__titresTypes: {
    path: string
    data: (IAdministrationTitreType & {
      administration_id: string
      titre_type_id: string
    })[]
  }
  administrations__titresTypes__titresStatuts: {
    path: string
    data: (IAdministrationTitreTypeTitreStatut & {
      administration_id: string
      titre_type_id: string
      titre_statut_id: string
    })[]
  }
  administrations__titresTypes__etapesTypes: {
    path: string
    data: (IAdministrationTitreTypeEtapeType & {
      administration_id: string
      titre_type_id: string
      etape_type_id: string
    })[]
  }
  etapesTypes: { path: string; data: IEtapeType[] }
}

const sources = {
  administrations: { path: '../../sources/administrations.json', data: [] },
  titresTypes: { path: '../../sources/titres-types.json', data: [] },
  titresStatuts: { path: '../../sources/titres-statuts.json', data: [] },
  administrations__titresTypes: {
    path: '../../sources/administrations--titres-types.json',
    data: []
  },
  administrations__titresTypes__titresStatuts: {
    path: '../../sources/administrations--titres-types--titres-statuts.json',
    data: []
  },
  administrations__titresTypes__etapesTypes: {
    path: '../../sources/administrations--titres-types--etapes-types.json',
    data: []
  },
  etapesTypes: { path: '../../sources/etapes-types.json', data: [] }
} as ISources

const readFile = (filePath: string) =>
  JSON.parse(readFileSync(join(__dirname, filePath)).toString())

Object.keys(sources).forEach(name => {
  const element = sources[name as keyof ISources]

  element.data = readFile(element.path)
})

const administrationsWithRelations = sources.administrations.data.map(
  (a: IAdministration) => {
    a.titresTypes = sources.administrations__titresTypes.data
      .filter(att => att.administration_id === a.id)
      .map(att => {
        att.titreTypeId = att.titre_type_id
        att.administrationId = att.administration_id

        const titreType = sources.titresTypes.data.find(
          tt => att.titre_type_id === tt.id
        )!

        titreType.domaineId = titreType.domaine_id
        titreType.typeId = titreType.type_id

        if (att.associee) {
          titreType.associee = true
        }

        if (att.gestionnaire) {
          titreType.gestionnaire = true
        }

        return titreType
      })

    a.titresTypesTitresStatuts = sources.administrations__titresTypes__titresStatuts.data
      .filter(attts => attts.administration_id === a.id)
      .map(attts => {
        attts.administrationId = attts.administration_id
        attts.titreTypeId = attts.titre_type_id
        attts.titreStatutId = attts.titre_statut_id

        attts.titreType = sources.titresTypes.data.find(
          tt => tt.id === attts.titreTypeId
        )
        attts.titreStatut = sources.titresStatuts.data.find(
          ts => ts.id === attts.titreStatutId
        )

        return attts
      })

    a.titresTypesEtapesTypes = sources.administrations__titresTypes__etapesTypes.data
      .filter(attet => attet.administration_id === a.id)
      .map(attet => {
        attet.administrationId = attet.administration_id
        attet.titreTypeId = attet.titre_type_id
        attet.etapeTypeId = attet.etape_type_id

        attet.titreType = sources.titresTypes.data.find(
          tt => tt.id === attet.titreTypeId
        )
        attet.etapeType = sources.etapesTypes.data.find(
          te => te.id === attet.etapeTypeId
        )

        return attet
      })

    return a
  }
)

export default administrationsWithRelations
