import '../../init'

import ActivitesTypes from '../../database/models/activites-types'

const main = async () => {
  await ActivitesTypes.query()
    .patch({
      description:
        'en vertu des articles <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006179968/#LEGISCTA000006179968" target="_blank">1519</a>, <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1587&searchField=ALL&tab_selection=all&anchor=LEGIARTI000042159975#LEGIARTI000042159975" target="_blank">1587</a> et <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006162672?init=true&page=1&query=1588&searchField=ALL&tab_selection=all&anchor=LEGIARTI000006306371#LEGIARTI000006306371" target="_blank">1588</a> du code général des impôts relatifs au calcul de la redevance départementale et communale des mines (RDCM).'
    })
    .whereIn('id', ['gra', 'grx'])
  await ActivitesTypes.query()
    .patch({
      description:
        '<a href="https://www.legifrance.gouv.fr/codes/id/LEGIARTI000023505020/2021-04-14/" target="_blank">article L. 172-1</a> du code minier et <a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033196097" target="_blank">article 35</a> du décret 2006/649 du 2 juin 2006'
    })
    .where('id', 'grp')
  await ActivitesTypes.query()
    .patch({
      description:
        '<a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000021822128/" target="_blank">article 47</a> du décret 2006-798 du 6 juillet 2006'
    })
    .where('id', 'wrp')

  process.exit(0)
}

main()
