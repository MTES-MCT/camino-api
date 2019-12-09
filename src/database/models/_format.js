const paysFormat = communes => {
  if (!communes || !communes.length) return []

  const pays = communes.reduce((pays, commune) => {
    const { departement: departementCommune } = commune
    if (!departementCommune) return pays

    const { region: regionCommune } = departementCommune
    if (!regionCommune) return pays

    const { pays: paysCommune } = regionCommune
    if (!paysCommune) return pays

    // "un pay", singulier de "des pays"
    let pay = pays.find(p => p.id === paysCommune.id)

    if (!pay) {
      pay = {
        id: paysCommune.id,
        nom: paysCommune.nom,
        regions: []
      }
      pays.push(pay)
    }

    let region = pay.regions.find(r => r.id === regionCommune.id)

    if (!region) {
      region = {
        id: regionCommune.id,
        nom: regionCommune.nom,
        departements: []
      }
      pay.regions.push(region)
    }

    let departement = region.departements.find(
      d => d.id === departementCommune.id
    )

    if (!departement) {
      departement = {
        id: departementCommune.id,
        nom: departementCommune.nom,
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
