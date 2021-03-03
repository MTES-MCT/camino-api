import titresContenuMigrate from './titres-contenu-migrate'

const typeMcrToMcp = {
  valueProp: 'typeId',
  changeTo: 'mcp'
}

const typeDelete = {
  valueProp: 'type',
  deleteProp: true
}

const modifs = {
  mcr: {
    typeMcrToMcp,
    typeDelete
  }
}

const ids = null && [
  'm-arm-affluents-crique-amadis-2019',
  'm-arm-cambrouze-2019',
  'm-arm-crique-saut-2010'
]

const options = {
  ids, // : ['m-ar-apatou-2003'],
  titresIds: ['m'],
  typesIds: ['ar']
}

titresContenuMigrate(options, modifs)
