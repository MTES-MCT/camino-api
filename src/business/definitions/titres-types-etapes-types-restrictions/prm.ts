export default [
  {
    condition: { etape: { typeId: 'mdp' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'spp' }]
  },

  {
    condition: { etape: { typeId: 'ret' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'dex' }]
  },
  {
    condition: { etape: { typeId: 'dim', statutId: 'rej' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'dex' }]
  },
  {
    condition: { etape: { typeId: 'dim', statutId: 'acc' } },
    impossible: true
  },

  {
    condition: { etape: { typeId: 'mod' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'sas' }]
  },

  {
    condition: { etape: { typeId: 'mif' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'sas' }]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    obligatoireApres: [{ typeId: 'mif' }],
    impossibleApres: [{ typeId: 'sas' }]
  },

  {
    condition: { etape: { typeId: 'spp' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },

  {
    condition: { etape: { typeId: 'mcr' } },
    obligatoireApres: [{ typeId: 'spp' }],
    impossibleApres: [{ typeId: 'ssr' }, { typeId: 'scl' }, { typeId: 'ppu' }]
  },

  {
    condition: { etape: { typeId: 'mco' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'def' }],
    impossibleApres: [{ typeId: 'mcr', statut: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    obligatoireApres: [{ typeId: 'mco' }],
    impossibleApres: [{ typeId: 'mcr', statut: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'anf' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [
      { typeId: 'mec' },
      { typeId: 'ssr' },
      { typeId: 'scl' },
      { typeId: 'ppu' }
    ]
  },
  {
    condition: { etape: { typeId: 'mec' } },
    obligatoireApres: [{ typeId: 'anf' }],
    impossibleApres: [{ typeId: 'ssr' }]
  },

  {
    condition: { etape: { typeId: 'ppu' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'scg' }]
  },

  {
    condition: { etape: { typeId: 'ssr' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },

  {
    condition: { etape: { typeId: 'apl' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'apm' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'pnr' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'apn' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'aop' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },

  {
    condition: { etape: { typeId: 'scl' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'apd' }]
  },

  {
    condition: { etape: { typeId: 'ama' } },
    obligatoireApres: [{ typeId: 'scl' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'aep' } },
    obligatoireApres: [{ typeId: 'scl' }],
    impossibleApres: [{ typeId: 'apd' }]
  },
  {
    condition: { etape: { typeId: 'acl' } },
    obligatoireApres: [{ typeId: 'scl' }],
    impossibleApres: [{ typeId: 'apd' }]
  },

  {
    condition: { etape: { typeId: 'spo' } },
    obligatoireApres: [{ typeId: 'ssr' }],
    impossibleApres: [{ typeId: 'apo' }]
  },
  {
    condition: { etape: { typeId: 'apo' } },
    obligatoireApres: [{ typeId: 'spo' }],
    impossibleApres: [{ typeId: 'apd' }]
  },

  {
    condition: { etape: { typeId: 'apd' } },
    obligatoireApres: [{ typeId: 'ssr' }]
  },
  {
    condition: { etape: { typeId: 'apd' } },
    obligatoireApres: [{ typeId: 'scl' }]
  },
  {
    condition: { etape: { typeId: 'apd' } },
    impossibleApres: [{ typeId: 'app' }]
  },

  {
    condition: { etape: { typeId: 'app' } },
    obligatoireApres: [{ typeId: 'apd' }],
    impossibleApres: [{ typeId: 'scg' }]
  },

  {
    condition: { etape: { typeId: 'scg' } },
    obligatoireApres: [{ typeId: 'app' }]
  },
  {
    condition: { etape: { typeId: 'scg' } },
    obligatoireApres: [{ typeId: 'ppu' }]
  },
  {
    condition: { etape: { typeId: 'scg' } },
    impossibleApres: [{ typeId: 'rcg' }]
  },

  {
    condition: { etape: { typeId: 'rcg' } },
    obligatoireApres: [{ typeId: 'scg' }],
    impossibleApres: [{ typeId: 'acg' }]
  },
  {
    condition: { etape: { typeId: 'acg' } },
    obligatoireApres: [{ typeId: 'rcg' }],
    impossibleApres: [{ typeId: 'sas' }]
  },
  {
    condition: { etape: { typeId: 'sas' } },
    obligatoireApres: [{ typeId: 'acg' }],
    impossibleApres: [{ typeId: 'dex' }]
  },
  {
    condition: { etape: { typeId: 'dex' } },
    obligatoireApres: [{ typeId: 'sas' }],
    impossibleApres: [{ typeId: 'ret' }]
  },

  {
    condition: { etape: { typeId: 'dpu', statutId: 'acc' } },
    obligatoireApres: [{ typeId: 'dex', statutId: 'acc' }],
    impossibleApres: [{ typeId: 'ret' }]
  },
  {
    condition: { etape: { typeId: 'dpu', statutId: 'rej' } },
    impossible: true
  },

  {
    condition: { etape: { typeId: 'npp' } },
    obligatoireApres: [
      { typeId: 'dpu', statutId: 'fav' },
      { typeId: 'dex', statutId: 'rej' }
    ]
  },

  {
    condition: { etape: { typeId: 'rpu' } },
    obligatoireApres: [{ typeId: 'npp' }],
    impossibleApres: null
  },
  {
    condition: { etape: { typeId: 'rpu' } },
    obligatoireApres: [{ typeId: 'dpu', statutId: 'fav' }],
    impossibleApres: null
  },

  {
    condition: { etape: { typeId: 'ncl' } },
    obligatoireApres: [{ typeId: 'npp' }],
    impossibleApres: null
  },
  {
    condition: { etape: { typeId: 'ncl' } },
    obligatoireApres: [{ typeId: 'dpu', statutId: 'fav' }],
    impossibleApres: null
  },

  {
    condition: { etape: { typeId: 'mno' } },
    obligatoireApres: [{ typeId: 'npp' }],
    impossibleApres: null
  },

  {
    condition: { etape: { typeId: 'abd' } },
    obligatoireApres: [{ typeId: 'dex' }],
    impossibleApres: null
  },
  {
    condition: { etape: { typeId: 'rtd' } },
    obligatoireApres: [{ typeId: 'dex' }],
    impossibleApres: null
  },

  {
    condition: { etape: { typeId: 'and' } },
    obligatoireApres: [{ typeId: 'dex' }, { typeId: 'dim', statutId: 'rej' }],
    impossibleApres: null
  }
]
