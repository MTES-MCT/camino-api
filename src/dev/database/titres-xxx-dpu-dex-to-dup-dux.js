import titresContenuMigrate from './titres-contenu-migrate'

const changeTypeFromTo = (from, to) => {
  const typeIdChange = {
    condition: e => e.statutId === 'fai',
    valueProp: 'typeId',
    changeTo: to
  }

  const typeDelete = {
    condition: e => e.statutId === 'fai',
    valueProp: 'type',
    deleteProp: true
  }

  return {
    [from]: {
      typeIdChange,
      typeDelete
    }
  }
}

const modifs = {
  ...changeTypeFromTo('dex', 'dux'),
  ...changeTypeFromTo('dpu', 'dup')
}

const ids = null && [
  'm-arm-affluents-crique-amadis-2019',
  'm-arm-cambrouze-2019',
  'm-arm-crique-saut-2010'
]

const options = {
  ids
}

titresContenuMigrate(options, modifs)
