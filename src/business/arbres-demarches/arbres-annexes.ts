import { IArbreEtape } from './arbres-demarches'

const arbresAnnexesGet = (
  arbreEtape: IArbreEtape,
  unique: boolean,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
): IArbreEtape[] => [
  {
    arbreTypeId: `${demandeEtapeTypeId}-${arbreEtape.arbreTypeId}`,
    avant: unique ? [[{ arbreTypeId: arbreEtape.arbreTypeId }]] : undefined,
    justeApres: [
      ...arbreEtape.justeApres,
      [{ arbreTypeId: `${receptionEtapeTypeId}-${arbreEtape.arbreTypeId}` }]
    ]
  },
  {
    arbreTypeId: `${receptionEtapeTypeId}-${arbreEtape.arbreTypeId}`,
    justeApres: [
      [{ arbreTypeId: `${demandeEtapeTypeId}-${arbreEtape.arbreTypeId}` }]
    ]
  },

  {
    ...arbreEtape,
    avant: unique ? [[{ arbreTypeId: arbreEtape.arbreTypeId }]] : undefined,
    justeApres: [
      ...arbreEtape.justeApres,
      [{ arbreTypeId: `${receptionEtapeTypeId}-${arbreEtape.arbreTypeId}` }]
    ]
  }
]

const arbreInformationsGet = (arbreEtape: IArbreEtape, unique = true) =>
  arbresAnnexesGet(arbreEtape, unique, 'mif', 'rif')

const arbreComplementsGet = (arbreEtape: IArbreEtape, unique = true) =>
  arbresAnnexesGet(arbreEtape, unique, 'mco', 'rco')

export { arbreInformationsGet, arbreComplementsGet }
