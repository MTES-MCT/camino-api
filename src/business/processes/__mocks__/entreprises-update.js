const entreprisesDbCreees = [
  null,
  { id: 'pipo', legalSiren: null },
  { id: 'toto', legalSiren: 'toto' },
  { id: 'nunu', legalSiren: 'toto' }
]
const entreprisesEtablissementsDbCreees = []
const entreprisesApiCreees = [{ id: 'papa', legalSiren: 'toto' }]

const entreprisesDbModifiees = [{ id: 'toto', legalSiren: 'toto' }]
const entreprisesEtablissementsDbModifies = []
const entreprisesApiModifiees = [{ id: 'toto', legalSiren: 'papa' }]

const entreprisesDbExistantes = [{ id: 'toto', legalSiren: 'toto' }]
const entreprisesEtablissementsDbExistants = [
  { id: 'toto', legalSiren: 'toto' }
]
const entreprisesApiExistantes = [{ id: 'toto', legalSiren: 'toto' }]

const entreprisesDbInexistantes = []
const entreprisesEtablissementsDbInexistantes = []
const entreprisesApiInexistantes = []

export {
  entreprisesDbCreees,
  entreprisesEtablissementsDbCreees,
  entreprisesApiCreees,
  entreprisesDbModifiees,
  entreprisesEtablissementsDbModifies,
  entreprisesApiModifiees,
  entreprisesDbExistantes,
  entreprisesApiExistantes,
  entreprisesEtablissementsDbExistants,
  entreprisesDbInexistantes,
  entreprisesEtablissementsDbInexistantes,
  entreprisesApiInexistantes
}
