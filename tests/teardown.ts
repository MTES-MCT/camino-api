import { dbManager } from './init'

export default async () => {
  // TODO: les tests ne passent pas lorsqu'on watch
  // la connection à la bdd ne semble pas fermée correctement
  await dbManager.close()
}
