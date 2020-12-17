import { IEtapeTypeIdDefinition } from './demarches-etats-definitions'

const etatCycleGet = (
  etapeTypeIdDefinition: IEtapeTypeIdDefinition,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
): IEtapeTypeIdDefinition[] => [
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
  etapeTypeIdDefinition: IEtapeTypeIdDefinition
) => etatCycleGet(etapeTypeIdDefinition, mifId, rifId)

const etatComplementsGet = (
  mcoId: string,
  rcoId: string,
  etapeTypeIdDefinition: IEtapeTypeIdDefinition
) => etatCycleGet(etapeTypeIdDefinition, mcoId, rcoId)

export { etatInformationsGet, etatComplementsGet }
