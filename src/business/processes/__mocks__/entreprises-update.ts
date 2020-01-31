const dbEntreprisesCreees = [
  null,
  { id: 'pipo', legalSiren: null },
  { id: 'toto', legalSiren: 'toto' },
  { id: 'nunu', legalSiren: 'toto' }
]
const dbEntreprisesEtablissementsCreees = []
const apiEntreprisesCreees = [{ id: 'papa', legalSiren: 'toto' }]

const dbEntreprisesModifiees = [{ id: 'toto', legalSiren: 'toto' }]
const dbEntreprisesEtablissementsModifies = []
const apiEntreprisesModifiees = [{ id: 'toto', legalSiren: 'papa' }]

const dbEntreprisesSupprimeees = [{ id: 'papa', legalSiren: 'toto' }]
const dbEntreprisesEtablissementsSupprimeees = [
  { id: 'papa', legalSiren: 'toto' }
]
const apiEntreprisesSupprimeees = []

const dbEntreprisesExistantes = [{ id: 'toto', legalSiren: 'toto' }]
const dbEntreprisesEtablissementsExistants = [
  { id: 'toto', legalSiren: 'toto' }
]
const apiEntreprisesExistantes = [{ id: 'toto', legalSiren: 'toto' }]
const entreprisesEtablissementsApiExistantes = [
  { id: 'toto', legalSiren: 'toto' }
]
const dbEntreprisesInexistantes = []
const dbEntreprisesEtablissementsInexistantes = []
const apiEntreprisesInexistantes = []

export {
  dbEntreprisesCreees,
  dbEntreprisesEtablissementsCreees,
  apiEntreprisesCreees,
  dbEntreprisesModifiees,
  dbEntreprisesEtablissementsModifies,
  apiEntreprisesModifiees,
  dbEntreprisesSupprimeees,
  dbEntreprisesEtablissementsSupprimeees,
  apiEntreprisesSupprimeees,
  dbEntreprisesExistantes,
  apiEntreprisesExistantes,
  entreprisesEtablissementsApiExistantes,
  dbEntreprisesEtablissementsExistants,
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistantes,
  apiEntreprisesInexistantes
}
