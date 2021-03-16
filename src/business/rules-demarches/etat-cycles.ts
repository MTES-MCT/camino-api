import { IDemarcheDefinitionRestrictionsElements } from './definitions'

const etatCycleGet = (
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictionsElements,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
) => {
  const newEtapeTypeIdDefinition = Object.assign({}, etapeTypeIdDefinition)
  delete newEtapeTypeIdDefinition.etapeTypeId

  return {
    [demandeEtapeTypeId]: {
      avant: [[{ etapeTypeId: etapeTypeIdDefinition.etapeTypeId }]],
      justeApres: [
        ...etapeTypeIdDefinition.justeApres,
        [{ etapeTypeId: receptionEtapeTypeId }]
      ]
    },
    [receptionEtapeTypeId]: {
      justeApres: [[{ etapeTypeId: demandeEtapeTypeId }]]
    },
    [etapeTypeIdDefinition.etapeTypeId!]: {
      ...newEtapeTypeIdDefinition,
      avant: [[{ etapeTypeId: etapeTypeIdDefinition.etapeTypeId }]],
      justeApres: [
        ...etapeTypeIdDefinition.justeApres,
        [{ etapeTypeId: receptionEtapeTypeId }]
      ]
    }
  }
}

const etatInformationsGet = (
  mifId: string,
  rifId: string,
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictionsElements
) => etatCycleGet(etapeTypeIdDefinition, mifId, rifId)

const etatComplementsGet = (
  mcoId: string,
  rcoId: string,
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictionsElements
) => etatCycleGet(etapeTypeIdDefinition, mcoId, rcoId)

export { etatInformationsGet, etatComplementsGet }
