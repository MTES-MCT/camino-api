import { IEtatIdDefinition } from './demarches-etats-definitions'

const etatCycleGet = (
  etatIdDefinition: IEtatIdDefinition,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
): IEtatIdDefinition[] => [
  {
    etatId: `${demandeEtapeTypeId}-${etatIdDefinition.etatId}`,
    avant: [[{ etatId: etatIdDefinition.etatId }]],
    justeApres: [
      ...etatIdDefinition.justeApres,
      [{ etatId: `${receptionEtapeTypeId}-${etatIdDefinition.etatId}` }]
    ]
  },
  {
    etatId: `${receptionEtapeTypeId}-${etatIdDefinition.etatId}`,
    justeApres: [
      [{ etatId: `${demandeEtapeTypeId}-${etatIdDefinition.etatId}` }]
    ]
  },

  {
    ...etatIdDefinition,
    avant: [[{ etatId: etatIdDefinition.etatId }]],
    justeApres: [
      ...etatIdDefinition.justeApres,
      [{ etatId: `${receptionEtapeTypeId}-${etatIdDefinition.etatId}` }]
    ]
  }
]

const etatInformationsGet = (etatIdDefinition: IEtatIdDefinition) =>
  etatCycleGet(etatIdDefinition, 'mif', 'rif')

const etatComplementsGet = (etatIdDefinition: IEtatIdDefinition) =>
  etatCycleGet(etatIdDefinition, 'mco', 'rco')

export { etatInformationsGet, etatComplementsGet }
