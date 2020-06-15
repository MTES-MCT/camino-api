export default [
  {
    condition: { etape: { typeId: 'des' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'sco' }]
  },
  {
    condition: { etape: { typeId: 'mdp' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'mcp' }]
  },
  {
    condition: { etape: { typeId: 'dae' } },
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rde' } },
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'mod' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'aca' }]
  },

  {
    condition: { etape: { typeId: 'mco' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    obligatoireApres: [{ typeId: 'mco' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'pfd' } },
    impossibleApres: [{ typeId: 'mcp' }]
  },

  {
    condition: { etape: { typeId: 'mcp' } },
    obligatoireApres: [{ typeId: 'mdp' }]
  },
  {
    condition: { etape: { typeId: 'mcp' } },
    obligatoireApres: [{ typeId: 'pfd' }]
  },
  {
    condition: { etape: { typeId: 'mcp' } },
    impossibleApres: [{ typeId: 'mcp', statutId: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'css' } },
    obligatoireApres: [
      { typeId: 'mcp', statutId: 'def' },
      { typeId: 'aca', statutId: 'def' }
    ],
    impossibleApres: [{ typeId: 'mno' }]
  },

  {
    condition: { etape: { typeId: 'vfd' } },
    obligatoireApres: [{ typeId: 'mcp', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'mcr' }
    },
    obligatoireApres: [{ typeId: 'rde' }]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'mcr' }
    },
    obligatoireApres: [{ typeId: 'dae' }]
  },

  {
    condition: { etape: { typeId: 'mcr' } },
    obligatoireApres: [{ typeId: 'vfd' }]
  },
  {
    condition: { etape: { typeId: 'mcr' } },
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }, { typeId: 'eof' }]
  },

  {
    condition: { etape: { typeId: 'mif' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    obligatoireApres: [{ typeId: 'mif' }],
    impossibleApres: [{ typeId: 'aca' }]
  },

  {
    condition: { etape: { typeId: 'edm' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aof' }]
  },
  {
    condition: { etape: { typeId: 'ede' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aof' }]
  },

  {
    condition: { etape: { typeId: 'eof' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'aof' }]
  },

  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'eof' }],
    impossibleApres: [{ typeId: 'aca' }]
  },

  {
    condition: { etape: { typeId: 'aca' } },
    obligatoireApres: [{ typeId: 'aof' }],
    impossibleApres: [{ typeId: 'mno' }]
  },

  {
    condition: { etape: { typeId: 'mno' } },
    obligatoireApres: [{ typeId: 'aca' }, { typeId: 'css' }]
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: false } } },
      etape: { typeId: 'pfc' }
    },
    impossible: true
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'pfc' }
    },
    obligatoireApres: [{ typeId: 'aca', statutId: 'fav' }]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'pfc' }
    },
    obligatoireApres: [{ typeId: 'mno' }]
  },
  {
    condition: { etape: { typeId: 'pfc' } },
    impossibleApres: [{ typeId: 'vfc' }]
  },
  {
    condition: { etape: { typeId: 'vfc' } },
    obligatoireApres: [{ typeId: 'pfc' }],
    impossibleApres: [{ typeId: 'sco' }]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'sco' }
    },
    obligatoireApres: [{ typeId: 'vfc' }]
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: false } } },
      etape: { typeId: 'sco' }
    },
    obligatoireApres: [{ typeId: 'aca', statutId: 'fav' }]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: false } } },
      etape: { typeId: 'sco' }
    },
    obligatoireApres: [{ typeId: 'mno' }]
  },

  {
    condition: { etape: { typeId: 'sco' } },
    impossibleApres: [{ typeId: 'aco' }]
  },

  {
    condition: { etape: { typeId: 'aco' } },
    obligatoireApres: [{ typeId: 'sco' }],
    impossibleApres: null
  }
]
