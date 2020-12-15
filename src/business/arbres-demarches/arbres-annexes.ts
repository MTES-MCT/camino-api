import { IArbreEtape } from './arbres-demarches'

const arbresAnnexesGet = (
  arbreEtape: IArbreEtape,
  demandeEtapeTypeId: string,
  receptionEtapeTypeId: string
): IArbreEtape[] => [
  {
    arbreTypeId: `${demandeEtapeTypeId}-${arbreEtape.arbreTypeId}`,
    avant: [[{ arbreTypeId: arbreEtape.arbreTypeId }]],
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
    avant: [[{ arbreTypeId: arbreEtape.arbreTypeId }]],
    justeApres: [
      ...arbreEtape.justeApres,
      [{ arbreTypeId: `${receptionEtapeTypeId}-${arbreEtape.arbreTypeId}` }]
    ]
  }
]

const arbreInformationsGet = (arbreEtape: IArbreEtape) =>
  arbresAnnexesGet(arbreEtape, 'mif', 'rif')

const arbreComplementsGet = (arbreEtape: IArbreEtape) =>
  arbresAnnexesGet(arbreEtape, 'mco', 'rco')

export { arbreInformationsGet, arbreComplementsGet }
