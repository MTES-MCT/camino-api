import { IFields } from '../../types'

const titreActiviteFormatFields = {
  periode: {},
  sections: {}
} as IFields

const titreEtapeFormatFields = {
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  sections: {}
} as IFields

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields
} as IFields

const titreFormatFields = {
  surface: {},
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  demarches: titreDemarcheFormatFields,
  activites: titreActiviteFormatFields,
  administrations: {}
} as IFields

titreDemarcheFormatFields.titre = titreFormatFields

export {
  titreEtapeFormatFields,
  titreDemarcheFormatFields,
  titreActiviteFormatFields,
  titreFormatFields
}
