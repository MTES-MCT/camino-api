const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const tdePath = './sources/titres-types--demarches-types--etapes-types.json'

const elementsCorrespondance = [
  { id: 'agent', sectionId: '' },
  { id: 'entreprise', sectionId: '' },
  { id: 'representantLegal', sectionId: '' },
  { id: 'motifsIdentification', sectionId: '' },
  { id: 'nomSecteur', sectionId: '' },
  { id: 'duree', sectionId: '' },
  { id: 'surfaceDemandee', sectionId: '' },
  { id: 'surfaceMaximumDetenue', sectionId: '' },
  { id: 'localisationPerimetres', sectionId: '' },
  { id: 'cheminements', sectionId: '' },
  { id: 'localisationCheminements', sectionId: '' },
  { id: 'franchissementsCoursDeau', sectionId: '' },
  { id: 'localisationPointsFranchissementsCoursDeau', sectionId: '' },
  { id: 'carte500000', sectionId: '' },
  { id: 'carte50000', sectionId: '' },
  { id: 'descriptionProjet', sectionId: '' },
  { id: 'motifsDemande', sectionId: '' },
  { id: 'descriptionMateriel', sectionId: '' },
  { id: 'tonnageMaximum', sectionId: '' },
  { id: 'motifsMateriel', sectionId: '' },
  { id: 'justificatifsCapacitesTechniques', sectionId: '' },
  { id: 'responsableTravaux', sectionId: '' },
  { id: 'motifsCapaciteTechniques', sectionId: '' },
  { id: 'planFinancement', sectionId: '' },
  { id: 'justificationCapacitesFinancieres', sectionId: '' },
  { id: 'justificatifSituationFiscale', sectionId: '' },
  { id: 'motifsCapaciteFinancieres', sectionId: '' },
  {
    id: 'informationsComplementaires',
    sectionId: '',
    idNew: 'informationsCompletude'
  }
]

const sections = JSON.parse(fs.readFileSync(tdePath).toString()).find(
  tde =>
    tde.titre_type_id === 'arm' &&
    tde.demarche_type_id === 'oct' &&
    tde.etape_type_id === 'mcp'
).sections

sections.forEach(s => {
  s.elements.forEach(e => {
    const element = elementsCorrespondance.find(element =>
      [element.id, element.idNew].includes(e.id)
    )

    // nouveau champ
    if (!element) {
      console.info('nouveau champ:', e.id)
      // process.exit(1)
    } else {
      // on affecte la nouvelle section
      element.sectionId = s.id
    }
  })
})

const domainesIds = ['m']

domainesIds.forEach(domaineId => {
  const fileName = decamelize(`titres-${domaineId}-titres-etapes.json`, {
    separator: '-'
  })

  try {
    const filePath = `./sources/${fileName}`
    const etapes = JSON.parse(fs.readFileSync(filePath).toString())

    etapes.forEach(t => {
      if (t.type_id === 'mcp') {
        const titreId = t.id.split('-').slice(0, -2).join('-')

        if (t.statut_id === 'fai') {
          console.info('modification du statut `fai` en `fav`:', titreId)

          t.statut_id = 'fav'
        }

        if (t.contenu) {
          console.info('modification du contenu:', titreId)

          t.contenu = Object.keys(t.contenu).reduce(
            (r, section) =>
              Object.keys(t.contenu[section]).reduce((r, elementId) => {
                const correspondance = elementsCorrespondance.find(
                  e => e.id === elementId
                )

                const { sectionId, id, idNew } = correspondance
                if (!r[sectionId]) {
                  r[sectionId] = {}
                }

                r[sectionId][idNew || id] = t.contenu[section][elementId]

                return r
              }, r),
            {}
          )
        }
      }
    })

    fs.writeFileSync(`${filePath}`, JSON.stringify(etapes, null, 2))
  } catch (e) {
    console.info(chalk.red(e.message.split('\n')[0]))
    console.info(e.stack)
  }
})
