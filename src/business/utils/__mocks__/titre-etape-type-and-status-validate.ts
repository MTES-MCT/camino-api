import { ITitreEtape, ITitreDemarche, IEtapeType } from '../../../types'

const titreEtapeTypeStatutOk = ({
  typeId: 'xxx',
  statutId: 'ok'
} as unknown) as ITitreEtape

const titreEtapeStatutKo = ({
  typeId: 'xxx',
  statutId: 'ko'
} as unknown) as ITitreEtape

const titreDemarche = ({
} as unknown) as ITitreDemarche

const titreDemarcheEtapeType = ({
  id: 'xxx',
  etapesStatuts: [{ id: 'ok' }]
} as unknown) as IEtapeType

export {
  titreEtapeTypeStatutOk,
  titreEtapeStatutKo,
  titreDemarche,
  titreDemarcheEtapeType
}
