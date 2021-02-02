import 'dotenv/config'
import knex from '../../src/init'
import { ISubstanceFiscale, IUnite } from '../../src/types'

import SubstancesFiscales from '../../src/database/models/substances-fiscales'
import Unites from '../../src/database/models/unites'
import ActivitesTypes from '../../src/database/models/activites-types'
import {
  titresActivitesGet,
  titresActivitesUpsert
} from '../../src/database/queries/titres-activites'
import { activitesTypesGet } from '../../src/database/queries/metas-activites'
import { titresGet } from '../../src/database/queries/titres'
import { titreActiviteSectionsBuild } from '../../src/business/rules/titre-activites-build'

async function main() {
  await knex.schema.alterTable('unites', table => {
    table.string('referenceUniteId', 3).references('id')
    table.float('referenceUniteRatio')
  })

  await knex.schema.createTable('substancesFiscales', table => {
    table.string('id', 4).primary()
    table
      .string('substanceLegaleId')
      .index()
      .references('substancesLegales.id')
      .notNullable()
    table.string('uniteId').index().references('unites.id').notNullable()
    table.string('nom').notNullable()
    table.string('description', 2048)
  })

  await knex.schema.alterTable('titresTypes', table => {
    table.renameColumn('propsEtapesTypes', 'contenuIds')
  })

  await knex.schema.alterTable('titres', table => {
    table.renameColumn('propsTitreEtapesIds', 'contenusTitreEtapesIds')
  })

  await knex.schema.alterTable('titresActivites', table => {
    table.specificType('sections', 'jsonb[]')
  })

  await Unites.query().upsertGraph(unites, { insertMissing: true })

  console.info(`${unites.length} unités mise à jour`)

  await SubstancesFiscales.query().insert(substancesFiscales)

  console.info(`${substancesFiscales.length} substancesFiscales ajoutées`)

  const activitesTypes = await activitesTypesGet(
    { fields: { id: {} } },
    'super'
  )

  const activiteTypeGra = activitesTypes.find(at => at.id === 'gra')!

  const graSection = activiteTypeGra.sections!.find(
    ({ id }) => id === 'renseignements'
  )!

  activiteTypeGra.nom = 'rapport annuel de production'

  graSection.id = 'substancesFiscales'
  delete graSection.elements

  await ActivitesTypes.query().patchAndFetchById('gra', activiteTypeGra)

  await knex('activites_types__pays').where('activite_type_id', 'gra').del()

  console.info(`type d'activité gra modifié`)

  const activiteTypeGrx = activitesTypes.find(at => at.id === 'grx')!

  const grxSection = activiteTypeGrx.sections!.find(
    ({ id }) => id === 'renseignements'
  )!

  grxSection.id = 'substancesFiscales'
  delete grxSection.elements

  await ActivitesTypes.query().patchAndFetchById('grx', activiteTypeGrx)

  console.info(`type d'activité grx modifié`)

  const titresActivites = await titresActivitesGet({}, { fields: {} }, 'super')

  const titresIds = titresActivites.map(ta => ta.titreId)

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: {
          etapes: {
            substances: { legales: { fiscales: { unite: { id: {} } } } }
          }
        }
      }
    },
    'super'
  )

  for (const ta of titresActivites) {
    if (
      ['gra', 'grx'].includes(ta.typeId) &&
      ta.contenu?.renseignements &&
      (ta.contenu.renseignements.orNet || ta.contenu.renseignements.orNet === 0)
    ) {
      ta.contenu.substancesFiscales = {
        auru: (ta.contenu.renseignements.orNet as number) / 1000
      }
    }

    if (ta.contenu?.renseignements) {
      delete ta.contenu.renseignements
    }

    const activiteType = activitesTypes.find(at => at.id === ta.typeId)!
    const titre = titres.find(t => t.id === ta.titreId)!

    ta.sections = titreActiviteSectionsBuild(
      activiteType.id,
      activiteType.sections,
      ta.frequencePeriodeId,
      ta.date,
      titre.demarches!
    )
  }
  await titresActivitesUpsert(titresActivites)

  console.info(`${titresActivites.length} activités modifiées`)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})

