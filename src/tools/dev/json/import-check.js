const camelize = require('camelcase')
const decamelize = require('decamelize')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w', 'reprise']

const metas = [
  'domaines',
  'types',
  'domaines--types',
  'statuts',
  'demarchesTypes',
  'demarches-types--types',
  'demarchesStatuts',
  'demarches-types--demarches-statuts',
  'etapesTypes',
  'demarches-types--etapes-types',
  'etapesStatuts',
  'etapes-types--etapes-statuts',
  'phasesStatuts',
  'emprises',
  'devises',
  'volumeUnites',
  'geoSystemes'
]

const substances = [
  'substances',
  'substancesLegales',
  'substancesLegalesCodes',
  'substances--SubstancesLegales'
]

const territoires = ['pays', 'regions', 'departements']

const entreprisesFiles = ['', 'Etablissements']

const repertoires = domainesIds.reduce(
  (res, domaineId) =>
    res.concat(
      entreprisesFiles.reduce((d, file) => {
        d.push({
          name: `entreprises${file}`,
          file: decamelize(
            `entreprises-titres-${domaineId}${file ? '-' : ''}${file}`,
            '-'
          )
        })

        return d
      }, [])
    ),
  []
)
repertoires.push(
  'administrations',
  'administrationsTypes',
  'administrations--domaines'
)

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
  'titresEmprises',
  'titresPoints',
  'titresPointsReferences',
  'titresDocuments',
  'titresSubstances',
  'titresTitulaires',
  'titresAmodiataires',
  'titresIncertitudes'
]

const titres = titresFiles.reduce(
  (d, file) =>
    d.concat(
      domainesIds.reduce((res, domaineId) => {
        res.push({
          name: file,
          file: decamelize(`titres-${domaineId}-${file}`, '-')
        })

        return res
      }, [])
    ),
  []
)

const activitesMetas = [
  'activitesStatuts',
  'activitesTypes',
  'activitesTypes--types',
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
      ? require(`../../../database/models/${decamelize(name, '-')}`).default
      : null
  } catch (e) {}

  let data
  try {
    data = require(`../../../../sources/${decamelize(file, '-')}.json`)
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

const splitJoin = (from, to, swapIfId = false) => {
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

    relations.push(
      Object.assign({ file, name }, splitJoin(join.from, join.to, true))
    )

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
        console.log(
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
