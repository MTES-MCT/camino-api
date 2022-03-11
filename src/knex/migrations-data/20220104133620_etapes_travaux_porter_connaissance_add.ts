import { TitreEtapesTravauxTypes } from '../../types'
import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  // Ajoute l'étape "Porter-à-connaissance"
  // à la démarche "Déclaration d’arrêt définitif de travaux miniers DADT".
  const titresTypes = await knex.select().table('titres_types')
  const etapeTypeId = TitreEtapesTravauxTypes.PorterAConnaissance
  const demarcheTypeId = 'dam'

  await knex('etapes_types').insert({
    id: etapeTypeId,
    nom: 'porter-à-connaissance',
    description: 'Porter-à-connaissance',
    ordre: 1029,
    fondamentale: false
  })

  await knex('etapes_types__etapes_statuts').insert([
    {
      etapeTypeId,
      etapeStatutId: 'fai',
      ordre: 0
    }
  ])

  for (const t of titresTypes) {
    await knex('titres_types__demarches_types__etapes_types').insert({
      titreTypeId: t.id,
      demarcheTypeId,
      etapeTypeId,
      ordre: 240
    })
  }
}

exports.down = () => ({})
