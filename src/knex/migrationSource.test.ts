import { CustomMigrationSource } from './migrationSource'
import { join } from 'path'

const migrationPath = join(__dirname, '/migrations-schema')

it('should return all the migrations', async () => {
  const tested = new CustomMigrationSource(migrationPath)
  const actual = await tested.getMigrations()

  // Testing only the 7 firsts which should never change
  expect(actual.slice(0, 7)).toMatchSnapshot()
})

it('should return a given migration', async () => {
  const tested = new CustomMigrationSource(migrationPath)
  const migrations = await tested.getMigrations()
  const firstMigration = await tested.getMigration(migrations[0])

  expect(firstMigration).not.toBeNull()
})
