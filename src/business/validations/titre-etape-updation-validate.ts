import {
  ITitreEtape,
  ITitreDemarche,
  ITitre,
  IDocumentType,
  ISection,
  IDocument
} from '../../types'

import { titreEtapeTypeAndStatusValidate } from './titre-etape-type-and-status-validate'
import { titreEtapePointsValidate } from './titre-etape-points-validate'
import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'
import { heritageContenuValidate } from './utils/heritage-contenu-validate'
import { propsNumbersCheck } from './utils/props-numbers-check'
import { contenuNumbersCheck } from './utils/contenu-numbers-check'
import { propsDatesCheck } from './utils/props-dates-check'
import { contenuDatesCheck } from './utils/contenu-dates-check'
import { documentsTypesValidate } from './documents-types-validate'

const numberProps = ['duree', 'surface'] as unknown as [keyof ITitreEtape]

const dateProps = ['date', 'dateDebut', 'dateFin'] as unknown as [
  keyof ITitreEtape
]

const titreEtapeUpdationValidate = (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre,
  sections: ISection[],
  documentsTypes: IDocumentType[],
  documents: IDocument[] | null | undefined,
  justificatifsTypes: IDocumentType[],
  justificatifs: IDocument[] | null | undefined
) => {
  const errors = []

  // le champ heritageContenu est cohérent avec les sections
  const errorsHeritageContenu = heritageContenuValidate(
    sections,
    titreEtape.heritageContenu
  )

  errors.push(...errorsHeritageContenu)

  if (sections.length) {
    // 1. les champs number ne peuvent avoir une durée négative
    const errorsNumbers = propsNumbersCheck(numberProps, titreEtape)
    if (errorsNumbers) {
      errors.push(errorsNumbers)
    }

    if (titreEtape.contenu) {
      const errorsContenu = contenuNumbersCheck(sections, titreEtape.contenu)
      if (errorsContenu) {
        errors.push(errorsContenu)
      }
    }

    // 2. les champs date ne peuvent avoir une date invalide
    const errorsDates = propsDatesCheck<ITitreEtape>(dateProps, titreEtape)
    if (errorsDates) {
      errors.push(errorsDates)
    }

    // 3. les champs date des sections ne peuvent avoir une date invalide
    if (titreEtape.contenu) {
      const errorsContenu = contenuDatesCheck(sections, titreEtape.contenu)
      if (errorsContenu) {
        errors.push(errorsContenu)
      }
    }

    if (
      titreEtape.typeId !== 'mfr' &&
      titreEtape.heritageContenu &&
      titreEtape.heritageContenu.arm &&
      titreEtape.heritageContenu.arm.mecanise &&
      !titreEtape.heritageContenu.arm.mecanise.actif &&
      titreEtape.contenu &&
      titreEtape.contenu.arm &&
      titreEtape.contenu.arm.mecanise
    ) {
      errors.push('une demande non mécanisée ne peut pas devenir mécanisée')
    }
  }

  // 4. si l’étape n’est pas en cours de construction
  if (titreEtape.statutId !== 'aco') {
    errors.push(
      ...titreEtapeCompleteValidate(
        titreEtape,
        sections,
        documentsTypes,
        documents,
        justificatifsTypes,
        justificatifs
      )
    )
  }

  if (errors.length) {
    return errors
  }

  return titreEtapeUpdationBusinessValidate(titreEtape, titreDemarche, titre)
}

const titreEtapeCompleteValidate = (
  titreEtape: ITitreEtape,
  sections: ISection[],
  documentsTypes: IDocumentType[],
  documents: IDocument[] | null | undefined,
  justificatifsTypes: IDocumentType[],
  justificatifs: IDocument[] | null | undefined
) => {
  const errors = [] as string[]
  // les éléments non optionnel des sections sont renseignés
  if (sections.length) {
    sections.forEach(s =>
      s.elements?.forEach(e => {
        if (!e.optionnel && !['radio', 'checkbox'].includes(e.type)) {
          if (
            !titreEtape.contenu ||
            titreEtape.contenu[s.id][e.id] === undefined ||
            titreEtape.contenu[s.id][e.id] === null ||
            titreEtape.contenu[s.id][e.id] === ''
          ) {
            errors.push(
              `l’élément "${e.nom}" de la section "${s.nom}" est obligatoire`
            )
          } else if (e.type === 'multiple') {
            const values = titreEtape!.contenu[s.id][e.id] as []
            if (!values?.length) {
              errors.push(
                `l’élément "${e.nom}" de la section "${s.nom}" est obligatoire`
              )
            } else {
              e.elements?.forEach(prop => {
                if (!prop.optionnel) {
                  values.forEach(v => {
                    if (
                      !v[prop.id] ||
                      v[prop.id] === undefined ||
                      v[prop.id] === null
                    ) {
                      errors.push(
                        `le champ "${prop.id}" de l’élément "${e.nom}" de la section "${s.nom}" est obligatoire`
                      )
                    }
                  })
                }
              })
            }
          }
        }
      })
    )
  }

  // les fichiers obligatoires sont tous renseignés et complets
  if (documentsTypes!.length) {
    const documentsErrors = documentsTypesValidate(documents, documentsTypes)
    if (documentsErrors.length) {
      errors.push(...documentsErrors)
    }
  }

  // les justificatifs obligatoires sont tous présents
  const justificatifsTypesIds = [] as string[]
  if (justificatifs?.length) {
    for (const justificatif of justificatifs) {
      if (
        !justificatifsTypes.map(({ id }) => id).includes(justificatif!.typeId)
      ) {
        errors.push(
          `impossible de lier un justificatif de type ${justificatif!.typeId}`
        )
      }
      justificatifsTypesIds.push(justificatif!.typeId)
    }
  }
  justificatifsTypes
    .filter(({ optionnel }) => !optionnel)
    .forEach(jt => {
      if (!justificatifsTypesIds.includes(jt.id)) {
        errors.push(`un justificatif obligatoire est manquant`)
      }
    })

  return errors
}

const titreEtapeUpdationBusinessValidate = (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre
) => {
  const errors = []

  // 1. le type d'étape correspond à la démarche et au type de titre
  const titreEtapeTypeAndStatusErrors = titreEtapeTypeAndStatusValidate(
    titreEtape.typeId,
    titreEtape.statutId,
    titreDemarche.type!.etapesTypes,
    titreDemarche.type!.nom
  )
  if (titreEtapeTypeAndStatusErrors.length) {
    errors.push(...titreEtapeTypeAndStatusErrors)
  }

  // 2. la date de l'étape est possible
  // en fonction de l'ordre des types d'étapes de la démarche
  const demarcheUpdatedErrors = titreDemarcheUpdatedEtatValidate(
    titreDemarche.type!,
    titre,
    titreEtape,
    titreDemarche.etapes!
  )
  if (demarcheUpdatedErrors.length) {
    errors.push(...demarcheUpdatedErrors)
  }

  // 3. les références de points sont bien renseignées
  if (titreEtape.points) {
    const error = titreEtapePointsValidate(titreEtape.points)
    if (error) {
      errors.push(error)
    }
  }

  return errors
}

export { titreEtapeUpdationValidate, titreEtapeCompleteValidate }