const unites = [
  {
    id: 'deg',
    nom: 'degré',
    symbole: 'º'
  },
  {
    id: 'gon',
    nom: 'grade',
    symbole: 'gon',
    referenceUniteRatio: 0.9,
    referenceUniteId: 'deg'
  },
  {
    id: 'km3',
    nom: 'kilomètre cube',
    symbole: 'km³',
    referenceUniteRatio: 1000000000,
    referenceUniteId: 'm3x'
  },
  {
    id: 'm3a',
    nom: 'mètre cube par an',
    symbole: 'm³ / an'
  },
  {
    id: 'm3x',
    nom: 'mètre cube',
    symbole: 'm³'
  },
  {
    id: 'met',
    nom: 'mètre',
    symbole: 'm'
  },
  {
    id: 'txa',
    nom: 'tonnes par an',
    symbole: 't / an'
  },
  {
    id: 'mtk',
    nom: 'millier de tonnes',
    symbole: 'x 1000 t',
    referenceUniteRatio: 1000000,
    referenceUniteId: 'mkg'
  },
  {
    id: 'mtc',
    nom: 'centaine de tonnes',
    symbole: 'x 100 t',
    referenceUniteRatio: 100000,
    referenceUniteId: 'mkg'
  },
  {
    id: 'mtt',
    nom: 'tonne',
    symbole: 't',
    referenceUniteRatio: 1000,
    referenceUniteId: 'mkg'
  },
  {
    id: 'mkc',
    nom: 'quintal',
    symbole: 'x 100 kg',
    referenceUniteRatio: 100,
    referenceUniteId: 'mkg'
  },
  {
    id: 'mgr',
    nom: 'gramme',
    symbole: 'g',
    referenceUniteRatio: 0.001,
    referenceUniteId: 'mkg'
  },
  {
    id: 'vmd',
    nom: '100 000 mètres cubes',
    symbole: 'x 100 000 m³',
    referenceUniteRatio: 100000,
    referenceUniteId: 'm3x'
  },
  {
    id: 'mkg',
    nom: 'kilogramme',
    symbole: 'Kg'
  }
] as IUnite[]

