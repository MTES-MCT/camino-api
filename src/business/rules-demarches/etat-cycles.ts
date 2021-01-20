import { IDemarcheDefinitionRestrictions } from './definitions'

const etatCycleGet = (
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictions,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
): IDemarcheDefinitionRestrictions[] => [
  {
    etapeTypeId: demandeEtapeTypeId,
    avant: [[{ etapeTypeId: etapeTypeIdDefinition.etapeTypeId }]],
    justeApres: [
      ...etapeTypeIdDefinition.justeApres,
      [{ etapeTypeId: receptionEtapeTypeId }]
    ]
  },
  {
    etapeTypeId: receptionEtapeTypeId,
    justeApres: [[{ etapeTypeId: demandeEtapeTypeId }]]
  },
  {
    ...etapeTypeIdDefinition,
    avant: [[{ etapeTypeId: etapeTypeIdDefinition.etapeTypeId }]],
    justeApres: [
      ...etapeTypeIdDefinition.justeApres,
      [{ etapeTypeId: receptionEtapeTypeId }]
    ]
  }
]

const etatInformationsGet = (
  mifId: string,
  rifId: string,
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictions
) => etatCycleGet(etapeTypeIdDefinition, mifId, rifId)

const etatComplementsGet = (
  mcoId: string,
  rcoId: string,
  etapeTypeIdDefinition: IDemarcheDefinitionRestrictions
) => etatCycleGet(etapeTypeIdDefinition, mcoId, rcoId)

export { etatInformationsGet, etatComplementsGet }
