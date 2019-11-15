// administrations restreintes à certains types types de titres
const administrationsTypesRestrictions = {
  'ope-ptmg-973-01': ['arm'],
  'ope-onf-973-01': ['arm'],
  'dea-guyane-01': ['axm']
}

// administrations subsidiaires sur certains types de titres
const administrationsTypesSubsidiaires = {
  'dea-guyane-01': ['arm'],
  'ope-ptmg-973-01': ['arm'],
  'min-mtes-dgaln-01': ['arm', 'axm']
}

const titreAdministrationsCentralesBuild = (
  { id: titreId, domaineId, typeId },
  administrations
) =>
  administrations.reduce((titreAdministrationsCentrales, administration) => {
    const isTitreAdministration =
      administration.domaines &&
      administration.domaines.length &&
      administration.domaines.find(({ id }) => id === domaineId)

    if (!isTitreAdministration) return titreAdministrationsCentrales

    const typesRestrictions =
      administrationsTypesRestrictions[administration.id]

    // si
    // - il y a des restrictions pour cette administration centrale
    // - le type de titre n'est pas trouvé parmi les types de titres autorisés
    // l'administration n'est pas rattachée à l'étape
    if (typesRestrictions && !typesRestrictions.includes(typeId)) {
      return titreAdministrationsCentrales
    }

    const subsidiaire =
      administrationsTypesSubsidiaires[administration.id] &&
      administrationsTypesSubsidiaires[administration.id].includes(typeId)

    const titreAdministrationCentrale = {
      titreId,
      administrationId: administration.id
    }

    if (subsidiaire) {
      titreAdministrationCentrale.subsidiaire = subsidiaire
    }

    titreAdministrationsCentrales.push(titreAdministrationCentrale)

    return titreAdministrationsCentrales
  }, [])

export default titreAdministrationsCentralesBuild
