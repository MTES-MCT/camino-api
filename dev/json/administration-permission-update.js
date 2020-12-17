const fs = require('fs')
const chalk = require('chalk')
const decamelize = require('decamelize')

const fileName = decamelize(
  'administrations--titres-types--etapes-types.json',
  '-'
)

try {
  const filePath = `./sources/${fileName}`
  const restrictions = JSON.parse(fs.readFileSync(filePath).toString())

  restrictions.forEach(r => {
    if (r.titre_type_id === 'arm') {
      if (r.etape_type_id === 'mco') {
        ;['mcm', 'mcb', 'mcd', 'mcs'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'rco') {
        ;['rcm', 'rcb', 'rcd', 'rcs'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'mif') {
        ;['mim', 'mia', 'mio', 'mid'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'rif') {
        ;['rim', 'ria', 'rio', 'rid'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'mno') {
        ;['mna', 'mnb', 'mnc', 'mnd', 'mns', 'mnv'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }
    }

    if (r.titre_type_id === 'axm') {
      if (r.etape_type_id === 'mco') {
        ;['mca'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'rco') {
        ;['rca'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'mif') {
        ;['mio', 'mie'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'rif') {
        ;['rio', 'rie'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }

      if (r.etape_type_id === 'mod') {
        ;['mom'].forEach(etapeTypeId => {
          const rNew = JSON.parse(JSON.stringify(r))
          rNew.etape_type_id = etapeTypeId

          restrictions.push(rNew)
        })
      }
    }
  })

  fs.writeFileSync(`${filePath}`, JSON.stringify(restrictions, null, 2))
} catch (e) {
  console.info(chalk.red(e.message.split('\n')[0]))
}
