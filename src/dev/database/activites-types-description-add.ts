import '../../init'

import { knex } from '../../knex'

import ActivitesTypes from '../../database/models/activites-types'

const main = async () => {
  await knex.schema.alterTable('activitesTypes', table => {
    table.text('description')
  })

  await ActivitesTypes.query()
    .patch({
      description:
        '<p>La production annuelle est requise en vertu des <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006179968/#LEGISCTA000006179968" target="_blank">article 1519</a>, <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1587&searchField=ALL&tab_selection=all&anchor=LEGIARTI000042159975#LEGIARTI000042159975" target="_blank">article 1587</a> et <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1588&searchField=ALL&tab_selection=all&anchor=LEGIARTI000006306371#LEGIARTI000006306371" target="_blank">article 1588</a> du code général des impôts relatifs au calcul de la redevance départementale et communale des mines (RDCM).</p><p>Le rapport annuel d\'exploitation est requis en vertu de l\'<a href="https://www.legifrance.gouv.fr/codes/id/LEGIARTI000023505020/2021-04-14/" target="_blank">article L. 172-1</a> du code minier et <a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033196097" target="_blank">article 35</a> du décret 2006/649 du 2 juin 2006.</p>'
    })
    .whereIn('id', ['gra', 'grx'])

  await ActivitesTypes.query()
    .patch({
      description:
        '<p>La production annuelle est requise en vertu des <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006179968/#LEGISCTA000006179968" target="_blank">article 1519</a>, <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1587&searchField=ALL&tab_selection=all&anchor=LEGIARTI000042159975#LEGIARTI000042159975" target="_blank">article 1587</a> et <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1588&searchField=ALL&tab_selection=all&anchor=LEGIARTI000006306371#LEGIARTI000006306371" target="_blank">article 1588</a> du code général des impôts relatifs au calcul de la redevance départementale et communale des mines (RDCM).</p><p><a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000021822128/" target="_blank">article 47</a> du décret 2006-798 du 6 juillet 2006.</p>'
    })
    .where('id', 'wrp')

  await ActivitesTypes.query()
    .patch({
      nom: "rapport d'exploitation (autorisations M)"
    })
    .where('id', 'grx')

  await ActivitesTypes.query()
    .patch({
      nom: "rapport d'exploitation (permis et concessions M)"
    })
    .where('id', 'gra')

  await ActivitesTypes.query()
    .patch({
      nom: "rapport d'exploitation (permis et concessions W)"
    })
    .where('id', 'wrp')

  process.exit(0)
}

main()