const substancesFiscales = [
  {
    id: 'aloh',
    substanceLegaleId: 'aloh',
    uniteId: 'mtk',
    nom: 'bauxite',
    description: 'bauxite nettes livrées'
  },
  {
    id: 'anti',
    substanceLegaleId: 'anti',
    uniteId: 'mtt',
    nom: 'antimoine',
    description: 'contenu dans les minerais'
  },
  {
    id: 'arge',
    substanceLegaleId: 'arge',
    uniteId: 'mkc',
    nom: 'argent',
    description: 'contenu dans les minerais'
  },
  {
    id: 'arse',
    substanceLegaleId: 'arse',
    uniteId: 'mtk',
    nom: 'arsenic',
    description: 'contenu dans les minerais'
  },
  {
    id: 'auru',
    substanceLegaleId: 'auru',
    uniteId: 'mkg',
    nom: 'or',
    description: 'contenu dans les minerais'
  },
  {
    id: 'bism',
    substanceLegaleId: 'bism',
    uniteId: 'mtt',
    nom: 'bismuth',
    description: 'contenu dans les minerais'
  },
  {
    id: 'cfxa',
    substanceLegaleId: 'cfxx',
    uniteId: 'mtc',
    nom: 'charbon',
    description: 'net extrait'
  },
  {
    id: 'cfxb',
    substanceLegaleId: 'cfxx',
    uniteId: 'mtk',
    nom: 'lignites',
    description:
      "net livré pour les lignites d'un pouvoir calorifique égal ou supérieur à 13 MJ/kg"
  },
  {
    id: 'cfxc',
    substanceLegaleId: 'cfxx',
    uniteId: 'mtk',
    nom: 'lignites',
    description:
      "net livré pour les lignites d'un pouvoir calorifique inférieur à 13 MJ/kg"
  },
  {
    id: 'coox',
    substanceLegaleId: 'coox',
    uniteId: 'vmd',
    nom: 'gaz carbonique',
    description: 'extrait à 1 bar et 15 °C'
  },
  {
    id: 'cuiv',
    substanceLegaleId: 'cuiv',
    uniteId: 'mtt',
    nom: 'cuivre',
    description: 'contenu dans les minerais'
  },
  {
    id: 'etai',
    substanceLegaleId: 'etai',
    uniteId: 'mtt',
    nom: 'étain',
    description: 'contenu dans les minerais'
  },
  {
    id: 'fera',
    substanceLegaleId: 'ferx',
    uniteId: 'mtt',
    nom: 'pyrite de fer',
    description: 'net livré'
  },
  {
    id: 'ferb',
    substanceLegaleId: 'ferx',
    uniteId: 'mtt',
    nom: 'minerais de fer',
    description: 'net livré'
  },
  {
    id: 'fluo',
    substanceLegaleId: 'fluo',
    uniteId: 'mtk',
    nom: 'fluorine',
    description: 'net livré'
  },
  {
    id: 'hyda',
    substanceLegaleId: 'hydm',
    uniteId: 'mtk',
    nom: 'calcaires et grès bitumineux ou asphaltiques',
    description:
      "net livré (non destinés à la distillation pour production d'huiles ou d'essences)"
  },
  {
    id: 'hydb',
    substanceLegaleId: 'hydm',
    uniteId: 'mtt',
    nom: 'schistes carbobitumineux et schistes bitumineux',
    description:
      'net livré (à traiter par distillation pour en extraire des huiles et des essences)'
  },
  {
    id: 'hydc',
    substanceLegaleId: 'hydx',
    uniteId: 'mtc',
    nom: 'pétrole brut',
    description: 'net extrait'
  },
  {
    id: 'hydd',
    substanceLegaleId: 'hydx',
    uniteId: 'mtt',
    nom: 'propane et le butane',
    description: 'net livré'
  },
  {
    id: 'hyde',
    substanceLegaleId: 'hydx',
    uniteId: 'mtt',
    nom: 'essence de dégazolinage',
    description: 'net livré'
  },
  {
    id: 'hydf',
    substanceLegaleId: 'hydx',
    uniteId: 'vmd',
    nom: 'gaz naturel',
    description: 'extrait des gisements'
  },
  {
    id: 'kclx',
    substanceLegaleId: 'kclx',
    uniteId: 'mtc',
    nom: 'oxyde de potassium',
    description: 'K2O contenu dans les sels de potassium'
  },
  {
    id: 'lith',
    substanceLegaleId: 'lith',
    uniteId: 'mtt',
    nom: 'oxyde de lithium',
    description: 'Li2O contenu dans les minerais de lithium'
  },
  {
    id: 'mang',
    substanceLegaleId: 'mang',
    uniteId: 'mtc',
    nom: 'manganèse',
    description: 'contenu dans les minerais'
  },
  {
    id: 'moly',
    substanceLegaleId: 'moly',
    uniteId: 'mtt',
    nom: 'molybdène',
    description: 'contenu dans les minerais'
  },
  {
    id: 'naca',
    substanceLegaleId: 'nacl',
    uniteId: 'mtk',
    nom: 'sel (chlorure de sodium)',
    description: 'extrait par abattage net livré'
  },
  {
    id: 'nacb',
    substanceLegaleId: 'nacl',
    uniteId: 'mtk',
    nom: 'sel (chlorure de sodium)',
    description: 'extrait en dissolution par sondage et livré raffiné'
  },
  {
    id: 'nacc',
    substanceLegaleId: 'nacl',
    uniteId: 'mtk',
    nom: 'sel (chlorure de sodium contenu)',
    description: 'extrait en dissolution par sondage et livré en dissolution'
  },
  {
    id: 'plom',
    substanceLegaleId: 'plom',
    uniteId: 'mtc',
    nom: 'plomb',
    description: 'contenu dans les minerais'
  },
  {
    id: 'souf',
    substanceLegaleId: 'souf',
    uniteId: 'mtt',
    nom: 'soufre',
    description:
      'contenu dans les minerais de soufre autres que les pyrites de fer'
  },
  {
    id: 'uran',
    substanceLegaleId: 'uran',
    uniteId: 'mkc',
    nom: 'uranium',
    description: 'contenu dans les minerais'
  },
  {
    id: 'wolf',
    substanceLegaleId: 'wolf',
    uniteId: 'mtt',
    nom: 'oxyde de tungstène (WO3)',
    description: 'contenu dans les minerais'
  },
  {
    id: 'zinc',
    substanceLegaleId: 'zinc',
    uniteId: 'mtc',
    nom: 'zinc',
    description: 'contenu dans les minerais'
  }
] as ISubstanceFiscale[]
