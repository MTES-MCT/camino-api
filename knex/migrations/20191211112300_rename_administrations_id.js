exports.up = knex => {
  return (
    knex.schema
      // retire les foreign keys
      .table('administrations__domaines', table => {
        table.dropForeign(
          'administration_id',
          'administrations__domaines_administrationid_foreign'
        )
      })
      .table('restrictions__etapes_types__administrations', table => {
        table.dropForeign(
          'administration_id',
          'restrictions__etapestypes__administrations_administrationid_for'
        )
      })
      .table('restrictions__types__administrations', table => {
        table.dropForeign(
          'administration_id',
          'restrictions__types__administrations_administrationid_foreign'
        )
      })
      .table('restrictions__types__statuts__administrations', table => {
        table.dropForeign(
          'administration_id',
          'restrictions__types__statuts__administrations_administrationid_'
        )
      })
      .table('titres_administrations_gestionnaires', table => {
        table.dropForeign(
          'administration_id',
          'titresadministrationsgestionnaires_administrationid_foreign'
        )
      })
      .table('titres_administrations_locales', table => {
        table.dropForeign(
          'administration_id',
          'titresadministrationslocales_administrationid_foreign'
        )
      })
      .table('utilisateurs__administrations', table => {
        table.dropForeign(
          'administration_id',
          'utilisateurs__administrations_administrationid_foreign'
        )
      })
    // copie le champ 'id' ou 'administration_id' un champ old... pour mémoire
    // .then(() => {
    //   return knex.schema.table('administrations', table => {
    //     table.string('old_id', 64)
    //   })
    // })
    // .then(() => {
    //   return knex('administrations').update('old_id', knex.raw('id'))
    // })
    // .then(() => {
    //   return knex.schema.table('administrations__domaines', table => {
    //     table.string('old_administration_id', 64)
    //   })
    // })
    // .then(() => {
    //   return knex('administrations__domaines').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__etapes_types__administrations',
    //     table => {
    //       table.string('old_administration_id', 64)
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__etapes_types__administrations').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__administrations',
    //     table => {
    //       table.string('old_administration_id', 64)
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__types__administrations').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__statuts__administrations',
    //     table => {
    //       table.string('old_administration_id', 64)
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__types__statuts__administrations').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'titres_administrations_gestionnaires',
    //     table => {
    //       table.string('old_administration_id', 64)
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex('titres_administrations_gestionnaires').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table('titres_administrations_locales', table => {
    //     table.string('old_administration_id', 64)
    //   })
    // })
    // .then(() => {
    //   return knex('titres_administrations_locales').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table('utilisateurs__administrations', table => {
    //     table.string('old_administration_id', 64)
    //   })
    // })
    // .then(() => {
    //   return knex('utilisateurs__administrations').update(
    //     'old_administration_id',
    //     knex.raw('administration_id')
    //   )
    // })
    // // update le champ 'id' de la table 'administrations' et les champs 'administration_id' des tables liées
    // .then(() => {
    //   return knex('administrations').update(
    //     'id',
    //     knex.raw("type_id||substring(old_id,position('-' in old_id))")
    //   )
    // })
    // .then(() => {
    //   return knex('administrations__domaines').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__etapes_types__administrations').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__types__administrations').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('restrictions__types__statuts__administrations').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('titres_administrations_gestionnaires').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('titres_administrations_locales').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // .then(() => {
    //   return knex('utilisateurs__administrations').update(
    //     'administration_id',
    //     knex.raw(
    //       '(select id from administrations where old_id=old_administration_id)'
    //     )
    //   )
    // })
    // // replace les foreign keys
    // .then(() => {
    //   return knex.schema.table('administrations__domaines', table => {
    //     table
    //       .foreign(
    //         'administration_id',
    //         'administrations__domaines_administrationid_foreign'
    //       )
    //       .references('administrations.id')
    //   })
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__etapes_types__administrations',
    //     table => {
    //       table
    //         .foreign(
    //           'administration_id',
    //           'restrictions__etapestypes__administrations_administrationid_for'
    //         )
    //         .references('administrations.id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__administrations',
    //     table => {
    //       table
    //         .foreign(
    //           'administration_id',
    //           'restrictions__types__administrations_administrationid_foreign'
    //         )
    //         .references('administrations.id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__statuts__administrations',
    //     table => {
    //       table
    //         .foreign(
    //           'administration_id',
    //           'restrictions__types__statuts__administrations_administrationid_'
    //         )
    //         .references('administrations.id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'titres_administrations_gestionnaires',
    //     table => {
    //       table
    //         .foreign(
    //           'administration_id',
    //           'titresadministrationsgestionnaires_administrationid_foreign'
    //         )
    //         .references('administrations.id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table('titres_administrations_locales', table => {
    //     table
    //       .foreign(
    //         'administration_id',
    //         'titresadministrationslocales_administrationid_foreign'
    //       )
    //       .references('administrations.id')
    //   })
    // })
    // .then(() => {
    //   return knex.schema.table('utilisateurs__administrations', table => {
    //     table
    //       .foreign(
    //         'administration_id',
    //         'utilisateurs__administrations_administrationid_foreign'
    //       )
    //       .references('administrations.id')
    //   })
    // })
    // // retire les champs old...
    // .then(() => {
    //   return knex.schema.table('administrations', table => {
    //     table.dropColumn('old_id')
    //   })
    // })
    // .then(() => {
    //   return knex.schema.table('administrations__domaines', table => {
    //     table.dropColumn('old_administration_id')
    //   })
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__etapes_types__administrations',
    //     table => {
    //       table.dropColumn('old_administration_id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__administrations',
    //     table => {
    //       table.dropColumn('old_administration_id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'restrictions__types__statuts__administrations',
    //     table => {
    //       table.dropColumn('old_administration_id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table(
    //     'titres_administrations_gestionnaires',
    //     table => {
    //       table.dropColumn('old_administration_id')
    //     }
    //   )
    // })
    // .then(() => {
    //   return knex.schema.table('titres_administrations_locales', table => {
    //     table.dropColumn('old_administration_id')
    //   })
    // })
    // .then(() => {
    //   return knex.schema.table('utilisateurs__administrations', table => {
    //     table.dropColumn('old_administration_id')
    //   })
    // })
  )
}

// exports.down = function(knex) {}

exports.down = knex => {
  return (
    knex.schema
      // retire les foreign keys
      // .table('administrations__domaines', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'administrations__domaines_administrationid_foreign'
      //   )
      // })
      // .table('restrictions__etapes_types__administrations', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'restrictions__etapestypes__administrations_administrationid_for'
      //   )
      // })
      // .table('restrictions__types__administrations', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'restrictions__types__administrations_administrationid_foreign'
      //   )
      // })
      // .table('restrictions__types__statuts__administrations', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'restrictions__types__statuts__administrations_administrationid_'
      //   )
      // })
      // .table('titres_administrations_gestionnaires', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'titresadministrationsgestionnaires_administrationid_foreign'
      //   )
      // })
      // .table('titres_administrations_locales', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'titresadministrationslocales_administrationid_foreign'
      //   )
      // })
      // .table('utilisateurs__administrations', table => {
      //   table.dropForeign(
      //     'administration_id',
      //     'utilisateurs__administrations_administrationid_foreign'
      //   )
      // })
      // // down le champ 'id' de la table 'administrations' et les champs 'administration_id' des tables liées via les champs old...
      // .then(() => {
      //   return knex('administrations').update('id', knex.raw('old_id'))
      // })
      // .then(() => {
      //   return knex('administrations__domaines').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('restrictions__etapes_types__administrations').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('restrictions__types__administrations').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('restrictions__types__statuts__administrations').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('titres_administrations_gestionnaires').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('titres_administrations_locales').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // .then(() => {
      //   return knex('utilisateurs__administrations').update(
      //     'administration_id',
      //     knex.raw('old_administration_id')
      //   )
      // })
      // // retire les champs old...
      // .then(() => {
      //   return knex.schema.table('administrations', table => {
      //     table.dropColumn('old_id')
      //   })
      // })
      // .then(() => {
      //   return knex.schema.table('administrations__domaines', table => {
      //     table.dropColumn('old_administration_id')
      //   })
      // })
      // .then(() => {
      //   return knex.schema.table(
      //     'restrictions__etapes_types__administrations',
      //     table => {
      //       table.dropColumn('old_administration_id')
      //     }
      //   )
      // })
      // .then(() => {
      //   return knex.schema.table(
      //     'restrictions__types__administrations',
      //     table => {
      //       table.dropColumn('old_administration_id')
      //     }
      //   )
      // })
      // .then(() => {
      //   return knex.schema.table(
      //     'restrictions__types__statuts__administrations',
      //     table => {
      //       table.dropColumn('old_administration_id')
      //     }
      //   )
      // })
      // .then(() => {
      //   return knex.schema.table(
      //     'titres_administrations_gestionnaires',
      //     table => {
      //       table.dropColumn('old_administration_id')
      //     }
      //   )
      // })
      // .then(() => {
      //   return knex.schema.table('titres_administrations_locales', table => {
      //     table.dropColumn('old_administration_id')
      //   })
      // })
      // .then(() => {
      //   return knex.schema.table('utilisateurs__administrations', table => {
      //     table.dropColumn('old_administration_id')
      //   })
      // })
      // replace les foreign keys
      .then(() => {
        return knex.schema.table('administrations__domaines', table => {
          table
            .foreign(
              'administration_id',
              'administrations__domaines_administrationid_foreign'
            )
            .references('administrations.id')
        })
      })
      .then(() => {
        return knex.schema.table(
          'restrictions__etapes_types__administrations',
          table => {
            table
              .foreign(
                'administration_id',
                'restrictions__etapestypes__administrations_administrationid_for'
              )
              .references('administrations.id')
          }
        )
      })
      .then(() => {
        return knex.schema.table(
          'restrictions__types__administrations',
          table => {
            table
              .foreign(
                'administration_id',
                'restrictions__types__administrations_administrationid_foreign'
              )
              .references('administrations.id')
          }
        )
      })
      .then(() => {
        return knex.schema.table(
          'restrictions__types__statuts__administrations',
          table => {
            table
              .foreign(
                'administration_id',
                'restrictions__types__statuts__administrations_administrationid_'
              )
              .references('administrations.id')
          }
        )
      })
      .then(() => {
        return knex.schema.table(
          'titres_administrations_gestionnaires',
          table => {
            table
              .foreign(
                'administration_id',
                'titresadministrationsgestionnaires_administrationid_foreign'
              )
              .references('administrations.id')
          }
        )
      })
      .then(() => {
        return knex.schema.table('titres_administrations_locales', table => {
          table
            .foreign(
              'administration_id',
              'titresadministrationslocales_administrationid_foreign'
            )
            .references('administrations.id')
        })
      })
      .then(() => {
        return knex.schema.table('utilisateurs__administrations', table => {
          table
            .foreign(
              'administration_id',
              'utilisateurs__administrations_administrationid_foreign'
            )
            .references('administrations.id')
        })
      })
  )
}
