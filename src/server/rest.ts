import * as express from 'express'

import { auth } from './auth'

import {
  titres,
  demarches,
  activites,
  utilisateurs,
  entreprises
} from '../api/rest/flux'

const fichiers = express.Router()

fichiers.use(auth)

fichiers.get('/titres', titres)
fichiers.get('/demarches', demarches)
fichiers.get('/activites', activites)
fichiers.get('/utilisateurs', utilisateurs)
fichiers.get('/entreprises', entreprises)

export default fichiers
