exports.up = async knex => {
  const travaux = await knex.select().table('travaux_types')

  await knex('demarches_types').insert(
    travaux.map(t => ({ ...t, travaux: true, ordre: t.ordre + 100 }))
  )

  const titresTypes = await knex.select().table('titres_types')
  for (const titreType of titresTypes) {
    await knex('titresTypes__demarchesTypes').insert(
      travaux.map(t => ({
        titreTypeId: titreType.id,
        demarcheTypeId: t.id
      }))
    )
  }

  const travauxEtapesTypes = await knex.select().table('travaux_etapes_types')

  const demarchesEtapes = await knex.select().table('etapes_types')

  const etapesIds = demarchesEtapes.map(({ id }) => id)

  const etapeTypeIdsIndex = {}

  for (const travauxEtapeType of travauxEtapesTypes) {
    const newEtapeTypeIdGet = etapeTypeId => {
      if (etapesIds.includes(etapeTypeId)) {
        const newLastChar = String.fromCharCode(
          etapeTypeId.slice(-1).charCodeAt() + 1
        )
        const newEtapeTypeId = etapeTypeId.substr(0, 2) + newLastChar

        return newEtapeTypeIdGet(newEtapeTypeId)
      }

      return etapeTypeId
    }

    const newEtapeTypeId = newEtapeTypeIdGet(travauxEtapeType.id)
    etapesIds.push(newEtapeTypeId)
    etapeTypeIdsIndex[travauxEtapeType.id] = newEtapeTypeId

    await knex('etapes_types').insert({
      ...travauxEtapeType,
      id: newEtapeTypeId,
      ordre: travauxEtapeType.ordre + 200
    })

    const statuts = await knex
      .select()
      .table('travaux_etapes_types__etapes_statuts')
      .where('travauxEtapeTypeId', travauxEtapeType.id)
    if (statuts.length) {
      await knex('etapes_types__etapes_statuts').insert(
        statuts.map(s => ({
          etapeTypeId: newEtapeTypeId,
          etapeStatutId: s.etapeStatutId,
          ordre: s.ordre
        }))
      )
    }

    const documents = await knex
      .select()
      .table('travaux_etapes_types__documents_types')
      .where('travauxEtapeTypeId', travauxEtapeType.id)
    if (documents.length) {
      await knex('etapes_types__documents_types').insert(
        documents.map(s => ({
          etapeTypeId: newEtapeTypeId,
          documentTypeId: s.documentTypeId,
          optionnel: s.optionnel
        }))
      )
    }
  }

  const travauxTypesEtapesTypes = await knex
    .select()
    .table('travaux_types__travaux_etapes_types')

  for (const ttEt of travauxTypesEtapesTypes) {
    await knex('titres_types__demarches_types__etapes_types').insert(
      titresTypes.map(({ id }) => ({
        titreTypeId: id,
        demarcheTypeId: ttEt.travauxTypeId,
        etapeTypeId: etapeTypeIdsIndex[ttEt.travauxEtapeTypeId],
        ordre: ttEt.ordre * 10
      }))
    )
  }

  return knex.schema
    .dropTable('travaux_etapes_types__documents_types')
    .dropTable('travaux_etapes_types__etapes_statuts')
    .dropTable('travaux_types__travaux_etapes_types')
    .dropTable('travaux_etapes_types')
    .dropTable('travaux_types')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.down = knex => {
  // TODO
}
