import fetch from 'node-fetch'

import errorLog from '../error-log'

/*
 eslint-disable camelcase
*/

interface IOpenfiscaBody {
  articles: {
    [titreId_substance_commune: string]: {
      quantite_aurifere_kg?: {
        [annee: string]: number | null
      }
      surface_communale?: {
        [annee: string]: number | null
      }
      redevance_communale_des_mines_aurifere_kg?: {
        [annee: string]: number | null
      }
      surface_totale?: {
        [annee: string]: number | null
      }
    }
  }
  titres?: {
    [titreId: string]: {
      commune_principale_exploitation: {
        [annee: string]: string | null
      }
      operateur: {
        [annee: string]: string | null
      }
      categorie: {
        [annee: string]: string | null
      }
      investissement: {
        [annee: string]: string | null
      }
      articles: string[]
    }
  }
  communes?: {
    [communeId: string]: {
      articles: string[]
    }
  }
}

const apiOpenfiscaFetch = async (body: IOpenfiscaBody) => {
  try {
    const apiOpenfiscaUrl = process.env.API_OPENFISCA_URL
    if (!apiOpenfiscaUrl) {
      throw new Error(
        "impossible de se connecter à l'API Openfisca car la variable d'environnement est absente"
      )
    }

    const response = await fetch(`${apiOpenfiscaUrl}/calculate`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const result = (await response.json()) as IOpenfiscaBody

    if (response.status >= 400) {
      throw result
    }

    return result
  } catch (e: any) {
    const properties = JSON.stringify(body)
    errorLog(`apiOpenfiscaFetch ${properties}`, e.error || e.message || e)

    return null
  }
}

/**
 * Calcule la redevance communale des mines aurifères
 * @param entreprises - liste des entreprises avec leur production d’or net en gramme par année
 * @param annees - liste des années sur lesquelles on souhaite calculer la redevance
 * @return la redevance à payer par entreprise et par année
 */
const redevanceCommunaleMinesAurifiereGet = async (
  entreprises: {
    id: string
    orNet: { [annee: string]: number }
  }[],
  annees: number[]
) => {
  // construction de l’objet qui permet de dire à Openfisca ce que l’on souhaite récupérer
  const redevanceCommunaleDesMinesAurifereKg = annees.reduce((acc, annee) => {
    acc[annee] = null

    return acc
  }, {} as { [annee: string]: null })

  const societes: IOpenfiscaBody = entreprises.reduce(
    (acc, entreprise) => {
      // conversion des grammes en kilogrammes
      const orNetKg = Object.keys(entreprise.orNet).reduce(
        (orNetKg, annee) => ({
          ...orNetKg,
          [annee]: entreprise.orNet[annee] / 1000
        }),
        {}
      )

      acc.articles[entreprise.id] = {
        quantite_aurifere_kg: orNetKg,
        redevance_communale_des_mines_aurifere_kg:
          redevanceCommunaleDesMinesAurifereKg
      }

      return acc
    },
    { articles: {} } as IOpenfiscaBody
  )

  const result = (await apiOpenfiscaFetch(societes))?.articles

  if (result) {
    return Object.keys(result).reduce((acc, societe) => {
      acc[societe] = result[societe].redevance_communale_des_mines_aurifere_kg!

      return acc
    }, {} as { [entrepriseId: string]: { [annee: string]: number | null } })
  }

  return null
}

export { redevanceCommunaleMinesAurifiereGet }
