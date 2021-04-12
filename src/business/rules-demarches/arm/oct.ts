import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/oWuHFa1Y8cCdCqaB/B1B05
const restrictionsArmOct: IDemarcheDefinitionRestrictions = {
  mfr: {
    justeApres: []
  },
  mdp: {
    separation: ['mcp'],
    justeApres: [[{ etapeTypeId: 'mfr', statutId: 'fai' }]]
  },
  pfd: {
    justeApres: [],
    avant: [[{ etapeTypeId: 'mcp' }]]
  },
  mcb: {
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'rde' }]],
    justeApres: [[]],
    final: false
  },
  rcb: { justeApres: [[{ etapeTypeId: 'mcb' }]] },
  rde: { justeApres: [[{ etapeTypeId: 'rcb' }], []] },
  mcd: {
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'dae' }]],
    justeApres: [[]],
    final: false
  },
  rcd: { justeApres: [[{ etapeTypeId: 'mcd' }]] },
  dae: { justeApres: [[{ etapeTypeId: 'rcd' }], []] },
  mod: {
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'sca' }]],
    justeApres: [[]],
    final: false
  },
  mom: {
    justeApres: [
      [{ etapeTypeId: 'rde', statutId: 'def' }],
      [{ etapeTypeId: 'dae', statutId: 'def' }]
    ]
  },
  mcp: {
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'dae', statutId: 'fav' },
        { etapeTypeId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etapeTypeId: 'mdp' }
      ],
      [{ etapeTypeId: 'mcr', statutId: 'def' }],
      [{ etapeTypeId: 'mom' }],
      [{ etapeTypeId: 'rcm' }]
    ]
  },
  mcm: {
    justeApres: [[{ etapeTypeId: 'mcp', statutId: 'def' }]]
  },
  rcm: {
    justeApres: [[{ etapeTypeId: 'mcm' }]]
  },
  vfd: {
    avant: [[{ etapeTypeId: 'vfd' }]],
    separation: ['mcr'],
    justeApres: [
      [{ etapeTypeId: 'mcp', statutId: 'fav' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'mnc' }]
    ]
  },
  mim: {
    avant: [[{ etapeTypeId: 'mcr' }]],
    justeApres: [[{ etapeTypeId: 'vfd' }], [{ etapeTypeId: 'rim' }]]
  },
  rim: {
    justeApres: [[{ etapeTypeId: 'mim' }]]
  },
  mca: {
    avant: [[{ etapeTypeId: 'mcr' }]],
    justeApres: [[{ etapeTypeId: 'vfd' }], [{ etapeTypeId: 'rca' }]]
  },
  rca: {
    justeApres: [[{ etapeTypeId: 'mca' }]]
  },
  mcr: {
    apres: [
      [{ etapeTypeId: 'vfd' }],
      [{ etapeTypeId: 'rim' }],
      [{ etapeTypeId: 'rca' }]
    ],
    separation: ['aof'],
    justeApres: [[{ etapeTypeId: 'rim' }], [{ etapeTypeId: 'vfd' }]]
  },
  ...etatInformationsGet('mid', 'rid', {
    etapeTypeId: 'edm',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  }),
  ede: {
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  }),
  mia: {
    justeApres: [[{ etapeTypeId: 'eof' }]]
  },
  ria: {
    justeApres: [[{ etapeTypeId: 'mia' }]]
  },
  aof: {
    justeApres: [
      [{ etapeTypeId: 'ria' }],
      [{ etapeTypeId: 'eof' }],
      [{ etapeTypeId: 'mcr', statutId: 'def' }]
    ]
  },
  sca: {
    justeApres: [
      [
        { etapeTypeId: 'aof' },
        { etapeTypeId: 'rde', statutId: 'fav' },
        {
          titre: {
            contenu: {
              arm: {
                franchissements: { valeur: 0, operation: 'NOT_EQUAL' }
              }
            }
          }
        }
      ],
      [
        { etapeTypeId: 'aof' },
        {
          titre: {
            contenu: {
              arm: {
                franchissements: { valeur: 0 }
              }
            }
          }
        }
      ],
      [{ etapeTypeId: 'mna' }],
      [{ etapeTypeId: 'rcs' }]
    ]
  },
  aca: { justeApres: [[{ etapeTypeId: 'sca' }]] },
  mna: {
    justeApres: [[{ etapeTypeId: 'aca', statutId: 'ajo' }]]
  },
  mcs: {
    justeApres: [[{ etapeTypeId: 'mna' }], [{ etapeTypeId: 'rcs' }]]
  },
  rcs: { justeApres: [[{ etapeTypeId: 'mcs' }]] },
  mnb: {
    justeApres: [
      [
        { etapeTypeId: 'aca', statutId: 'fav' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ]
    ]
  },
  mnd: {
    justeApres: [[{ etapeTypeId: 'aca', statutId: 'def' }]]
  },
  pfc: {
    justeApres: [[{ etapeTypeId: 'mnb' }]]
  },
  vfc: {
    avant: [[{ etapeTypeId: 'vfc' }]],
    justeApres: [
      [{ etapeTypeId: 'pfc' }],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'mnc' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'des' }
      ]
    ]
  },
  sco: {
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etapeTypeId: 'aca', statutId: 'fav' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'vfc' }
      ]
    ]
  },
  mns: {
    justeApres: [
      [
        { etapeTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } }
      ]
    ]
  },
  aco: {
    justeApres: [
      [
        { etapeTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ],
      [{ etapeTypeId: 'mnv' }],
      [{ etapeTypeId: 'mns' }]
    ]
  },
  mnv: { justeApres: [[{ etapeTypeId: 'aco' }]] },
  css: {
    justeApres: [],
    final: true,
    apres: [
      [{ etapeTypeId: 'mdp' }],
      [{ etapeTypeId: 'pfd' }],
      [{ etapeTypeId: 'rde' }],
      [{ etapeTypeId: 'dae' }]
    ],
    avant: [
      [{ etapeTypeId: 'sco' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'aca', statutId: 'def' }]
    ]
  },
  mnc: { justeApres: [[{ etapeTypeId: 'css' }]] },
  des: {
    justeApres: [],
    final: true,
    apres: [
      [{ etapeTypeId: 'mdp' }],
      [{ etapeTypeId: 'pfd' }],
      [{ etapeTypeId: 'rde' }],
      [{ etapeTypeId: 'dae' }]
    ],
    avant: [
      [{ etapeTypeId: 'sco' }],
      [{ etapeTypeId: 'aca', statutId: 'def' }],
      [{ etapeTypeId: 'css' }]
    ]
  }
}

export { restrictionsArmOct }
