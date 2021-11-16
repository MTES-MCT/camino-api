// https://entreprise.api.gouv.fr/
import fetch from 'node-fetch'
import { ReadStream } from 'fs'
import { FileUpload } from 'graphql-upload'

const { API_ENTREPRISE_URL, API_ENTREPRISE_TOKEN } = process.env

const apiEntrepriseCall = async (
  urlSuffix: string,
  context: string,
  object: string
) => {
  if (!API_ENTREPRISE_URL) {
    throw new Error(
      "impossible de se connecter à l'API entreprise car la variable d'environnement API_ENTREPRISE_URL est absente"
    )
  }

  if (!API_ENTREPRISE_TOKEN) {
    throw new Error(
      "impossible de se connecter à l'API entreprise car la variable d'environnement API_ENTREPRISE_TOKEN est absente"
    )
  }

  const url = new URL(`${API_ENTREPRISE_URL}/${urlSuffix}`)

  url.searchParams.append('token', API_ENTREPRISE_TOKEN)
  url.searchParams.append('context', context)
  url.searchParams.append('recipient', 'Camino')
  url.searchParams.append('object', object)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  if (response.status > 400) {
    console.error(response)
    throw response.statusText
  }

  return response.json()
}

const attestationFiscaleGet = async (
  siren: string,
  object: string,
  context: string
): Promise<FileUpload> => {
  const result: { url: string } = await apiEntrepriseCall(
    `attestations_fiscales_dgfip/${siren}`,
    context,
    object
  )

  console.log(result)

  const response = await fetch(result.url)

  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`)

  return {
    createReadStream: () => response.body as ReadStream,
    filename: `attestation_fiscale_${siren}.pdf`,
    mimetype: 'application/pdf',
    encoding: 'utf-8'
  }
}

const privilegesGet = async () => {
  return apiEntrepriseCall(`privileges`, 'test', 'test')
}

export { attestationFiscaleGet, privilegesGet }
