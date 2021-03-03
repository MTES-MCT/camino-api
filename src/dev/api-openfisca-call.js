import 'dotenv/config'
import { redevanceCommunaleMinesAurifiereGet } from '..//tools/api-openfisca'

async function main() {
  const result = await redevanceCommunaleMinesAurifiereGet(
    [
      {
        id: 'or compagnie',
        orNet: {
          2019: 1000,
          2018: 1000
        }
      }
    ],
    [2020, 2019]
  )

  console.info(result)

  process.exit()
}

main()
