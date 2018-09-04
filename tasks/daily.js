require('dotenv').config()
require('../postgres')

const titresDemarchesStatutUpdate = require('./titres-demarches-statut-update')

titresDemarchesStatutUpdate()
