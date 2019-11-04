import { entreprisesAdressesGet } from '../../tools/api-insee/index'

const entrepriseGetBySirenApi = async (siren, token) => {
  const entrepriseApi = await entreprisesAdressesGet([siren], token)

  if (!entrepriseApi || !entrepriseApi[0]) {
    console.log("pas d'entreprise trouvée pour ce siren")

    return null
  }
  console.log(entrepriseApi[0])

  return entrepriseApi[0]
}

export default entrepriseGetBySirenApi
