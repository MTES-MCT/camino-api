export default [
  {
    condition: { etape: { typeId: 'mfr' } },
    obligatoireApres: null
    // impossible après toute étape
    // note: désactivation de cette règle
    // car le "cas par cas" est possible avant la demande
    // impossibleApres: '*'
  },
  {
    condition: { etape: { typeId: 'ret' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'sco' }]
  },
  {
    condition: { etape: { typeId: 'mdp' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'pfd' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },

  {
    condition: { etape: { typeId: 'dae' } },
    // note: désactivation de cette règle
    // car le "cas par cas" est possible avant la demande
    // obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'mco' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },

  {
    condition: { etape: { typeId: 'mcr', statutId: 'fav' } },
    obligatoireApres: [{ typeId: 'pfd' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'mcr', statutId: 'def' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'edm' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'ede' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'rde' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'eof' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'aca' }]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'eof' }],
    impossibleApres: [{ typeId: 'aca' }]
  },

  {
    condition: { etape: { typeId: 'aca' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'ret' }]
  },

  {
    condition: {
      titre: { contenu: { onf: { mecanisee: false } } },
      etape: { typeId: 'mno' }
    },
    obligatoireApres: [{ typeId: 'aca', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'sco' }]
  },
  {
    condition: {
      titre: { contenu: { onf: { mecanisee: false } } },
      etape: { typeId: 'sco' }
    },
    obligatoireApres: [{ typeId: 'mno' }],
    impossibleApres: [{ typeId: 'aco' }]
  },
  {
    condition: {
      titre: { contenu: { onf: { mecanisee: true } } },
      etape: { typeId: 'mno' }
    },
    obligatoireApres: [{ typeId: 'aca' }],
    impossibleApres: [{ typeId: 'pfc' }]
  },
  {
    condition: {
      titre: { contenu: { onf: { mecanisee: true } } },
      etape: { typeId: 'pfc' }
    },
    obligatoireApres: [{ typeId: 'mno' }],
    impossibleApres: [{ typeId: 'sco' }]
  },
  {
    condition: {
      titre: { contenu: { onf: { mecanisee: true } } },
      etape: { typeId: 'sco' }
    },
    obligatoireApres: [{ typeId: 'pfc' }],
    impossibleApres: [{ typeId: 'aco' }]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    obligatoireApres: [{ typeId: 'sco' }],
    impossibleApres: null
  }
]
