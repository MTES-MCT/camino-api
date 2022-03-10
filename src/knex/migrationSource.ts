import fs from 'fs'
import path from 'path'
import { Knex } from 'knex'

type MigrationFileExtension = typeof MIGRATION_FILE_EXTENSIONS[number]
const MIGRATION_FILE_EXTENSIONS = ['.js', '.ts', '.sql'] as const

interface MigrationFile {
  path: string
  extension: MigrationFileExtension
}
// Overloads fs-migration.js into Knex
// https://knexjs.org/#custom-migration-sources
export class CustomMigrationSource {
  private migrationFolders: readonly string[]

  constructor(migrationFolders: undefined | string | readonly string[]) {
    if (migrationFolders === undefined) {
      throw new Error('No migration folder configured')
    }
    if (typeof migrationFolders === 'string') {
      this.migrationFolders = [migrationFolders]
    } else {
      this.migrationFolders = migrationFolders
    }
  }

  public async getMigrations(): Promise<string[]> {
    const files = this.migrationFolders.flatMap(folder =>
      fs.readdirSync(folder)
    )

    return files
      .sort((a, b) => a.localeCompare(b))
      .filter(migration => {
        const migrationName = this.getMigrationName(migration)
        const extension = path.extname(migrationName)

        return (MIGRATION_FILE_EXTENSIONS as ReadonlyArray<string>).includes(
          extension
        )
      })
      .map(CustomMigrationSource.removeExtension)
  }

  private static removeExtension(migrationName: string): string {
    return migrationName.replace(/\.[^/.]+$/, '')
  }

  public getMigrationName(migration: string): string {
    return migration
  }

  private findMigrationFile(migration: string): MigrationFile | null {
    for (const migrationFileExtension of MIGRATION_FILE_EXTENSIONS) {
      for (const migrationFolder of this.migrationFolders) {
        const sqlMigrationFile = path.join(
          migrationFolder,
          `${migration}${migrationFileExtension}`
        )
        if (fs.existsSync(sqlMigrationFile)) {
          return {
            path: sqlMigrationFile,
            extension: migrationFileExtension
          }
        }
      }
    }

    return null
  }

  public getMigration(migration: string): {
    up: (knex: Knex) => Promise<void>
    down: () => Promise<void>
  } {
    const migrationFile = this.findMigrationFile(migration)
    if (migrationFile === null) {
      throw new Error(`Migration ${migration} not found`)
    }
    if (migrationFile.extension === '.sql') {
      return {
        up: async (knex: Knex): Promise<void> => {
          const sql = fs.readFileSync(migrationFile.path, 'utf8')
          await knex.raw(sql.replace(/\?/g, '\\?'))
        },
        down: async (): Promise<void> => {
          throw new Error(
            'Down migration not supported, restore backup instead'
          )
        }
      }
    } else {
      return require(migrationFile.path)
    }
  }
}
