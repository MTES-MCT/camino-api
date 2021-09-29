exports.up = async knex => {


  const travaux = await knex.select().table('travaux_types')

  await knex('demarches_types').insert(
    travaux.map(t => ({ ...t, travaux: true, ordre: t.ordre + 100 }))
  )

  const travauxEtapes = await knex.select().table('travaux_etapes_types')

  const demarchesEtapes = await knex.select().table('etapes_types')

  const etapesIds = demarchesEtapes.map(({ id }) => id)

  for (const travauxEtape of travauxEtapes) {
    if (!etapesIds.includes(travauxEtape.id)) {
      await knex('etapes_types').insert({
        ...travauxEtape,
        ordre: travauxEtape.ordre + 200
      })

      const statuts = await knex.select().table('travaux_etapes_types__etapes_statuts').where('travauxEtapeTypeId', travauxEtape.id)
      if (statuts.length) {
        await knex('etapes_types__etapes_statuts').insert(statuts.map(s => ({etapeTypeId: s.travauxEtapeTypeId, etapeStatutId: s.etapeStatutId, ordre: s.ordre})))
      }

      const documents = await knex.select().table('travaux_etapes_types__documents_types').where('travauxEtapeTypeId', travauxEtape.id)
       if (documents.length) {
         await knex('etapes_types__documents_types').insert(documents.map(s => ({etapeTypeId: s.travauxEtapeTypeId, documentTypeId: s.documentTypeId, optionnel: s.optionnel})))
       }
    }
  }

  const travauxTypesEtapesTypes = await knex.select().table('travaux_types__travaux_etapes_types')
  const titresTypes = await knex.select().table('titres_types')

  for (const ttEt of travauxTypesEtapesTypes) {
    await knex('titres_types__demarches_types__etapes_types').insert(
      titresTypes.map(({ id }) => ({
        titreTypeId: id,
        demarcheTypeId: ttEt.travauxTypeId,
        etapeTypeId: ttEt.travauxEtapeTypeId,
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

exports.down = knex => {}
