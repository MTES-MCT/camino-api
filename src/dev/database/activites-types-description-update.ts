import '../../init'

import ActivitesTypes from '../../database/models/activites-types'

const main = async () => {
  await ActivitesTypes.query()
    .patch({
      description:
        'en vertu des articles <a href="https://www.collectivites-locales.gouv.fr/redevance-des-mines" target="_blank">1519, 1587 et 1588</a> du code général des impôts relatifs au calcul de la redevance départementale et communale des mines (RDCM).'
    })
    .whereIn('id', ['gra', 'grx'])
  await ActivitesTypes.query()
    .patch({
      description:
        '<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000023505020/" target="_blank">article L. 172-1</a> du code minier et <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000609345/" target="_blank">article 35</a> du décret 2006/649 du 2 juin 2006'
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
