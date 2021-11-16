import 'dotenv/config'
import { privilegesGet } from '../tools/api-entreprise'

async function main() {
  // const result = await attestationFiscaleGet('830388997', 'test', 'MiseEnPlace')

  const result = await privilegesGet()
  console.info(result)

  process.exit()
}

main()
