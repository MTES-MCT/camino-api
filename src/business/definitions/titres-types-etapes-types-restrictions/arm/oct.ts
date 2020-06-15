export default [
  {
    condition: { etape: { typeId: 'des' } },
    obligatoireApres: [{ typeId: 'mdp' }, { typeId: 'pfd' }],
    impossibleApres: [{ typeId: 'sco' }, { typeId: 'mno' }]
  },

  {
    condition: { etape: { typeId: 'mdp' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'mcp' }]
  },
  {
    condition: { etape: { typeId: 'dae' } },
    impossibleApres: [{ typeId: 'mcp' }]
  },
  {
    condition: { etape: { typeId: 'rde' } },
    impossibleApres: [{ typeId: 'mcp' }]
  },

  {
    condition: { etape: { typeId: 'mod' } },
    obligatoireApres: [{ typeId: 'mdp' }, { typeId: 'rde' }, { typeId: 'dae' }],
    impossibleApres: [{ typeId: 'sca' }]
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

  // titres mécanisés
  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'mcp' }
    },
    obligatoireApres: [{ typeId: 'rde' }]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: true } } },
      etape: { typeId: 'mcp' }
    },
    obligatoireApres: [{ typeId: 'dae' }]
  },

  {
    condition: { etape: { typeId: 'mcp' } },
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  // cycle de compléments de la complétude
  {
    condition: { etape: { typeId: 'mco' } },
    obligatoireApres: [{ typeId: 'mcp', statutId: 'def' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    obligatoireApres: [{ typeId: 'mco' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'css' } },
    obligatoireApres: [{ typeId: 'mcp', statutId: 'def' }],
    impossibleApres: [{ typeId: 'mno' }]
  },

  {
    condition: { etape: { typeId: 'vfd' } },
    obligatoireApres: [{ typeId: 'mcp', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  {
    condition: { etape: { typeId: 'mcr' } },
    obligatoireApres: [{ typeId: 'vfd' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },

  // cycle d'informations
  {
    condition: { etape: { typeId: 'mif' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'sca' }]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    obligatoireApres: [{ typeId: 'mif' }],
    impossibleApres: [{ typeId: 'sca' }]
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
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aof' }]
  },

  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'eof' }],
    impossibleApres: [{ typeId: 'sca' }]
  },

  {
    condition: { etape: { typeId: 'sca' } },
    obligatoireApres: [{ typeId: 'aof' }],
    impossibleApres: [{ typeId: 'aca' }]
  },

  {
    condition: { etape: { typeId: 'aca' } },
    obligatoireApres: [{ typeId: 'sca' }],
    impossibleApres: [{ typeId: 'css' }, { typeId: 'des' }]
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

  // paiement des frais de dossier titre mécanisé
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
  // validation des frais de dossier titre mécanisé
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
    obligatoireApres: [{ typeId: 'sco' }]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    obligatoireApres: [{ typeId: 'mno' }]
  }
]
