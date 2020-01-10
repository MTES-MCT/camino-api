const paysFormat = communes => {
  if (!communes || !communes.length) return []

  const pays = communes.reduce((pays, commune) => {
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

    let region = pay.regions.find(r => r.id === communeRegion.id)

    if (!region) {
      region = {
        id: communeRegion.id,
        nom: communeRegion.nom,
        departements: []
      }
      pay.regions.push(region)
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
  pays.sort((a, b) => a.nom > b.nom)
  pays.forEach(p => {
    p.regions.sort((a, b) => (a.nom > b.nom ? 1 : -1))
    p.regions.forEach(r => {
      r.departements.sort((a, b) => (a.nom > b.nom ? 1 : -1))
      r.departements.forEach(d => {
        d.communes.sort((a, b) => (a.nom > b.nom ? 1 : -1))
      })
    })
  })

  return pays
}

export { paysFormat }
