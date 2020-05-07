import * as fs from 'fs'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'

import { IUtilisateur } from '../src/types'

const queryImport = (nom: string) =>
  fs
    .readFileSync(path.join(__dirname, `./queries/${nom}.graphql`))
    // important pour transformer le buffer en string
    .toString()

const tokenCreate = (user: Partial<IUtilisateur>) =>
  jwt.sign(user, process.env.JWT_SECRET as string)

export { queryImport, tokenCreate }
