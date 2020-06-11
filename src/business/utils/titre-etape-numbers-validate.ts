import { ITitreEtape, ISection, IContenu } from '../../types'

const numberProps = (['duree', 'surface'] as unknown) as [keyof ITitreEtape]

const contenuNumbersValidate = (
  sections: ISection[],
  contenu: IContenu | null | undefined
) => {
  if (!sections || !contenu) return []

  return sections.reduce((res: string[], section) => {
    if (!section.elements) return res

    return section.elements.reduce((res, element) => {
      if (
        element.type === 'number' &&
        contenu[section.id] &&
        contenu[section.id][element.id] &&
        contenu[section.id][element.id] < 0
      ) {
        res.push(
          `le champ "${element.id}" ne peut pas avoir une valeur négative`
        )
      }

      return res
    }, res)
  }, [])
}

const titreEtapeNumbersValidate = (
  titreEtape: ITitreEtape,
  sections: ISection[]
) => {
  const errorsFondamentales = numberProps.reduce((errors: string[], prop) => {
    if (titreEtape[prop] && (titreEtape[prop] as number) < 0) {
      errors.push(`le champ "${prop}" ne peut pas avoir une valeur négative`)
    }

    return errors
  }, [])

  const errorsContenu = contenuNumbersValidate(sections, titreEtape.contenu)

  const errors = [...errorsFondamentales, ...errorsContenu]

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapeNumbersValidate
