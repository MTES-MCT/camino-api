import { titrePropsUpdate as queryTitrePropsUpdate } from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const calculatedProps = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'surface',
  'volume',
  'substances',
  'communes'
]

const titreStatutIdUpdate = (titre, statutId) =>
  statutId !== titre.statutId &&
  queryTitrePropsUpdate({
    id: titre.id,
    props: { statutId }
  }).then(u => `Mise à jour: titre ${titre.id}, statutId ${statutId}`)

const titrePropsUpdate = (titre, prop) => {
  const propEtapeIdName = `${prop}TitreEtapeId`
  const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

  return (
    etapeId !== titre[propEtapeIdName] &&
    queryTitrePropsUpdate({
      id: titre.id,
      props: { [propEtapeIdName]: etapeId }
    }).then(u => `Mise à jour: titre ${titre.id}, ${prop}, ${etapeId}`)
  )
}

export { calculatedProps, titreStatutIdUpdate, titrePropsUpdate }
