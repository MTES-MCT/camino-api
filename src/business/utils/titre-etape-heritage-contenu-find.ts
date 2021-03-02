import {
  IContenuValeur,
  IEtapeType,
  Index,
  ISection,
  ITitreEtape
} from '../../types'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'

const heritageContenuFind = (
  sectionId: string,
  elementId: string,
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false
  let value = (titreEtape.contenu &&
    titreEtape.contenu[sectionId] &&
    titreEtape.contenu[sectionId][elementId]) as IContenuValeur

  const heritage = titreEtape.heritageContenu![sectionId][elementId]
  const prevHeritage = prevTitreEtape?.heritageContenu![sectionId][elementId]

  const etapeId =
    prevHeritage?.etapeId && prevHeritage?.actif
      ? prevHeritage.etapeId
      : prevTitreEtape?.id

  if (heritage.actif && prevTitreEtape) {
    const oldValue = value
    value = (prevTitreEtape.contenu &&
      prevTitreEtape.contenu[sectionId] &&
      prevTitreEtape.contenu[sectionId][elementId]) as IContenuValeur

    if (oldValue !== value) {
      hasChanged = true
    }
  }

  if ((etapeId || heritage.etapeId) && etapeId !== heritage.etapeId) {
    hasChanged = true
  }

  return { hasChanged, value, etapeId }
}

const titreEtapeHeritageContenuFind = (
  titreEtapes: ITitreEtape[],
  titreEtape: ITitreEtape,
  etapeSectionsDictionary: Index<ISection[]>
) => {
  const sections = etapeSectionsDictionary[titreEtape.id]

  return sections.reduce(
    ({ contenu, heritageContenu, hasChanged }, section) => {
      if (section.elements?.length) {
        section.elements.forEach(element => {
          // parmi les étapes précédentes,
          // trouve l'étape qui contient section / element
          const prevTitreEtape = titreEtapes.find(
            e =>
              e.id !== titreEtape.id &&
              etapeSectionsDictionary[e.id].find(
                s =>
                  s.id === section.id &&
                  s.elements!.find(e => e.id === element.id)
              )
          )

          const {
            hasChanged: contenuHasChanged,
            value,
            etapeId
          } = heritageContenuFind(
            section.id,
            element.id,
            titreEtape,
            prevTitreEtape
          )

          if (contenuHasChanged) {
            if (value || value === 0) {
              if (!contenu) {
                contenu = {}
              }

              if (!contenu[section.id]) {
                contenu[section.id] = {}
              }

              contenu![section.id][element.id] = value
            } else if (contenu && contenu[section.id]) {
              delete contenu[section.id][element.id]
            }

            heritageContenu![section.id][element.id].etapeId = etapeId

            hasChanged = true
          }
        })
      }

      return { contenu, heritageContenu, hasChanged }
    },
    {
      contenu: titreEtape.contenu,
      heritageContenu: titreEtape.heritageContenu,
      hasChanged: false
    }
  )
}

const etapeSectionsDictionaryBuild = (
  titreEtapes: ITitreEtape[],
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) =>
  titreEtapes.reduce((acc: { [id: string]: ISection[] }, e) => {
    const sections = etapeTypeSectionsFormat(
      e.type!,
      demarcheTypeEtapesTypes,
      titreTypeId
    )

    if (sections.length) {
      acc[e.id] = sections
    }

    return acc
  }, {})

export {
  etapeSectionsDictionaryBuild,
  titreEtapeHeritageContenuFind,
  heritageContenuFind
}
