// Liste des noms des tables à sauvegarder au format json
const tables = [
  { name: 'activites_statuts', orderBy: ['id'] },
  { name: 'activites_types', orderBy: ['id'] },
  {
    name: 'activites_types__documents_types',
    orderBy: ['activite_type_id', 'document_type_id']
  },
  { name: 'activites_types__pays', orderBy: ['pays_id', 'activite_type_id'] },
  {
    name: 'activites_types__titres_types',
    orderBy: ['titre_type_id', 'activite_type_id']
  },
  { name: 'administrations', orderBy: ['id'] },
  {
    name: 'administrations__activites_types',
    orderBy: ['activite_type_id', 'administration_id']
  },
  {
    name: 'administrations__titres_types',
    orderBy: ['administration_id', 'titre_type_id']
  },
  {
    name: 'administrations__titres_types__etapes_types',
    orderBy: ['administration_id', 'titre_type_id', 'etape_type_id']
  },
  {
    name: 'administrations__titres_types__titres_statuts',
    orderBy: ['administration_id', 'titre_type_id', 'titre_statut_id']
  },
  { name: 'administrations_types', orderBy: ['id'] },
  { name: 'annees', orderBy: ['id'] },
  // la table 'caches' n'est pas utile dans les json
  // { name: 'caches',orderBy: ['id'] },
  { name: 'communes', orderBy: ['id'] },
  { name: 'definitions', orderBy: ['id'] },
  { name: 'demarches_statuts', orderBy: ['id'] },
  { name: 'demarches_types', orderBy: ['id'] },
  { name: 'departements', orderBy: ['id'] },
  { name: 'devises', orderBy: ['id'] },
  { name: 'documents', orderBy: ['id'] },
  { name: 'documents_types', orderBy: ['id'] },
  { name: 'domaines', orderBy: ['id'] },
  { name: 'entreprises', orderBy: ['id'] },
  { name: 'entreprises__documents_types', orderBy: ['document_type_id'] },
  { name: 'entreprises_etablissements', orderBy: ['id'] },
  { name: 'etapes_statuts', orderBy: ['id'] },
  { name: 'etapes_types', orderBy: ['id'] },
  {
    name: 'etapes_types__documents_types',
    orderBy: ['etape_type_id', 'document_type_id']
  },
  {
    name: 'etapes_types__justificatifs_types',
    orderBy: ['etape_type_id', 'document_type_id']
  },
  {
    name: 'etapes_types__etapes_statuts',
    orderBy: ['etape_type_id', 'etape_statut_id']
  },
  { name: 'forets', orderBy: ['id'] },
  { name: 'frequences', orderBy: ['id'] },
  { name: 'geo_systemes', orderBy: ['id'] },
  { name: 'globales', orderBy: ['id'] },
  { name: 'mois', orderBy: ['id'] },
  { name: 'pays', orderBy: ['id'] },
  { name: 'permissions', orderBy: ['id'] },
  { name: 'phases_statuts', orderBy: ['id'] },
  { name: 'references_types', orderBy: ['id'] },
  { name: 'regions', orderBy: ['id'] },
  { name: 'substances', orderBy: ['id'] },
  {
    name: 'substances__substances_legales',
    orderBy: ['substance_id', 'substance_legale_id']
  },
  { name: 'substances_fiscales', orderBy: ['id'] },
  { name: 'substances_legales', orderBy: ['id'] },
  { name: 'substances_legales_codes', orderBy: ['id'] },
  { name: 'titres', orderBy: ['id'] },
  { name: 'titres_activites', orderBy: ['id'] },
  {
    name: 'titres_administrations_gestionnaires',
    orderBy: ['titre_id', 'administration_id']
  },
  {
    name: 'titres_administrations_locales',
    orderBy: ['titre_etape_id', 'administration_id']
  },
  { name: 'titres_amodiataires', orderBy: ['titre_etape_id', 'entreprise_id'] },
  { name: 'titres_communes', orderBy: ['titre_etape_id', 'commune_id'] },
  { name: 'titres_demarches', orderBy: ['id'] },
  {
    name: 'titres_demarches_liens',
    orderBy: ['enfant_titre_demarche_id', 'parent_titre_demarche_id']
  },
  { name: 'titres_etapes', orderBy: ['id'] },
  {
    name: 'titres_etapes_justificatifs',
    orderBy: ['titre_etape_id', 'document_id']
  },
  { name: 'titres_forets', orderBy: ['titre_etape_id', 'foret_id'] },
  { name: 'titres_phases', orderBy: ['titre_demarche_id', 'statut_id'] },
  { name: 'titres_points', orderBy: ['id'] },
  { name: 'titres_points_references', orderBy: ['id'] },
  { name: 'titres_references', orderBy: ['titre_id', 'type_id'] },
  { name: 'titres_statuts', orderBy: ['id'] },
  { name: 'titres_substances', orderBy: ['titre_etape_id', 'substance_id'] },
  { name: 'titres_titulaires', orderBy: ['titre_etape_id', 'entreprise_id'] },
  { name: 'titres_travaux', orderBy: ['id'] },
  { name: 'titres_travaux_etapes', orderBy: ['id'] },
  { name: 'titres_types', orderBy: ['id'] },
  {
    name: 'titres_types__demarches_types',
    orderBy: ['titre_type_id', 'demarche_type_id']
  },
  {
    name: 'titres_types__demarches_types__etapes_types',
    orderBy: ['titre_type_id', 'demarche_type_id', 'etape_type_id']
  },
  {
    name: 'titres_types__titres_statuts',
    orderBy: ['titre_type_id', 'titre_statut_id']
  },
  { name: 'titres_types_types', orderBy: ['id'] },
  { name: 'travaux_etapes_types', orderBy: ['id'] },
  {
    name: 'travaux_etapes_types__documents_types',
    orderBy: ['travaux_etape_type_id', 'document_type_id']
  },
  {
    name: 'travaux_etapes_types__etapes_statuts',
    orderBy: ['travaux_etape_type_id', 'etape_statut_id']
  },
  { name: 'travaux_types', orderBy: ['id'] },
  {
    name: 'travaux_types__travaux_etapes_types',
    orderBy: ['travaux_type_id', 'travaux_etape_type_id']
  },
  { name: 'trimestres', orderBy: ['id'] },
  { name: 'unites', orderBy: ['id'] },
  { name: 'utilisateurs', orderBy: ['id'] },
  {
    name: 'utilisateurs__administrations',
    orderBy: ['utilisateur_id', 'administration_id']
  },
  {
    name: 'utilisateurs__entreprises',
    orderBy: ['utilisateur_id', 'entreprise_id']
  }
]

export { tables }
