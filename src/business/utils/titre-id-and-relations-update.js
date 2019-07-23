import slugify from '@sindresorhus/slugify'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'
import elementRelationsUpdate from './element-relations-update'
import titreDemarchesAscSort from './titre-demarches-asc-sort'
import titreEtapesAscSort from './titre-etapes-asc-sort'
import { titrePropsEtapes } from '../processes/titres-props-etape-id-update'

const titreIdUpdate = titre => {
  const { domaineId, typeId, nom } = titre

  const demarcheOctroiDateDebut = titreDemarcheOctroiDateDebutFind(titre)

  return slugify(
    `${domaineId}-${typeId}-${nom}-${demarcheOctroiDateDebut.slice(0, 4)}`
  )
}

const titreDemarcheIdUpdate = (titreDemarche, titre) => {
  const titreDemarcheTypeOrder =
    titreDemarchesAscSort(
      titre.demarches.filter(d => d.typeId === titreDemarche.typeId)
    ).findIndex(d => d === titreDemarche) + 1

  return `${titre.id}-${
    titreDemarche.typeId
  }${titreDemarcheTypeOrder.toString().padStart(2, '0')}`
}

const titreEtapeIdUpdate = (titreEtape, titreDemarche) => {
  const titreEtapeTypeOrder =
    titreEtapesAscSort(
      titreDemarche.etapes.filter(e => e.typeId === titreEtape.typeId)
    ).findIndex(e => e === titreEtape) + 1

  return `${titreDemarche.id}-${
    titreEtape.typeId
  }${titreEtapeTypeOrder.toString().padStart(2, '0')}`
}

const titreRelations = {
  idUpdate: titreIdUpdate,
  links: [
    {
      path: 'demarches',
      props: ['titreId']
    },
    {
      path: 'activites',
      props: ['id', 'titreId']
    }
  ]
}

const titreDemarcheRelations = {
  idUpdate: titreDemarcheIdUpdate,
  links: [
    {
      path: 'etapes',
      props: ['titreDemarcheId']
    },
    {
      path: 'phase',
      props: ['titreDemarcheId']
    },
    {
      path: '/titre/demarches',
      props: ['annulationTitreDemarcheId']
    }
  ]
}

const titreEtapeRelations = {
  idUpdate: titreEtapeIdUpdate,
  links: [
    {
      path: '/titre',
      props: titrePropsEtapes.map(prop => `${prop}TitreEtapeId`)
    },
    {
      path: 'points',
      props: ['id', 'titreEtapeId'],
      links: [
        {
          path: 'references',
          props: ['id', 'titrePointId']
        }
      ]
    },
    {
      path: 'documents',
      // TODO: renommer le fichier en physique ?
      props: ['id', 'titreEtapeId' /*, 'fichier' */]
    },
    {
      path: 'incertitudes',
      props: ['id', 'titreEtapeId']
    }
  ]
}

const titreIdAndRelationsUpdate = titreOld => {
  const titreNew = { ...titreOld }

  // met à jour l'id du titre et ses relations
  let hasChanged = elementRelationsUpdate(titreNew, titreRelations, {
    titre: titreNew
  })

  titreNew.demarches.forEach(titreDemarche => {
    // met à jour l'id de la démarche du titre et ses relations
    hasChanged =
      elementRelationsUpdate(
        titreDemarche,
        titreDemarcheRelations,
        { titre: titreNew },
        titreNew
      ) || hasChanged

    // met à jour l'id de l'étape de la démarche et ses relations
    titreDemarche.etapes &&
      titreDemarche.etapes.forEach(
        titreEtape =>
          (hasChanged =
            elementRelationsUpdate(
              titreEtape,
              titreEtapeRelations,
              { titre: titreNew },
              titreDemarche
            ) || hasChanged)
      )
  })

  return { titreNew, hasChanged }
}

export default titreIdAndRelationsUpdate
