const camelize = require('camelcase')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w', 'reprise']

const metas = [
  'domaines',
  'titresTypes',
  'titresTypesTypes',
  'titresStatuts',
  'demarchesTypes',
  'titres-types--demarches-types',
  'demarchesStatuts',
  'demarches-types--demarches-statuts',
  'etapesTypes',
  'demarches-types--etapes-types',
  'etapesStatuts',
  'etapes-types--etapes-statuts',
  'phasesStatuts',
  'devises',
  'unites',
  'geoSystemes'
]

const substances = [
  'substances',
  'substancesLegales',
  'substancesLegalesCodes',
  'substances--SubstancesLegales'
]

const territoires = ['pays', 'regions', 'departements', 'communes']

const repertoires = [
  'entreprises',
  'entreprises-etablissements',
  'administrations',
  'administrationsTypes',
  'administrations--domaines'
]

const calendrier = ['frequences', 'trimestres', 'mois']

const utilisateurs = [
  'utilisateurs',
  'utilisateurs--entreprises',
  'permissions'
]

const titresFiles = [
  'titres',
  'titresDemarches',
  'titresDemarchesLiens',
  'titresEtapes',
  'titresPoints',
  'titresPointsReferences',
  'titresDocuments',
  'titresSubstances',
  'titresTitulaires',
  'titresAmodiataires',
  'titresCommunes',
  'titresAdministrationsGestionnaires',
  'titresAdministrationsLocales',
  'titresIncertitudes'
]

const titres = titresFiles.reduce(
  (titres, file) =>
    titres.concat(
      domainesIds.reduce((res, domaineId) => {
        res.push({
          name: file,
          file: decamelize(`titres-${domaineId}-${file}`, { separator: '-' })
        })

        return res
      }, [])
    ),
  []
)

const activitesMetas = [
  'activitesStatuts',
  'activitesTypes',
  'titres-types--activitesTypes',
  'activitesTypes--pays'
]

const titresActivites = ['titresActivites']

const data = [
  ...metas,
  ...substances,
  ...territoires,
  ...repertoires,
  ...calendrier,
  ...utilisateurs,
  ...titres,
  ...activitesMetas,
  ...titresActivites
].reduce((acc, e) => {
  const name = camelize(typeof e === 'object' ? e.name : e)
  const file = typeof e === 'object' ? e.file : e

  let model
  try {
    model = !file.match(/--/)
      ? require(`../../src/database/models/${decamelize(name, {
          separator: '-'
        })}`).default
      : null
  } catch (e) {
    console.info(e)
  }

  let data
  try {
    data = require(`./sources/${decamelize(file, { separator: '-' })}.json`)
  } catch (e) {
    data = []
  }

  if (acc[name]) {
    acc[name].data = acc[name].data.concat(data)

    return acc
  }

  acc[name] = {
    name,
    model,
    data
  }

  return acc
}, {})

const splitJoin = (from, to) => {
  from = from.split('.')
  const fromTable = camelize(from[0])
  const fromField = decamelize(from[1])

  to = to.split('.')
  const toTable = camelize(to[0])
  const toField = decamelize(to[1])

  return fromField === 'id'
    ? {
        fromTable: toTable,
        fromField: toField,
        toTable: fromTable,
        toField: fromField
      }
    : { fromTable, fromField, toTable, toField }
}

const mappingRelationsGet = (file, mappings) => {
  return Object.keys(mappings).reduce((relations, name) => {
    const mapping = mappings[name]

    const { join } = mapping

    if (join.through) {
      relations.push(
        Object.assign({ file, name }, splitJoin(join.from, join.through.from)),
        Object.assign({ file, name }, splitJoin(join.through.to, join.to))
      )

      return relations
    }

    relations.push(Object.assign({ file, name }, splitJoin(join.from, join.to)))

    return relations
  }, [])
}

const findMissing = relations =>
  relations.forEach(relation => {
    const { file, name, fromTable, fromField, toTable, toField } = relation

    if (!data[fromTable]) {
      return
    }

    data[fromTable].data.forEach(f => {
      if (!(fromField in f)) return

      const isCalculatedProp = data[toTable].data.every(t => !(toField in t))
      if (isCalculatedProp) return

      const found = data[toTable].data.find(t => t[toField] === f[fromField])

      if (!found) {
        console.info(
          `${file}.${name}: ${fromTable}.${fromField} (${f[fromField]}) manquant dans ${toTable}`
        )
        console.error(f)
        // throw new Error('erreur: donnée manquante')
      }
    })
  })

const main = async () => {
  Object.keys(data).forEach(file => {
    const e = data[file]
    if (e.model && e.model.relationMappings) {
      const relations = mappingRelationsGet(file, e.model.relationMappings)
      findMissing(relations)
    }
  })
}

main()
