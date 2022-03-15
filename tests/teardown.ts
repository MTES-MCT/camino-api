import { dbManager } from './db-manager'

export default async () => {
  await dbManager.end()
}
