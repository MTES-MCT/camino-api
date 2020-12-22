import { IPays, ICommune } from '../../types'
import * as slugify from '@sindresorhus/slugify'
import { Pojo } from 'objection'

const titreInsertFormat = (json: Pojo) => {
  if (!json.id && json.domaineId && json.typeId && json.nom) {
    json.id = `${json.domaineId}-${json.typeId.slice(0, -1)}-${slugify(
      json.nom
    )}-0000`
  }

  delete json.geojsonMultiPolygon
  delete json.geojsonPoints
  delete json.pays
  delete json.surface
  delete json.contenu
  delete json.modification
  delete json.suppression
  delete json.travauxCreation
  delete json.activitesAbsentes
  delete json.activitesEnConstruction
  delete json.activitesDeposees
  delete json.demarchesCreation

  if (json.type) {
    delete json.type.sections
  }

  return json
}

const paysFormat = (communes: ICommune[]) => {
  if (!communes) return []

  const pays = communes.reduce((pays: IPays[], commune) => {
    const { departement: communeDepartement } = commune
    if (!communeDepartement) return pays

    const { region: communeRegion } = communeDepartement
    if (!communeRegion) return pays

    const { pays: communePay } = communeRegion
    if (!communePay) return pays

    // "un pay", singulier de "des pays"
    let pay = pays.find(p => p.id === communePay.id)

    if (!pay) {
      pay = {
        id: communePay.id,
        nom: communePay.nom,
        regions: []
      }
      pays.push(pay)
    }

    if (!pay.regions) {
      pay.regions = []
    }

    let region = pay.regions.find(r => r.id === communeRegion.id)

    if (!region) {
      region = {
        id: communeRegion.id,
        nom: communeRegion.nom,
        departements: []
      }
      pay.regions.push(region)
    }

    if (!region.departements) {
      region.departements = []
    }

    let departement = region.departements.find(
      d => d.id === communeDepartement.id
    )

    if (!departement) {
      departement = {
        id: communeDepartement.id,
        nom: communeDepartement.nom,
        communes: []
      }
      region.departements.push(departement)
    }

    if (!departement.communes) {
      departement.communes = []
    }

    if (!departement.communes.find(c => c.id === commune.id)) {
      departement.communes.push({
        id: commune.id,
        nom: commune.nom,
        surface: commune.surface
      })
    }

    return pays
  }, [])

  // trie par ordre alphabétique
  pays.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  pays.forEach(p => {
    if (!p.regions) return

    p.regions.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    p.regions.forEach(r => {
      if (!r.departements) return

      r.departements.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
      r.departements.forEach(d => {
        if (!d.communes) return

        d.communes.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
      })
    })
  })

  return pays
}

export { paysFormat, titreInsertFormat }
