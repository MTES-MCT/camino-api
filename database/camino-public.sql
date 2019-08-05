--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4
-- Dumped by pg_dump version 11.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.utilisateurs DROP CONSTRAINT utilisateurs_permissionid_foreign;
ALTER TABLE ONLY public.utilisateurs DROP CONSTRAINT utilisateurs_administrationid_foreign;
ALTER TABLE ONLY public.utilisateurs__entreprises DROP CONSTRAINT utilisateurs__entreprises_utilisateurid_foreign;
ALTER TABLE ONLY public.utilisateurs__entreprises DROP CONSTRAINT utilisateurs__entreprises_entrepriseid_foreign;
ALTER TABLE ONLY public.trimestres DROP CONSTRAINT trimestres_frequenceid_foreign;
ALTER TABLE ONLY public.titres_titulaires DROP CONSTRAINT titrestitulaires_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_titulaires DROP CONSTRAINT titrestitulaires_entrepriseid_foreign;
ALTER TABLE ONLY public.titres_substances DROP CONSTRAINT titressubstances_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_substances DROP CONSTRAINT titressubstances_substanceid_foreign;
ALTER TABLE ONLY public.titres_points_references DROP CONSTRAINT titrespointsreferences_titrepointid_foreign;
ALTER TABLE ONLY public.titres_points DROP CONSTRAINT titrespoints_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_phases DROP CONSTRAINT titresphases_titredemarcheid_foreign;
ALTER TABLE ONLY public.titres_phases DROP CONSTRAINT titresphases_statutid_foreign;
ALTER TABLE ONLY public.titres_incertitudes DROP CONSTRAINT titresincertitudes_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titresetapes_volumeuniteid_foreign;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titresetapes_typeid_foreign;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titresetapes_titredemarcheid_foreign;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titresetapes_statutid_foreign;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titresetapes_engagementdeviseid_foreign;
ALTER TABLE ONLY public.titres_emprises DROP CONSTRAINT titresemprises_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_emprises DROP CONSTRAINT titresemprises_empriseid_foreign;
ALTER TABLE ONLY public.titres_documents DROP CONSTRAINT titresdocuments_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_demarches_liens DROP CONSTRAINT titresdemarchesliens_parenttitredemarcheid_foreign;
ALTER TABLE ONLY public.titres_demarches_liens DROP CONSTRAINT titresdemarchesliens_enfanttitredemarcheid_foreign;
ALTER TABLE ONLY public.titres_demarches DROP CONSTRAINT titresdemarches_typeid_foreign;
ALTER TABLE ONLY public.titres_demarches DROP CONSTRAINT titresdemarches_titreid_foreign;
ALTER TABLE ONLY public.titres_demarches DROP CONSTRAINT titresdemarches_statutid_foreign;
ALTER TABLE ONLY public.titres_communes DROP CONSTRAINT titrescommunes_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_communes DROP CONSTRAINT titrescommunes_communeid_foreign;
ALTER TABLE ONLY public.titres_amodiataires DROP CONSTRAINT titresamodiataires_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_amodiataires DROP CONSTRAINT titresamodiataires_entrepriseid_foreign;
ALTER TABLE ONLY public.titres_administrations DROP CONSTRAINT titresadministrations_titreetapeid_foreign;
ALTER TABLE ONLY public.titres_administrations DROP CONSTRAINT titresadministrations_administrationid_foreign;
ALTER TABLE ONLY public.titres_activites DROP CONSTRAINT titresactivites_utilisateurid_foreign;
ALTER TABLE ONLY public.titres_activites DROP CONSTRAINT titresactivites_titreid_foreign;
ALTER TABLE ONLY public.titres_activites DROP CONSTRAINT titresactivites_activitetypeid_foreign;
ALTER TABLE ONLY public.titres_activites DROP CONSTRAINT titresactivites_activitestatutid_foreign;
ALTER TABLE ONLY public.substances_legales DROP CONSTRAINT substanceslegales_substancelegalecodeid_foreign;
ALTER TABLE ONLY public.substances_legales DROP CONSTRAINT substanceslegales_domaineid_foreign;
ALTER TABLE ONLY public.substances__substances_legales DROP CONSTRAINT substances__substanceslegales_substancelegaleid_foreign;
ALTER TABLE ONLY public.substances__substances_legales DROP CONSTRAINT substances__substanceslegales_substanceid_foreign;
ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_paysid_foreign;
ALTER TABLE ONLY public.mois DROP CONSTRAINT mois_trimestreid_foreign;
ALTER TABLE ONLY public.mois DROP CONSTRAINT mois_frequenceid_foreign;
ALTER TABLE ONLY public.etapes_types__etapes_statuts DROP CONSTRAINT etapestypes__etapesstatuts_etapetypeid_foreign;
ALTER TABLE ONLY public.etapes_types__etapes_statuts DROP CONSTRAINT etapestypes__etapesstatuts_etapestatutid_foreign;
ALTER TABLE ONLY public.entreprises_etablissements DROP CONSTRAINT entreprisesetablissements_entrepriseid_foreign;
ALTER TABLE ONLY public.domaines__types DROP CONSTRAINT domaines__types_typeid_foreign;
ALTER TABLE ONLY public.domaines__types DROP CONSTRAINT domaines__types_domaineid_foreign;
ALTER TABLE ONLY public.departements DROP CONSTRAINT departements_regionid_foreign;
ALTER TABLE ONLY public.demarches_types__types DROP CONSTRAINT demarchestypes__types_typeid_foreign;
ALTER TABLE ONLY public.demarches_types__types DROP CONSTRAINT demarchestypes__types_demarchetypeid_foreign;
ALTER TABLE ONLY public.demarches_types__etapes_types DROP CONSTRAINT demarchestypes__etapestypes_typeid_foreign;
ALTER TABLE ONLY public.demarches_types__etapes_types DROP CONSTRAINT demarchestypes__etapestypes_etapetypeid_foreign;
ALTER TABLE ONLY public.demarches_types__etapes_types DROP CONSTRAINT demarchestypes__etapestypes_demarchetypeid_foreign;
ALTER TABLE ONLY public.communes DROP CONSTRAINT communes_departementid_foreign;
ALTER TABLE ONLY public.administrations DROP CONSTRAINT administrations_typeid_foreign;
ALTER TABLE ONLY public.administrations DROP CONSTRAINT administrations_regionid_foreign;
ALTER TABLE ONLY public.administrations DROP CONSTRAINT administrations_departementid_foreign;
ALTER TABLE ONLY public.administrations__domaines DROP CONSTRAINT administrations__domaines_domaineid_foreign;
ALTER TABLE ONLY public.administrations__domaines DROP CONSTRAINT administrations__domaines_administrationid_foreign;
ALTER TABLE ONLY public.activites_types DROP CONSTRAINT activitestypes_frequenceid_foreign;
ALTER TABLE ONLY public.activites_types__types DROP CONSTRAINT activitestypes__types_typeid_foreign;
ALTER TABLE ONLY public.activites_types__types DROP CONSTRAINT activitestypes__types_domaineid_foreign;
ALTER TABLE ONLY public.activites_types__types DROP CONSTRAINT activitestypes__types_activitetypeid_foreign;
ALTER TABLE ONLY public.activites_types__pays DROP CONSTRAINT activitestypes__pays_paysid_foreign;
ALTER TABLE ONLY public.activites_types__pays DROP CONSTRAINT activitestypes__pays_activitetypeid_foreign;
ALTER TABLE ONLY public.volume_unites DROP CONSTRAINT volume_unites_pkey;
ALTER TABLE ONLY public.utilisateurs DROP CONSTRAINT utilisateurs_pkey;
ALTER TABLE ONLY public.types DROP CONSTRAINT types_pkey;
ALTER TABLE ONLY public.trimestres DROP CONSTRAINT trimestres_pkey;
ALTER TABLE ONLY public.titres_titulaires DROP CONSTRAINT titres_titulaires_pkey;
ALTER TABLE ONLY public.titres_substances DROP CONSTRAINT titres_substances_pkey;
ALTER TABLE ONLY public.titres_points_references DROP CONSTRAINT titres_points_references_pkey;
ALTER TABLE ONLY public.titres_points DROP CONSTRAINT titres_points_pkey;
ALTER TABLE ONLY public.titres DROP CONSTRAINT titres_pkey;
ALTER TABLE ONLY public.titres_phases DROP CONSTRAINT titres_phases_pkey;
ALTER TABLE ONLY public.titres_incertitudes DROP CONSTRAINT titres_incertitudes_pkey;
ALTER TABLE ONLY public.titres_etapes DROP CONSTRAINT titres_etapes_pkey;
ALTER TABLE ONLY public.titres_emprises DROP CONSTRAINT titres_emprises_pkey;
ALTER TABLE ONLY public.titres_documents DROP CONSTRAINT titres_documents_pkey;
ALTER TABLE ONLY public.titres_demarches DROP CONSTRAINT titres_demarches_pkey;
ALTER TABLE ONLY public.titres_demarches_liens DROP CONSTRAINT titres_demarches_liens_pkey;
ALTER TABLE ONLY public.titres_communes DROP CONSTRAINT titres_communes_pkey;
ALTER TABLE ONLY public.titres_amodiataires DROP CONSTRAINT titres_amodiataires_pkey;
ALTER TABLE ONLY public.titres_administrations DROP CONSTRAINT titres_administrations_pkey;
ALTER TABLE ONLY public.titres_activites DROP CONSTRAINT titres_activites_pkey;
ALTER TABLE ONLY public.substances DROP CONSTRAINT substances_pkey;
ALTER TABLE ONLY public.substances_legales DROP CONSTRAINT substances_legales_pkey;
ALTER TABLE ONLY public.substances_legales_codes DROP CONSTRAINT substances_legales_codes_pkey;
ALTER TABLE ONLY public.substances__substances_legales DROP CONSTRAINT substances__substances_legales_pkey;
ALTER TABLE ONLY public.statuts DROP CONSTRAINT statuts_pkey;
ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_pkey;
ALTER TABLE ONLY public.phases_statuts DROP CONSTRAINT phases_statuts_pkey;
ALTER TABLE ONLY public.permissions DROP CONSTRAINT permissions_pkey;
ALTER TABLE ONLY public.pays DROP CONSTRAINT pays_pkey;
ALTER TABLE ONLY public.mois DROP CONSTRAINT mois_pkey;
ALTER TABLE ONLY public.knex_migrations DROP CONSTRAINT knex_migrations_pkey;
ALTER TABLE ONLY public.knex_migrations_lock DROP CONSTRAINT knex_migrations_lock_pkey;
ALTER TABLE ONLY public.geo_systemes DROP CONSTRAINT geo_systemes_pkey;
ALTER TABLE ONLY public.frequences DROP CONSTRAINT frequences_pkey;
ALTER TABLE ONLY public.etapes_types DROP CONSTRAINT etapes_types_pkey;
ALTER TABLE ONLY public.etapes_types__etapes_statuts DROP CONSTRAINT etapes_types__etapes_statuts_pkey;
ALTER TABLE ONLY public.etapes_statuts DROP CONSTRAINT etapes_statuts_pkey;
ALTER TABLE ONLY public.entreprises DROP CONSTRAINT entreprises_pkey;
ALTER TABLE ONLY public.entreprises_etablissements DROP CONSTRAINT entreprises_etablissements_pkey;
ALTER TABLE ONLY public.emprises DROP CONSTRAINT emprises_pkey;
ALTER TABLE ONLY public.domaines DROP CONSTRAINT domaines_pkey;
ALTER TABLE ONLY public.domaines__types DROP CONSTRAINT domaines__types_pkey;
ALTER TABLE ONLY public.devises DROP CONSTRAINT devises_pkey;
ALTER TABLE ONLY public.departements DROP CONSTRAINT departements_pkey;
ALTER TABLE ONLY public.demarches_types DROP CONSTRAINT demarches_types_pkey;
ALTER TABLE ONLY public.demarches_types__types DROP CONSTRAINT demarches_types__types_pkey;
ALTER TABLE ONLY public.demarches_types__etapes_types DROP CONSTRAINT demarches_types__etapes_types_pkey;
ALTER TABLE ONLY public.demarches_statuts DROP CONSTRAINT demarches_statuts_pkey;
ALTER TABLE ONLY public.communes DROP CONSTRAINT communes_pkey;
ALTER TABLE ONLY public.administrations_types DROP CONSTRAINT administrations_types_pkey;
ALTER TABLE ONLY public.administrations DROP CONSTRAINT administrations_pkey;
ALTER TABLE ONLY public.activites_types DROP CONSTRAINT activites_types_pkey;
ALTER TABLE ONLY public.activites_types__types DROP CONSTRAINT activites_types__types_pkey;
ALTER TABLE ONLY public.activites_types__pays DROP CONSTRAINT activites_types__pays_pkey;
ALTER TABLE ONLY public.activites_statuts DROP CONSTRAINT activites_statuts_pkey;
ALTER TABLE public.knex_migrations_lock ALTER COLUMN index DROP DEFAULT;
ALTER TABLE public.knex_migrations ALTER COLUMN id DROP DEFAULT;
DROP TABLE public.volume_unites;
DROP TABLE public.utilisateurs__entreprises;
DROP TABLE public.utilisateurs;
DROP TABLE public.types;
DROP TABLE public.trimestres;
DROP TABLE public.titres_titulaires;
DROP TABLE public.titres_substances;
DROP TABLE public.titres_points_references;
DROP TABLE public.titres_points;
DROP TABLE public.titres_phases;
DROP TABLE public.titres_incertitudes;
DROP TABLE public.titres_etapes;
DROP TABLE public.titres_emprises;
DROP TABLE public.titres_documents;
DROP TABLE public.titres_demarches_liens;
DROP TABLE public.titres_demarches;
DROP TABLE public.titres_communes;
DROP TABLE public.titres_amodiataires;
DROP TABLE public.titres_administrations;
DROP TABLE public.titres_activites;
DROP TABLE public.titres;
DROP TABLE public.substances_legales_codes;
DROP TABLE public.substances_legales;
DROP TABLE public.substances__substances_legales;
DROP TABLE public.substances;
DROP TABLE public.statuts;
DROP TABLE public.regions;
DROP TABLE public.phases_statuts;
DROP TABLE public.permissions;
DROP TABLE public.pays;
DROP TABLE public.mois;
DROP SEQUENCE public.knex_migrations_lock_index_seq;
DROP TABLE public.knex_migrations_lock;
DROP SEQUENCE public.knex_migrations_id_seq;
DROP TABLE public.knex_migrations;
DROP TABLE public.geo_systemes;
DROP TABLE public.frequences;
DROP TABLE public.etapes_types__etapes_statuts;
DROP TABLE public.etapes_types;
DROP TABLE public.etapes_statuts;
DROP TABLE public.entreprises_etablissements;
DROP TABLE public.entreprises;
DROP TABLE public.emprises;
DROP TABLE public.domaines__types;
DROP TABLE public.domaines;
DROP TABLE public.devises;
DROP TABLE public.departements;
DROP TABLE public.demarches_types__types;
DROP TABLE public.demarches_types__etapes_types;
DROP TABLE public.demarches_types;
DROP TABLE public.demarches_statuts;
DROP TABLE public.communes;
DROP TABLE public.administrations_types;
DROP TABLE public.administrations__domaines;
DROP TABLE public.administrations;
DROP TABLE public.activites_types__types;
DROP TABLE public.activites_types__pays;
DROP TABLE public.activites_types;
DROP TABLE public.activites_statuts;
SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: activites_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activites_statuts (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    couleur character varying(16) NOT NULL
);


ALTER TABLE public.activites_statuts OWNER TO postgres;

--
-- Name: activites_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activites_types (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    sections jsonb[],
    frequence_id character varying(3) NOT NULL
);


ALTER TABLE public.activites_types OWNER TO postgres;

--
-- Name: activites_types__pays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activites_types__pays (
    pays_id character varying(3) NOT NULL,
    activite_type_id character varying(3) NOT NULL
);


ALTER TABLE public.activites_types__pays OWNER TO postgres;

--
-- Name: activites_types__types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activites_types__types (
    domaine_id character varying(1) NOT NULL,
    type_id character varying(3) NOT NULL,
    activite_type_id character varying(3) NOT NULL
);


ALTER TABLE public.activites_types__types OWNER TO postgres;

--
-- Name: administrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrations (
    id character varying(64) NOT NULL,
    type_id character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    service character varying(255),
    url character varying(255),
    email character varying(255),
    telephone character varying(255),
    adresse1 character varying(255),
    adresse2 character varying(255),
    code_postal character varying(255),
    commune character varying(255),
    cedex character varying(255),
    departement_id character varying(255),
    region_id character varying(255)
);


ALTER TABLE public.administrations OWNER TO postgres;

--
-- Name: administrations__domaines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrations__domaines (
    domaine_id character varying(1) NOT NULL,
    administration_id character varying(255) NOT NULL
);


ALTER TABLE public.administrations__domaines OWNER TO postgres;

--
-- Name: administrations_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrations_types (
    id character varying(64) NOT NULL,
    nom character varying(255) NOT NULL,
    ordre integer
);


ALTER TABLE public.administrations_types OWNER TO postgres;

--
-- Name: communes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communes (
    id character varying(5) NOT NULL,
    nom character varying(255) NOT NULL,
    departement_id character varying(3) NOT NULL
);


ALTER TABLE public.communes OWNER TO postgres;

--
-- Name: demarches_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demarches_statuts (
    id character varying(3) NOT NULL,
    nom character varying(32) NOT NULL,
    couleur character varying(16) NOT NULL
);


ALTER TABLE public.demarches_statuts OWNER TO postgres;

--
-- Name: demarches_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demarches_types (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    ordre integer,
    duree boolean,
    points boolean,
    substances boolean,
    titulaires boolean,
    renouvelable boolean,
    exception boolean,
    auto boolean
);


ALTER TABLE public.demarches_types OWNER TO postgres;

--
-- Name: demarches_types__etapes_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demarches_types__etapes_types (
    demarche_type_id character varying(7) NOT NULL,
    etape_type_id character varying(3) NOT NULL,
    type_id character varying(3) NOT NULL,
    ordre integer
);


ALTER TABLE public.demarches_types__etapes_types OWNER TO postgres;

--
-- Name: demarches_types__types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demarches_types__types (
    type_id character varying(3) NOT NULL,
    demarche_type_id character varying(3) NOT NULL,
    duree_max integer,
    acceptation_implicite boolean,
    delai_implicite character varying(255),
    delai_recours character varying(255),
    legal_ref character varying(255),
    legal_lien character varying(255),
    date_debut date,
    date_fin date
);


ALTER TABLE public.demarches_types__types OWNER TO postgres;

--
-- Name: departements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departements (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    region_id character varying(2) NOT NULL,
    cheflieu_id character varying(5)
);


ALTER TABLE public.departements OWNER TO postgres;

--
-- Name: devises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devises (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL
);


ALTER TABLE public.devises OWNER TO postgres;

--
-- Name: domaines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domaines (
    id character varying(1) NOT NULL,
    nom character varying(255) NOT NULL,
    ordre integer
);


ALTER TABLE public.domaines OWNER TO postgres;

--
-- Name: domaines__types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domaines__types (
    domaine_id character varying(1) NOT NULL,
    type_id character varying(3) NOT NULL,
    archive boolean
);


ALTER TABLE public.domaines__types OWNER TO postgres;

--
-- Name: emprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emprises (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL
);


ALTER TABLE public.emprises OWNER TO postgres;

--
-- Name: entreprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entreprises (
    id character varying(64) NOT NULL,
    nom character varying(255) NOT NULL,
    pays_id character varying(255),
    legal_siren character varying(255),
    legal_etranger character varying(255),
    legal_forme character varying(255),
    categorie character varying(255),
    date_creation date,
    adresse character varying(255),
    code_postal character varying(255),
    commune character varying(255),
    cedex character varying(255),
    url character varying(255),
    email character varying(255),
    telephone character varying(255)
);


ALTER TABLE public.entreprises OWNER TO postgres;

--
-- Name: entreprises_etablissements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entreprises_etablissements (
    id character varying(64) NOT NULL,
    entreprise_id character varying(64) NOT NULL,
    nom character varying(255),
    legal_siret character varying(255),
    date_debut date,
    date_fin date
);


ALTER TABLE public.entreprises_etablissements OWNER TO postgres;

--
-- Name: etapes_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etapes_statuts (
    id character varying(3) NOT NULL,
    nom character varying(32) NOT NULL,
    couleur character varying(16) NOT NULL
);


ALTER TABLE public.etapes_statuts OWNER TO postgres;

--
-- Name: etapes_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etapes_types (
    id character varying(3) NOT NULL,
    nom character varying(128),
    fondamentale boolean,
    acceptation_auto boolean,
    legal_ref character varying(255),
    legal_lien character varying(255),
    date_debut date,
    date_fin date,
    sections jsonb[]
);


ALTER TABLE public.etapes_types OWNER TO postgres;

--
-- Name: etapes_types__etapes_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etapes_types__etapes_statuts (
    etape_type_id character varying(7) NOT NULL,
    etape_statut_id character varying(3) NOT NULL,
    ordre integer
);


ALTER TABLE public.etapes_types__etapes_statuts OWNER TO postgres;

--
-- Name: frequences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.frequences (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    periodes_nom character varying(255)
);


ALTER TABLE public.frequences OWNER TO postgres;

--
-- Name: geo_systemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_systemes (
    id character varying(5) NOT NULL,
    nom character varying(255) NOT NULL,
    unite character varying(8),
    zone character varying(255)
);


ALTER TABLE public.geo_systemes OWNER TO postgres;

--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: mois; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mois (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    frequence_id character varying(3),
    trimestre_id integer
);


ALTER TABLE public.mois OWNER TO postgres;

--
-- Name: pays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pays (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL,
    timezone character varying(255)
);


ALTER TABLE public.pays OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id character varying(12) NOT NULL,
    nom character varying(255) NOT NULL,
    ordre integer
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: phases_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phases_statuts (
    id character varying(3) NOT NULL,
    nom character varying(32) NOT NULL,
    couleur character varying(16) NOT NULL
);


ALTER TABLE public.phases_statuts OWNER TO postgres;

--
-- Name: regions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regions (
    id character varying(2) NOT NULL,
    nom character varying(255),
    pays_id character varying(3) NOT NULL,
    cheflieu_id character varying(5)
);


ALTER TABLE public.regions OWNER TO postgres;

--
-- Name: statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuts (
    id character varying(3) NOT NULL,
    nom character varying(32) NOT NULL,
    couleur character varying(16) NOT NULL
);


ALTER TABLE public.statuts OWNER TO postgres;

--
-- Name: substances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substances (
    id character varying(4) NOT NULL,
    nom character varying(255) NOT NULL,
    symbole character varying(255),
    gerep integer,
    description character varying(2048)
);


ALTER TABLE public.substances OWNER TO postgres;

--
-- Name: substances__substances_legales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substances__substances_legales (
    substance_id character varying(255) NOT NULL,
    substance_legale_id character varying(255) NOT NULL
);


ALTER TABLE public.substances__substances_legales OWNER TO postgres;

--
-- Name: substances_legales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substances_legales (
    id character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    domaine_id character varying(1) NOT NULL,
    description character varying(255),
    substance_legale_code_id character varying(255) NOT NULL
);


ALTER TABLE public.substances_legales OWNER TO postgres;

--
-- Name: substances_legales_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.substances_legales_codes (
    id character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    description character varying(255),
    lien character varying(255) NOT NULL
);


ALTER TABLE public.substances_legales_codes OWNER TO postgres;

--
-- Name: titres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres (
    id character varying(128) NOT NULL,
    nom character varying(255) NOT NULL,
    type_id character varying(3) NOT NULL,
    domaine_id character varying(1) NOT NULL,
    statut_id character varying(3) DEFAULT 'ind'::character varying NOT NULL,
    "references" jsonb,
    date_debut date,
    date_fin date,
    date_demande date,
    activites_deposees integer,
    activites_en_construction integer,
    activites_absentes integer,
    points_titre_etape_id character varying(128),
    titulaires_titre_etape_id character varying(128),
    amodiataires_titre_etape_id character varying(128),
    administrations_titre_etape_id character varying(128),
    surface_titre_etape_id character varying(128),
    volume_titre_etape_id character varying(128),
    volume_unite_id_titre_etape_id character varying(128),
    substances_titre_etape_id character varying(128),
    communes_titre_etape_id character varying(128),
    engagement_titre_etape_id character varying(128),
    engagement_devise_id_titre_etape_id character varying(128)
);


ALTER TABLE public.titres OWNER TO postgres;

--
-- Name: titres_activites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_activites (
    id character varying(255) NOT NULL,
    titre_id character varying(128),
    utilisateur_id character varying(128),
    date date,
    date_saisie date,
    contenu jsonb,
    activite_type_id character varying(3) NOT NULL,
    activite_statut_id character varying(3) NOT NULL,
    annee integer,
    frequence_periode_id integer
);


ALTER TABLE public.titres_activites OWNER TO postgres;

--
-- Name: titres_administrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_administrations (
    titre_etape_id character varying(128) NOT NULL,
    administration_id character varying(64) NOT NULL,
    coordinateur boolean
);


ALTER TABLE public.titres_administrations OWNER TO postgres;

--
-- Name: titres_amodiataires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_amodiataires (
    titre_etape_id character varying(128) NOT NULL,
    entreprise_id character varying(64) NOT NULL,
    operateur boolean
);


ALTER TABLE public.titres_amodiataires OWNER TO postgres;

--
-- Name: titres_communes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_communes (
    titre_etape_id character varying(128) NOT NULL,
    commune_id character varying(8) NOT NULL
);


ALTER TABLE public.titres_communes OWNER TO postgres;

--
-- Name: titres_demarches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_demarches (
    id character varying(128) NOT NULL,
    titre_id character varying(128) NOT NULL,
    type_id character varying(3) NOT NULL,
    statut_id character varying(3) DEFAULT 'ind'::character varying NOT NULL,
    ordre integer DEFAULT 0,
    annulation_titre_demarche_id character varying(128)
);


ALTER TABLE public.titres_demarches OWNER TO postgres;

--
-- Name: titres_demarches_liens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_demarches_liens (
    enfant_titre_demarche_id character varying(128) NOT NULL,
    parent_titre_demarche_id character varying(128) NOT NULL
);


ALTER TABLE public.titres_demarches_liens OWNER TO postgres;

--
-- Name: titres_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_documents (
    id character varying(255) NOT NULL,
    titre_etape_id character varying(128) NOT NULL,
    type character varying(32) NOT NULL,
    nom character varying(1024) NOT NULL,
    jorf character varying(32),
    nor character varying(32),
    url character varying(255),
    uri character varying(255),
    fichier character varying(255),
    public boolean
);


ALTER TABLE public.titres_documents OWNER TO postgres;

--
-- Name: titres_emprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_emprises (
    titre_etape_id character varying(128) NOT NULL,
    emprise_id character varying(3) NOT NULL
);


ALTER TABLE public.titres_emprises OWNER TO postgres;

--
-- Name: titres_etapes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_etapes (
    id character varying(128) NOT NULL,
    titre_demarche_id character varying(128) NOT NULL,
    type_id character varying(3) NOT NULL,
    statut_id character varying(3) NOT NULL,
    ordre integer,
    date date NOT NULL,
    date_debut date,
    date_fin date,
    duree integer,
    surface real,
    volume real,
    volume_unite_id character varying(255),
    visas text[],
    engagement real,
    engagement_devise_id character varying(255),
    source_indisponible boolean,
    contenu jsonb
);


ALTER TABLE public.titres_etapes OWNER TO postgres;

--
-- Name: titres_incertitudes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_incertitudes (
    titre_etape_id character varying(128) NOT NULL,
    date boolean,
    date_debut boolean,
    date_fin boolean,
    duree boolean,
    surface boolean,
    volume boolean,
    engagement boolean,
    points boolean,
    substances boolean,
    titulaires boolean,
    amodiataires boolean,
    administrations boolean
);


ALTER TABLE public.titres_incertitudes OWNER TO postgres;

--
-- Name: titres_phases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_phases (
    titre_demarche_id character varying(128) NOT NULL,
    statut_id character varying(3) NOT NULL,
    date_debut date,
    date_fin date
);


ALTER TABLE public.titres_phases OWNER TO postgres;

--
-- Name: titres_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_points (
    id character varying(255) NOT NULL,
    titre_etape_id character varying(128) NOT NULL,
    coordonnees point NOT NULL,
    groupe integer NOT NULL,
    contour integer NOT NULL,
    point integer NOT NULL,
    nom character varying(255) NOT NULL,
    description character varying(1023),
    securite boolean
);


ALTER TABLE public.titres_points OWNER TO postgres;

--
-- Name: titres_points_references; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_points_references (
    id character varying(255) NOT NULL,
    titre_point_id character varying(255),
    geo_systeme_id character varying(5) NOT NULL,
    coordonnees text[] NOT NULL
);


ALTER TABLE public.titres_points_references OWNER TO postgres;

--
-- Name: titres_substances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_substances (
    titre_etape_id character varying(128) NOT NULL,
    substance_id character varying(4) NOT NULL,
    connexe boolean,
    ordre integer
);


ALTER TABLE public.titres_substances OWNER TO postgres;

--
-- Name: titres_titulaires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titres_titulaires (
    titre_etape_id character varying(128) NOT NULL,
    entreprise_id character varying(64) NOT NULL,
    operateur boolean
);


ALTER TABLE public.titres_titulaires OWNER TO postgres;

--
-- Name: trimestres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trimestres (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    frequence_id character varying(3)
);


ALTER TABLE public.trimestres OWNER TO postgres;

--
-- Name: types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL
);


ALTER TABLE public.types OWNER TO postgres;

--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id character varying(255) NOT NULL,
    email character varying(255),
    mot_de_passe character varying(255) NOT NULL,
    nom character varying(255),
    prenom character varying(255),
    administration_id character varying(64),
    telephone_fixe character varying(255),
    telephone_mobile character varying(255),
    permission_id character varying(12) NOT NULL,
    preferences json
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: utilisateurs__entreprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs__entreprises (
    utilisateur_id character varying(64),
    entreprise_id character varying(64)
);


ALTER TABLE public.utilisateurs__entreprises OWNER TO postgres;

--
-- Name: volume_unites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volume_unites (
    id character varying(3) NOT NULL,
    nom character varying(255) NOT NULL
);


ALTER TABLE public.volume_unites OWNER TO postgres;

--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Data for Name: activites_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activites_statuts (id, nom, couleur) FROM stdin;
abs	absent	error
enc	en construction	warning
dep	déposé	success
\.


--
-- Data for Name: activites_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activites_types (id, nom, sections, frequence_id) FROM stdin;
grp	rapport trimestriel d'activité	{"{\\"id\\": \\"renseignements\\", \\"elements\\": [{\\"id\\": \\"orNet\\", \\"nom\\": \\"Or net extrait annuel (g)\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"<b>Masse d’or en gramme obtenue au cours de l’année après traitement métallurgique</b> (au sens de l’<a href=\\\\\\"https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000021850943&cidTexte=LEGITEXT000006069569\\\\\\" target=\\\\\\"_blank\\\\\\" rel=\\\\\\"noopener noreferrer\\\\\\">article 318 B de l’annexe II au code général des impôts, annexe 2 </a>). Cette masse sera prise en compte pour le calcul de la taxe sur l’or et des différentes redevances associées.\\", \\"frequencePeriodesIds\\": [4]}, {\\"id\\": \\"orBrut\\", \\"nom\\": \\"Or brut extrait (g)\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Masse d’or brut en sortie de mine extrait au cours du trimestre (exemple : masse sous la forme de concentré gravimétrique).\\"}, {\\"id\\": \\"orExtrait\\", \\"nom\\": \\"Or extrait (g)\\", \\"type\\": \\"number\\", \\"dateFin\\": \\"2018-01-01\\", \\"description\\": \\"Masse d'or brut en sortie de mine, ou nette obtenue  après traitement métallurgique, extrait au cours du trimestre.\\"}, {\\"id\\": \\"volumeMinerai\\", \\"nom\\": \\"Minerai extrait (m3)\\", \\"type\\": \\"number\\", \\"dateFin\\": \\"2018-01-01\\", \\"description\\": \\"Volume en mètre cube de minerai extrait au cours du trimestre.\\"}, {\\"id\\": \\"mercure\\", \\"nom\\": \\"Mercure récupéré (g)\\", \\"type\\": \\"number\\", \\"description\\": \\"Masse en gramme de l’ensemble des produits contaminés envoyés en traitement au cours du trimestre.\\"}, {\\"id\\": \\"carburantDetaxe\\", \\"nom\\": \\"Carburant détaxé (l)\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Volume total en litre de carburant détaxé consommé au cours du trimestre par les travaux réalisés sur le chantier.\\"}, {\\"id\\": \\"carburantConventionnel\\", \\"nom\\": \\"Carburant conventionnel (l)\\", \\"type\\": \\"number\\", \\"description\\": \\"Volume total en litre de carburant conventionnel consommé au cours du trimestre par les travaux réalisés sur le chantier.\\"}, {\\"id\\": \\"pompes\\", \\"nom\\": \\"Pompes actives\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Nombre moyen de pompes actives au cours du trimestre utilisées sur le chantier (pompe à gravier, pompe de relevage…).\\"}, {\\"id\\": \\"pelles\\", \\"nom\\": \\"Pelles actives\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Nombre moyen de pelles actives au cours du trimestre utilisées sur le chantier (aménagement, exploitation, réhabilitation).\\"}, {\\"id\\": \\"effectifs\\", \\"nom\\": \\"Effectifs\\", \\"type\\": \\"number\\", \\"description\\": \\"Nombre moyen de salariés sur le chantier au cours du trimestre.\\"}, {\\"id\\": \\"depensesTotales\\", \\"nom\\": \\"Dépenses totales (euros)\\", \\"type\\": \\"number\\", \\"dateFin\\": \\"2018-01-01\\", \\"description\\": \\"Montant en euros des dépenses sur l'exploitation.\\"}, {\\"id\\": \\"environnement\\", \\"nom\\": \\"Dépenses relatives à la protection de l’environnement (euros)\\", \\"type\\": \\"number\\", \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Montant en euros des investissements consentis au cours du trimestre listés à l’<a href=\\\\\\"https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000021850940&cidTexte=LEGITEXT000006069569\\\\\\" target=\\\\\\"_blank\\\\\\" rel=\\\\\\"noopener noreferrer\\\\\\">article 318 C de l’annexe II du code général des impôts</a>. Afin de bénéficier des déductions fiscales afférentes, les justificatifs attestant de la réalisation effective des investissements sont susceptibles de vous êtres demandés par l’administration.\\"}]}","{\\"id\\": \\"travaux\\", \\"nom\\": \\"Statut des travaux\\", \\"elements\\": [{\\"id\\": \\"1\\", \\"nom\\": \\"Janvier\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [1]}, {\\"id\\": \\"2\\", \\"nom\\": \\"Février\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [1]}, {\\"id\\": \\"3\\", \\"nom\\": \\"Mars\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [1]}, {\\"id\\": \\"4\\", \\"nom\\": \\"Avril\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [2]}, {\\"id\\": \\"5\\", \\"nom\\": \\"Mai\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [2]}, {\\"id\\": \\"6\\", \\"nom\\": \\"Juin\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [2]}, {\\"id\\": \\"7\\", \\"nom\\": \\"Juillet\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [3]}, {\\"id\\": \\"8\\", \\"nom\\": \\"Août\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [3]}, {\\"id\\": \\"9\\", \\"nom\\": \\"Septembre\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [3]}, {\\"id\\": \\"10\\", \\"nom\\": \\"Octobre\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"frequencePeriodesIds\\": [4]}, {\\"id\\": \\"11\\", \\"nom\\": \\"Novembre\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [4]}, {\\"id\\": \\"12\\", \\"nom\\": \\"Décembre\\", \\"type\\": \\"checkboxes\\", \\"valeurs\\": {\\"nonDebutes\\": \\"non débutés\\", \\"arretDefinitif\\": \\"arrêt définitif (après réhabilitation)\\", \\"rehabilitation\\": \\"réhabilitation\\", \\"arretTemporaire\\": \\"arrêt temporaire\\", \\"exploitationEnCours\\": \\"exploitation en cours\\"}, \\"dateDebut\\": \\"2018-01-01\\", \\"frequencePeriodesIds\\": [4]}]}","{\\"id\\": \\"complement\\", \\"nom\\": \\"Informations complémentaires\\", \\"elements\\": [{\\"id\\": \\"texte\\", \\"type\\": \\"textarea\\", \\"optionel\\": true, \\"dateDebut\\": \\"2018-01-01\\", \\"description\\": \\"Toute information sur les événements marquants du trimestre (accident, incident, arrêt ou suspension d’activité en précisant les raisons, évolution de l’exploitation, difficultés rencontrées, etc.).\\"}]}"}	tri
\.


--
-- Data for Name: activites_types__pays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activites_types__pays (pays_id, activite_type_id) FROM stdin;
GF	grp
\.


--
-- Data for Name: activites_types__types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activites_types__types (domaine_id, type_id, activite_type_id) FROM stdin;
m	cxx	grp
m	pxm	grp
m	axm	grp
\.


--
-- Data for Name: administrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrations (id, type_id, nom, service, url, email, telephone, adresse1, adresse2, code_postal, commune, cedex, departement_id, region_id) FROM stdin;
dea-bfc-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Bourgogne-Franche-Comté - Siège de Besançon	\N	http://www.bourgogne-franche-comte.developpement-durable.gouv.fr	\N	+33 (0)3 81 21 67 00	Technopole microtechnique et scientifique\n17 E rue Alain-Savary\nBP 1269\n25005 Besançon	\N	25005	Besançon	Cedex	\N	27
dea-bretagne-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Bretagne	\N	http://www.bretagne.developpement-durable.gouv.fr	dreal-bretagne@developpement-durable.gouv.fr	+33 (0)2 99 33 45 55	10 rue Maurice-Fabre\nCS 96515\n35065 Rennes	\N	35065	Rennes	Cedex	\N	53
dea-centre-val-de-loire-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Centre-Val-de-Loire	\N	http://www.centre.developpement-durable.gouv.fr	dreal-centre@developpement-durable.gouv.fr	+33 (0)2 36 17 41 41	5 avenue Buffon\nCS 96407\n45064 Orléans	\N	45064	Orléans	Cedex	\N	24
dea-corse-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Corse	\N	http://www.corse.developpement-durable.gouv.fr	dreal-corse@developpement-durable.gouv.fr	+33 (0)4 95 51 79 70	19 cours Napoléon\nBâtiment D\nCS 10006\n20704 Ajaccio	\N	20704	Ajaccio	Cedex	\N	94
dea-grand-est-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Grand Est - Siège de Metz	\N	http://www.grand-est.developpement-durable.gouv.fr	\N	+33 (0)3 87 62 81 00	Greenpark\n2 rue Augustin-Fresnel\nBP 95038\n57071 Metz	\N	57071	Metz	Cedex	\N	44
dea-guadeloupe-01	dea	Direction de l'environnement de l'aménagement et du logement (DEAL) - Guadeloupe	\N	http://www.guadeloupe.developpement-durable.gouv.fr	deal-guadeloupe@developpement-durable.gouv.fr	+33 (0)5 90 99 46 46	Route de St Phy\n97102 Basse-Terre	Adresse postale\r\nDEAL Guadeloupe\nBP 54\n97102 Basse-Terre	97102	Basse-Terre	Cedex	\N	01
dea-guyane-01	dea	Direction de l'environnement de l'aménagement et du logement (DEAL) - Guyane	\N	http://www.guyane.developpement-durable.gouv.fr	\N	+594 5 94 39 80 00	Route du Vieux-Port\n97300 Cayenne	Adresse postale\nRoute du Vieux-Port\nCS 76003\n97306 Cayenne	97300	Cayenne	Cedex	\N	03
dea-hauts-de-france-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Hauts-de-France - Siège de Lille	\N	http://www.hauts-de-france.developpement-durable.gouv.fr	\N	+33 (0)3 20 13 48 48	44 rue de Tournai\nCS 40259\n59019 Lille	\N	59019	Lille	Cedex	\N	32
dea-martinique-01	dea	Direction de l'environnement de l'aménagement et du logement (DEAL) - Martinique	\N	http://www.martinique.developpement-durable.gouv.fr	deal-martinique-usagers@developpement-durable.gouv.fr	+33 (0)5 96 59 57 00	B.P. 7212\n97274 Schœlcher	\N	97274	Schœlcher	Cedex	\N	02
dea-mayotte-01	dea	Direction de l'environnement de l'aménagement et du logement (DEAL) - Mayotte	\N	http://www.mayotte.gouv.fr/Services-de-l-Etat/Direction-de-l-Environnement-de-l-Amenagement-et-du-Logement-DEAL	de-mayotte@equipement.gouv.fr	+262 269 61 12 54	Terre plein de M'Tsapéré\n97600 Mamoudzou	Adresse postale\nBP 109\n97600 Mamoudzou	97600	Mamoudzou	Cedex	\N	06
dea-normandie-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Normandie - Siège de Rouen	\N	http://www.normandie.developpement-durable.gouv.fr	dreal-hnormandie@developpement-durable.gouv.fr	+33 (0)2 35 58 53 27	BP 86002\nCité administrative\n2 rue Saint-Sever\n76032 Rouen	\N	76032	Rouen	Cedex	\N	28
dea-nouvelle-aquitaine-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Nouvelle-Aquitaine - Siège de Poitiers	\N	http://www.nouvelle-aquitaine.developpement-durable.gouv.fr	\N	+33 (0)5 49 55 63 63	15 rue Arthur-Ranc\nBP 60539\n86020 Poitiers	\N	86020	Poitiers	Cedex	\N	75
dea-occitanie-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Occitanie - Siège de Toulouse	\N	http://www.occitanie.developpement-durable.gouv.fr	\N	+33 (0)5 61 58 50 00	1 rue de la Cité-Administrative\nBâtiment G\nCS 80002\n31074 Toulouse	\N	31074	Toulouse	Cedex	\N	76
dea-paca-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Provence-Alpes-Côte-d'Azur	\N	http://www.paca.developpement-durable.gouv.fr	\N	+33 (0)4 91 28 40 40	16 rue Antoine-Zattara\nCS 70248\n13331 Marseille	\N	13331	Marseille	Cedex	\N	93
dea-pays-de-la-loire-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Pays de la Loire	\N	http://www.pays-de-la-loire.developpement-durable.gouv.fr	dreal-pays-de-la-loire@developpement-durable.gouv.fr	+33 (0)2 72 74 73 00	5 rue Françoise-Giroud\nCS 16326\n44263 Nantes	\N	44263	Nantes	Cedex	\N	52
dea-reunion-01	dea	Direction de l'environnement de l'aménagement et du logement (DEAL) - La Réunion	\N	http://www.reunion.developpement-durable.gouv.fr	deal-reunion@developpement-durable.gouv.fr	+33 (0)2 62 40 26 26	2 rue Juliette Dodu\nCS 41009\r\n97743 Saint-Denis	\N	97743	Saint-Denis	Cedex	\N	04
deal-aura-01	dre	Direction régionale de l'environnement, de l'aménagement et du logement (DREAL) - Auvergne-Rhône-Alpes - Siège de Lyon	\N	http://www.auvergne-rhone-alpes.developpement-durable.gouv.fr	dir.dreal-auvergne-rhone-alpes@developpement-durable.gouv.fr	+33 (0)4 26 28 60 00	5 place Jules-Ferry\n69006 Lyon	Adresse postale\nDreal Rhône-Alpes\n69453 Lyon Cedex 6	69006	Lyon	Cedex	\N	84
min-mtes-dgaln-01	min	Ministère de l'Economie et des Finances & Ministère de la Transition écologique et solidaire	Bureau de la politique des ressources minérales non énergétiques - Direction générale de l'aménagement, du logement et de la nature (DGALN)	http://www.mineralinfo.fr	earm2.deb.dgaln@developpement-durable.gouv.fr	+33 (0)1 40 81 21 22	Tour Séquoia\n1 place Carpeaux\n92800 Puteaux	Adresse postale\n92055 Paris-La-Défense Cedex	92800	Puteaux	Cedex	\N	\N
min-mtes-dgec-01	min	Ministère de l'Economie et des Finances & Ministère de la Transition écologique et solidaire	Bureau Ressources énergétiques du sous-sol (2A) - Direction générale de l'énergie et du climat (DGEC)	http://www.minergies.fr	2a.sd2.de.dgec@developpement-durable.gouv.fr	+33 (0)1 40 81 95 63	Tour Séquoia\n1 place Carpeaux\n92800 Puteaux	Adresse postale\r\n92055 Paris-La-Défense Cedex	92800	Puteaux	Cedex	\N	\N
min-mtes-dgpr-01	min	Ministère de l'Economie et des Finances & Ministère de la Transition écologique et solidaire	Bureau du sol et du sous-sol - Direction générale de la prévention des risques (DGPR)	\N	bsss.sdrcp.srt.dgpr@developpement-durable.gouv.fr	+33 (0)1 40 81 21 22	Tour Séquoia\n1 place Carpeaux\n92800 Puteaux	Adresse postale\n92055 Paris-La-Défense Cedex	92800	Puteaux	Cedex	\N	\N
ope-onf-973-01	ope	Office national des forêts	Direction territoriale Guyane	http://www1.onf.fr/guyane/@@index.html	pole.minier@onf.fr	+594 (0)5 94 25 53 78	541 route de Montabo	Adresse postale\r\n541 route de Montabo\nCS87002	97300	Cayenne	\N	\N	\N
prefecture_region-75115-01	pre	Préfecture de région - Île-de-France	\N	http://www.prefectures-regions.gouv.fr/ile-de-france	\N	01 82 52 40 00	5 rue Leblanc	\N	75911	Paris Cedex 15	\N	75	\N
prefecture-01053-01	pre	Préfecture - Ain	\N	http://www.ain.gouv.fr	prefecture@ain.gouv.fr	04 74 32 30 00	45, avenue d'Alsace-Lorraine, CS 80400, Quartier Bourg centre	\N	01012	Bourg-en-Bresse Cedex	\N	01	\N
prefecture-02408-01	pre	Préfecture - Aisne	\N	http://www.aisne.gouv.fr	prefecture@aisne.gouv.fr	03 23 21 82 82	2, rue Paul-Doumer	\N	02010	Laon Cedex	\N	02	\N
prefecture-03190-01	pre	Préfecture - Allier	\N	http://www.allier.gouv.fr	prefecture@allier.gouv.fr	04 70 48 30 00	2, rue Michel-de-L'Hospital, CS 31649	\N	03016	Moulins Cedex	\N	03	\N
prefecture-04070-01	pre	Préfecture - Alpes-de-Haute-Provence	\N	http://www.alpes-de-haute-provence.gouv.fr	\N	04 92 36 72 00	8, rue Docteur-Romieu	\N	04016	Digne-les-Bains Cedex	\N	04	\N
prefecture-05061-01	pre	Préfecture des Hautes-Alpes	\N	http://www.hautes-alpes.gouv.fr	prefecture@hautes-alpes.gouv.fr	04 92 40 48 00	28, rue Saint-Arey, CS 66002	\N	05011	Gap Cedex	\N	05	\N
prefecture-06088-01	pre	Préfecture - Alpes-Maritimes	\N	http://www.alpes-maritimes.gouv.fr	\N	04 93 72 20 00	CADAM, 147, route de Grenoble	Services de l'État dans les Alpes-Maritimes, Préfecture, CADAM, 147, route de Grenoble	06000	Nice	\N	06	\N
prefecture-07186-01	pre	Préfecture - Ardèche	\N	http://www.ardeche.gouv.fr	pref-courrier@ardeche.gouv.fr	04 75 66 50 00	4, boulevard de Vernon	\N	07000	Privas	\N	07	\N
prefecture-08105-01	pre	Préfecture des Ardennes	\N	http://www.ardennes.gouv.fr	prefecture@ardennes.gouv.fr	03 24 59 66 00	1, place de la Préfecture, BP 60002	\N	08005	Charleville-Mézières Cedex	\N	08	\N
prefecture-09122-01	pre	Préfecture - Ariège	\N	http://www.ariege.gouv.fr	prefecture@ariege.gouv.fr	05 61 02 10 00	2, rue de la Préfecture - Préfet Claude Erignac, BP 4087	\N	09007	Foix Cedex	\N	09	\N
prefecture-10387-01	pre	Préfecture - Aube	\N	http://www.aube.gouv.fr	prefecture@aube.gouv.fr	03 25 42 35 00	CS 20372, 2, rue Pierre-Labonde	\N	10025	Troyes Cedex	\N	10	\N
prefecture-11069-01	pre	Préfecture - Aude	\N	http://www.aude.gouv.fr	prefecture@aude.gouv.fr	04 68 10 27 00	CS 20001, 52, rue Jean-Bringer	\N	11836	Carcassonne Cedex 9	\N	11	\N
prefecture-12202-01	pre	Préfecture de l'Aveyron	\N	http://www.aveyron.gouv.fr	prefecture@aveyron.fr	05 65 75 71 71	Place Charles-de-Gaulle\nBP 715	\N	12007	Rodez Cedex	\N	12	\N
prefecture-13203-01	pre	Préfecture des Bouches-du-Rhône	\N	http://www.bouches-du-rhone.gouv.fr	contact@bouches-du-rhone.pref.gouv.fr	04 84 35 40 00	Boulevard Paul-Peytral	\N	13282	Marseille Cedex 20	\N	13	\N
prefecture-14118-01	pre	Préfecture - Calvados	\N	http://www.calvados.gouv.fr	prefecture@calvados.gouv.fr	02 31 30 64 00	Rue Daniel-Huet	\N	14038	Caen Cedex 9	\N	14	\N
prefecture-15014-01	pre	Préfecture - Cantal	\N	http://www.cantal.gouv.fr	courrier@cantal.pref.gouv.fr	04 71 46 23 00	Cours Monthyon, BP 529	\N	15005	Aurillac Cedex	\N	15	\N
prefecture-16015-01	pre	Préfecture - Charente	\N	http://www.charente.gouv.fr	communication@charente.gouv.fr	05 45 97 61 00	7-9, rue de la Préfecture, CS 92301	\N	16023	Angoulême Cedex	\N	16	\N
prefecture-17300-01	pre	Préfecture - Charente-Maritime	\N	http://www.charente-maritime.gouv.fr	prefecture@charente-maritime.gouv.fr	05 46 27 43 00	CS 70000, 38, rue Réaumur	\N	17017	La Rochelle Cedex 1	\N	17	\N
prefecture-18033-01	pre	Préfecture du Cher	\N	http://www.cher.gouv.fr	prefecture@cher.gouv.fr	02 48 67 18 18	Place Marcel-Plaisant, CS 60022	\N	18020	Bourges Cedex	\N	18	\N
prefecture-19272-01	pre	Préfecture - Corrèze	\N	http://www.correze.gouv.fr	prefecture@correze.gouv.fr	05 55 20 55 20	1, rue Souham, BP 250	\N	19012	Tulle Cedex	\N	19	\N
prefecture-21231-01	pre	Préfecture - Côte-d'Or	\N	http://www.cote-dor.gouv.fr	\N	03 80 44 64 00	53, rue de la Préfecture	\N	21041	Dijon Cedex	\N	21	\N
prefecture-22278-01	pre	Préfecture - Côtes-d'Armor	\N	http://www.cotes-darmor.gouv.fr	prefecture@cotes-darmor.gouv.fr	02 96 62 44 22	1, place du Général-de-Gaulle, BP 2370	\N	22023	Saint-Brieuc Cedex 1	\N	22	\N
prefecture-23096-01	pre	Préfecture de la Creuse	\N	http://www.creuse.gouv.fr	\N	0810 01 23 23	BP 79, Place Louis-Lacrocq	\N	23011	Guéret Cedex	\N	23	\N
prefecture-24322-01	pre	Préfecture de Dordogne	\N	http://www.dordogne.gouv.fr	prefecture@dordogne.gouv.fr	05 53 02 24 24	2, rue Paul-Louis-Courier	Services de l'État - Préfecture de la Dordogne, Cité adminsitrative	24000	Périgueux	\N	24	\N
prefecture-25056-01	pre	Préfecture - Doubs	\N	http://www.doubs.gouv.fr	pref-courrier@doubs.gouv.fr	03 81 25 10 00	8 bis, rue Charles-Nodier	\N	25035	Besançon Cedex	\N	25	\N
prefecture-26362-01	pre	Préfecture - Drôme	\N	http://www.drome.gouv.fr	prefecture@drome.gouv.fr	04 75 79 28 00	3, boulevard Vauban	\N	26030	Valence Cedex 9	\N	26	\N
prefecture-27229-01	pre	Préfecture - Eure	\N	http://www.eure.gouv.fr	courrier-web@eure.gouv.fr	02 32 78 27 27	Boulevard Georges-Chauvin	\N	27022	Evreux Cedex	\N	27	\N
prefecture-28085-01	pre	Préfecture - Eure-et-Loir	\N	http://www.eure-et-loir.gouv.fr	\N	02 37 27 72 00	Place de la République, CS 80537	\N	28019	Chartres Cedex	\N	28	\N
prefecture-29232-01	pre	Préfecture du Finistère	\N	http://www.finistere.gouv.fr	prefecture@finistere.gouv.fr	02 98 76 29 29	42, boulevard Dupleix	\N	29320	Quimper Cedex	\N	29	\N
prefecture-2A004-01	pre	Préfecture de Corse-du-Sud	\N	http://www.corse-du-sud.gouv.fr	prefecture@corse-du-sud.gouv.fr	04 95 11 12 13	Palais Lantivy, Cours Napoléon	\N	20188	Ajaccio Cedex 9	\N	2A	\N
prefecture-2B033-01	pre	Préfecture - Haute-Corse	\N	http://www.haute-corse.gouv.fr	prefecture.haute-corse@haute-corse.pref.gouv.fr	04 95 34 50 00	CS 60007, Rond-Point du Maréchal-Leclerc-de-Hautecloque	\N	20401	Bastia Cedex 09	\N	2B	\N
prefecture-30189-01	pre	Préfecture - Gard	\N	http://www.gard.gouv.fr	prefecture@gard.gouv.fr	0820 09 11 72	2, rue Guillemette, 19, avenue Feuchères (étrangers)	10, avenue Feuchères	30000	Nîmes	\N	30	\N
prefecture-31555-01	pre	Préfecture - Haute-Garonne	\N	http://www.haute-garonne.gouv.fr	\N	05 34 45 34 45	1, place Saint-Étienne	Place Saint-Étienne	31000	Toulouse	\N	31	\N
prefecture-32013-01	pre	Préfecture - Gers	\N	http://www.gers.gouv.fr	prefecture@gers.gouv.fr	05 62 61 44 00	3, place du Préfet Claude-Erignac	\N	32007	Auch Cedex	\N	32	\N
prefecture-33063-01	pre	Préfecture - Gironde	\N	http://www.gironde.gouv.fr	\N	05 56 90 60 60	Rue Claude-Bonnier	2, esplanade Charles-de-Gaulle, CS 41397	33000	Bordeaux	\N	33	\N
prefecture-34172-01	pre	Préfecture de l'Hérault	\N	http://www.herault.gouv.fr	\N	04 67 61 61 61	34, place des Martyrs-de-la-Résistance	\N	34062	Montpellier Cedex 2	\N	34	\N
prefecture-35238-01	pre	Préfecture - Ille-et-Vilaine	\N	http://www.bretagne.gouv.fr	prefecture@ille-et-vilaine.gouv.fr	02 99 02 10 35	3, avenue de la Préfecture	\N	35026	Rennes Cedex 9	\N	35	\N
prefecture-36044-01	pre	Préfecture - Indre	\N	http://www.indre.gouv.fr	\N	02 54 29 50 00	Rue des Jeux marins	Place de la Victoire et des Alliés, CS 80583	36000	Châteauroux	\N	36	\N
prefecture-37261-01	pre	Préfecture d'Indre-et-Loire	\N	http://www.indre-et-loire.gouv.fr	prefecture@indre-et-loire.gouv.fr	+ 33 2 47 64 37 37	15, rue Bernard-Palissy	\N	37925	Tours Cedex 9	\N	37	\N
prefecture-38185-01	pre	Préfecture - Isère	\N	http://www.isere.gouv.fr	\N	04 76 60 34 00	CS 71046, Place de Verdun	\N	38021	Grenoble Cedex 1	\N	38	\N
prefecture-39300-01	pre	Préfecture - Jura	\N	http://www.jura.gouv.fr	prefecture@jura.gouv.fr	03 84 86 84 00	8, rue de la Préfecture	\N	39030	Lons-le-Saunier Cedex	\N	39	\N
prefecture-40192-01	pre	Préfecture - Landes	\N	http://www.landes.gouv.fr	\N	05 58 06 58 06	24-26, rue Victor-Hugo	\N	40021	Mont-de-Marsan Cedex	\N	40	\N
prefecture-41018-01	pre	Préfecture - Loir-et-Cher	\N	http://www.loir-et-cher.gouv.fr	\N	0810 02 41 41	BP 40299, 1, place de la République	\N	41006	Blois Cedex	\N	41	\N
prefecture-42218-01	pre	Préfecture - Loire	\N	http://www.loire.gouv.fr	pref-loire@loire.pref.gouv.fr	04 77 48 48 48	2, rue Charles-de-Gaulle	\N	42022	Saint-Etienne Cedex 1	\N	42	\N
prefecture-43157-01	pre	Préfecture de Haute-Loire	\N	http://www.haute-loire.gouv.fr	prefecture@haute-loire.gouv.fr	04 71 09 43 43	6, avenue du Général-de-Gaulle, CS 40321	\N	43009	Le Puy-en-Velay Cedex	\N	43	\N
prefecture-44109-01	pre	Préfecture - Loire-Atlantique	\N	http://www.loire-atlantique.gouv.fr	\N	02 40 41 20 20	6, quai Ceineray, BP 33515	\N	44035	Nantes Cedex 1	\N	44	\N
prefecture-45234-01	pre	Préfecture - Loiret	\N	http://www.loiret.gouv.fr	\N	0821 80 30 45	181, rue de Bourgogne	\N	45042	Orléans Cedex 1	\N	45	\N
prefecture-46042-01	pre	Préfecture - Lot	\N	http://www.lot.gouv.fr	prefecture@lot.gouv.fr	05 65 23 10 00	Cité Bessières	\N	46009	Cahors Cedex 9	\N	46	\N
prefecture-47001-01	pre	Préfecture - Lot-et-Garonne	\N	http://www.lot-et-garonne.gouv.fr	\N	05 53 77 60 47	Place de Verdun	\N	47920	Agen Cedex 9	\N	47	\N
prefecture-48095-01	pre	Préfecture de la Lozère	\N	http://www.lozere.gouv.fr	prefecture@lozere.gouv.fr	04 66 49 60 00	Rue du Faubourg-Montbel	BP 130	48000	Mende	\N	48	\N
prefecture-49007-01	pre	Préfecture - Maine-et-Loire	\N	http://www.maine-et-loire.gouv.fr	modernisation@maine-et-loire.pref.gouv.fr	02 41 81 81 81	Place Michel-Debré	\N	49934	Angers Cedex 9	\N	49	\N
prefecture-50502-01	pre	Préfecture - Manche	\N	http://www.manche.gouv.fr	prefecture@manche.gouv.fr	02 33 75 49 50	Place de la Préfecture, BP 70522	\N	50002	Saint-Lô Cedex	\N	50	\N
prefecture-51108-01	pre	Préfecture - Marne	\N	http://www.marne.gouv.fr	contact@marne.gouv.fr	03 26 26 10 10	38, rue Carnot	\N	51036	Châlons-en-Champagne Cedex	\N	51	\N
prefecture-52121-01	pre	Préfecture - Haute-Marne	\N	http://www.haute-marne.gouv.fr	prefecture@haute-marne.gouv.fr	03 25 30 52 52	89, rue de la Victoire-de-la-Marne	\N	52011	Chaumont Cedex	\N	52	\N
prefecture-53130-01	pre	Préfecture - Mayenne	\N	http://www.mayenne.gouv.fr	pref-communication@mayenne.gouv.fr	02 43 01 50 00	46, rue Mazagran, CS 91507	\N	53015	Laval Cedex	\N	53	\N
prefecture-54395-01	pre	Préfecture - Meurthe-et-Moselle	\N	http://www.meurthe-et-moselle.gouv.fr	pref-informations@meurthe-et-moselle.gouv.fr	03 83 34 26 26	6, rue Sainte-Catherine	CS 60031, 1, rue du Préfet-Claude-Érignac	54000	Nancy	\N	54	\N
prefecture-55029-01	pre	Préfecture - Meuse	\N	http://www.meuse.gouv.fr	\N	03 29 77 55 55	40, rue du Bourg, CS 30512	\N	55012	Bar-le-Duc Cedex	\N	55	\N
prefecture-56260-01	pre	Préfecture - Morbihan	\N	http://www.morbihan.gouv.fr	\N	02 97 54 84 00	24, place de la République	Préfecture du Morbihan, BP 501	56000	Vannes	\N	56	\N
prefecture-57463-01	pre	Préfecture - Moselle	\N	\N	\N	03 87 34 87 34	9, place de la Préfecture, BP 71014	\N	57034	Metz Cedex 01	\N	57	\N
prefecture-58194-01	pre	Préfecture - Nièvre	\N	http://www.nievre.gouv.fr	courrier@nievre.pref.gouv.fr	03 86 60 70 80	40, rue de la Préfecture	\N	58026	Nevers Cedex	\N	58	\N
prefecture-59350-01	pre	Préfecture - Nord	\N	http://www.nord.gouv.fr	\N	03 20 30 59 59	CS 20003, 12, rue Jean-Sans-Peur	\N	59039	Lille Cedex	\N	59	\N
prefecture-60057-01	pre	Préfecture de l'Oise	\N	http://www.oise.gouv.fr	\N	03 44 06 12 60	1, place de la Préfecture	\N	60022	Beauvais Cedex	\N	60	\N
prefecture-61001-01	pre	Préfecture de l'Orne	\N	http://www.orne.gouv.fr	pref-communication@orne.gouv.fr	02 33 80 61 61	BP 529, 39, rue Saint-Blaise	\N	61018	Alençon Cedex	\N	61	\N
prefecture-62041-01	pre	Préfecture - Pas-de-Calais	\N	http://www.pas-de-calais.gouv.fr	\N	03 21 21 20 00	Rue Ferdinand-Buisson	\N	62020	Arras Cedex 9	\N	62	\N
prefecture-63113-01	pre	Préfecture - Puy-de-Dôme	\N	http://www.puy-de-dome.gouv.fr	\N	04 73 98 63 63	1, rue d'Assas	\N	63033	Clermont-Ferrand Cedex 1	\N	63	\N
prefecture-64445-01	pre	Préfecture des Pyrénées-Atlantiques	\N	http://www.pyrenees-atlantiques.gouv.fr	prefecture@pyrenees-atlantiques.gouv.fr	05 59 98 24 24	2, rue du Maréchal-Joffre	\N	64021	Pau Cedex	\N	64	\N
prefecture-65440-01	pre	Préfecture - Hautes-Pyrénées	\N	http://www.hautes-pyrenees.gouv.fr	prefecture@hautes-pyrenees.gouv.fr	05 62 56 65 65	CS 61350, Place Charles-de-Gaulle	\N	65013	Tarbes Cedex 9	\N	65	\N
prefecture-66136-01	pre	Préfecture - Pyrénées-Orientales	\N	http://www.pyrenees-orientales.gouv.fr	\N	04 68 51 66 66	24, quai Sadi-Carnot, BP 951	\N	66951	Perpignan Cedex	\N	66	\N
prefecture-67482-01	pre	Préfecture - Bas-Rhin	\N	http://www.bas-rhin.gouv.fr	\N	03 88 21 67 68	5 place de la République, BP 1047	\N	67073	Strasbourg Cedex	\N	67	\N
prefecture-68066-01	pre	Préfecture - Haut-Rhin	\N	http://www.haut-rhin.gouv.fr	pref-courrier@haut-rhin.gouv.fr	03 89 29 20 00	11, avenue de la République	7, rue Bruat, BP 10489	68000	Colmar	\N	68	\N
prefecture-69383-01	pre	Préfecture - Rhône	\N	http://www.rhone.gouv.fr	\N	0821 80 30 69	97, rue Molière	106, rue Pierre-Corneille	69003	Lyon	\N	69	\N
prefecture-70550-01	pre	Préfecture - Haute-Saône	\N	http://www.haute-saone.gouv.fr	prefecture@haute-saone.pref.gouv.fr	03 84 77 70 00	1, rue de la Préfecture, BP 429	\N	70013	Vesoul Cedex	\N	70	\N
prefecture-71270-01	pre	Préfecture - Saône-et-Loire	\N	http://www.saone-et-loire.gouv.fr	\N	03 85 21 81 00	196, rue de Strasbourg	\N	71021	Mâcon Cedex 9	\N	71	\N
prefecture-72181-01	pre	Préfecture - Sarthe	\N	http://www.sarthe.gouv.fr	pref-mail@sarthe.gouv.fr	02 43 39 72 72	Place Aristide-Briand	\N	72041	Le Mans Cedex 9	\N	72	\N
prefecture-73065-01	pre	Préfecture - Savoie	\N	http://www.savoie.gouv.fr	prefecture@savoie.gouv.fr	04 79 75 50 50	Château des Ducs de Savoie, BP 1801	\N	73018	Chambéry Cedex	\N	73	\N
prefecture-74010-01	pre	Préfecture de Haute-Savoie	\N	http://www.haute-savoie.gouv.fr	prefecture@haute-savoie.gouv.fr	04 50 33 60 00	30, rue du 30e-Régiment-d'Infanterie, BP 2332	\N	74034	Annecy Cedex	\N	74	\N
prefecture-76540-01	pre	Préfecture de la Seine-Maritime	\N	http://www.seine-maritime.gouv.fr	\N	02 32 76 50 00	7, place de la Madeleine	\N	76036	Rouen Cedex	\N	76	\N
prefecture-77288-01	pre	Préfecture de Seine-et-Marne	\N	http://www.seine-et-marne.gouv.fr	\N	01 64 71 77 77	12, rue des Saints-Pères	\N	77010	Melun Cedex	\N	77	\N
prefecture-78646-01	pre	Préfecture - Yvelines	\N	http://www.yvelines.gouv.fr	pref-communication78@yvelines.gouv.fr	01 39 49 78 00	1, rue Jean-Houdon	\N	78000	Versailles	\N	78	\N
prefecture-79191-01	pre	Préfecture - Deux-Sèvres	\N	http://www.deux-sevres.gouv.fr	courrier@deux-sevres.pref.gouv.fr	05 49 08 68 68	4, rue Duguesclin, BP 70000	\N	79099	Niort Cedex 9	\N	79	\N
prefecture-80021-01	pre	Préfecture - Somme	\N	http://www.somme.gouv.fr	pref-courrier@somme.gouv.fr	0821 80 30 80	51, rue de la République	\N	80020	Amiens Cedex 9	\N	80	\N
prefecture-81004-01	pre	Préfecture du Tarn	\N	http://www.tarn.gouv.fr	courrier@tarn.pref.gouv.fr	05 63 45 61 61	Place de la Préfecture	\N	81013	Albi Cedex 9	\N	81	\N
prefecture-82121-01	pre	Préfecture - Tarn-et-Garonne	\N	http://www.tarn-et-garonne.gouv.fr	\N	05 63 22 82 00	2, allée de l'Empereur, BP 779	\N	82013	Montauban Cedex	\N	82	\N
prefecture-83137-01	pre	Préfecture - Var	\N	http://www.var.gouv.fr	\N	04 94 18 83 83	CS 31209, Boulevard du 112e Régiment-d'Infanterie	\N	83070	Toulon Cedex	\N	83	\N
prefecture-84007-01	pre	Préfecture - Vaucluse	\N	http://www.vaucluse.gouv.fr	pref-contact@vaucluse.gouv.fr	04 88 17 84 84	2, avenue de la Folie	Services de l'Etat en Vaucluse Préfecture	84000	Avignon	\N	84	\N
prefecture-85191-01	pre	Préfecture - Vendée	\N	http://www.vendee.gouv.fr	prefecture@vendee.gouv.fr	02 51 36 70 85	29, rue Delille	\N	85922	La Roche-sur-Yon Cedex 9	\N	85	\N
prefecture-86194-01	pre	Préfecture - Vienne	\N	http://www.vienne.gouv.fr	pref-courrier@vienne.gouv.fr	05 49 55 70 00	BP 589, 7, place Aristide-Briand	\N	86021	Poitiers Cedex	\N	86	\N
prefecture-87085-01	pre	Préfecture - Haute-Vienne	\N	http://www.haute-vienne.gouv.fr	\N	05 55 44 18 00	1, rue de la Préfecture, BP 87031	\N	87031	Limoges Cedex 1	\N	87	\N
prefecture-88160-01	pre	Préfecture des Vosges	\N	http://www.vosges.gouv.fr	prefecture@vosges.gouv.fr	03 29 69 88 88	1, place Foch	\N	88026	Epinal Cedex	\N	88	\N
prefecture-89024-01	pre	Préfecture de l'Yonne	\N	http://www.yonne.gouv.fr	prefecture@yonne.gouv.fr	03 86 72 79 89	Place de la Préfecture	\N	89016	Auxerre Cedex	\N	89	\N
prefecture-90010-01	pre	Préfecture - Territoire de Belfort	\N	http://www.territoire-belfort.gouv.fr	courrier90@territoire-de-belfort.pref.gouv.fr	03 84 57 00 07	Place de la République	\N	90020	Belfort Cedex	\N	90	\N
prefecture-91228-01	pre	Préfecture - Essonne	\N	http://www.essonne.gouv.fr	prefecture@essonne.gouv.fr	01 69 91 91 91	Boulevard de France	\N	91010	Évry	\N	91	\N
prefecture-92050-01	pre	Préfecture - Hauts-de-Seine	\N	http://www.hauts-de-seine.gouv.fr	prefecture@hauts-de-seine.gouv.fr	01 40 97 20 00	167-177, avenue Joliot-Curie	\N	92013	Nanterre Cedex	\N	92	\N
prefecture-93008-01	pre	Préfecture de la Seine-Saint-Denis	\N	http://www.seine-saint-denis.gouv.fr	prefecture@seine-saint-denis.gouv.fr	01 41 60 60 60	1, esplanade Jean-Moulin	\N	93007	Bobigny Cedex	\N	93	\N
prefecture-94028-01	pre	Préfecture - Val-de-Marne	\N	http://www.val-de-marne.gouv.fr	prefecture@val-de-marne.gouv.fr	01 49 56 60 00	21-29, avenue du Général-de-Gaulle	\N	94038	Créteil Cedex	\N	94	\N
prefecture-95127-01	pre	Préfecture - Val-d'Oise	\N	http://www.val-doise.gouv.fr	prefecture@val-doise.gouv.fr	01 34 20 95 95	CS 20105, 5, avenue Bernard-Hirsch	\N	95010	Cergy-Pontoise Cedex	\N	95	\N
prefecture-97105-01	pre	Préfecture - Guadeloupe	\N	http://www.guadeloupe.pref.gouv.fr	\N	+590 590 99 39 00	Avenue Paul-Lacavé	\N	97109	Basse-Terre Cedex	\N	971	\N
prefecture-97209-01	pre	Préfecture - Martinique	\N	http://www.martinique.pref.gouv.fr	contact.prefecture@martinique.pref.gouv.fr	+596 596 39 36 00	82, rue Victor-Sévère	\N	97262	Fort-de-France Cedex	\N	972	\N
prefecture-97302-01	pre	Préfecture - Guyane	\N	http://www.guyane.pref.gouv.fr	courrier@guyane.pref.gouv.fr	+594 594 39 45 00	BP 7008, Rue Fiedmond	\N	97307	Cayenne Cedex	\N	973	\N
prefecture-97411-01	pre	Préfecture - Réunion	\N	http://www.reunion.gouv.fr	\N	+262 262 40 77 77	1, rue de la Messagerie, CS 51079	\N	97404	Saint-Denis Cedex	\N	974	\N
prefecture-97611-01	pre	Préfecture - Mayotte	\N	http://www.mayotte.pref.gouv.fr/	\N	02 69 63 50 00	BP 676, Kawéni, Avenue de la Préfecture	\N	97600	Mamoudzou	\N	976	\N
\.


--
-- Data for Name: administrations__domaines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrations__domaines (domaine_id, administration_id) FROM stdin;
m	min-mtes-dgaln-01
w	min-mtes-dgaln-01
c	min-mtes-dgaln-01
h	min-mtes-dgec-01
f	min-mtes-dgec-01
g	min-mtes-dgec-01
s	min-mtes-dgec-01
r	min-mtes-dgec-01
\.


--
-- Data for Name: administrations_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrations_types (id, nom, ordre) FROM stdin;
min	Ministère	1
dre	Dréal	2
dea	Déal	3
pre	Préfecture	4
ope	Opérateur	5
\.


--
-- Data for Name: communes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communes (id, nom, departement_id) FROM stdin;
97310	Roura	973
97306	Mana	973
97301	Régina	973
97353	Maripasoula	973
97358	Saint-Élie	973
97311	Saint-Laurent-du-Maroni	973
97357	Grand-Santi	973
97362	Papaichton	973
97304	Kourou	973
97360	Apatou	973
97312	Sinnamary	973
97303	Iracoubo	973
54250	Haraucourt	54
54104	Buissoncourt	54
54110	Cerville	54
54311	Lenoncourt	54
97352	Saül	973
26349	Tersanne	26
26148	Hauterives	26
26083	Châteauneuf-de-Galaure	26
26314	Saint-Martin-d'Août	26
41086	Fontaines-en-Sologne	41
41157	Mur-de-Sologne	41
41247	Soings-en-Sologne	41
41237	Sassay	41
41059	Contres	41
01024	Attignat	01
01451	Viriat	01
27682	Vesly	27
60659	Vaudancourt	60
95462	Omerville	95
27153	Chauvincourt-Provemont	27
27059	Bernouville	27
27026	Authevernes	27
95141	Charmont	95
95355	Magny-en-Vexin	95
95309	Hodent	95
95429	Montreuil-sur-Epte	95
95119	Buhy	95
95554	Saint-Gervais	95
95011	Ambleville	95
95139	La Chapelle-en-Vexin	95
60487	Parnes	60
27445	Noyers	27
27199	Dangu	27
27152	Château-sur-Epte	27
27304	Guerny	27
95541	Saint-Clair-sur-Epte	95
27426	Neaufles-Saint-Martin	27
60169	Courcelles-lès-Gisors	60
60095	Boury-en-Vexin	60
26143	Le Grand-Serre	26
78588	Saulx-Marchais	78
78364	Marcq	78
78062	Beynes	78
78616	Thoiry	78
78013	Andelu	78
78415	Montainville	78
78550	Saint-Germain-de-la-Grange	78
78443	Neauphle-le-Vieux	78
78683	Villiers-Saint-Frédéric	78
78615	Thiverval-Grignon	78
78034	Auteuil	78
44052	Donges	44
26293	Saint-Avit	26
26028	Bathernay	26
26259	Ratières	26
54012	Amance	54
54289	Laître-sous-Amance	54
54184	Essey-lès-Nancy	54
54439	Pulnoy	54
54006	Agincourt	54
54168	Dommartin-sous-Amance	54
54498	Seichamps	54
54495	Saulxures-lès-Nancy	54
54296	Laneuvelotte	54
54558	Velaine-sous-Amance	54
04112	Manosque	04
04190	Saint-Martin-les-Eaux	04
78344	Lommoye	78
78559	Saint-Illiers-le-Bois	78
78531	Rosny-sur-Seine	78
78558	Saint-Illiers-la-Ville	78
78668	La Villeneuve-en-Chevrie	78
78107	Bréval	78
78082	Boissy-Mauvoisin	78
78484	Perdreauville	78
78089	Bonnières-sur-Seine	78
37177	Orbigny	37
37046	Céré-la-Ronde	37
41211	Saint-Georges-sur-Cher	41
41080	Faverolles-sur-Cher	41
41126	Mareuil-sur-Cher	41
37100	Épeigné-les-Bois	37
41181	Pouillé	41
41002	Angé	41
41217	Saint-Julien-de-Chédon	41
04245	Volx	04
04068	Dauphin	04
13056	Martigues	13
76497	Petit-Couronne	76
41062	Couddes	41
41049	Chémery	41
41195	Rougeou	41
60337	Lachelle	60
60382	Margny-lès-Compiègne	60
60048	Baugy	60
60166	Coudun	60
60434	Mortemer	60
60168	Courcelles-Epayelles	60
60533	Ressons-sur-Matz	60
60396	Méry-la-Bataille	60
60449	Neufvy-sur-Aronde	60
60281	Gournay-sur-Aronde	60
60061	Belloy	60
60351	Lataule	60
60191	Cuvilly	60
60019	Antheuil-Portes	60
60386	Marquéglise	60
60675	Vignemont	60
60689	Villers-sur-Coudun	60
60308	Hémévillers	60
60531	Remy	60
60424	Montmartin	60
60408	Monchy-Humières	60
60099	Braisnes-sur-Aronde	60
60440	Moyenneville	60
60394	Ménévillers	60
60698	Wacquemoulin	60
60585	Saint-Martin-aux-Bois	60
60416	Montgérain	60
60643	Tricot	60
68082	Ensisheim	68
68266	Réguisheim	68
01232	Marboz	01
01163	Foissiat	01
01130	Cras-sur-Reyssouze	01
01154	Étrez	01
40127	Hontanx	40
32155	Le Houga	32
40166	Lussagnet	40
40080	Cazères-sur-l'Adour	40
40329	Le Vignau	40
51144	Cheminon	51
55296	L'Isle-en-Rigault	55
55132	Cousances-les-Forges	55
55010	Ancerville	55
52104	Chancenay	52
51583	Trois-Fontaines-l'Abbaye	51
55031	Baudonvilliers	55
55470	Saudrupt	55
55494	Sommelonne	55
55447	Rupt-aux-Nonains	55
55224	Haironville	55
02428	Licy-Clignon	02
02268	Domptin	02
02221	Coupru	02
02443	Lucy-le-Bocage	02
02679	Saint-Gengoulph	02
02375	Hautevesnes	02
60380	Mareuil-sur-Ourcq	60
02185	Chézy-en-Orxois	02
02125	Brumetz	02
02512	Montigny-l'Allier	02
60554	Rouvres-en-Multien	60
60548	Rosoy-en-Multien	60
60448	Neufchelles	60
60679	La Villeneuve-sous-Thury	60
60385	Marolles	60
60092	Boullarre	60
60637	Thury-en-Valois	60
60020	Antilly	60
60190	Cuvergnon	60
02792	Veuilly-la-Poterie	02
02137	Bussiares	02
02744	Torcy-en-Valois	02
02521	Montreuil-aux-Lions	02
02339	Gandelu	02
77204	Germigny-sous-Coulombs	77
77129	Coulombs-en-Valois	77
77148	Crouy-sur-Ourcq	77
02465	Marigny-en-Orxois	02
77490	Vendrest	77
02818	Villiers-Saint-Denis	02
02084	Bézu-le-Guéry	02
77157	Dhuisy	77
60656	Varinfroy	60
77283	May-en-Multien	77
60224	Étavigny	60
60069	Betz	60
78267	Gargenville	78
78314	Issou	78
32094	Caupenne-d'Armagnac	32
32222	Magnan	32
32310	Perchède	32
32291	Mormès	32
32202	Laujuzan	32
71512	Sennecey-le-Grand	71
81062	Fontrieu	81
97314	Ouanary	973
63033	Beaumont-lès-Randan	63
63229	Moissat	63
63040	Billom	63
63096	Chas	63
63168	Glaine-Montaigut	63
63154	Espirat	63
63164	Gerzat	63
63063	Cébazat	63
63099	Châteaugay	63
63224	Ménétrol	63
63113	Clermont-Ferrand	63
63042	Blanzat	63
63263	Orcines	63
63308	Royat	63
63075	Chamalières	63
63083	Chanat-la-Mouteyre	63
63254	Nohanent	63
63141	Durtol	63
63417	Sayat	63
63302	La Roche-Blanche	63
63345	Saint-Genès-Champanelle	63
63307	Romagnat	63
63032	Beaumont	63
63070	Ceyrat	63
63297	Reignat	63
63350	Saint-Georges-sur-Allier	63
63106	Chauriat	63
63332	Saint-Clément-de-Régnat	63
63295	Randan	63
63013	Aubiat	63
63061	Bussières-et-Pruns	63
63001	Aigueperse	63
63226	Mezel	63
63133	Dallet	63
63325	Saint-Bonnet-lès-Allier	63
63453	Vertaizon	63
63445	Vassel	63
63049	Bouzel	63
63204	Malintrat	63
63284	Pont-du-Château	63
63200	Lussat	63
63213	Les Martres-d'Artière	63
63420	Seychalles	63
63034	Beauregard-l'Évêque	63
63194	Lempty	63
63107	Chavaroux	63
63180	Joze	63
63131	Culhat	63
63372	Saint-Laure	63
63058	Bulhon	63
63272	Pérignat-lès-Sarliève	63
63262	Orcet	63
63069	Le Cendre	63
63306	La Roche-Noire	63
63273	Pérignat-sur-Allier	63
63146	Égliseneuve-près-Billom	63
63019	Aulnat	63
63193	Lempdes	63
63124	Cournon-d'Auvergne	63
67288	Memmelshoffen	67
67290	Merkwiller-Pechelbronn	67
67394	Retschwiller	67
67455	Schœnenbourg	67
67254	Kutzenhausen	67
67487	Surbourg	67
63047	La Bourboule	63
63246	Murat-le-Quaire	63
63236	Mont-Dore	63
63305	Rochefort-Montagne	63
63264	Orcival	63
63451	Vernines	63
63303	Roche-Charles-la-Mayrand	63
63077	Chambon-sur-Lac	63
63247	Murol	63
63407	Saulzet-le-Froid	63
63449	Le Vernet-Sainte-Marguerite	63
63144	Égliseneuve-d'Entraigues	63
63117	Compains	63
63279	Picherande	63
63098	Chastreix	63
63335	Saint-Diéry	63
63440	Valbeleix	63
63087	La Chapelle-Marcousse	63
63122	Courgoul	63
63097	Chassagne	63
63134	Dauzat-sur-Vodable	63
63426	Tauves	63
63192	La Tour-d'Auvergne	63
63274	Perpezat	63
63397	Saint-Sauves-d'Auvergne	63
63370	Saint-Julien-Puy-Lavèze	63
63401	Saint-Victor-la-Rivière	63
63383	Saint-Pierre-Colamine	63
63189	Laqueuille	63
63038	Besse-et-Saint-Anastaise	63
67082	Dalhunden	67
67023	Batzendorf	67
67540	Wintershouse	67
67331	Niederschaeffolsheim	67
67497	Uhlwiller	67
63219	Mazaye	63
63385	Saint-Pierre-le-Chastel	63
22322	Saint-Péver	22
22271	Saint-Adrien	22
22040	Coadout	22
22189	Plésidy	22
22131	Loguivy-Plougras	22
22005	Belle-Isle-en-Terre	22
22129	Loc-Envel	22
22037	La Chapelle-Neuve	22
22216	Plougonver	22
78536	Sailly	78
22132	Lohuec	22
22231	Plourac'h	22
22072	Gurunhuel	22
22067	Grâces	22
22249	Pont-Melvez	22
22013	Bourbriac	22
22024	Calanhel	22
22025	Callac	22
22138	Maël-Pestivien	22
22023	Bulat-Pestivien	22
78113	Brueil-en-Vexin	78
22354	Tréglamus	22
54139	Courbesseaux	54
22156	Moustéru	22
54219	Gellenoncourt	54
22164	Pédernec	22
22135	Louargat	22
54549	Varangéville	54
22228	Plounévez-Moëdec	22
44095	La Meilleraye-de-Bretagne	44
67404	Rittershoffen	67
44138	Puceul	44
67349	Oberrœdern	67
44091	Marsac-sur-Don	44
67206	Hoffen	67
44113	Nozay	44
44224	La Grigonnais	44
67339	Betschdorf	67
44214	Vay	44
67474	Soultz-sous-Forêts	67
44062	Le Gâvre	44
67180	Haguenau	67
44149	Saffré	44
01109	Collonges	01
44180	Vallons-de-l'Erdre	44
74077	Clarafond-Arcine	74
44067	Guémené-Penfao	44
74074	Chevrier	74
44077	Joué-sur-Erdre	44
01209	Léaz	01
44065	Grand-Auverné	44
74069	Chênex	74
44144	Riaillé	44
01308	Pougny	01
44001	Abbaretz	44
74309	Viry	74
49218	Montrevault-sur-Èvre	49
74250	Saint-Pierre-en-Faucigny	74
49069	Orée d'Anjou	49
74042	Bonneville	74
49244	Mauges-sur-Loire	49
74024	Ayse	74
49092	Chemillé-en-Anjou	49
74240	Saint-Jean-de-Tholome	74
49023	Beaupréau-en-Mauges	49
74244	Saint-Laurent	74
15034	Chaliers	15
74021	Arthaz-Pont-Notre-Dame	74
15051	Clavières	15
74298	Vétraz-Monthoux	74
15168	Ruynes-en-Margeride	15
74197	Nangy	74
85194	Les Sables-d'Olonne	85
74040	Bonne	74
85166	Olonne-sur-Mer	85
74012	Annemasse	74
85060	Château-d'Olonne	85
27365	Léry	27
27474	Poses	27
74094	Cranves-Sales	74
27471	Porte-de-Seine	27
74128	Fillinges	74
27701	Val-de-Reuil	27
27528	Le Vaudreuil	27
74153	Lucinges	74
95176	Cormeilles-en-Parisis	95
74145	Juvigny	74
95018	Argenteuil	95
74305	Ville-la-Grand	74
74008	Ambilly	74
95252	Franconville	95
74133	Gaillard	74
95582	Sannois	95
74118	Étrembières	74
63035	Beauregard-Vendon	63
74243	Saint-Julien-en-Genevois	74
63212	Marsat	63
74304	Ville-en-Sallaz	74
63245	Mozac	63
74311	Viuz-en-Sallaz	74
63167	Gimeaux	63
74226	Saint-André-de-Boëge	74
63135	Davayat	63
74037	Boëge	74
63014	Aubière	63
63214	Les Martres-de-Veyre	63
63443	Varennes-sur-Morge	63
63112	Clerlande	63
74122	Faucigny	74
63108	Le Cheix	63
63424	Surat	63
74087	Contamine-sur-Arve	74
63362	Saint-Ignat	63
74209	Peillonnex	74
63432	Thuret	63
74284	La Tour	74
63473	Yssac-la-Tourette	63
74162	Marcellaz	74
63327	Saint-Bonnet-près-Riom	63
74043	Bons-en-Chablais	74
63379	Saint-Myon	63
74229	Saint-Cergues	74
63012	Artonne	63
74158	Machilly	74
74193	La Muraz	74
63148	Ennezat	63
74211	Pers-Jussy	74
63198	Loubeyrat	63
74220	Reignier-Ésery	74
63093	Charbonnières-les-Vieilles	63
74262	Scientrier	74
63427	Teilhède	63
74185	Monnetier-Mornex	74
74018	Arenthon	74
63103	Châtel-Guyon	63
74044	Bossey	74
63288	Prompsat	63
74082	Collonges-sous-Salève	74
63116	Combronde	63
74016	Archamps	74
63089	Chappes	63
74313	Vovray-en-Bornes	74
63149	Entraigues	63
74177	Menthonnex-en-Bornes	74
63244	Chambaron sur Morge	63
74259	Le Sappey	74
63278	Pessat-Villeneuve	63
63092	Charbonnières-les-Varennes	63
74059	La Chapelle-Rambaud	74
63470	Volvic	63
63215	Martres-sur-Morge	63
74015	Arbusigny	74
63406	Sardon	63
63322	Saint-Beauzire	63
63203	Malauzat	63
63150	Enval	63
63300	Riom	63
63128	Crevant-Laveine	63
63195	Lezoux	63
63201	Luzillat	63
63333	Saint-Denis-Combarnazat	63
63317	Saint-André-le-Coq	63
63210	Maringues	63
64059	Artigueloutan	64
64439	Ousse	64
64148	Bruges-Capbis-Mifaget	64
64068	Asson	64
64238	Ger	64
65235	Juillan	65
65057	Azereix	65
65344	Ossun	65
65257	Lanne	65
65223	Horgues	65
65313	Momères	65
65284	Louey	65
65331	Odos	65
65251	Laloubère	65
65220	Hibarette	65
65080	Bénac	65
65392	Saint-Martin	65
64344	Livron	64
64453	Pontacq	64
65108	Bours	65
65440	Tarbes	65
65226	Ibos	65
65364	Pintac	65
65350	Oursbelille	65
65072	Bazet	65
65100	Bordères-sur-l'Échez	65
65341	Oroix	65
65292	Luquet	65
65185	Gardères	65
65252	Lamarque-Pontacq	65
65286	Lourdes	65
65065	Barlest	65
65002	Adé	65
43185	Sainte-Florine	43
63220	Mazoires	63
63114	Collanges	63
63456	Vichel	63
63009	Ardes	63
63017	Augnat	63
63007	Apchat	63
63356	Saint-Gervazy	63
63127	Creste	63
63403	Saint-Vincent	63
63330	Saint-Cirgues-sur-Couze	63
63109	Chidrac	63
63080	Champeix	63
63123	Cournols	63
63282	Plauzat	63
63413	La Sauvetat	63
63425	Tallende	63
63222	Meilhaud	63
63026	Aydat	63
63313	Saint-Alyre-ès-Montagne	63
43247	Torsiac	43
43121	Léotoing	43
43182	Saint-Étienne-sur-Blesle	43
15105	Leyvaux	15
15126	Molèdes	15
15127	Molompize	15
15013	Auriac-l'Église	15
15098	Laurie	15
63006	Anzat-le-Luguet	63
43014	Autrac	43
43033	Blesle	43
43258	Vergongheon	43
43099	Frugerès-les-Mines	43
15256	Vèze	15
63185	Lamontgie	63
63022	Auzat-la-Combelle	63
63029	Bansat	63
63392	Saint-Rémy-de-Chargnat	63
63375	Saint-Martin-des-Plains	63
63202	Madriat	63
63299	Rentières	63
63466	Vodable	63
63357	Saint-Hérent	63
63429	Ternant-les-Eaux	63
63342	Saint-Floret	63
63409	Saurier	63
63435	Tourzel-Ronzières	63
63234	Montaigut-le-Blanc	63
63199	Ludesse	63
63452	Verrières	63
63259	Olloix	63
63396	Saint-Saturnin	63
63172	Grandeyrolles	63
63395	Saint-Sandoux	63
63380	Saint-Nectaire	63
63315	Saint-Amant-Tallende	63
63352	Saint-Germain-Lembron	63
63005	Antoingt	63
63422	Solignat	63
63166	Gignat	63
63036	Bergonne	63
63046	Boudes	63
63209	Mareugheol	63
63074	Chalus	63
63458	Villeneuve	63
63275	Perrier	63
63268	Pardines	63
26171	Manas	26
26249	Pont-de-Barret	26
26268	Rochebaudin	26
26334	Salettes	26
26348	Taulignan	26
26335	Salles-sous-Bois	26
26192	Montbrison-sur-Lez	26
26145	Les Granges-Gontardes	26
26360	Valaurie	26
26261	Réauville	26
26284	Roussas	26
07042	Bourg-Saint-Andéol	07
07346	Viviers	07
26121	Espeluche	26
26005	Allan	26
26085	Châteauneuf-du-Rhône	26
26116	Donzère	26
07279	Saint-Montan	07
26272	Rochefort-en-Valdaine	26
26203	Montjoyer	26
26146	Grignan	26
26031	La Bâtie-Rolland	26
26169	Malataverne	26
26045	La Bégude-de-Mazenc	26
26343	Souspierre	26
26131	Eyzahut	26
67466	Siegen	67
67346	Oberlauterbach	67
67440	Schaffhouse-près-Seltz	67
67541	Wintzenbach	67
67315	Neewiller-près-Lauterbourg	67
67451	Schleithal	67
67351	Seebach	67
67308	Munchhausen	67
67432	Salmbach	67
67261	Lauterbourg	67
67443	Scheibenhard	67
67327	Niederlauterbach	67
67305	Mothern	67
67014	Auenheim	67
67418	Rountzenheim	67
67142	Fort-Louis	67
67319	Neuhaeusel	67
67079	Crœttwiller	67
67494	Trimbach	67
67330	Niederrœdern	67
67087	Dauendorf	67
67458	Schweighouse-sur-Moder	67
67230	Kaltenhouse	67
67359	Ohlungen	67
67156	Geudertheim	67
67038	Bietlenheim	67
67039	Bilwisheim	67
67100	Donnenheim	67
67067	Brumath	67
67252	Kurtzenhouse	67
67523	Weitbruch	67
67529	Weyersheim	67
67169	Gries	67
67046	Bischwiller	67
67298	Mittelschaeffolsheim	67
67361	Olwisheim	67
67506	Vendenheim	67
67205	Hœrdt	67
67407	Rohrwiller	67
67345	Oberhoffen-sur-Moder	67
67194	Herrlisheim	67
67356	Offendorf	67
67106	Drusenheim	67
67151	Gambsheim	67
67237	Kilstett	67
67495	Truchtersheim	67
67034	Berstett	67
67256	Lampertheim	67
67519	La Wantzenau	67
67389	Reichstett	67
67539	Wingersheim les Quatre Bans	67
67236	Kienheim	67
67119	Eckwersheim	67
67452	Schnersheim	67
67001	Achenheim	67
67118	Eckbolsheim	67
67350	Oberschaeffolsheim	67
67551	Wolfisheim	67
67343	Oberhausbergen	67
67482	Strasbourg	67
67326	Niederhausbergen	67
67447	Schiltigheim	67
67204	Hœnheim	67
67471	Souffelweyersheim	67
67043	Bischheim	67
67097	Dingsheim	67
67173	Griesheim-sur-Souffel	67
67548	Wiwersheim	67
67375	Pfulgriesheim	67
67485	Stutzheim-Offenheim	67
67296	Mittelhausbergen	67
67309	Mundolsheim	67
67382	Quatzenheim	67
67214	Hurtigheim	67
67065	Breuschwickersheim	67
67226	Ittenheim	67
67218	Illkirch-Graffenstaden	67
67365	Ostwald	67
67268	Lipsheim	67
67212	Holtzheim	67
67124	Entzheim	67
67182	Hangenbieten	67
67267	Lingolsheim	67
67131	Eschau	67
67152	Geispolsheim	67
67112	Duttlenheim	67
67108	Duppigheim	67
67247	Kolbsheim	67
67045	Bischoffsheim	67
67223	Innenheim	67
67049	Blaesheim	67
67197	Hindisheim	67
67248	Krautergersheim	67
63292	Puy-Saint-Gulmier	63
63433	Tortebesse	63
63359	Saint-Hilaire-les-Monges	63
63115	Combrailles	63
63041	Biollet	63
63186	Landogne	63
63460	Villosanges	63
63363	Saint-Jacques-d'Ambur	63
63228	Miremont	63
63283	Pontaumur	63
63170	La Goutelle	63
63238	Montfermy	63
63191	Lastic	63
63175	Herment	63
63410	Sauvagnat	63
63339	Saint-Étienne-des-Champs	63
63020	Aurières	63
63326	Saint-Bonnet-près-Orcival	63
63257	Olby	63
63351	Saint-Germain-près-Herment	63
63085	Chapdes-Beaufort	63
63285	Pontgibaud	63
63055	Bromont-Lamothe	63
63381	Saint-Ours	63
63110	Cisternes-la-Forêt	63
63386	Saint-Pierre-Roche	63
63176	Heume-l'Église	63
63178	Issoire	63
63031	Beaulieu	63
63052	Le Breuil-sur-Couze	63
63255	Nonette-Orsonnette	63
63054	Le Broc	63
63287	Les Pradeaux	63
63270	Parentignat	63
43022	Beaumont	43
43038	Bournoncle-Saint-Pierre	43
63111	Clémensat	63
43125	Lubilhac	43
43103	Grenier-Montgon	43
43050	Chambezon	43
15119	Massiac	15
63242	Moriat	63
63091	Charbonnier-les-Mines	63
43120	Lempdes-sur-Allagnon	43
43088	Espalem	43
43170	Saint-Beauzire	43
43123	Lorlanges	43
43191	Saint-Géron	43
63050	Brassac-les-Mines	63
67093	Dieffenbach-lès-Wœrth	67
67379	Preuschdorf	67
67177	Gunstett	67
67257	Lampertsloch	67
67511	Walbourg	67
67037	Biblisheim	67
07332	Valvignères	07
07099	Gras	07
07300	Saint-Thomé	07
07005	Alba-la-Romaine	07
07133	Larnas	07
07316	Soyons	07
26165	Livron-sur-Drôme	26
26252	Portes-lès-Valence	26
26124	Étoile-sur-Rhône	26
26362	Valence	26
07102	Guilherand-Granges	07
07070	Cornas	07
07323	Toulaud	07
07281	Saint-Péray	07
07055	Charmes-sur-Rhône	07
26313	Saint-Marcel-lès-Valence	26
26004	Alixan	26
26058	Bourg-lès-Valence	26
07076	Cruas	07
26097	Cliousclat	26
26166	Loriol-sur-Drôme	26
26185	Mirmande	26
26353	Les Tourrettes	26
63163	Gelles	63
63248	Nébouzat	63
63388	Saint-Priest-des-Champs	63
63071	Ceyssat	63
63289	Prondines	63
63094	Charensat	63
63048	Bourg-Lastic	63
63421	Singles	63
63225	Messeix	63
63024	Avèze	63
63399	Saint-Sulpice	63
63053	Briffons	63
03166	Mazerier	03
03268	Saulzet	03
03164	Le Mayet-d'École	03
63181	Jozerand	63
63311	Saint-Agoulin	63
03258	Saint-Rémy-en-Rollat	03
03236	Saint-Germain-des-Fossés	03
03029	Billy	03
03237	Saint-Germain-de-Salles	03
03112	Étroussat	03
03016	Barberier	03
03163	Mariol	03
03045	Busset	03
03118	Gannat	03
63446	Vensat	63
03021	Bègues	03
63235	Montcel	63
63082	Champs	63
03255	Saint-Priest-d'Andelot	03
63271	Paslières	63
63291	Puy-Guillaume	63
63301	Ris	63
63430	Thiers	63
63138	Dorat	63
63402	Saint-Victor-Montvianeix	63
03182	Monteignet-sur-l'Andelot	03
03109	Escurolles	03
03252	Saint-Pont	03
03220	Saint-Bonnet-de-Rochefort	03
03133	Jenzat	03
63387	Saint-Priest-Bramefant	63
03110	Espinasse-Vozelle	03
03126	Hauterive	03
03271	Serbannes	03
03264	Saint-Yorre	03
63030	Bas-et-Lezat	63
63143	Effiat	63
63400	Saint-Sylvestre-Pragoulin	63
03044	Brugheas	03
03030	Biozat	03
03209	Poëzat	03
03061	Charmes	03
03080	Cognat-Lyonne	03
63347	Saint-Genès-du-Retz	63
63095	Charnat	63
63461	Vinzelles	63
63253	Noalhat	63
63196	Limons	63
63265	Orléat	63
63232	Mons	63
63364	Saint-Jean-d'Heurs	63
03160	Marcenat	03
03018	Bayet	03
03227	Saint-Didier-la-Forêt	03
03043	Broût-Vernet	03
03304	Vendat	03
03294	Ussel-d'Allier	03
03062	Charroux	03
63249	Néronde-sur-Dore	63
63151	Escoutoux	63
63276	Peschadoires	63
63310	Sainte-Agathe	63
63469	Vollore-Ville	63
63090	Chaptuzat	63
63240	Montpensier	63
63459	Villeneuve-les-Cerfs	63
03023	Bellerive-sur-Allier	03
03310	Vichy	03
03001	Abrest	03
03306	Le Vernet	03
03095	Cusset	03
03060	Charmeil	03
03094	Creuzier-le-Vieux	03
03093	Creuzier-le-Neuf	03
03273	Seuillet	03
63102	Châteldon	63
63393	Saint-Rémy-sur-Durolle	63
97134	Vieux-Habitants	971
97105	Basse-Terre	971
97104	Baillif	971
97109	Gourbeyre	971
97133	Vieux-Fort	971
97132	Trois-Rivières	971
97124	Saint-Claude	971
97106	Bouillante	971
64381	Méritein	64
67154	Gerstheim	67
67501	Uttenheim	67
67438	Schaeffersheim	67
67364	Osthouse	67
67054	Bolsenheim	67
67285	Matzenheim	67
67137	Fegersheim	67
77286	Meigneux	77
77383	Rampillon	77
77454	Sognolles-en-Montois	77
77452	Sigy	77
77223	Gurcy-le-Châtel	77
77159	Donnemarie-Dontilly	77
77298	Mons-en-Montois	77
77068	Cessoy-en-Montois	77
77524	Vimpelles	77
91198	D'Huison-Longueville	91
91293	Guigneville-sur-Essonne	91
91412	Mondeville	91
91579	Saint-Vrain	91
91159	Chevannes	91
91315	Itteville	91
91045	Ballancourt-sur-Essonne	91
91232	La Ferté-Alais	91
91047	Baulne	91
91135	Champcueil	91
91095	Bouray-sur-Juine	91
91129	Cerny	91
64301	Lagor	64
64003	Abidos	64
64431	Os-Marsillon	64
64061	Artix	64
64512	Sauvelade	64
64410	Mourenx	64
64075	Audaux	64
64149	Bugnein	64
64349	Loubieng	64
64418	Noguères	64
64443	Pardies	64
64005	Abos	64
64535	Tarsacq	64
64117	Bésingrand	64
64288	Labastide-Cézéracq	64
64290	Labastide-Monréjeau	64
64521	Serres-Sainte-Marie	64
64171	Casteide-Cami	64
64541	Urdès	64
64200	Doazon	64
64048	Arnos	64
64181	Castillon (Canton d'Arthez-de-Béarn)	64
64396	Mont	64
64057	Arthez-de-Béarn	64
64300	Lacq	64
64198	Denguin	64
64080	Aussevielle	64
64121	Beyrie-en-Béarn	64
26006	Allex	26
26007	Ambonil	26
26042	Beauvallon	26
26021	Autichamp	26
26065	Chabrillan	26
26277	La Roche-sur-Grane	26
26144	Grane	26
26365	Vaunaveys-la-Rochette	26
26224	Ourches	26
26032	La Baume-Cornillane	26
26196	Montéléger	26
26206	Montmeyran	26
26037	Beaumont-lès-Valence	26
26170	Malissard	26
26212	Montvendre	26
26197	Montélier	26
26064	Chabeuil	26
26108	Crest	26
26125	Eurre	26
26208	Montoison	26
26358	Upie	26
26115	Divajeu	26
07191	Rochemaure	07
07319	Le Teil	07
07157	Meysse	07
26008	Ancône	26
26198	Montélimar	26
26052	Bonlieu-sur-Roubion	26
26257	Puygiron	26
26191	Montboucher-sur-Jabron	26
26312	Saint-Marcel-lès-Sauzet	26
26338	Sauzet	26
26339	Savasse	26
26305	Saint-Gervais-sur-Roubion	26
26157	La Laupie	26
26095	Cléon-d'Andran	26
26176	Marsanne	26
26102	Condillac	26
26106	La Coucourde	26
26020	La Répara-Auriples	26
26287	Roynac	26
26352	La Touche	26
26243	Le Poët-Laval	26
26251	Portes-en-Valdaine	26
26276	Roche-Saint-Secret-Béconne	26
26003	Aleyrac	26
26258	Puy-Saint-Martin	26
26344	Soyans	26
26078	Charols	26
64532	Tadousse-Ussau	64
64180	Castetpugon	64
64534	Taron-Sadirac-Viellenave	64
64090	Baliracq-Maumusson	64
64153	Burosse-Mendousse	64
64552	Vialer	64
64311	Lannecaube	64
64307	Lalongue	64
64464	Ribarrouy	64
64233	Garlin	64
54442	Quevilloncourt	54
54497	Saxon-Sion	54
54434	Praye	54
54117	Chaouilley	54
54592	Vroncourt	54
54203	Forcelles-Saint-Gorgon	54
54552	Vaudémont	54
54522	Thorey-Lyautey	54
54185	Étreval	54
54407	Ognéville	54
65366	Poueyferré	65
65280	Loubajac	65
65164	Escoubès-Pouts	65
65247	Arrayou-Lahitte	65
65019	Arcizac-Adour	65
65339	Orincles	65
65281	Loucrup	65
65479	Visker	65
65043	Astugue	65
65107	Bourréac	65
65268	Layrisse	65
65433	Soues	65
65221	Hiis	65
65320	Montgaillard	65
65047	Aureilhan	65
65067	Barry	65
65052	Averan	65
65236	Julos	65
65355	Paréac	65
65163	Escots	65
65165	Esparros	65
65111	Bulan	65
65041	Asque	65
65167	Espieilh	65
65096	Bonnemazon	65
65306	Mauvezin	65
65162	Esconnets	65
65105	Bourg-de-Bigorre	65
65179	Fréchendets	65
65042	Asté	65
65123	Campan	65
65135	Castillon	65
65300	Marsas	65
65060	Banios	65
65091	Bettes	65
65147	Cieutat	65
65351	Ousté	65
65349	Ourdon	65
65271	Lézignan	65
65237	Juncalas	65
65144	Cheust	65
65348	Ourdis-Cotdoussan	65
65345	Ossun-ez-Angles	65
65038	Artigues	65
65421	Sère-Lanso	65
65011	Les Angles	65
65033	Arrodets-ez-Angles	65
65020	Arcizac-ez-Angles	65
65203	Gez-ez-Angles	65
65451	Trébons	65
65059	Bagnères-de-Bigorre	65
65200	Germs-sur-l'Oussouet	65
65238	Labassère	65
65328	Neuilh	65
65191	Gazost	65
65198	Gerde	65
65275	Lies	65
65310	Mérilheu	65
65459	Uzer	65
65216	Hauban	65
65024	Argelès-Bagnères	65
65338	Orignac	65
65335	Ordizan	65
65370	Pouzac	65
65078	Beaudéan	65
01401	Sergy	01
01135	Crozet	01
39478	Saint-Claude	39
01114	Confort	01
74109	Éloise	74
01205	Lancrans	01
01033	Bellegarde-sur-Valserine	01
74130	Franclens	74
74055	Challonges	74
74235	Saint-Germain-sur-Rhône	74
74029	Bassy	74
74269	Seyssel	74
39297	Longchaumois	39
01158	Farges	01
39275	Lamoura	39
77135	Courpalay	77
77138	Courtomer	77
77219	Guérard	77
77063	La Celle-sur-Morin	77
77224	Hautefeuille	77
77176	Faremoutiers	77
77229	La Houssaye-en-Brie	77
77144	Crèvecœur-en-Brie	77
67113	Eberbach-Seltz	67
67140	Forstfeld	67
67476	Stattmatten	67
67405	Rœschwoog	67
67264	Leutenheim	67
67231	Kauffenheim	67
67409	Roppenheim	67
67025	Beinheim	67
67184	Hatten	67
67069	Buhl	67
67235	Kesseldorf	67
67463	Seltz	67
67544	Wissembourg	67
67344	Oberhoffen-lès-Wissembourg	67
67221	Ingolsheim	67
67479	Steinseltz	67
67416	Rott	67
67232	Keffenach	67
67104	Drachenbronn-Birlenbach	67
67400	Riedseltz	67
67213	Hunspach	67
67160	Gœrsdorf	67
67074	Cleebourg	67
67075	Climbach	67
67271	Lobsann	67
67263	Lembach	67
30033	Beauvoisin	30
30128	Générac	30
13004	Arles	13
30258	Saint-Gilles	30
30341	Vauvert	30
30276	Saint-Laurent-d'Aigouze	30
15108	Val d'Arcomie	15
15241	La Trinitat	15
15078	Jabrun	15
15216	Saint-Urcize	15
15198	Sainte-Marie	15
15106	Lieutadès	15
48161	Saint-Juéry	48
48012	Les Monts-Verts	48
48002	Albaret-Sainte-Marie	48
48046	Chaulhac	48
48044	Chauchailles	48
48001	Albaret-le-Comtal	48
48031	Brion	48
48064	Fournels	48
48071	Grandvals	48
15073	Fridefont	15
15007	Anterrieux	15
15107	Lorcières	15
15209	Saint-Rémy-de-Chaudes-Aigues	15
15121	Maurines	15
48007	Arzenc-d'Apcher	48
15142	Neuvéglise-sur-Truyère	15
55178	Érize-Saint-Dizier	55
55282	Lavallée	55
55446	Rumont	55
55175	Érize-la-Brûlée	55
55044	Belrain	55
55366	Val-d'Ornain	55
55382	Neuville-sur-Ornain	55
55272	Laimont	55
55120	Combles-en-Barrois	55
55186	Fains-Véel	55
55101	Chardogne	55
55514	Trémont-sur-Saulx	55
55568	Ville-sur-Saulx	55
55476	Savonnières-devant-Bar	55
55029	Bar-le-Duc	55
55504	Tannois	55
55302	Longeville-en-Barrois	55
55488	Silmont	55
55426	Resson	55
55041	Behonne	55
55369	Naives-Rosières	55
55541	Vavincourt	55
55479	Seigneulles	55
55123	Les Hauts-de-Chée	55
55442	Raival	55
55069	Brabant-le-Roi	55
55560	Villers-aux-Vents	55
55304	Louppy-le-Château	55
55388	Noyers-Auzécourt	55
55427	Revigny-sur-Ornain	55
55125	Contrisson	55
55378	Nettancourt	55
55531	Vassincourt	55
55330	Méligny-le-Grand	55
55371	Nançois-le-Grand	55
55472	Saulvaux	55
55454	Saint-Aubin-sur-Aire	55
55573	Void-Vacon	55
55334	Ménil-la-Horgne	55
55278	Laneuville-au-Rupt	55
55374	Nant-le-Petit	55
55373	Nant-le-Grand	55
55543	Velaines	55
55519	Tronville-en-Barrois	55
55372	Nançois-sur-Ornain	55
55581	Willeroncourt	55
55291	Ligny-en-Barrois	55
55352	Montplonne	55
55221	Guerpont	55
55079	Brillon-en-Barrois	55
55501	Stainville	55
55335	Ménil-sur-Saulx	55
55061	Le Bouchon-sur-Saulx	55
55261	Juvigny-en-Perthois	55
55144	Dammarie-sur-Saulx	55
55520	Troussey	55
55496	Sorcy-Saint-Martin	55
55184	Euville	55
55122	Commercy	55
55358	Chanteraine	55
55487	Seuzey	55
55420	Récourt-le-Creux	55
55512	Tilly-sur-Meuse	55
55064	Bouquemont	55
55254	Les Trois-Domaines	55
55411	Rambluzin-et-Benoite-Vaux	55
55274	Lamorville	55
55551	Vigneulles-lès-Hattonchâtel	55
55303	Loupmont	55
55460	Saint-Julien-sous-les-Côtes	55
55093	Buxières-sous-les-Côtes	55
55384	Nicey-sur-Aire	55
55404	Pierrefitte-sur-Aire	55
55401	Les Paroches	55
55111	Chauvoncourt	55
55129	Courouvre	55
55197	Fresnes-au-Mont	55
55506	Thillombois	55
55269	Lahaymeix	55
55159	Dompcevrin	55
55212	Girauvoisin	55
55096	Chaillon	55
55245	Heudicourt-sous-les-Côtes	55
55528	Varnéville	55
55530	Valbois	55
55312	Maizey	55
55196	Frémeréville-sous-les-Côtes	55
55177	Érize-la-Petite	55
55128	Courcelles-sur-Aire	55
55532	Vaubecourt	55
55423	Rembercourt-Sommaisne	55
55409	Pretz-en-Argonne	55
55295	Lisle-en-Barrois	55
51132	Les Charmontois	51
48167	Saint-Laurent-de-Veyrès	48
48106	Noalhac	48
15065	Espinasse	15
15045	Chaudes-Aigues	15
97424	Cilaos	974
97421	Salazie	974
23114	Lussat	23
23045	Chambon-sur-Voueize	23
23106	Lépaud	23
23009	Auge	23
23259	Verneiges	23
03280	Terjat	03
03007	Arpheuilles-Saint-Priest	03
03211	Prémilhat	03
03261	Sainte-Thérence	03
03233	Saint-Genest	03
03314	Villebret	03
03106	Durdat-Larequille	03
03195	Néris-les-Bains	03
23209	Saint-Loup	23
23251	Tardes	23
23167	Sannat	23
23160	Reterre	23
23203	Saint-Julien-la-Genête	23
23164	Rougnat	23
63060	Bussières	63
23108	Leyrat	23
03259	Saint-Sauvier	03
03246	Saint-Martinien	03
03136	Lamaids	03
03212	Quinssaines	03
23032	Boussac-Bourg	23
03005	Archignat	03
23174	Soumans	23
23233	Saint-Pierre-le-Bost	23
23145	Nouhant	23
03288	Treignat	03
23254	Toulx-Sainte-Croix	23
23104	Lavaufranche	23
23240	Saint-Silvain-Bas-le-Roc	23
23031	Boussac	23
23093	Gouzon	23
23040	La Celle-sous-Gouzon	23
23243	Saint-Silvain-sous-Toulx	23
23255	Trois-Fonds	23
23026	Bord-Saint-Georges	23
23261	Viersat	23
23076	Évaux-les-Bains	23
23083	Fontanières	23
23046	Chambonchard	23
23035	Budelière	23
63101	Château-sur-Cher	63
03161	Marcillat-en-Combraille	03
63011	Ars-les-Favets	63
03167	Mazirat	03
63377	Saint-Maurice-près-Pionsat	63
03244	Saint-Marcel-en-Marcillat	03
23054	Charron	23
03206	La Petite-Marche	03
03231	Saint-Fargeol	03
03216	Ronnet	03
03047	La Celle	03
63360	Saint-Hilaire	63
63281	Pionsat	63
03145	Lignerolles	03
03140	Lavault-Sainte-Anne	03
03128	Huriel	03
03051	Chambérat	03
03055	La Chapelaude	03
67484	Stundwiller	67
67012	Aschbach	67
67200	Hipsheim	67
67217	Ichtratzheim	67
67336	Nordhouse	67
67266	Limersheim	67
67130	Erstein	67
67378	Plobsheim	67
67433	Sand	67
51648	Vitry-la-Ville	51
51339	Mairy-sur-Marne	51
51574	Togny-aux-Bœufs	51
51148	Cheppes-la-Prairie	51
51244	Faux-Vésigneul	51
51106	Cernon	51
51178	Coupetz	51
51512	Saint-Quentin-sur-Coole	51
51099	Bussy-Lettrée	51
51556	Soudron	51
51087	Breuvery-sur-Coole	51
51409	Nuisement-sur-Coole	51
51285	Haussimont	51
10369	Semoine	10
10216	Mailly-le-Camp	10
10293	Poivres	10
51276	Gourgançon	51
51241	Euvy	51
51535	Sézanne	51
51045	Beaunay	51
51327	Loisy-en-Brie	51
51129	Charleville	51
51070	Boissy-le-Repos	51
51369	Mœurs-Verdey	51
51526	Saudoy	51
51645	Vindey	51
51151	Chichey	51
51377	Montépreux	51
77066	Cerneux	77
77444	Sancy-lès-Provins	77
77421	Saint-Mars-Vieux-Maisons	77
77301	Montceaux-lès-Provins	77
77424	Saint-Martin-du-Boschet	77
77045	Bougligny	77
77267	La Madeleine-sur-Loing	77
77016	Bagneaux-sur-Loing	77
77333	Nemours	77
77458	Souppes-sur-Loing	77
77271	Maisoncelles-en-Gâtinais	77
77110	Chenou	77
77348	Ormesson	77
77178	Faÿ-lès-Nemours	77
77102	Châtenoy	77
77431	Saint-Pierre-lès-Nemours	77
33529	La Teste-de-Buch	33
33199	Gujan-Mestras	33
40287	Sanguinet	40
40046	Biscarrosse	40
77327	Nangis	77
77191	Fontenailles	77
77089	La Chapelle-Rablais	77
77509	Villeneuve-les-Bordes	77
77190	Fontains	77
51275	Glannes	51
51065	Blacy	51
51262	Frignicourt	51
51066	Blaise-sous-Arzillières	51
51134	Châtelraould-Saint-Louvent	51
51184	Courdemanges	51
51295	Huiron	51
51463	Les Rivières-Henruel	51
33498	Salles	33
33042	Belin-Béliet	33
33260	Lugos	33
77320	Mouroux	77
77436	Saint-Siméon	77
77131	Coulommiers	77
77278	Marolles-en-Brie	77
77028	Beautheil	77
77070	Chailly-en-Brie	77
77433	Saints	77
77002	Amillis	77
64525	Siros	64
64184	Cescau	64
64142	Bougarber	64
64554	Viellenave-d'Arthez	64
64549	Uzein	64
64387	Momas	64
64374	Mazerolles	64
64318	Larreule	64
64144	Boumourt	64
64243	Géus-d'Arzacq	64
64548	Uzan	64
64179	Castetner	64
64505	Sarpourenx	64
64367	Maslacq	64
64042	Argagnon	64
64312	Lanneplaà	64
64414	Narp	64
64434	Ossenx	64
64286	Laà-Mondrans	64
64176	Castetbon	64
64440	Ozenx-Montestrucq	64
64430	Orthez	64
64131	Biron	64
64177	Castétis	64
64088	Balansun	64
55340	Mognéville	55
55011	Andernay	55
55049	Beurey-sur-Saulx	55
55435	Robert-Espagne	55
55134	Couvonges	55
51531	Sermaize-les-Bains	51
52099	Chamouilley	52
55477	Savonnières-en-Perthois	55
55015	Aulnois-en-Perthois	55
55035	Bazincourt-sur-Saulx	55
55284	Lavincourt	55
52429	Roches-sur-Marne	52
64159	Cadillon	64
64192	Conchez-de-Béarn	64
64079	Aurions-Idernes	64
64236	Gayon	64
64052	Arricau-Bordes	64
64366	Mascaraàs-Haron	64
64486	Saint-Jean-Poudge	64
01143	Divonne-les-Bains	01
01153	Échenevex	01
01173	Gex	01
01354	Saint-Genis-Pouilly	01
01360	Saint-Jean-de-Gonville	01
01288	Péron	01
01419	Thoiry	01
39510	Septmoncel les Molunes	39
39046	Bellecombe	39
01210	Lélex	01
01247	Mijoux	01
39274	Lajoux	39
39441	Prémanon	39
01081	Champfromier	01
01104	Chézery-Forens	01
01078	Challex	01
01103	Chevry	01
01399	Ségny	01
01436	Vesancy	01
01071	Cessy	01
01160	Ferney-Voltaire	01
01281	Ornex	01
01180	Grilly	01
01397	Sauverny	01
01313	Prévessin-Moëns	01
01435	Versonnex	01
74062	Charvonnex	74
74137	Groisy	74
74195	Musièges	74
74065	Chaumont	74
74066	Chavannaz	74
74051	Cercier	74
74006	Allonzier-la-Caille	74
74307	Villy-le-Pelloux	74
74179	Mésigny	74
74257	Sallenôves	74
74076	Choisy	74
74086	Contamine-Sarzin	74
74168	Marlioz	74
74078	Clermont	74
74075	Chilly	74
74131	Frangy	74
74071	Chessenaz	74
74100	Desingy	74
74285	Usinens	74
74068	Chêne-en-Semine	74
74291	Vanzy	74
51268	Germinon	51
51638	Villeseneux	51
51603	Vélye	51
51319	Lenharrée	51
51049	Bergères-lès-Vertus	51
51226	Écury-le-Repos	51
51158	Val-des-Marais	51
51430	Pierre-Morains	51
51154	Clamanges	51
51578	Trécon	51
51176	Corroy	51
51248	Fère-Champenoise	51
51324	Linthes	51
51005	Allemant	51
51091	Broussy-le-Petit	51
51432	Pleurs	51
51165	Connantre	51
51090	Broussy-le-Grand	51
51035	Bannes	51
51265	Gaye	51
51323	Linthelles	51
51495	Saint-Loup	51
51563	Talus-Saint-Prix	51
51042	Baye	51
51641	Villevenard	51
51186	Courjeonnet	51
51157	Coizard-Joches	51
51611	Vert-Toulon	51
51514	Saint-Remy-sous-Broyes	51
51426	Péas	51
51092	Broyes	51
51374	Mondement-Montgivroux	51
51421	Oyes	51
51458	Reuves	51
51238	Étoges	51
51239	Étréchy	51
51113	Champaubert	51
51163	Congy	51
51247	Fèrebrianges	51
51263	Fromentières	51
51570	Le Thoult-Trosnay	51
51313	Lachy	51
51626	La Villeneuve-lès-Charleville	51
51542	Soizy-aux-Bois	51
51170	Corfélix	51
51034	Bannay	51
51412	Ognes	51
51555	Soudé	51
51545	Sommesous	51
51594	Vassimont-et-Chapelaine	51
51212	Dommartin-Lettrée	51
51164	Connantray-Vaurefroy	51
51146	Cheniers	51
40175	Maurrin	40
40012	Artassenx	40
40139	Laglorieuse	40
40259	Saint-Gein	40
40240	Renung	40
40049	Bordères-et-Lamensans	40
40286	Samadet	40
40298	Serres-Gaston	40
40016	Aubagnan	40
40029	Bats	40
40086	Coudures	40
40289	Sarraziet	40
40325	Vielle-Tursan	40
77113	Chevru	77
77116	Choisy-en-Brie	77
77032	Beton-Bazoches	77
77250	Leudon-en-Brie	77
10023	Avon-la-Pèze	10
10318	Rigny-la-Nonneuse	10
10348	Saint-Lupien	10
10224	Marigny-le-Châtel	10
10157	La Fosse-Corduan	10
10351	Saint-Martin-de-Bossenay	10
67472	Soufflenheim	67
67450	Schirrhoffen	67
67449	Schirrhein	67
67465	Sessenheim	67
77239	Jouy-le-Châtel	77
77033	Bezalles	77
77020	Bannost-Villegagnon	77
77036	Boisdon	77
77109	Chenoise	77
77414	Saint-Hilliers	77
77201	Gastins	77
77381	Quiers	77
77147	La Croix-en-Brie	77
77010	Aubepierre-Ozouer-le-Repos	77
77317	Mormant	77
77211	Grandpuits-Bailly-Carrois	77
77031	Bernay-Vilbert	77
77119	Clos-Fontaine	77
65359	Peyriguère	65
65206	Goudon	65
65426	Sinzos	65
65447	Tournay	65
65357	Peyraube	65
65149	Clarac	65
65324	Moulédous	65
65101	Bordes	65
65326	Mun	65
65044	Aubarède	65
65301	Marseillan	65
65115	Cabanac	65
65298	Marquerie	65
65142	Chelle-Debat	65
65443	Thuy	65
65276	Lizos	65
65225	Hourc	65
65369	Pouyastruc	65
65151	Collongues	65
65131	Castelvieilh	65
65103	Bouilh-Péreuilh	65
65265	Laslades	65
65436	Souyeaux	65
65259	Lansac	65
65104	Boulin	65
65380	Sabalos	65
65410	Sarrouilles	65
65303	Mascaras	65
65120	Calavanté	65
65346	Oueilloux	65
65272	Lhez	65
65270	Lespouey	65
65010	Angos	65
65333	Oléac-Dessus	65
65146	Chis	65
65156	Dours	65
65332	Oléac-Debat	65
65340	Orleix	65
65048	Aurensan	65
10223	Marcilly-le-Hayer	10
10410	Villadin	10
10145	Faux-Villecerf	10
10054	Bourdenay	10
10038	Bercenay-le-Hayer	10
10003	Aix-Villemaur-Pâlis	10
10301	Pouy-sur-Vannes	10
10290	Planty	10
40217	Parentis-en-Born	40
40257	Sainte-Eulalie-en-Born	40
40108	Gastes	40
62383	Gouy-sous-Bellonne	62
59214	Estrées	59
59263	Gœulzin	59
62753	Saint-Laurent-Blangy	62
62718	Rœux	62
62660	Plouvain	62
62323	Fampoux	62
62764	Saint-Nicolas	62
62011	Agnez-lès-Duisans	62
62399	Habarcq	62
62340	Floringhem	62
62854	Villers-au-Bois	62
62213	Carency	62
62001	Ablain-Saint-Nazaire	62
62019	Aix-Noulette	62
62380	Gouy-Servins	62
62443	Hersin-Coupigny	62
62170	Bouvigny-Boyeffles	62
62801	Souchez	62
62371	Givenchy-en-Gohelle	62
62861	Vimy	62
62324	Farbus	62
62570	Méricourt	62
62427	Hénin-Beaumont	62
62249	Courcelles-lès-Lens	62
59211	Esquerchin	59
62865	Vitry-en-Artois	62
62639	Oppy	62
62369	Gavrelle	62
62039	Arleux-en-Gohelle	62
62892	Willerval	62
62680	Quiéry-la-Motte	62
62198	Cambligneul	62
62314	Estrée-Cauchy	62
62199	Camblain-l'Abbé	62
62793	Servins	62
62366	Gauchin-Légal	62
62356	Fresnicourt-le-Dolmen	62
62166	Bours	62
62652	Pernes	62
62553	Marest	62
62813	La Thieuloye	62
62269	Diéval	62
62197	Camblain-Châtelain	62
62457	Houdain	62
62586	Montenescourt	62
62363	Frévin-Capelle	62
62540	Maisnil-lès-Ruitz	62
62211	Capelle-Fermont	62
62012	Agnières	62
57409	Lixing-lès-Saint-Avold	57
57237	Frémestroff	57
57384	Laning	57
57014	Altrippe	57
57398	Leyviller	57
57725	Vittersbourg	57
57571	Rémering-lès-Puttelange	57
57615	Saint-Jean-Rohrbach	57
57308	Hazembourg	57
57556	Puttelange-aux-Lacs	57
57325	Hilsprich	57
57573	Réning	57
57497	Nelling	57
57536	Petit-Tenquin	57
57258	Gréning	57
57357	Kappelkinger	57
57346	Insming	57
57178	Diffembach-lès-Hellimer	57
57267	Le Val-de-Guéblange	57
57239	Freybouse	57
57723	Virming	57
57262	Grostenquin	57
57198	Erstroff	57
57311	Hellimer	57
57232	Francaltroff	57
57394	Léning	57
77318	Mortcerf	77
77400	Saint-Augustin	77
77281	Mauperthuis	77
77277	Marles-en-Brie	77
77192	Fontenay-Trésigny	77
77360	Pézarches	77
77264	Lumigny-Nesles-Ormeaux	77
77365	Le Plessis-Feu-Aussoux	77
77469	Touquin	77
77486	Vaudoy-en-Brie	77
77527	Voinsles	77
77357	Pécy	77
77393	Rozay-en-Brie	77
77087	La Chapelle-Iger	77
10172	Herbisse	10
10004	Allibaudières	10
10095	Le Chêne	10
10167	Grandville	10
10195	Lhuître	10
10130	Dosnon	10
10386	Trouans	10
33236	Lège-Cap-Ferret	33
33051	Biganos	33
65397	Saint-Sever-de-Rustan	65
65254	Laméac	65
65454	Trouley-Labarthe	65
65232	Jacque	65
91376	Marolles-en-Hurepoix	91
91649	Vert-le-Petit	91
91332	Leudeville	91
91648	Vert-le-Grand	91
91103	Brétigny-sur-Orge	91
91494	Le Plessis-Pâté	91
91086	Bondoufle	91
07113	Labastide-de-Virac	07
07328	Vagnas	07
07028	Beaulieu	07
07033	Bessas	07
07101	Grospierres	07
07031	Berrias-et-Casteljau	07
07304	Salavas	07
30175	Montclus	30
07168	Orgnac-l'Aven	07
30131	Goudargues	30
30230	Saint-André-de-Roquepertuis	30
30303	Saint-Victor-de-Malcap	30
30237	Saint-Brès	30
07294	Saint-Sauveur-de-Cruzières	07
07211	Saint-André-de-Cruzières	07
30113	Fons-sur-Lussan	30
30151	Lussan	30
30215	Rivières	30
30218	Rochegude	30
30327	Tharaux	30
30164	Méjannes-le-Clap	30
30293	Saint-Privat-de-Champclos	30
30266	Saint-Jean-de-Maruéjols-et-Avéjan	30
30029	Barjac	30
30008	Allègre-les-Fumades	30
30204	Potelières	30
30247	Saint-Denis	30
51612	Blancs-Coteaux	51
51271	Gionges	51
51367	Le Mesnil-sur-Oger	51
51411	Oger	51
40001	Aire-sur-l'Adour	40
40221	Perquie	40
40258	Sainte-Foy	40
40331	Villeneuve-de-Marsan	40
40178	Mazerolles	40
40051	Bougue	40
40103	Gaillères	40
40238	Pujo-le-Plan	40
40255	Saint-Cricq-Villeneuve	40
40250	Saint-Avit	40
40100	Le Frêche	40
40013	Arthez-d'Armagnac	40
40024	Banos	40
40017	Audignon	40
40098	Eyres-Moncube	40
40282	Saint-Sever	40
40196	Montsoué	40
40195	Montgaillard	40
40145	Larrivière-Saint-Savin	40
40026	Bas-Mauco	40
40122	Haut-Mauco	40
40275	Saint-Maurice-sur-Adour	40
40037	Benquet	40
40055	Bretagne-de-Marsan	40
40117	Grenade-sur-l'Adour	40
40025	Bascons	40
40070	Castandet	40
62609	Neuville-Saint-Vaast	62
62415	Haute-Avesnes	62
62007	Acq	62
62290	Écurie	62
62041	Arras	62
62042	Athies	62
62073	Bailleul-Sir-Berthoult	62
62810	Thélus	62
62714	Roclincourt	62
62320	Étrun	62
62557	Marœuil	62
62589	Mont-Saint-Éloi	62
62279	Duisans	62
59126	Cantin	59
59513	Roucourt	59
59170	Dechy	59
62744	Sainte-Catherine	62
62037	Anzin-Saint-Aubin	62
59234	Flers-en-Escrebieux	59
59178	Douai	59
62627	Noyelles-sous-Bellonne	62
62240	Corbehem	62
62173	Brebières	62
59156	Courchelettes	59
59228	Férin	59
59165	Cuincy	59
59329	Lambres-lez-Douai	59
59334	Lauwin-Planque	59
62612	Neuvireuil	62
62358	Fresnoy-en-Gohelle	62
62003	Acheville	62
62148	Bois-Bernard	62
62277	Drocourt	62
62476	Izel-lès-Équerchin	62
62355	Fresnes-lès-Montauban	62
62128	Biache-Saint-Vaast	62
62441	Hermin	62
62693	Rebreuve-Ranchicourt	62
62218	Caucourt	62
62642	Ourton	62
62270	Divion	62
62362	Frévillers	62
62077	Bajus	62
62580	Monchy-Breton	62
62120	Beugin	62
62536	Magnicourt-en-Comte	62
62232	La Comté	62
62438	Hermaville	62
59280	Hamel	59
59115	Brunémont	59
59026	Aubigny-au-Bac	59
62284	Écourt-Saint-Quentin	62
62106	Bellonne	62
59015	Arleux	59
62298	Épinoy	62
62697	Récourt	62
62825	Tortequesne	62
62646	Palluel	62
62280	Dury	62
62638	Oisy-le-Verger	62
62317	Étaing	62
40099	Fargues	40
40281	Saint-Pierre-du-Mont	40
40192	Mont-de-Marsan	40
40280	Saint-Perdon	40
40201	Mugron	40
40204	Nerbis	40
40309	Souprosse	40
40121	Hauriet	40
40091	Duhort-Bachen	40
40253	Saint-Cricq-Chalosse	40
40299	Serreslous-et-Arribans	40
40318	Toulouzette	40
40191	Montaut	40
40143	Lamothe	40
40076	Cauna	40
40020	Aurice	40
40177	Maylis	40
40144	Larbey	40
40249	Saint-Aubin	40
40054	Brassempouy	40
40109	Gaujacq	40
40038	Bergouey	40
40252	Sainte-Colombe	40
40089	Doazit	40
40128	Horsarrieu	40
40092	Dumes	40
40119	Hagetmau	40
40002	Amou	40
40132	Labatut	40
40153	Le Leuy	40
40194	Montfort-en-Chalosse	40
40023	Baigts	40
40205	Nousse	40
40160	Lourquen	40
40078	Caupenne	40
40141	Lahosse	40
40228	Pomarez	40
40071	Castelnau-Chalosse	40
40090	Donzacq	40
40112	Gibret	40
40074	Castel-Sarrazin	40
40028	Bastennes	40
40236	Poyartin	40
40095	Estibeaux	40
40199	Mouscardès	40
40084	Clermont	40
40216	Ozourt	40
40308	Sort-en-Chalosse	40
40106	Garrey	40
40126	Hinx	40
40113	Goos	40
40237	Préchacq-les-Bains	40
40104	Gamarde-les-Bains	40
40147	Laurède	40
40116	Gouts	40
40208	Onard	40
40018	Audon	40
40180	Meilhan	40
40061	Campagne	40
40260	Saint-Geours-d'Auribat	40
40235	Poyanne	40
40313	Tartas	40
40183	Mimbaste	40
40063	Candresse	40
40315	Téthieu	40
40283	Saint-Vincent-de-Paul	40
40316	Tilh	40
40214	Ossages	40
64479	Saint-Girons-en-Béarn	64
40118	Habas	40
64135	Bonnut	64
40047	Bonnegarde	40
40011	Arsague	40
40186	Misson	40
40233	Pouillon	40
40332	Ychoux	40
40295	Saugnacq-et-Muret	40
65207	Gourgue	65
65378	Ricaud	65
65037	Artiguemy	65
65353	Ozon	65
65367	Poumarous	65
65143	Chelle-Spou	65
65256	Lanespède	65
65153	Coussan	65
65204	Gonez	65
65337	Orieux	65
62379	Gouy-en-Artois	62
62578	Monchiet	62
59117	Bugnicourt	59
59276	Guesnain	59
59569	Sin-le-Noble	59
59199	Erchin	59
62414	Haucourt	62
62703	Rémy	62
62319	Éterpigny	62
62405	Hamblain-les-Prés	62
62734	Sailly-en-Ostrevent	62
62858	Villers-lès-Cagnicourt	62
62782	Saudemont	62
62728	Rumaucourt	62
62780	Sauchy-Cauchy	62
62857	Villers-Châtel	62
62574	Mingoval	62
62118	Béthonsart	62
62558	Marquay	62
62070	Bailleul-aux-Cornailles	62
62816	Tilloy-lès-Hermaville	62
62820	Tincques	62
62542	Maizières	62
51137	Châtillon-sur-Morin	51
10225	Marnay-sur-Seine	10
10298	Pont-sur-Seine	10
10268	Nogent-sur-Seine	10
51056	Bethon	51
51258	La Forestière	51
10031	Barbuise	10
10291	Plessis-Barbuise	10
51376	Montgenost	51
10421	La Villeneuve-au-Châtelot	10
51473	Saint-Bon	51
51071	Bouchy-Saint-Genest	51
77519	Villiers-Saint-Georges	77
77262	Louan-Villegruis-Fontaine	77
51236	Les Essarts-le-Vicomte	51
51233	Escardes	51
10420	Villenauxe-la-Grande	10
51395	Nesle-la-Reposte	51
77026	Beauchery-Saint-Martin	77
10254	Montpothier	10
10355	Saint-Nicolas-la-Chapelle	10
10367	La Saulsotte	10
77012	Augers-en-Brie	77
77246	Léchelle	77
77530	Voulton	77
77396	Rupéreux	77
77275	Les Marêts	77
51235	Les Essarts-lès-Sézanne	51
51237	Esternay	51
51407	La Noue	51
51036	Barbonne-Fayel	51
51360	Le Meix-Saint-Epoing	51
51124	Chantemerle	51
51103	La Celle-sous-Chantemerle	51
51254	Fontaine-Denis-Nuisy	51
10284	Périgny-la-Rose	10
51443	Potangis	51
51625	Villeneuve-la-Lionne	51
51579	Tréfols	51
51306	Joiselle	51
51459	Réveillon	51
51185	Courgivaux	51
51402	Neuvy	51
51116	Champguyon	51
51386	Morsains	51
59336	Lécluse	59
62650	Pelves	62
62477	Izel-lès-Hameau	62
62331	Feuchy	62
62145	Boiry-Notre-Dame	62
62004	Achicourt	62
62817	Tilloy-lès-Mofflaines	62
62582	Monchy-le-Preux	62
62223	Chérisy	62
62864	Vis-en-Artois	62
62013	Agny	62
62392	Guémappe	62
62332	Ficheux	62
62378	Gouves	62
62045	Aubigny-en-Artois	62
62727	Ruitz	62
62514	Ligny-Saint-Flochel	62
62061	Averdoingt	62
62651	Penin	62
62113	Berles-Monchel	62
62785	Savy-Berlette	62
62221	Chelers	62
62856	Villers-Brûlin	62
62878	Warlus	62
62115	Berneville	62
62263	Dainville	62
62869	Wailly	62
62426	Héninel	62
62428	Hénin-sur-Cojeul	62
62761	Saint-Martin-sur-Cojeul	62
62568	Mercatel	62
62099	Beaurains	62
62611	Neuville-Vitasse	62
62873	Wancourt	62
62085	Basseux	62
62712	Rivière	62
62097	Beaumetz-lès-Loges	62
62874	Wanquetin	62
62796	Simencourt	62
55569	Villotte-devant-Louppy	55
55026	Badonvilliers-Gérauvilliers	55
55005	Amanty	55
55173	Épiez-sur-Meuse	55
55215	Gondrecourt-le-Château	55
55328	Maxey-sur-Vaise	55
55088	Burey-en-Vaux	55
55381	Neuville-lès-Vaucouleurs	55
55248	Houdelaincourt	55
55001	Abainville	55
55030	Baudignécourt	55
55148	Delouze-Rosières	55
55327	Mauvages	55
55350	Montigny-lès-Vaucouleurs	55
55559	Villeroy-sur-Méholle	55
55084	Broussey-en-Blois	55
55516	Tréveray	55
55370	Naix-aux-Forges	55
55452	Saint-Amand-sur-Ornain	55
55067	Boviolles	55
55150	Demange-aux-Eaux	55
55066	Bovée-sur-Barboure	55
55421	Reffroy	55
55322	Marson-sur-Barboure	55
55331	Méligny-le-Petit	55
55475	Sauvoy	55
55368	Naives-en-Blois	55
55533	Vaucouleurs	55
55396	Ourches-sur-Meuse	55
55246	Hévilliers	55
55459	Saint-Joire	55
55326	Maulan	55
55300	Longeaux	55
55214	Givrauval	55
55562	Villers-le-Sec	55
55376	Nantois	55
55195	Fouchères-aux-Bois	55
55359	Morley	55
55332	Menaucourt	55
55444	Rouvrois-sur-Meuse	55
55268	Lacroix-sur-Meuse	55
55584	Woimbey	55
55027	Bannoncourt	55
55040	Beausite	55
65274	Libaros	65
65419	Sentous	65
65184	Galez	65
65095	Bonnefont	65
65128	Castelbajac	65
65113	Burg	65
65097	Bonrepos	65
65086	Bernadets-Dessus	65
65183	Galan	65
65318	Montastruc	65
77107	Chaumes-en-Brie	77
77007	Argentières	77
77004	Andrezel	77
77029	Beauvoir	77
77534	Yèbles	77
77493	Verneuil-l'Étang	77
77222	Guignes	77
77082	Champeaux	77
77453	Sivry-Courtry	77
77426	Saint-Méry	77
77044	Bombon	77
77086	La Chapelle-Gauthier	77
77165	Les Écrennes	77
77103	Châtillon-la-Borde	77
77100	Le Châtelet-en-Brie	77
77195	Fouju	77
77034	Blandy	77
57115	Brulange	57
57395	Lesse	57
57174	Destry	57
57138	Chenois	57
57054	Baudrecourt	57
57442	Many	57
57430	Mainvillers	57
57698	Vatimont	57
57027	Arraincourt	57
57313	Hémilly	57
57328	Holacourt	57
57726	Vittoncourt	57
57190	Elvange	57
57159	Créhange	57
57276	Guinglange	57
57319	Herny	57
57029	Arriance	57
57008	Adelange	57
57189	Eincheville	57
57673	Thonville	57
57662	Suisse	57
57105	Boustroff	57
57670	Thicourt	57
57686	Vahl-lès-Faulquemont	57
57209	Faulquemont	57
57684	Vahl-Ebersing	57
57082	Biding	57
57453	Maxstadt	57
57337	Hoste	57
67125	Epfig	67
67362	Orschwiller	67
45329	Triguères	45
45097	Chuelles	45
45083	Château-Renard	45
45275	Saint-Firmin-des-Bois	45
45115	Courtenay	45
45073	Chantecoq	45
45281	Saint-Hilaire-les-Andrésis	45
77067	Cesson	77
77495	Vert-Saint-Denis	77
77145	Crisenoy	77
77081	Champdeuil	77
77410	Saint-Germain-Laxis	77
55258	Geville	55
55141	Dagonville	55
55333	Ménil-aux-Bois	55
55114	Chonville-Malaumont	55
55220	Grimaucourt-près-Sampigny	55
55138	Culey	55
55298	Loisey	55
55466	Salmagne	55
55518	Cousances-lès-Triconville	55
55179	Erneville-aux-Bois	55
55207	Géry	55
55526	Vadonville	55
55288	Lérouville	55
55553	Vignot	55
55463	Saint-Mihiel	55
55329	Mécrin	55
55012	Apremont-la-Forêt	55
55229	Han-sur-Meuse	55
55467	Sampigny	55
55407	Pont-sur-Meuse	55
55058	Boncourt-sur-Meuse	55
55448	Rupt-devant-Saint-Mihiel	55
55289	Levoncourt	55
55570	Villotte-sur-Aire	55
55290	Lignières-sur-Aire	55
55032	Baudrémont	55
55210	Gimécourt	55
55127	Courcelles-en-Barrois	55
55263	Kœur-la-Grande	55
55555	Ville-devant-Belrain	55
55264	Kœur-la-Petite	55
55054	Bislée	55
34143	Loupian	34
30157	Mars	30
30052	Bréau-et-Salagosse	30
30024	Aulas	30
30015	Arphy	30
30016	Arre	30
30038	Bez-et-Esparon	30
30170	Molières-Cavaillac	30
30026	Avèze	30
30154	Mandagout	30
30353	Vissec	30
30040	Blandas	30
30017	Arrigas	30
30025	Aumessas	30
48069	Gatuzières	48
30219	Rogues	30
48065	Fraissinet-de-Fourques	48
48130	Rousses	48
48088	La Malène	48
48141	Mas-Saint-Chély	48
48193	Vebron	48
48020	Bassurels	48
34215	Pouzols	34
34254	Saint-Félix-de-Lodez	34
34262	Saint-Guiraud	34
34239	Saint-André-de-Sangonis	34
34122	Jonquières	34
34208	Popian	34
34125	Lagamas	34
34013	Aspiran	34
34313	Tressan	34
34210	Le Pouget	34
34041	Brignac	34
34197	Péret	34
34138	Lieuran-Cabrières	34
34106	Fozières	34
34212	Poujols	34
34196	Pégairolles-de-l'Escalette	34
34253	Saint-Félix-de-l'Héras	34
34304	Soubès	34
34251	Saint-Étienne-de-Gourgas	34
34283	Saint-Pierre-de-la-Fage	34
34278	Saint-Michel	34
34286	Saint-Privat	34
34317	La Vacquerie-et-Saint-Martin-de-Castries	34
34277	Saint-Maurice-Navacelles	34
34303	Sorbs	34
34268	Saint-Jean-de-la-Blaquière	34
34287	Saint-Saturnin-de-Lucian	34
34011	Arboras	34
34173	Montpeyroux	34
34267	Saint-Jean-de-Fos	34
34261	Saint-Guilhem-le-Désert	34
34195	Pégairolles-de-Buèges	34
34264	Saint-Jean-de-Buèges	34
34306	Soumont	34
34036	Le Bosc	34
12212	Saint-Beaulize	12
12220	Sainte-Eulalie-de-Cernon	12
12115	L'Hospitalet-du-Larzac	12
12063	La Cavalerie	12
10057	Bouy-sur-Orvin	10
77356	Passy-sur-Seine	77
77341	Noyen-sur-Seine	77
10154	Fontenay-de-Bossery	10
10153	Fontaine-Mâcon	10
77403	Saint-Brice	77
77456	Soisy-Bouy	77
77073	Chalautre-la-Petite	77
77227	Hermé	77
77218	Grisy-sur-Seine	77
77522	Villiers-sur-Seine	77
77289	Melz-sur-Seine	77
77459	Sourdun	77
10169	Gumery	10
10259	La Motte-Tilly	10
10106	Courceroy	10
10231	Le Mériot	10
10382	Traînel	10
77072	Chalautre-la-Grande	77
51278	Les Grandes-Loges	51
51003	Aigny	51
51161	Condé-sur-Marne	51
51196	Cramant	51
51029	Avize	51
51030	Aÿ-Champagne	51
51018	Athis	51
51303	Jâlons	51
51576	Tours-sur-Marne	51
51150	Cherville	51
51566	Thibie	51
51435	Pocancy	51
51117	Champigneul-Champagne	51
51160	Compertrix	51
51227	Écury-sur-Coole	51
51302	Les Istres-et-Bury	51
51023	Aulnay-sur-Marne	51
51413	Oiry	51
51434	Plivot	51
51153	Chouilly	51
77225	La Haute-Maison	77
77361	Pierre-Levée	77
77238	Jouarre	77
77047	Bouleurs	77
77130	Coulommes	77
77443	Sancy	77
77111	Chessy	77
77132	Coupvray	77
77075	Chalifert	77
77268	Magny-le-Hongre	77
77315	Montry	77
77413	Saint-Germain-sur-Morin	77
77128	Couilly-Pont-aux-Dames	77
77371	Pommeuse	77
77013	Aulnoy	77
77270	Maisoncelles-en-Brie	77
77206	Giremoutiers	77
55517	Seuil-d'Argonne	55
55380	Neuville-en-Verdunois	55
55301	Longchamps-sur-Aire	55
55108	Chaumont-sur-Aire	55
55185	Èvres	55
55271	Laheycourt	55
12147	Montagnol	12
12282	Tournemire	12
12229	Saint-Jean-d'Alcapiès	12
12203	Roquefort-sur-Soulzon	12
12222	Saint-Félix-de-Sorgues	12
12292	Versols-et-Lapeyre	12
12200	Rivière-sur-Tarn	12
12180	Peyreleau	12
30176	Montdardier	30
34111	Ganges	34
12022	La Bastide-Pradines	12
30199	Pommiers	30
30296	Saint-Roman-de-Codières	30
30325	Sumène	30
34205	Les Plans	34
34132	Lauroux	34
34144	Lunas	34
12178	Paulhe	12
12086	La Cresse	12
12232	Saint-Jean-et-Saint-Paul	12
34121	Joncels	34
12139	Marnhagues-et-Latour	12
12295	Viala-du-Pas-de-Jaux	12
12122	Lapanouse-de-Cernon	12
12084	Creissels	12
12247	Saint-Saturnin-de-Lenne	12
12047	Campagnac	12
12055	La Capelle-Bonance	12
48175	Saint-Pierre-de-Nogaret	48
48191	La Tieule	48
48028	Les Bondons	48
48017	Banassac-Canilhac	48
12237	Saint-Laurent-d'Olt	12
12184	Pomayrols	12
48147	Saint-Étienne-du-Valdonnez	48
48081	Lanuéjols	48
48137	Saint-Bauzile	48
48016	Balsièges	48
48146	Gorges du Tarn Causses	48
48075	Ispagnac	48
48056	Esclanèdes	48
48156	Saint-Germain-du-Teil	48
48181	Saint-Saturnin	48
48034	La Canourgue	48
48085	Laval-du-Tarn	48
48039	Chanac	48
34241	Saint-Bauzille-de-la-Sylve	34
34114	Gignac	34
34282	Saint-Paul-et-Valmalle	34
34035	La Boissière	34
34010	Aniane	34
34221	Puéchabon	34
34060	Causse-de-la-Selle	34
34238	Saint-André-de-Buèges	34
34171	Montoulieu	34
34005	Agonès	34
34128	Laroque	34
34243	Saint-Bauzille-de-Putois	34
34099	Ferrières-les-Verreries	34
34185	Notre-Dame-de-Londres	34
34042	Brissac	34
34082	Combaillaux	34
34177	Murles	34
34342	Viols-en-Laval	34
34066	Cazevieille	34
34012	Argelliers	34
34343	Viols-le-Fort	34
34179	Murviel-lès-Montpellier	34
34259	Saint-Georges-d'Orques	34
34163	Montarnaud	34
34320	Vailhauquès	34
34274	Saint-Martin-de-Londres	34
34152	Mas-de-Londres	34
34153	Les Matelles	34
34116	Grabels	34
34123	Juvignac	34
34333	Vic-la-Gardiole	34
34024	Balaruc-le-Vieux	34
34113	Gigean	34
34087	Cournonsec	34
34108	Frontignan	34
34095	Fabrègues	34
34088	Cournonterral	34
34202	Pignan	34
34159	Mireval	34
34295	Saussan	34
34103	Fontès	34
34194	Paulhan	34
34029	Bélarga	34
34222	Puilacher	34
34204	Plaissan	34
34328	Vendémian	34
34338	Villeneuvette	34
34180	Nébian	34
34051	Canet	34
34213	Poussan	34
34281	Saint-Pargoire	34
34165	Montbazin	34
34016	Aumelas	34
34341	Villeveyrac	34
57425	Luppy	57
57737	Vulmont	57
57605	Sailly-Achâtel	57
57643	Secourt	57
57655	Solgne	57
54021	Armaucourt	54
54225	Gézoncourt	54
54239	Griscourt	54
54573	Villers-en-Haye	54
54126	Chenicourt	54
54024	Arraye-et-Han	54
54157	Dieulouard	54
57009	Ajoncourt	57
57406	Liocourt	57
57559	Puzieux	57
57171	Delme	57
57755	Xocourt	57
57674	Tincry	57
54517	Thézey-Saint-Martin	54
54313	Létricourt	54
57158	Craincourt	57
57010	Alaincourt-la-Côte	57
57349	Jallaucourt	57
57391	Lemoncourt	57
57525	Oriocourt	57
57436	Malaucourt-sur-Seille	57
57440	Manhoué	57
57228	Fossieux	57
57002	Aboncourt-sur-Seille	57
54546	Vandières	54
54579	Villers-sous-Prény	54
54375	Montauville	54
54403	Norroy-lès-Pont-à-Mousson	54
54279	Jezainville	54
57354	Juville	57
57045	Bacourt	57
57671	Thimonville	57
57555	Prévocourt	57
57231	Foville	57
54115	Champigneulles	54
54304	Laxou	54
54357	Maxéville	54
54482	Saint-Max	54
54526	Tomblaine	54
57717	Viller	57
57668	Teting-sur-Nied	57
57275	Guessling-Hémering	57
57549	Pontpierre	57
57379	Landroff	57
57297	Harprich	57
30056	La Bruguière	30
30048	Bouquet	30
30001	Aigaliers	30
30035	Belvézet	30
30055	Brouzet-lès-Alès	30
30338	Vallérargues	30
30275	Saint-Just-et-Vacquières	30
30320	Seynes	30
30197	Les Plans	30
30187	Navacelles	30
31545	Sepx	31
31477	Saint-Élix-Séglan	31
31134	Cazeneuve-Montaut	31
31440	Proupiary	31
34230	Les Rives	34
34064	Le Caylar	34
34091	Le Cros	34
12155	Fondamente	12
12067	Le Clapier	12
30332	Trèves	30
30105	Dourbies	30
30139	Lanuéjols	30
30074	Causse-Bégon	30
30280	Saint-Laurent-le-Minier	30
30350	Le Vigan	30
30220	Roquedur	30
30213	Revens	30
12260	Sauclières	12
12231	Saint-Jean-du-Bruel	12
30064	Campestre-et-Luc	30
30009	Alzon	30
12204	La Roque-Sainte-Marguerite	12
12168	Nant	12
12077	Cornus	12
12082	La Couvertoirade	12
34231	Romiguières	34
34233	Roqueredonde	34
34142	Lodève	34
34076	Ceyras	34
34124	Lacoste	34
34079	Clermont-l'Hérault	34
30272	Saint-Julien-de-la-Nef	30
34174	Moulès-et-Baucels	34
30238	Saint-Bresson	30
30229	Saint-André-de-Majencoules	30
34115	Gorniès	34
34067	Cazilhac	34
48074	Hures-la-Parade	48
48131	Le Rozier	48
48096	Meyrueis	48
48176	Saint-Pierre-des-Tripiers	48
12211	Saint-André-de-Vézines	12
12293	Veyreau	12
48094	Massegros Causses Gorges	48
12160	Mostuéjouls	12
48061	Florac Trois Rivières	48
48166	Cans et Cévennes	48
48050	Bédouès-Cocurès	48
12070	Compeyre	12
12002	Aguessac	12
12225	Saint-Georges-de-Luzençon	12
12145	Millau	12
12072	Comprégnac	12
12291	Verrières	12
12270	Sévérac d'Aveyron	12
12243	Saint-Rome-de-Cernon	12
34019	Avène	34
34071	Ceilhes-et-Rocozels	34
51230	Épernay	51
51483	Saint-Gibrien	51
51656	Vraux	51
51312	Juvigny	51
51504	Saint-Martin-sur-le-Pré	51
51617	La Veuve	51
51453	Recy	51
51509	Saint-Pierre	51
51634	Villers-le-Château	51
51242	Fagnières	51
51357	Matougues	51
51168	Coolus	51
51499	Saint-Mard-lès-Rouffy	51
51251	Flavigny	51
51107	Chaintrix-Bierges	51
51655	Vouzy	51
51663	Magenta	51
51431	Pierry	51
51281	Grauves	51
51200	Cuis	51
33333	Le Porge	33
77202	La Genevraye	77
77302	Montcourt-Fromonville	77
77156	Darvault	77
77506	Villemer	77
77340	Nonville	77
57539	Pévange	57
57451	Marthille	57
57051	Baronville	57
57004	Achain	57
57018	Amelécourt	57
57423	Lubécourt	57
57247	Gerbécourt	57
57702	Vaxy	57
57225	Fonteny	57
57528	Oron	57
57130	Château-Bréhain	57
57141	Chicourt	57
57719	Villers-sur-Nied	57
57236	Frémery	57
57424	Lucy	57
57483	Morhange	57
57692	Vannecourt	57
57107	Bréhain	57
57166	Dalhain	57
57059	Bellange	57
57490	Moyenvic	57
57625	Salonnes	57
57712	Vic-sur-Seille	57
57126	Chambrey	57
57657	Sotzeling	57
57580	Riche	57
57151	Conthil	57
57281	Haboudange	57
57558	Puttigny	57
57290	Hampont	57
57485	Morville-lès-Vic	57
57120	Burlioncourt	57
57132	Château-Salins	57
67311	Muttersholtz	67
67115	Ebersheim	67
67116	Ebersmunster	67
67246	Kogenheim	67
67464	Sermersheim	67
67196	Hilsenheim	67
67545	Witternheim	67
67412	Rossfeld	67
67146	Friesenheim	67
67055	Boofzheim	67
67192	Herbsheim	67
67338	Obenheim	67
67040	Bindernheim	67
67090	Diebolsheim	67
67397	Rhinau	67
67053	Bœsenbiesen	67
67461	Schwobsheim	67
67422	Saasenheim	67
67547	Wittisheim	67
67453	Schœnau	67
67486	Sundhouse	67
67310	Mussig	67
67019	Baldenheim	67
67429	Saint-Pierre	67
67481	Stotzheim	67
67557	Zellwiller	67
67526	Westhouse	67
67216	Huttenheim	67
67028	Benfeld	67
67233	Kertzfeld	67
67086	Daubensand	67
67060	Bourgheim	67
67504	Valff	67
67155	Gertwiller	67
67021	Barr	67
67239	Kintzheim	67
67462	Sélestat	67
67073	Châtenois	67
67445	Scherwiller	67
67094	Dieffenthal	67
67084	Dambach-la-Ville	67
57595	Rorbach-lès-Dieuze	57
57404	Lindre-Basse	57
57448	Marsal	57
57183	Donnelay	57
54446	Réchicourt-la-Petite	54
54133	Coincourt	54
54288	Lagney	54
54360	Ménil-la-Tour	54
54208	Francheville	54
54016	Andilly	54
54086	Boucq	54
54088	Bouvron	54
54327	Lucey	54
54346	Manoncourt-en-Woëvre	54
54298	Laneuveville-derrière-Foug	54
54205	Foug	54
54128	Choloy-Ménillot	54
54534	Trondes	54
54105	Bulligny	54
54010	Allamps	54
54247	Hammeville	54
54587	Vitrey	54
54174	Écrouves	54
54162	Domgermain	54
54414	Pagney-derrière-Barine	54
54102	Bruley	54
54528	Toul	54
54332	Maidières	54
54431	Pont-à-Mousson	54
57418	Loudrefing	57
57161	Cutting	57
57177	Dieuze	57
57053	Bassing	57
54283	Jouaville	54
55163	Doncourt-aux-Templiers	55
55583	Woël	55
55021	Avillers-Sainte-Croix	55
55256	Jonville-en-Woëvre	55
54535	Tronville	54
54477	Saint-Julien-lès-Gorze	54
54112	Chambley-Bussières	54
54244	Hagéville	54
54166	Dommartin-la-Chaussée	54
54599	Xonville	54
55267	Lachaussée	55
54511	Sponville	54
54171	Doncourt-lès-Conflans	54
54273	Jarny	54
54353	Mars-la-Tour	54
57722	Vionville	57
54103	Bruville	54
54441	Puxieux	54
55228	Hannonville-sous-les-Côtes	55
55462	Saint-Maurice-sous-les-Côtes	55
55507	Thillot	55
54570	Villecey-sur-Mad	54
54593	Waville	54
54453	Rembercourt-sur-Mad	54
54119	Charey	54
54153	Dampvitoux	54
54594	Xammes	54
57112	Brouck	57
57150	Condé-Northen	57
57220	Flocourt	57
57057	Béchy	57
57048	Bannay	57
57563	Raville	57
57085	Bionville-sur-Nied	57
57148	Colligny-Maizery	57
57654	Silly-sur-Nied	57
57127	Chanville	57
57718	Villers-Stoncourt	57
57648	Servigny-lès-Raville	57
57155	Courcelles-Chaussy	57
57695	Varize-Vaudoncourt	57
57431	Maizeroy	57
57335	Honskirch	57
54038	Azerailles	54
54243	Hablainville	54
54101	Brouville	54
54450	Reherrey	54
54377	Montigny	54
54484	Sainte-Pôle	54
54481	Saint-Maurice-aux-Forges	54
54555	Vaxainville	54
54163	Domjevin	54
54210	Fréménil	54
54556	Vého	54
54078	Blémerey	54
54480	Saint-Martin	54
54452	Reillon	54
54368	Mignéville	54
54014	Ancerviller	54
54161	Domèvre-sur-Vezouze	54
54044	Barbas	54
54396	Neufmaisons	54
54065	Bertrichamps	54
54124	Chazelles-sur-Albe	54
54562	Verdenal	54
54077	Blâmont	54
54189	Favières	54
57630	Sarrebourg	57
57446	Marimont-lès-Bénestroff	57
54064	Bertrambois	54
57321	Hesse	57
54129	Cirey-sur-Vezouze	54
57034	Aspach	57
57500	Neufmoulins	57
57380	Laneuveville-lès-Lorquin	57
57414	Lorquin	57
57318	Hermelange	57
57314	Héming	57
57362	Kerprich-aux-Bois	57
57756	Xouaxange	57
57344	Imling	57
57050	Barchain	57
57564	Réchicourt-le-Château	57
57469	Mittersheim	57
57086	Belles-Forêts	57
57253	Gondrexange	57
57320	Hertzing	57
57611	Saint-Georges	57
57241	Fribourg	57
57383	Languimberg	57
57759	Zarbeling	57
57060	Bénestroff	57
57382	Langatte	57
57579	Rhodes	57
57175	Diane-Capelle	57
57304	Haut-Clocher	57
57066	Berthelming	57
57613	Saint-Jean-de-Bassel	57
57524	Ommeray	57
77254	Liverdy-en-Brie	77
77136	Courquetaine	77
77127	Coubert	77
77217	Grisy-Suisnes	77
77384	Réau	77
77457	Solers	77
77352	Ozouer-le-Voulgis	77
77253	Lissy	77
77455	Soignolles-en-Brie	77
77269	Maincy	77
77487	Vaux-le-Pénil	77
91097	Boussy-Saint-Antoine	91
91631	Varennes-Jarcy	91
94056	Périgny	94
77039	Boissise-la-Bertrand	77
77038	Boissettes	77
77285	Le Mée-sur-Seine	77
77306	Montereau-sur-le-Jard	77
91215	Épinay-sous-Sénart	91
91514	Quincy-sous-Sénart	91
91617	Tigery	91
91225	Étiolles	91
77252	Limoges-Fourches	77
77175	Évry-Grégy-sur-Yerre	77
77053	Brie-Comte-Robert	77
77251	Lieusaint	77
77122	Combs-la-Ville	77
77288	Melun	77
91435	Morsang-sur-Seine	91
77445	Savigny-le-Temple	77
77412	Saint-Germain-sur-École	77
77389	La Rochette	77
77296	Moissy-Cramayel	77
77065	Cély	77
77185	Fleury-en-Bière	77
77528	Voisenon	77
77394	Rubelles	77
77435	Saint-Sauveur-sur-École	77
77447	Seine-Port	77
77326	Nandy	77
77407	Saint-Fargeau-Ponthierry	77
91179	Le Coudray-Montceaux	91
77378	Pringy	77
91573	Saint-Pierre-du-Perray	91
77069	Chailly-en-Bière	77
77152	Dammarie-les-Lys	77
77359	Perthes	77
77518	Villiers-en-Bière	77
77425	Saint-Martin-en-Bière	77
77040	Boissise-le-Roi	77
77186	Fontainebleau	77
77022	Barbizon	77
77521	Villiers-sur-Morin	77
77508	Villeneuve-le-Comte	77
77529	Voulangis	77
77104	Châtres	77
77154	Dammartin-sur-Tigeaux	77
77177	Favières	77
77510	Villeneuve-Saint-Denis	77
77377	Presles-en-Brie	77
77449	Serris	77
77470	Tournan-en-Brie	77
77215	Gretz-Armainvilliers	77
77091	Les Chapelles-Bourbon	77
77141	Coutevroult	77
77336	Neufmoutiers-en-Brie	77
77374	Pontcarré	77
77237	Jossigny	77
77181	Ferrières-en-Brie	77
77058	Bussy-Saint-Georges	77
77018	Bailly-Romainvilliers	77
77155	Dampmart	77
77464	Thorigny-sur-Marne	77
77243	Lagny-sur-Marne	77
77372	Pomponne	77
77307	Montévrain	77
77221	Guermantes	77
77124	Conches-sur-Gondoire	77
77085	Chanteloup-en-Brie	77
77390	Roissy-en-Brie	77
77350	Ozoir-la-Ferrière	77
77114	Chevry-Cossigny	77
77438	Saint-Thibault-des-Vignes	77
77209	Gouvernes	77
77059	Bussy-Saint-Martin	77
77382	Quincy-Voisins	77
54196	Flavigny-sur-Moselle	54
54266	Houdreville	54
54132	Clérey-sur-Brenon	54
54596	Xeuilley	54
54557	Velaine-en-Haye	54
54352	Maron	54
54351	Marbache	54
54490	Saizerais	54
54111	Chaligny	54
54318	Liverdun	54
54340	Mamey	54
54193	Fey-en-Haye	54
54463	Rosières-en-Haye	54
54235	Goviller	54
54417	Parey-Saint-Césaire	54
54354	Marthemont	54
54515	Thélod	54
54264	Houdelmont	54
54429	Pierreville	54
55503	Taillancourt	55
55089	Burey-la-Côte	55
55344	Montbras	55
55485	Sepvigny	55
55522	Ugny-sur-Meuse	55
55097	Chalaines	55
54380	Mont-le-Vignoble	54
54242	Gye	54
54392	Moutrot	54
54073	Bicqueley	54
54426	Pierre-la-Treiche	54
54122	Chaudeney-sur-Moselle	54
54167	Dommartin-lès-Toul	54
54583	Villey-le-Sec	54
54232	Gondreville	54
54202	Fontenoy-sur-Moselle	54
54007	Aingeray	54
54584	Villey-Saint-Étienne	54
54506	Sexey-les-Bois	54
54223	Germiny	54
54586	Viterne	54
54336	Maizières	54
54043	Bainville-sur-Madon	54
54505	Sexey-aux-Forges	54
54432	Pont-Saint-Vincent	54
54397	Neuves-Maisons	54
54500	Selaincourt	54
54135	Colombey-les-Belles	54
54046	Barisey-au-Plain	54
54435	Prény	54
54041	Bagneux	54
54008	Allain	54
54143	Crépey	54
54146	Crézilles	54
54523	Thuilley-aux-Groseilles	54
54405	Ochey	54
54226	Gibeaumeix	54
55456	Saint-Germain-sur-Meuse	55
55434	Rigny-Saint-Martin	55
55433	Rigny-la-Salle	55
54538	Uruffe	54
54306	Lay-Saint-Remy	54
55398	Pagny-sur-Meuse	55
77142	Crécy-la-Chapelle	77
77466	Tigeaux	77
77287	Meilleray	77
77097	Chartronges	77
77247	Lescherolles	77
77137	Courtacon	77
77240	Jouy-sur-Morin	77
77423	Saint-Martin-des-Champs	77
77182	La Ferté-Gaucher	77
77093	La Chapelle-Moutils	77
54370	Minorville	54
54063	Bernécourt	54
54240	Grosrouvres	54
54532	Tremblecourt	54
54160	Domèvre-en-Haye	54
54460	Rogéville	54
54466	Royaumeix	54
54492	Sanzey	54
54355	Martincourt	54
54518	Thiaucourt-Regniéville	54
54564	Viéville-en-Haye	54
54275	Jaulny	54
54087	Bouillonville	54
55046	Beney-en-Woëvre	55
55412	Rambucourt	55
55085	Broussey-Raulecourt	55
54499	Seicheprey	54
54343	Mandres-aux-Quatre-Tours	54
54057	Beaumont	54
55386	Nonsard-Lamarche	55
54182	Essey-et-Maizerais	54
54416	Pannes	54
54470	Saint-Baussant	54
54348	Manonville	54
54404	Noviant-aux-Prés	54
54317	Lironville	54
54566	Vilcey-sur-Trey	54
54316	Limey-Remenauville	54
55062	Bouconville-sur-Madt	55
54248	Hamonville	54
54019	Ansauville	54
55586	Xivray-et-Marvoisin	55
55353	Montsec	55
54200	Flirey	54
54187	Euvezin	54
55270	Lahayville	55
55431	Richecourt	55
57381	Laneuveville-en-Saulnois	57
57182	Donjeux	57
57727	Viviers	57
57040	Aulnois-sur-Seille	57
57292	Hannocourt	57
57486	Morville-sur-Nied	57
57676	Tragny	57
57609	Saint-Epvre	57
57035	Assenoncourt	57
54050	Bathelémont	54
54106	Bures	54
57621	Saint-Médard	57
57493	Mulcey	57
54418	Parroy	54
54601	Xures	54
57664	Tarquimpol	57
57272	Guermange	57
57173	Desseling	57
57181	Domnom-lès-Dieuze	57
57098	Bourgaltroff	57
57754	Xanrey	57
57077	Bezange-la-Petite	57
57473	Moncourt	57
57711	Vibersviller	57
54541	Valhey	54
54053	Bauzemont	54
54502	Serres	54
54026	Athienville	54
54509	Sommerviller	54
54462	Rosières-aux-Salines	54
54269	Hudiviller	54
54159	Dombasle-sur-Meurthe	54
54195	Flainval	54
54388	Mouacourt	54
54062	Benney	54
57472	Moncheux	57
54144	Crévéchamps	54
54527	Tonnoy	54
54559	Velle-sur-Moselle	54
54256	Haussonville	54
54192	Ferrières	54
54045	Barbonville	54
54307	Lebeuville	54
54310	Leménil-Mitry	54
54299	Laneuveville-devant-Bayon	54
54344	Mangonville	54
54465	Roville-devant-Bayon	54
54585	Virecourt	54
54597	Xirocourt	54
54554	Vaudigny	54
54553	Vaudeville	54
54142	Crantenoy	54
54252	Haroué	54
54411	Ormes-et-Ville	54
54589	Vittonville	54
57156	Courcelles-sur-Nied	57
57627	Sanry-sur-Nied	57
57055	Bazoncourt	57
57533	Pange	57
57218	Fleury	57
57552	Pouilly	57
57534	Peltre	57
57140	Chesny	57
57351	Jury	57
57656	Sorbey	57
57454	Mécleuves	57
57031	Ars-Laquenexy	57
57449	Marsilly	57
57385	Laquenexy	57
57162	Cuvry	57
57039	Augny	57
57447	Marly	57
57693	Vantoux	57
57467	Mey	57
57510	Noisseville	57
57512	Nouilly	57
57145	Coincy	57
57412	Longeville-lès-Metz	57
57049	Le Ban-Saint-Martin	57
57545	Plappeville	57
57480	Montigny-lès-Metz	57
57463	Metz	57
57616	Saint-Julien-lès-Metz	57
57249	Glatigny	57
57482	Ogy-Montoy-Flanville	57
57575	Retonfey	57
57200	Les Étangs	57
57649	Servigny-lès-Sainte-Barbe	57
57021	Ancy-Dornot	57
54055	Bayonville-sur-Mad	54
54022	Arnaville	54
54544	Vandelainville	54
57515	Novéant-sur-Moselle	57
57134	Châtel-Saint-Germain	57
57624	Sainte-Ruffine	57
57396	Lessy	57
57642	Scy-Chazelles	57
57030	Arry	57
57256	Gravelotte	57
57707	Vernéville	57
54415	Pagny-sur-Moselle	54
57415	Lorry-lès-Metz	57
54410	Onville	54
54478	Saint-Marcel	54
57578	Rezonville	57
57254	Gorze	57
54108	Burthecourt-aux-Chênes	54
54339	Malzéville	54
54395	Nancy	54
54165	Dommartemont	54
54123	Chavigny	54
54257	Heillecourt	54
54578	Villers-lès-Nancy	54
54300	Laneuveville-devant-Nancy	54
54547	Vandœuvre-lès-Nancy	54
54265	Houdemont	54
54274	Jarville-la-Malgrange	54
54330	Lupcourt	54
54571	Ville-en-Vermois	54
54328	Ludres	54
54197	Fléville-devant-Nancy	54
54366	Messein	54
54459	Richardménil	54
54141	Coyviller	54
54345	Manoncourt-en-Vermois	54
54483	Saint-Nicolas-de-Port	54
54025	Art-sur-Meurthe	54
54188	Faulx	54
54315	Leyr	54
54376	Montenoy	54
54338	Malleloy	54
54150	Custines	54
54430	Pompey	54
54215	Frouard	54
54089	Bouxières-aux-Chênes	54
54301	Lanfroicourt	54
54305	Lay-Saint-Christophe	54
54090	Bouxières-aux-Dames	54
54186	Eulmont	54
54262	Hoéville	54
54456	Réméréville	54
54180	Erbéviller-sur-Amezule	54
54510	Sornéville	54
54358	Mazerulles	54
54113	Champenoux	54
54023	Arracourt	54
54285	Juvrecourt	54
54071	Bezange-la-Grande	54
54070	Bey-sur-Seille	54
54100	Brin-sur-Seille	54
57538	Pettoncourt	57
57084	Bioncourt	57
57036	Attilloncourt	57
54374	Moncel-sur-Seille	54
54145	Crévic	54
54258	Hénaménil	54
54309	Lemainville	54
54032	Autrey	54
54437	Pulligny	54
54214	Frolois	54
54364	Méréville	54
54591	Voinémont	54
54109	Ceintrey	54
54233	Gondrexon	54
54030	Autrepierre	54
54458	Repaix	54
54230	Gogney	54
54512	Tanconville	54
57374	Lafrimbolle	57
54560	Veney	54
54365	Merviller	54
54539	Vacqueville	54
54229	Glonville	54
57099	Bourdonnay	57
57434	Maizières-lès-Vic	57
57044	Azoudange	57
57375	Lagarde	57
57210	Fénétrange	57
57071	Bettborn	57
57506	Niederstinzel	57
57592	Romelfing	57
67009	Altwiller	67
67091	Diedendorf	67
57583	Richeval	57
57229	Foulcrey	57
57042	Avricourt	57
57233	Fraquelfing	57
57504	Niderhoff	57
57302	Hattigny	57
57461	Métairies-Saint-Quirin	57
57377	Landange	57
54035	Avricourt	54
57488	Moussey	57
54083	Bonviller	54
54329	Lunéville	54
54116	Chanteheux	54
54074	Bienville-la-Petite	54
54507	Sionviller	54
54147	Crion	54
54445	Raville-sur-Sânon	54
54173	Drouville	54
54335	Maixe	54
54020	Anthelupt	54
54588	Vitrimont	54
54350	Marainviller	54
54061	Bénaménil	54
54349	Manonviller	54
54281	Jolivet	54
54148	Croismare	54
54297	Laneuveville-aux-Bois	54
54373	Moncel-lès-Lunéville	54
54303	Laronxe	54
54472	Saint-Clément	54
54520	Thiébauménil	54
54107	Buriville	54
54406	Ogéviller	54
54447	Réclonville	54
54422	Pettonville	54
54259	Herbéviller	54
54013	Amenoncourt	54
54457	Remoncourt	54
54308	Leintrey	54
88153	Domptail	88
54154	Deneuvre	54
54501	Seranville	54
54543	Vallois	54
54039	Baccarat	54
54217	Gélacourt	54
54245	Haigneville	54
54098	Brémoncourt	54
54170	Domptail-en-l'Air	54
54175	Einvaux	54
54359	Méhoncourt	54
54293	Landécourt	54
54461	Romain	54
54121	Charmois	54
54076	Blainville-sur-l'Eau	54
54565	Vigneulles	54
54152	Damelevières	54
54383	Mont-sur-Meurthe	54
54595	Xermaménil	54
54449	Rehainviller	54
54260	Hériménil	54
54209	Franconville	54
54255	Haudonville	54
54550	Vathiménil	54
54199	Flin	54
54292	Lamath	54
54206	Fraimbois	54
54125	Chenevières	54
54201	Fontenoy-la-Joûte	54
54393	Moyen	54
54216	Froville	54
54085	Borville	54
54130	Clayeures	54
54467	Rozelieures	54
54561	Vennezey	54
54386	Moriviller	54
54399	Neuviller-sur-Moselle	54
54486	Saint-Remimont	54
54054	Bayon	54
54379	Mont-l'Étroit	54
54496	Saulxures-lès-Vannes	54
54080	Blénod-lès-Toul	54
54120	Charmes-la-Côte	54
54548	Vannes-le-Châtel	54
55474	Sauvigny	55
55100	Champougny	55
55397	Pagny-la-Blanche-Côte	55
54047	Barisey-la-Côte	54
57675	Torcheville	57
57494	Munster	57
57470	Molring	57
57270	Val-de-Bride	57
57753	Wuisse	57
57133	Château-Voué	57
57401	Lidrezing	57
57417	Lostroff	57
57278	Guinzeling	57
57347	Insviller	57
57410	Lhor	57
57399	Lezey	57
57353	Juvelize	57
57268	Guébling	57
57265	Guébestroff	57
57520	Obreck	57
57763	Zommange	57
57405	Lindre-Haute	57
57081	Bidestroff	57
57706	Vergaville	57
57295	Haraucourt-sur-Seille	57
57248	Givrycourt	57
57011	Albestroff	57
54272	Jaillon	54
54034	Avrainville	54
57266	Guéblange-lès-Dieuze	57
57090	Blanche-Église	57
57246	Gelucourt	57
57397	Ley	57
57255	Gosselming	57
57342	Ibigny	57
54271	Igney	54
54551	Vaucourt	54
54600	Xousse	54
54177	Emberménil	54
54211	Frémonville	54
57056	Bébing	57
57180	Dolving	57
57518	Oberstinzel	57
54563	Vézelise	54
57350	Jouy-aux-Arches	57
57153	Corny-sur-Moselle	57
57487	Moulins-lès-Metz	57
54079	Blénod-lès-Pont-à-Mousson	54
57701	Vaux	57
57601	Rozérieulles	57
57352	Jussy	57
54581	Ville-sur-Yron	54
57032	Ars-sur-Moselle	57
59620	Villers-au-Tertre	59
62624	Noyelles-Godault	62
59574	Somain	59
59314	Hornaing	59
59227	Fenain	59
59297	Hélesmes	59
59203	Erre	59
59205	Escaudain	59
59292	Haveluy	59
59632	Wallers	59
59446	Oisy	59
59064	Bellaing	59
59172	Denain	59
59651	Wavrechain-sous-Denain	59
59504	Rœulx	59
59002	Abscon	59
59390	Masny	59
77480	Valence-en-Brie	77
59185	Écaillon	59
59024	Auberchicourt	59
59456	Pecquencourt	59
59113	Bruille-lez-Marchiennes	59
59501	Rieulay	59
59375	Marchiennes	59
59239	Flines-lez-Raches	59
59409	Monchecourt	59
59008	Aniche	59
59007	Anhiers	59
59486	Râches	59
59654	Waziers	59
59414	Montigny-en-Ostrevent	59
59345	Lewarde	59
59327	Lallaing	59
59592	Thumeries	59
59509	Roost-Warendin	59
62321	Évin-Malmaison	62
59028	Auby	59
59354	Loffre	59
62497	Leforest	62
59408	Moncheaux	59
59489	Raimbeaucourt	59
77442	Samoreau	77
77533	Vulaines-sur-Seine	77
77226	Héricy	77
77188	Fontaine-le-Port	77
77179	Féricy	77
77494	Vernou-la-Celle-sur-Seine	77
77079	Champagne-sur-Seine	77
77052	Bréau	77
77428	Saint-Ouen-en-Brie	77
77266	Machault	77
77354	Pamfou	77
45306	La Selle-en-Hermoy	45
51595	Vatry	51
64025	Angous	64
64555	Viellenave-de-Navarrenx	64
64178	Castetnau-Camblong	64
64106	Béhasque-Lapiste	64
64036	Arbouet-Sussaute	64
64241	Géronce	64
64551	Verdets	64
64426	Orin	64
64219	Estialescq	64
64409	Moumour	64
64245	Goès	64
64220	Estos	64
64460	Précilhon	64
64209	Escout	64
64244	Geüs-d'Oloron	64
64481	Saint-Goin	64
64217	Esquiule	64
64264	L'Hôpital-Saint-Blaise	64
64468	Roquiague	64
64319	Larribar-Sorhapuru	64
64093	Barcus	64
64188	Chéraute	64
64559	Viodos-Abense-de-Bas	64
64371	Mauléon-Licharre	64
64050	Arrast-Larrebieu	64
64391	Moncayolle-Larrory-Mendibieu	64
64214	Espès-Undurein	64
64186	Charre	64
64049	Aroue-Ithorots-Olhaïby	64
64221	Etcharry	64
64412	Nabas	64
64341	Lichos	64
64187	Charritte-de-Bas	64
64287	Laàs	64
64215	Espiute	64
64480	Saint-Gladie-Arrive-Munein	64
64435	Osserain-Rivareyte	64
64034	Arbérats-Sillègue	64
64531	Tabaille-Usquain	64
64242	Gestas	64
64096	Barraute-Camu	64
64466	Rivehaute	64
54479	Saint-Mard	54
54324	Lorey	54
64403	Montfort	64
64033	Araux	64
64032	Araujuzon	64
64345	Lohitzun-Oyhercq	64
64247	Gotein-Libarrenx	64
64231	Garindein	64
64115	Berrogain-Laruns	64
64251	Guinarthe-Parenties	64
64083	Autevielle-Saint-Martin-Bideren	64
64202	Domezain-Berraute	64
64228	Gabat	64
64429	Orsanco	64
64018	Amendeuix-Oneix	64
64493	Saint-Palais	64
64010	Aïcirits-Camou-Suhast	64
64120	Beyrie-sur-Joyeuse	64
64105	Béguios	64
64294	Labets-Biscay	64
64368	Masparraute	64
64487	Saint-Just-Ibarre	64
64012	Ainharp	64
64441	Pagolle	64
64411	Musculdy	64
64424	Ordiarp	64
64539	Uhart-Mixe	64
64437	Ostabat-Asme	64
64313	Lantabat	64
64314	Larceveau-Arros-Cibits	64
64267	Ibarrolle	64
64150	Bunus	64
64045	Arhansus	64
64285	Juxue	64
64362	Luxe-Sumberraute	64
64235	Garris	64
77512	Villeneuve-sur-Bellot	77
77472	La Trétoire	77
02664	Rozoy-Bellevalle	02
02281	L'Épine-aux-Bois	02
02800	Viffort	02
02518	Montlevon	02
02510	Monthurel	02
02146	Celles-lès-Condé	02
02209	Condé-en-Brie	02
02515	Montigny-lès-Condé	02
51192	Courthiézy	51
51607	Verdon	51
51175	Corrobert	51
02645	Reuilly-Sauvigny	02
02590	Pargny-la-Dhuys	02
02168	Château-Thierry	02
02458	Dhuys et Morin-en-Brie	02
10356	Saint-Oulph	10
10207	Longueville-sur-Aube	10
10125	Dierrey-Saint-Pierre	10
10414	Villeloup	10
10134	Échemines	10
10151	Fontaine-les-Grès	10
10233	Méry-sur-Seine	10
10234	Mesgrigny	10
89027	Bagneaux	89
89122	Courgenay	89
08119	Cheveuges	08
08099	Champigneul-sur-Vence	08
08040	Les Ayvelles	08
08395	Saint-Pierre-sur-Vence	08
08115	Chémery-Chéhéry	08
08377	Saint-Aignan	08
08334	Omicourt	08
08469	Vendresse	08
08023	Artaise-le-Vivier	08
08317	La Neuville-à-Maire	08
08503	Yvernaumont	08
08341	Poix-Terron	08
08076	Boulzicourt	08
08388	Saint-Marceau	08
08180	La Francheville	08
08357	Remilly-Aillicourt	08
08494	Wadelincourt	08
08409	Sedan	08
08043	Balan	08
08063	La Besace	08
08354	Raucourt-et-Flaba	08
08211	Haraucourt	08
08331	Noyers-Pont-Maugis	08
08445	Thelonne	08
08013	Angecourt	08
08053	Bazeilles	08
08142	Donchery	08
08145	Douzy	08
08477	Villers-devant-Mouzon	08
08502	Yoncq	08
08088	Bulson	08
08268	Maisoncelle-et-Villers	08
08034	Autrecourt-et-Pourron	08
08470	Verpel	08
08233	Imécourt	08
08446	Thénorgues	08
08089	Buzancy	08
08056	Beffu-et-le-Morthomme	08
08086	Briquenay	08
08490	Vouziers	08
08116	Bairon et ses environs	08
08095	Chagny	08
08244	Lametz	08
08278	Marquigny	08
08335	Omont	08
08461	Vandy	08
08045	Ballay	08
08035	Autruche	08
08020	Les Petites-Armoises	08
08434	Sy	08
08394	Saint-Pierremont	08
08332	Oches	08
08061	La Berlière	08
08424	Sommauthe	08
08471	Verrières	08
08300	Le Mont-Dieu	08
08019	Les Grandes-Armoises	08
08430	Stonne	08
08439	Tannay	08
08405	Sauville	08
08301	Montgon	08
08489	Voncq	08
08259	Longwé	08
08215	Harricourt	08
08049	Bar-lès-Buzancy	08
08176	Fossé	08
08463	Vaux-en-Dieulet	08
08052	Bayonville	08
08431	Sugny	08
08390	Sainte-Marie	08
08406	Savigny-sur-Aisne	08
08164	Falaise	08
08279	Mars-sous-Bourcq	08
08135	La Croix-aux-Bois	08
08274	Marcq	08
08131	Cornay	08
08383	Saint-Juvin	08
08198	Grandpré	08
08120	Chevières	08
08098	Champigneulle	08
08412	Senuc	08
08082	Brécy-Brières	08
08310	Mouron	08
08256	Liry	08
08308	Mont-Saint-Martin	08
08303	Monthois	08
08097	Challerange	08
08392	Saint-Morel	08
08333	Olizy-Primat	08
08311	Mouzon	08
08033	Authe	08
54468	Saffais	54
54222	Gerbéviller	54
54455	Remenoville	54
54155	Deuxville	54
54176	Einville-au-Jard	54
54228	Giriviller	54
54356	Mattexey	54
54331	Magnières	54
54567	Villacourt	54
54487	Saint-Rémy-aux-Bois	54
54471	Saint-Boingt	54
54475	Saint-Germain	54
54325	Loromontzey	54
54042	Bainville-aux-Miroirs	54
54183	Essey-la-Côte	54
88432	Saint-Pierremont	88
54513	Tantonville	54
54221	Gerbécourt-et-Haplemont	54
54409	Omelmont	54
54005	Affracourt	54
54037	Azelot	54
54473	Saint-Firmin	54
54052	Battigny	54
54218	Gélaucourt	54
54291	Lalœuf	54
54545	Vandeléville	54
54164	Dommarie-Eulmont	54
54158	Dolcourt	54
54494	Saulxerotte	54
02053	Vallées en Champagne	02
51380	Montmirail	51
02701	Saulchery	02
02653	Romeny-sur-Marne	02
02290	Essômes-sur-Marne	02
02596	Pavant	02
02163	Charly-sur-Marne	02
77117	Citry	77
77290	Méry-sur-Marne	77
77397	Saâcy-sur-Marne	77
77120	Cocherel	77
77265	Luzancy	77
02242	Crouttes-sur-Marne	02
77331	Nanteuil-sur-Marne	77
77401	Sainte-Aulde	77
77343	Ocquerre	77
77235	Jaignes	77
77183	La Ferté-sous-Jouarre	77
77388	Reuil-en-Brie	77
77078	Chamigny	77
77460	Tancrou	77
77448	Sept-Sorts	77
77084	Changis-sur-Marne	77
77478	Ussy-sur-Marne	77
77429	Saint-Ouen-sur-Morin	77
77405	Saint-Cyr-sur-Morin	77
77162	Doue	77
77415	Saint-Jean-les-Deux-Jumeaux	77
77451	Signy-Signets	77
77440	Sammeron	77
02162	La Chapelle-sur-Chézy	02
02505	Montfaucon	02
02289	Essises	02
02186	Chézy-sur-Marne	02
02098	Bonneil	02
02042	Azy-sur-Marne	02
02328	Fossoy	02
02114	Brasles	02
02347	Gland	02
02554	Nogentel	02
02292	Étampes-sur-Marne	02
02223	Courboin	02
02540	Nesles-la-Montagne	02
02187	Chierry	02
02094	Blesmes	02
02677	Saint-Eugène	02
02239	Crézancy	02
02213	Connigis	02
77057	Bussières	77
77024	Bassevelle	77
77398	Sablonnières	77
77043	Boitron	77
77345	Orly-sur-Morin	77
02555	Nogent-l'Artaud	02
77228	Hondevilliers	77
77492	Verdelot	77
02798	Viels-Maisons	02
02777	Vendières	02
10347	Saint-Loup-de-Buffigny	10
10370	Soligny-les-Étangs	10
10085	Charmoy	10
10146	Fay-lès-Marcilly	10
10020	Avant-lès-Marcilly	10
10341	Saint-Hilaire-sous-Romilly	10
10164	Gélannes	10
10323	Romilly-sur-Seine	10
10274	Orvilliers-Saint-Julien	10
10220	Maizières-la-Grande-Paroisse	10
10339	Saint-Flavy	10
10275	Ossey-les-Trois-Maisons	10
10271	Origny-le-Sec	10
10280	Pars-lès-Romilly	10
10308	Prunay-Belleville	10
10237	Mesnil-Saint-Loup	10
10335	Saint-Benoist-sur-Vanne	10
10142	Estissac	10
10263	Neuville-sur-Vanne	10
10276	Paisy-Cosdon	10
10383	Trancault	10
89359	Saint-Maurice-aux-Riches-Hommes	89
10444	Vulaines	10
10086	Charny-le-Bachot	10
10132	Droupt-Sainte-Marie	10
10320	Rilly-Sainte-Syre	10
10131	Droupt-Saint-Basle	10
10281	Le Pavillon-Sainte-Julie	10
10368	Savières	10
10349	Saint-Lyé	10
10282	Payns	10
10090	Chauchigny	10
10353	Saint-Mesmin	10
10211	Macey	10
10148	Ferreux-Quincey	10
10334	Saint-Aubin	10
89261	Molinons	89
89461	Villeneuve-l'Archevêque	89
89214	Lailly	89
10089	Châtres	10
10392	Vallant-Saint-Georges	10
51155	Clesles	51
08186	Germont	08
08350	Quatre-Champs	08
08075	Boult-aux-Bois	08
08453	Toges	08
08085	Brieulles-sur-Bar	08
08325	Noirval	08
08057	Belleville-et-Châtillon-sur-Bar	08
08055	Beaumont-en-Argonne	08
08059	Belval-Bois-des-Dames	08
08437	Tailly	08
08326	Nouart	08
08080	Bouvellemont	08
08041	Baâlons	08
08228	La Horgne	08
08478	Villers-le-Tilleul	08
08422	Singly	08
08482	Villers-sur-le-Mont	08
08042	Balaives-et-Butz	08
08152	Élan	08
74282	Fillière	74
74306	Villy-le-Bouveret	74
74224	La Roche-sur-Foron	74
74253	Saint-Sixt	74
74116	Etaux	74
74007	Amancy	74
74090	Cornier	74
74052	Cernex	74
74296	Vers	74
74009	Andilly	74
74228	Saint-Blaise	74
74216	Présilly	74
74031	Beaumont	74
74124	Feigères	74
74201	Neydens	74
74260	Savigny	74
74101	Dingy-en-Vuache	74
74184	Minzier	74
74144	Jonzier-Épagny	74
74288	Valleiry	74
74314	Vulbens	74
74088	Copponex	74
74096	Cruseilles	74
97356	Camopi	973
40088	Dax	40
40277	Saint-Pandelon	40
40294	Saugnac-et-Cambran	40
40202	Narrosse	40
40035	Bénesse-lès-Dax	40
31278	Latoue	31
31502	Saint-Marcet	31
31493	Saint-Lary-Boujean	31
31109	Cassagnabère-Tournas	31
31023	Aulon	31
31274	Larcan	31
33527	Le Teich	33
22225	Ploumagoar	22
64459	Préchacq-Navarrenx	64
64420	Ogenne-Camptort	64
64326	Lay-Lamidou	64
64099	Bastanès	64
64416	Navarrenx	64
64529	Sus	64
64197	Cuqueron	64
64306	Lahourcade	64
64556	Vielleségure	64
64132	Bizanos	64
64269	Idron	64
64445	Pau	64
64329	Lée	64
64211	Eslourenties-Daban	64
64352	Lourenties	64
64021	Andoins	64
64212	Espéchède	64
64053	Arrien	64
64041	Aressy	64
64518	Sendets	64
64520	Serres-Morlaàs	64
64438	Ouillon	64
64405	Morlaàs	64
64516	Sedzère	64
64227	Gabaston	64
64544	Urost	64
64346	Lombia	64
64370	Maucor	64
64482	Saint-Jammes	64
64442	Parbayse	64
64152	Buros	64
64399	Montardon	64
64519	Serres-Castet	64
64448	Poey-de-Lescar	64
64299	Lacommande	64
64037	Arbus	64
64060	Artiguelouve	64
64315	Laroin	64
64129	Billère	64
64335	Lescar	64
64348	Lons	64
64469	Saint-Abit	64
64072	Aubertin	64
64478	Saint-Faust	64
64376	Meillon	64
64550	Uzos	64
64417	Nay	64
64191	Coarraze	64
64386	Mirepeix	64
64101	Baudreix	64
64054	Arros-de-Nay	64
64257	Haut-de-Bosdarros	64
64139	Bosdarros	64
64343	Limendous	64
64145	Bourdettes	64
64091	Baliros	64
64270	Igon	64
64324	Lasseube	64
64165	Cardesse	64
64393	Monein	64
64359	Lucq-de-Béarn	64
64449	Poey-d'Oloron	64
64328	Ledeuix	64
64422	Oloron-Sainte-Marie	64
64039	Aren	64
64137	Bordères	64
64302	Lagos	64
64292	Labatmale	64
64109	Bénéjacq	64
64097	Barzun	64
64373	Mazères-Lezons	64
64237	Gelos	64
64284	Jurançon	64
64444	Pardies-Piétat	64
64246	Gomer	64
64133	Boeil-Bezing	64
64119	Beuste	64
64023	Angaïs	64
64358	Lucgarier	64
64266	Hours	64
64138	Bordes	64
64413	Narcastet	64
64467	Rontignon	64
64526	Soumoulou	64
64216	Espoey	64
64001	Aast	64
64452	Ponson-Dessus	64
64530	Susmiou	64
64281	Jasses	64
64201	Dognen	64
64253	Gurs	64
64508	Saucède	64
64458	Préchacq-Josbaig	64
65070	Bartrès	65
64400	Montaut	64
64498	Saint-Vincent	64
64339	Lestelle-Bétharram	64
64363	Lys	64
64067	Assat	64
64419	Nousty	64
15251	Védrines-Saint-Loup	15
48026	Blavignac	48
48169	Saint-Léger-du-Malzieu	48
48090	Le Malzieu-Ville	48
48190	Termes	48
48177	Saint-Pierre-le-Vieux	48
15187	Saint-Flour	15
15004	Andelat	15
15188	Saint-Georges	15
15055	Coren	15
15125	Mentières	15
15199	Saint-Martial	15
15262	Villedieu	15
15002	Alleuze	15
15005	Anglards-de-Saint-Flour	15
15245	Vabres	15
15237	Tiviers	15
15130	Montchamp	15
15231	Talizat	15
15259	Vieillespesse	15
15161	Rézentières	15
15060	Deux-Verges	15
08079	Boutancourt	08
08158	Étrépigny	08
08173	Flize	08
08400	Sapogne-et-Feuchères	08
08209	Hannogne-Saint-Martin	08
08140	Dom-le-Mesnil	08
08096	Chalandry-Elaire	08
08480	Villers-Semeuse	08
08263	Lumes	08
08327	Nouvion-sur-Meuse	08
08492	Vrigne-Meuse	08
08488	Vivier-au-Court	08
08481	Villers-sur-Bar	08
08385	Saint-Laurent	08
08491	Vrigne aux Bois	08
08411	Semuy	08
08321	Neuville-Day	08
08374	La Sabotterie	08
08160	Évigny	08
08497	Warcq	08
08346	Prix-lès-Mézières	08
08200	Grivy-Loisy	08
08130	Contreuve	08
08077	Bourcq	08
08351	Quilly	08
08455	Tourcelles-Chaumont	08
08410	Semide	08
08483	Ville-sur-Lumes	08
08235	Issancourt-et-Rumel	08
08199	La Grandville	08
08187	Gernelle	08
08105	Charleville-Mézières	08
08003	Aiglemont	08
65297	Mansan	65
65430	Soréac	65
65242	Lacassagne	65
65269	Lescurry	65
65133	Castéra-Lou	65
65375	Rabastens-de-Bigorre	65
65361	Peyrun	65
65418	Sénac	65
65073	Bazillac	65
65161	Escondeaux	65
64103	Bédeille	64
64515	Sedze-Maubecq	64
65476	Villenave-près-Béarn	65
64028	Anoye	64
64089	Baleix	64
64388	Momy	64
64454	Pontiacq-Viellepinte	64
64451	Ponson-Debat-Pouts	64
64372	Maure	64
65422	Séron	65
65160	Escaunets	65
51596	Vauchamps	51
51264	Le Gault-Soigny	51
51460	Rieux	51
51618	Le Vézier	51
51359	Mécringes	51
77304	Montenils	77
77314	Montolivet	77
51050	Bergères-sous-Montmirail	51
40146	Latrille	40
40174	Mauries	40
40305	Sorbets	40
40220	Pécorade	40
40022	Bahus-Soubiran	40
40219	Payros-Cazautets	40
40083	Clèdes	40
40110	Geaune	40
40321	Urgons	40
40072	Castelnau-Tursan	40
40185	Miramont-Sensacq	40
51632	Villers-en-Argonne	51
51424	Passavant-en-Argonne	51
51138	Châtrices	51
51222	Éclaires	51
55081	Brizeaux	55
55253	Les Islettes	55
55343	Montblainville	55
30119	Fressac	30
30252	Saint-Félix-de-Pallières	30
30265	Saint-Jean-de-Crieulon	30
30289	Saint-Nazaire-des-Gardies	30
30330	Tornac	30
30162	Massillargues-Attuech	30
34090	Le Crès	34
34120	Jacou	34
34327	Vendargues	34
34022	Baillargues	34
34266	Saint-Jean-de-Cuculles	34
34276	Saint-Mathieu-de-Tréviers	34
34290	Saint-Vincent-de-Barbeyrargues	34
34014	Assas	34
30095	Corconne	30
30093	Conqueyrac	30
30263	Saint-Hippolyte-du-Fort	30
30172	Monoblet	30
30200	Pompignan	30
34131	Lauret	34
34078	Claret	34
34297	Sauteyrargues	34
34318	Vacquières	34
34322	Valflaunès	34
34236	Rouet	34
30019	Aubais	30
34340	Villetelle	34
34294	Saturargues	34
30344	Vergèze	30
30347	Vestric-et-Candiac	30
30333	Uchaud	30
30036	Bernis	30
30186	Nages-et-Solorgues	30
30006	Aimargues	30
30123	Gallargues-le-Montueux	30
30004	Aigues-Vives	30
30185	Mus	30
30059	Le Cailar	30
30083	Codognan	30
34265	Saint-Jean-de-Cornies	34
34027	Beaulieu	34
34263	Saint-Hilaire-de-Beauvoir	34
34246	Saint-Christol	34
34330	Vérargues	34
34296	Saussines	34
34033	Boisseron	34
34288	Saint-Sériès	34
30136	Junas	30
34314	Le Triadou	34
34217	Prades-le-Lez	34
34255	Saint-Gély-du-Fesc	34
34247	Saint-Clément-de-Rivière	34
34240	Saint-Aunès	34
34057	Castelnau-le-Lez	34
34077	Clapiers	34
34169	Montferrier-sur-Lez	34
34172	Montpellier	34
34280	Saint-Nazaire-de-Pézan	34
34321	Valergues	34
34146	Lunel-Viel	34
34272	Saint-Just	34
34151	Marsillargues	34
34145	Lunel	34
34176	Mudaison	34
34244	Saint-Brès	34
34127	Lansargues	34
30049	Bourdic	30
30021	Aubussargues	30
30014	Arpaillargues-et-Aureillac	30
30122	Gajan	30
30193	Parignargues	30
30261	Saint-Hippolyte-de-Caton	30
30109	Euzet	30
51621	Vienne-le-Château	51
51253	Florent-en-Argonne	51
51507	Sainte-Menehould	51
55038	Beaulieu-en-Argonne	55
55527	Varennes-en-Argonne	55
55065	Boureuilles	55
55202	Futeau	55
51370	Moiremont	51
51519	Saint-Thomas-en-Argonne	51
55383	Neuvilly-en-Argonne	55
55266	Lachalade	55
55116	Le Claon	55
55379	Le Neufour	55
51619	Le Vieil-Dampierre	51
51143	Le Chemin	51
51537	Sivry-Ante	51
55014	Aubréville	55
51533	Servon-Melzicourt	51
51062	Binarville	51
55117	Clermont-en-Argonne	55
55416	Rarécourt	55
51608	Vernancourt	51
51489	Saint-Jean-devant-Possesse	51
51404	Noirlieu	51
51456	Remicourt	51
51272	Givry-en-Argonne	51
51166	Contault	51
51442	Possesse	51
51500	Saint-Mard-sur-le-Mont	51
51133	Le Châtelier	51
51658	Vroil	51
51057	Bettancourt-la-Longue	51
51130	Charmont	51
55414	Rancourt-sur-Ornain	55
51047	Belval-en-Argonne	51
55493	Sommeilles	55
55424	Remennecourt	55
51423	Pargny-sur-Saulx	51
51006	Alliancelles	51
51292	Herpont	51
51126	La Chapelle-Felcourt	51
51274	Gizaucourt	51
51650	Voilemont	51
51211	Dommartin-Dampierre	51
51214	Dommartin-Varimont	51
51229	Épense	51
51206	Dampierre-le-Château	51
51397	La Neuville-aux-Bois	51
51015	Argers	51
51610	Verrières	51
51399	La Neuville-au-Pont	51
51139	Chaudefontaine	51
51388	Mourmelon-le-Grand	51
51326	Livry-Louvercy	51
51078	Bouy	51
51485	Saint-Hilaire-au-Temple	51
51587	Vadenay	51
51205	Dampierre-au-Temple	51
51389	Mourmelon-le-Petit	51
51022	Aulnay-l'Aître	51
51195	Couvrot	51
51436	Pogny	51
51616	Vésigneul-sur-Marne	51
51482	Saint-Germain-la-Ville	51
51354	Marson	51
51208	Dampierre-sur-Moivre	51
51259	Francheville	51
51438	Poix	51
51548	Somme-Vesle	51
51515	Saint-Remy-sur-Bussy	51
51549	Somme-Yèvre	51
51098	Bussy-le-Repos	51
51371	Moivre	51
51260	Le Fresne	51
51179	Coupéville	51
51490	Saint-Jean-sur-Moivre	51
51589	Vanault-le-Châtel	51
51510	Saint-Quentin-les-Marais	51
51496	Saint-Lumier-en-Champagne	51
51325	Lisse-en-Champagne	51
51040	Bassuet	51
51311	Jussecourt-Minecourt	51
51218	Val-de-Vière	51
51289	Heiltz-le-Maurupt	51
51590	Vanault-les-Dames	51
51635	Villers-le-Sec	51
51122	Changy	51
51601	Vavray-le-Grand	51
51290	Heiltz-l'Évêque	51
51602	Vavray-le-Petit	51
51039	Bassu	51
51620	Vienne-la-Ville	51
51083	Braux-Saint-Remy	51
51452	Rapsécourt	51
51228	Élise-Daucourt	51
08128	Condé-lès-Autry	08
51476	Saint-Étienne-au-Temple	51
51203	Cuperly	51
51486	Saint-Hilaire-le-Grand	51
51307	Jonchery-sur-Suippe	51
30245	Saint-Côme-et-Maruéjols	30
30349	Vic-le-Fesq	30
30088	Combas	30
30321	Sommières	30
30352	Villevieille	30
30023	Aujargues	30
30114	Fontanès	30
30091	Congénies	30
30062	Calvisson	30
30043	Boissières	30
30082	Clarensac	30
30249	Saint-Dionisy	30
30319	Serviers-et-Labaume	30
30174	Montaren-et-Saint-Médiers	30
30334	Uzès	30
30295	Saint-Quentin-la-Poterie	30
30337	Vallabrix	30
30061	La Calmette	30
30102	Dions	30
30228	Sainte-Anastasie	30
30206	Poulx	30
30241	Saint-Chaptes	30
30041	Blauzac	30
30308	Sanilhac-Sagriès	30
30184	Moussac	30
30072	Castelnau-Valence	30
30248	Saint-Dézéry	30
30126	Garrigues-Sainte-Eulalie	30
30086	Collorgues	30
30111	Foissac	30
30188	Ners	30
30046	Boucoiran-et-Nozières	30
30053	Brignon	30
30100	Cruviers-Lascours	30
30158	Martignargues	30
30240	Saint-Césaire-de-Gauzignan	30
30264	Saint-Jean-de-Ceyrargues	30
30285	Saint-Maurice-de-Cazevieille	30
30030	Baron	30
30354	Montagnac	30
30112	Fons	30
30233	Saint-Bauzély	30
30180	Montignargues	30
30255	Saint-Geniès-de-Malgoirès	30
30224	La Rouvière	30
30313	Sauzet	30
30110	Flaux	30
51147	La Cheppe	51
51097	Bussy-le-Château	51
51559	Suippes	51
51031	Baconnes	51
51108	Châlons-en-Champagne	51
51231	L'Épine	51
51193	Courtisols	51
51141	La Chaussée-sur-Marne	51
51506	Saint-Memmie	51
51472	Saint-Amand-sur-Fion	51
51557	Soulanges	51
08171	Fléville	08
08109	Chatel-Chéhéry	08
08245	Lançon	08
08464	Vaux-lès-Mouron	08
08296	Montcheutin	08
08197	Grandham	08
08280	Marvaux-Vieux	08
08407	Séchault	08
08031	Aure	08
08271	Manre	08
51440	Pontfaverger-Moronvilliers	51
51659	Wargemoulin-Hurlus	51
51368	Minaucourt-le-Mesnil-lès-Hurlus	51
51355	Massiges	51
51646	Virginy	51
51640	Ville-sur-Tourbe	51
51341	Malmy	51
51447	Prosnes	51
51336	Maffrécourt	51
51588	Valmy	51
51082	Braux-Sainte-Cohière	51
51213	Dommartin-sous-Hans	51
51191	Courtémont	51
51470	Rouvroy-Ripont	51
08018	Ardeuil-et-Montfauxelles	08
08074	Bouconville	08
51104	Cernay-en-Dormois	51
51027	Auve	51
51498	Saint-Mard-sur-Auve	51
08017	Apremont	08
51572	Tilloy-et-Bellay	51
51547	Somme-Tourbe	51
51197	La Croix-en-Champagne	51
51491	Saint-Jean-sur-Tourbe	51
51543	Somme-Bionne	51
51283	Hans	51
51317	Laval-sur-Tourbe	51
51060	Bignicourt-sur-Saulx	51
51240	Étrepy	51
51539	Sogny-en-l'Angle	51
08092	Cauroy	08
08264	Machault	08
51019	Aubérive	51
51544	Sommepy-Tahure	51
51501	Sainte-Marie-à-Py	51
51517	Saint-Souplet-sur-Py	51
51053	Berzieux	51
08036	Autry	08
51280	Gratreuil	51
51255	Fontaine-en-Dormois	51
08378	Saint-Clément-à-Arnes	08
08393	Saint-Pierre-à-Arnes	08
08220	Hauviné	08
51216	Dontrien	51
08379	Saint-Étienne-à-Arnes	08
51503	Saint-Martin-l'Heureux	51
51487	Saint-Hilaire-le-Petit	51
51054	Bétheniville	51
51600	Vaudesincourt	51
51546	Somme-Suippe	51
51553	Souain-Perthes-lès-Hurlus	51
08032	Aussonce	08
08320	La Neuville-en-Tourne-à-Fuy	08
57572	Rémilly	57
57020	Ancerville	57
57445	Marieulles	57
57553	Pournoy-la-Chétive	57
57532	Pagny-lès-Goin	57
57251	Goin	57
57708	Verny	57
57554	Pournoy-la-Grasse	57
57422	Louvigny	57
57715	Vigny	57
57403	Liéhon	57
57653	Silly-en-Saulnois	57
57116	Buchy	57
57617	Saint-Jure	57
57037	Aube	57
57392	Lemud	57
57527	Orny	57
57139	Chérisey	57
57548	Pontoy	57
57075	Beux	57
54179	Éply	54
54333	Mailly-sur-Seille	54
54444	Raucourt	54
54424	Phlin	54
54387	Morville-sur-Seille	54
57137	Cheminot	57
57172	Denting	57
57705	Velving	57
57691	Valmunster	57
57016	Alzing	57
57567	Rémelfang	57
57329	Holling	57
57110	Brettnach	57
57700	Vaudreching	57
57516	Oberdorff	57
57106	Bouzonville	57
57136	Chémery-les-Deux	57
57070	Bettange	57
57252	Gomelange	57
57025	Anzeling	57
57235	Freistroff	57
57187	Éblange	57
57530	Ottonville	57
57154	Coume	57
57667	Téterchen	57
57312	Helstroff	57
57097	Boulay-Moselle	57
57599	Roupeldange	57
57230	Fouligny	57
57444	Marange-Zondrange	57
57213	Filstroff	57
57079	Bibiche	57
57273	Guerstling	57
77096	Chartrettes	77
77194	Forges	77
77140	Coutençon	77
77416	Saint-Just-en-Brie	77
77496	Vieux-Champagne	77
77481	Vanvillé	77
77098	Châteaubleau	77
77272	Maison-Rouge	77
77197	Frétoy	77
77151	Dagny	77
77025	Bazoches-lès-Bray	77
77019	Balloy	77
77347	Les Ormes-sur-Voulzie	77
77461	Thénisy	77
77355	Paroy	77
77174	Everly	77
77076	Chalmaison	77
77208	Gouaix	77
77256	Lizines	77
77446	Savins	77
77242	Jutigny	77
77260	Longueville	77
77090	La Chapelle-Saint-Sulpice	77
77532	Vulaines-lès-Provins	77
77319	Mortery	77
77404	Sainte-Colombe	77
54091	Bouxières-sous-Froidmont	54
54312	Lesménils	54
54114	Champey-sur-Moselle	54
54369	Millery	54
54060	Belleville	54
54059	Belleau	54
57416	Lorry-Mardigny	57
54095	Bratte	54
54508	Sivry	54
54276	Jeandelaincourt	54
54577	Villers-lès-Moivrons	54
54372	Moivrons	54
54131	Clémery	54
54433	Port-sur-Seille	54
54400	Nomeny	54
54464	Rouves	54
54001	Abaucourt	54
54569	Ville-au-Val	54
54294	Landremont	54
54027	Atton	54
54474	Sainte-Geneviève	54
54390	Mousson	54
57652	Sillegny	57
57212	Féy	57
57147	Coin-sur-Seille	57
57146	Coin-lès-Cuvry	57
57547	Pommérieux	57
54072	Bezaumont	54
54031	Autreville-sur-Moselle	54
54320	Loisy	54
07291	Saint-Remèze	07
07034	Bidon	07
30124	Le Garn	30
07287	Saint-Pons	07
07273	Saint-Maurice-d'Ibie	07
07032	Berzème	07
07311	Sceautres	07
07146	Lyas	07
07072	Coux	07
07194	Rochessauve	07
07283	Saint-Pierre-la-Roche	07
07278	Saint-Michel-de-Chabrillanoux	07
07167	Les Ollières-sur-Eyrieux	07
07295	Saint-Sauveur-de-Montagut	07
07306	Sampzon	07
07199	Rosières	07
07115	Labeaume	07
07053	Chandolas	07
07201	Ruoms	07
07110	Joyeuse	07
07207	Saint-Alban-Auriolles	07
07183	Pradons	07
07330	Vallon-Pont-d'Arc	07
07126	Lagorce	07
07117	Lablachère	07
07017	Les Assions	07
07027	Beauchastel	07
07349	La Voulte-sur-Rhône	07
07303	Saint-Vincent-de-Durfort	07
07184	Pranles	07
07083	Dunière-sur-Eyrieux	07
07022	Baix	07
07181	Le Pouzin	07
26337	Saulce-sur-Rhône	26
07219	Saint-Bauzile	07
07302	Saint-Vincent-de-Barrès	07
07260	Saint-Lager-Bressac	07
07298	Saint-Symphorien-sous-Chomérac	07
07221	Saint-Cierge-la-Serre	07
07198	Rompon	07
07237	Saint-Fortunat-sur-Eyrieux	07
07261	Saint-Laurent-du-Pape	07
07066	Chomérac	07
07255	Saint-Julien-en-Saint-Alban	07
07090	Flaviac	07
07008	Alissas	07
07186	Privas	07
07020	Aubignas	07
07270	Saint-Martin-sur-Lavezon	07
26324	Saint-Paul-Trois-Châteaux	26
07264	Saint-Marcel-d'Ardèche	07
07268	Saint-Martin-d'Ardèche	07
26138	La Garde-Adhémar	26
26235	Pierrelatte	26
84064	Lapalud	84
84063	Lamotte-du-Rhône	84
30163	Mauressargues	30
30104	Domessargues	30
30234	Saint-Bénézet	30
30160	Maruéjols-lès-Gardon	30
30002	Aigremont	30
30146	Lédignan	30
30071	Cassagnoles	30
30161	Massanes	30
30098	Crespian	30
30181	Montmirat	30
30183	Moulézan	30
30182	Montpezat	30
30281	Saint-Mamert-du-Gard	30
30324	Souvignargues	30
30205	Pougnadoresse	30
30076	Cavillargues	30
30287	Saint-Michel-d'Euzet	30
30242	Saint-Christol-de-Rodières	30
30304	Salazac	30
30256	Saint-Gervais	30
30070	Carsan	30
30343	Verfeuil	30
30282	Saint-Marcel-de-Careiret	30
30232	Saint-André-d'Olérargues	30
30222	La Roque-sur-Cèze	30
30096	Cornillon	30
30277	Saint-Laurent-de-Carnols	30
30115	Fontarèches	30
30031	La Bastide-d'Engras	30
30279	Saint-Laurent-la-Vernède	30
30168	Mialet	30
30329	Thoiras	30
30094	Corbès	30
30058	La Cadière-et-Cambo	30
30099	Cros	30
77300	Montceaux-lès-Meaux	77
77505	Villemareuil	77
77484	Vaucourtois	77
77049	Boutigny	77
77408	Saint-Fiacre	77
33009	Arcachon	33
67341	Oberdorf-Spachbach	67
67546	Wittersheim	67
67035	Berstheim	67
67110	Durrenbach	67
67550	Wœrth	67
67303	Morsbronn-les-Bains	67
67186	Hegeney	67
67259	Langensoultzbach	67
67132	Eschbach	67
67291	Mertzwiller	67
67260	Laubach	67
67141	Forstheim	67
67215	Huttendorf	67
67304	Morschwiller	67
67460	Schwindratzheim	67
67301	Mommenheim	67
67203	Hochstett	67
67293	Minversheim	67
67033	Bernolsheim	67
67510	Wahlenheim	67
67417	Rottelsheim	67
67250	Kriegsheim	67
30301	Saint-Victor-des-Oules	30
30262	Saint-Hippolyte-de-Montaigu	30
30067	La Capelle-et-Masmolène	30
30057	Cabrières	30
30145	Lédenon	30
30085	Collias	30
30286	Saint-Maximin	30
30299	Saint-Siffret	30
30013	Argilliers	30
30346	Vers-Pont-du-Gard	30
30075	Caveirac	30
30189	Nîmes	30
30138	Langlade	30
30020	Aubord	30
30169	Milhaud	30
34309	Teyran	34
34248	Sainte-Croix-de-Quintillargues	34
34118	Guzargues	34
34164	Montaud	34
34242	Saint-Bauzille-de-Montmel	34
34102	Fontanès	34
34058	Castries	34
34307	Sussargues	34
34256	Saint-Geniès-des-Mourgues	34
34227	Restinclières	34
34249	Saint-Drézéry	34
30069	Carnas	30
30244	Saint-Clément	30
30121	Gailhan	30
30054	Brouzet-lès-Quissac	30
34043	Buzignargues	34
34110	Galargues	34
34048	Campagne	34
34112	Garrigues	34
30018	Aspères	30
30306	Salinelles	30
30148	Liouc	30
30309	Sardan	30
30192	Orthoux-Sérignac-Quilhan	30
30210	Quissac	30
30311	Sauve	30
30144	Lecques	30
30150	Logrian-Florian	30
30050	Bragassargues	30
30208	Puechredon	30
30300	Saint-Théodorit	30
30066	Cannes-et-Clairan	30
30314	Savignargues	30
30065	Canaules-et-Argentières	30
30267	Saint-Jean-de-Serres	30
30147	Lézan	30
30068	Cardet	30
30106	Durfort-et-Saint-Martin-de-Sossenac	30
51149	Chepy	51
51001	Ablancourt	51
51372	Moncetz-Longevas	51
51304	Janvilliers	51
51350	Margny	51
77295	Moisenay	77
51511	Saint-Quentin-le-Verger	51
51004	Allemanche-Launay-et-Soyer	51
51353	Marsangis	51
51234	Esclavolles-Lurey	51
51162	Conflans-sur-Seine	51
51642	Villiers-aux-Corneilles	51
10114	Crancey	10
51041	Baudement	51
51009	Anglure	51
51279	Granges-sur-Aube	51
10144	Étrelles-sur-Aube	10
40163	Lüe	40
40278	Saint-Paul-en-Born	40
40229	Pontenx-les-Forges	40
65288	Lubret-Saint-Luc	65
65308	Mazerolles	65
65015	Antin	65
65342	Osmets	65
65085	Bernadets-Debat	65
65102	Bouilh-Devant	65
65170	Estampures	65
32086	Castex	32
65178	Fréchède	65
65461	Vidou	65
65250	Lalanne-Trie	65
65260	Lapeyre	65
65177	Fontrailles	65
32226	Manas-Bastanous	32
32415	Sarraguzan	32
65474	Villembits	65
65289	Luby-Betmont	65
64118	Bétracq	64
65429	Sombrun	65
65248	Lahitte-Toupière	65
64193	Corbère-Abères	64
64517	Séméacq-Blachon	64
65472	Villefranque	65
64323	Lasserre	64
65215	Hagedet	65
65264	Lascazères	65
64394	Monpezat	64
64390	Moncaup	64
65412	Sauveterre	65
65049	Auriébat	65
32008	Armentieux	32
65174	Estirac	65
65137	Caussade-Rivière	65
65304	Maubourguet	65
32009	Armous-et-Cau	32
32144	Gazax-et-Baccarisse	32
65240	Labatut-Rivière	65
65219	Hères	65
32445	Tieste-Uragnoux	32
32175	Ladevèze-Ville	32
64196	Crouseilles	64
65432	Soublecause	65
65296	Madiran	65
32174	Ladevèze-Rivière	32
32362	Saint-Aunix-Lengros	32
32164	Juillac	32
32163	Jû-Belloc	32
65130	Castelnau-Rivière-Basse	65
32151	Goux	32
32330	Préchac-sur-Adour	32
32036	Beaumarchés	32
32111	Courties	32
32217	Louslitges	32
32319	Plaisance	32
32199	Lasserade	32
32325	Pouydraguin	32
32218	Loussous-Débat	32
32109	Couloumé-Mondebat	32
32317	Peyrusse-Vieille	32
32403	Saint-Pierre-d'Aubézies	32
32449	Toujouse	32
32271	Monguilhem	32
32087	Castex-d'Armagnac	32
65387	Saint-Lanne	65
32460	Vergoignan	32
32027	Barcelonne-du-Gers	32
64056	Arrosès	64
32281	Mont-de-Marrast	32
65452	Trie-sur-Baïse	65
65448	Tournous-Darré	65
32127	Estang	32
32211	Lias-d'Armagnac	32
32305	Panjas	32
32264	Monclar	32
32096	Cazaubon	32
32243	Mauléon-d'Armagnac	32
30165	Méjannes-lès-Alès	30
30177	Monteils	30
30294	Saint-Privat-des-Vieux	30
30305	Salindres	30
30173	Mons	30
30259	Saint-Hilaire-de-Brethmas	30
30348	Vézénobres	30
30101	Deaux	30
30250	Saint-Étienne-de-l'Olm	30
30318	Servas	30
30223	Rousson	30
30010	Anduze	30
30042	Boisset-et-Gaujac	30
30129	Générargues	30
30298	Saint-Sébastien-d'Aigrefeuille	30
30270	Saint-Jean-du-Pin	30
30243	Saint-Christol-lès-Alès	30
30007	Alès	30
30214	Ribaute-les-Tavernes	30
30027	Bagard	30
30134	Issirac	30
30290	Saint-Paulet-de-Caisson	30
30005	Aiguèze	30
30143	Laval-Saint-Roman	30
07259	Saint-Just-d'Ardèche	07
30202	Pont-Saint-Esprit	30
30273	Saint-Julien-de-Peyrolas	30
07092	Freyssenet	07
07288	Saint-Priest	07
07179	Pourchères	07
07093	Genestelle	07
07182	Prades	07
07122	Lachapelle-sous-Aubenas	07
07327	Uzer	07
07141	Lentillères	07
07062	Chazeaux	07
07343	Vinezac	07
07155	Mercuer	07
07058	Chassiers	07
07132	Largentière	07
07091	Fons	07
07002	Ailhon	07
07109	Joannas	07
07162	Montréal	07
07307	Sanilhac	07
07134	Laurac-en-Vivarais	07
07336	Vernon	07
07061	Chauzon	07
07107	Jaujac	07
07251	Saint-Joseph-des-Bancs	07
07325	Ucel	07
07116	Labégude	07
07254	Saint-Julien-du-Serre	07
07339	Vesseaux	07
07210	Saint-Andéol-de-Vals	07
07277	Saint-Michel-de-Boulogne	07
07023	Balazuc	07
07189	Ribes	07
07196	Rocles	07
07187	Prunet	07
07318	Tauriers	07
07087	Fabras	07
07223	Saint-Cirgues-de-Prades	07
07213	Saint-André-Lachamp	07
07275	Saint-Mélany	07
07088	Faugères	07
07029	Beaumont	07
07176	Planzolles	07
07193	Rocher	07
07238	Saint-Genest-de-Beauzon	07
07284	Saint-Pierre-Saint-Jean	07
07147	Malarce-sur-la-Thines	07
07050	Chambonas	07
07171	Payzac	07
07305	Les Salelles	07
07024	Banne	07
07334	Les Vans	07
30044	Bonnevaux	30
30153	Malons-et-Elze	30
07100	Gravières	07
07148	Malbosc	07
07340	Veyras	07
51343	Marcilly-sur-Seine	51
51524	Saron-sur-Aube	51
30316	Sénéchas	30
30022	Aujac	30
48170	Saint-Martin-de-Boubaux	48
30253	Saint-Florent-sur-Auzonnet	30
30216	Robiac-Rochessadoule	30
30037	Bessèges	30
30268	Saint-Jean-de-Valériscle	30
30097	Courry	30
30194	Peyremale	30
30045	Bordezac	30
30080	Chamborigaud	30
30137	Lamelouze	30
30051	Branoux-les-Taillades	30
30239	Sainte-Cécile-d'Andorge	30
48163	Saint-Julien-des-Points	48
30152	Les Mages	30
30271	Saint-Julien-de-Cassagnas	30
30274	Saint-Julien-les-Rosiers	30
30142	Laval-Pradel	30
30159	Le Martinet	30
30307	Les Salles-du-Gardon	30
30132	La Grand-Combe	30
30203	Portes	30
30345	La Vernarède	30
30079	Chambon	30
07280	Saint-Paul-le-Jeune	07
30120	Gagnières	30
30227	Saint-Ambroix	30
30171	Molières-sur-Cèze	30
30167	Meyrannes	30
51340	Maisons-en-Champagne	51
51220	Drouilly	51
51328	Loisy-sur-Marne	51
51167	Coole	51
51538	Sogny-aux-Moulins	51
51649	Vitry-le-François	51
51647	Vitry-en-Perthois	51
51446	Pringy	51
51552	Songy	51
51525	Sarry	51
51550	Sompuis	51
51502	Saint-Martin-aux-Champs	51
51415	Omey	51
72089	Conlie	72
72321	Saint-Symphorien	72
72351	Tennie	72
72218	Neuvillette-en-Charnie	72
72197	Mézières-sous-Lavardin	72
36177	Sacierges-Saint-Martin	36
36174	Roussines	36
22064	Gouarec	22
56076	Guern	56
56026	Bubry	56
56128	Melrand	56
22181	Plélauff	22
22220	Plouguernével	22
22124	Lescouët-Gouarec	22
56209	Sainte-Brigitte	56
56245	Silfiac	56
56113	Locmalo	56
56041	Cléguérec	56
56125	Malguénac	56
56242	Séglien	56
77062	Carnetin	77
77234	Jablines	77
77118	Claye-Souilly	77
77005	Annet-sur-Marne	77
67176	Gundershoffen	67
67328	Niedermodern	67
67005	Alteckendorf	67
57095	Boucheporn	57
57284	Hallering	57
57762	Zimming	57
57679	Tritteling-Redlach	57
57047	Bambiderstroff	57
57495	Narbéfontaine	57
57217	Flétrange	57
57714	Haute-Vigneulles	57
57015	Altviller	57
57428	Macheren	57
57222	Folkling	57
57419	Loupershouse	57
57208	Farschviller	57
57316	Henriville	57
57207	Farébersviller	57
57669	Théding	57
57665	Tenteling	57
57144	Cocheren	57
57101	Bousbach	57
57176	Diebling	57
57332	Hombourg-Haut	57
57373	Lachambre	57
57052	Barst	57
57644	Seingbouse	57
57061	Béning-lès-Saint-Avold	57
57122	Cappel	57
57690	Valmont	57
57389	Lelling	57
57224	Folschviller	57
57413	Longeville-lès-Saint-Avold	57
57386	Laudrefang	57
57606	Saint-Avold	57
57408	Lixing-lès-Rouhling	57
57348	Ippling	57
57514	Nousseviller-Saint-Nabor	57
57598	Rouhling	57
57752	Woustviller	57
57340	Hundling	57
57260	Grosbliederstroff	57
57197	Ernestviller	57
57466	Metzing	57
57264	Guebenhouse	57
57263	Grundviller	57
57289	Hambach	57
57631	Sarreguemines	57
57471	Momerstroff	57
57507	Niedervisse	57
57519	Obervisse	57
32070	Cahuzac-sur-Adour	32
32161	Izotges	32
32244	Maulichères	32
32005	Arblade-le-Haut	32
32458	Urgosse	32
32434	Sion	32
32209	Lelin-Lapujolle	32
32093	Caumont	32
32380	Saint-Griède	32
32220	Luppé-Violles	32
32191	Lanne-Soubiran	32
32443	Termes-d'Armagnac	32
32414	Sarragachies	32
32390	Saint-Martin-d'Armagnac	32
32437	Sorbets	32
32136	Galiax	32
32135	Fustérouau	32
32440	Tasque	32
32145	Gée-Rivière	32
32004	Arblade-le-Bas	32
32398	Saint-Mont	32
32378	Saint-Germé	32
32108	Corneillan	32
32081	Castelnavet	32
32063	Bouzon-Gellenave	32
32126	Estampes	32
32464	Villecomtal-sur-Arros	32
32283	Montégut-Arros	32
32355	Sadeillan	32
32233	Marciac	32
32152	Haget	32
32383	Saint-Justin	32
32099	Cazaux-Villecomtal	32
32427	Sembouès	32
32422	Scieurac-et-Flourès	32
32240	Mascaras	32
32032	Bassoues	32
32342	Ricourt	32
32273	Monlezun	32
32275	Monpardiac	32
32446	Tillac	32
32303	Pallanne	32
32181	Laguian-Mazous	32
32225	Malabat	32
32058	Blousson-Sérian	32
32455	Troncens	32
32020	Aux-Aussat	32
65314	Monfaucon	65
32450	Tourdun	32
32074	Cannet	32
40193	Montégut	40
32245	Maumusson-Laguian	32
40052	Bourdalat	40
32205	Laveraët	32
32367	Saint-Christaud	32
32393	Saint-Maur	32
32252	Miélan	32
32034	Bazugues	32
32167	Laas	32
32323	Ponsampère	32
64084	Aydie	64
32373	Sainte-Dode	32
32397	Saint-Michel	32
32408	Salles-d'Armagnac	32
32369	Sainte-Christie-d'Armagnac	32
32062	Bourrouillan	32
40131	Labastide-d'Armagnac	40
32189	Lannemaignan	32
32296	Nogaro	32
32050	Betplan	32
32028	Barcugnan	32
32045	Berdoues	32
32394	Saint-Médard	32
32215	Loubersan	32
32389	Saint-Martin	32
32156	Idrac-Respaillès	32
32159	L'Isle-de-Noé	32
32254	Miramont-d'Astarac	32
32172	Labéjan	32
32187	Lamazère	32
32381	Saint-Jean-le-Comtal	32
32285	Montesquiou	32
32030	Bars	32
32293	Mouchès	32
32042	Belloc-Saint-Clamens	32
32375	Saint-Élix-Theux	32
32263	Moncassin	32
32363	Sainte-Aurence-Cazaux	32
32278	Montaut	32
32401	Saint-Ost	32
32419	Sauviac	32
32466	Viozan	32
32118	Durban	32
32300	Orbessan	32
32201	Lasseube-Propre	32
32060	Boucagnères	32
32302	Ornézan	32
32426	Seissan	32
32256	Mirande	32
32128	Estipouy	32
51028	Avenay-Val-d'Or	51
51469	Rouffy	51
77368	Poigny	77
77391	Rouilly	77
77418	Saint-Loup-de-Naud	77
77149	Cucharmoy	77
77379	Provins	77
77167	Égligny	77
77311	Montigny-Lencoup	77
77101	Châtenay-sur-Seine	77
77133	Courcelles-en-Bassée	77
77051	Bray-sur-Seine	77
77434	Saint-Sauveur-lès-Bray	77
77263	Luisetaines	77
77325	Mouy-sur-Seine	77
77439	Salins	77
77245	Laval-en-Brie	77
77409	Saint-Germain-Laval	77
77080	Champcenest	77
77134	Courchamp	77
77187	Fontaine-Fourches	77
77507	Villenauxe-la-Petite	77
77236	Jaulnes	77
77321	Mousseaux-lès-Bray	77
77523	Villuis	77
51492	Saint-Just-Sauvage	51
51032	Bagneux	51
07131	Lanas	07
07272	Saint-Maurice-d'Ardèche	07
07348	Vogüé	07
07190	Rochecolombe	07
07241	Saint-Germain	07
07341	Villeneuve-de-Berg	07
07208	Saint-Andéol-de-Berg	07
07138	Lavilledieu	07
07229	Saint-Didier-sous-Aubenas	07
07145	Lussas	07
07159	Mirabel	07
07247	Saint-Jean-le-Centenier	07
07004	Ajoux	07
07230	Saint-Étienne-de-Boulogne	07
07098	Gourdon	07
07289	Saint-Privat	07
07296	Saint-Sernin	07
07231	Saint-Étienne-de-Fontbellon	07
07019	Aubenas	07
07242	Saint-Gineis-en-Coiron	07
07077	Darbres	07
07263	Saint-Laurent-sous-Coiron	07
64491	Saint-Médard	64
40073	Castelner	40
64095	Barinque	64
64114	Bernadets	64
64027	Anos	64
64406	Morlanne	64
64172	Casteide-Candau	64
40189	Monget	40
64321	Lasclaveries	64
64070	Astis	64
64408	Mouhous	64
64523	Sévignacq	64
64194	Coslédaà-Lube-Boast	64
64043	Argelos	64
64078	Auriac	64
64536	Thèze	64
64385	Miossens-Lanusse	64
64167	Carrère	64
64190	Claracq	64
64472	Saint-Castin	64
64470	Saint-Armou	64
64511	Sauvagnon	64
64332	Lème	64
64234	Garos	64
64557	Vignes	64
64380	Méracq	64
64226	Fichous-Riumayou	64
64355	Louvigny	64
64073	Aubin	64
64183	Caubios-Loos	64
64146	Bournos	64
64203	Doumy	64
64560	Viven	64
64415	Navailles-Angos	64
64347	Lonçon	64
64514	Séby	64
64383	Mialos	64
64077	Auga	64
64456	Pouliacq	64
64195	Coublucq	64
64063	Arzacq-Arraziguet	64
64457	Poursiugues-Boucoue	64
64158	Cabidos	64
64143	Bouillon	64
64447	Piets-Plasence-Moustrou	64
64044	Arget	64
64397	Montagut	64
40225	Philondenx	40
64365	Malaussanne	64
40223	Peyre	40
64254	Hagetaubin	64
64262	Higuères-Souye	64
64239	Gerderest	64
64389	Monassut-Audiracq	64
64002	Abère	64
64488	Saint-Laurent-Bretagne	64
64465	Riupeyrous	64
64208	Escoubès	64
64361	Lussagnet-Lusson	64
64524	Simacourbe	64
64308	Lalonquette	64
64141	Boueilh-Boueilho-Lasque	64
64232	Garlède-Mondebat	64
40148	Lauret	40
77037	Bois-le-Roi	77
77255	Livry-sur-Seine	77
65325	Moumoulous	65
65013	Ansost	65
65061	Barbachen	65
65114	Buzon	65
65196	Gensac	65
65243	Lafitole	65
65273	Liac	65
65035	Artagnan	65
65262	Larreule	65
64293	Labatut	64
65119	Caixon	65
64395	Monségur	64
32039	Beccas	32
65414	Ségalas	65
65330	Nouilhan	65
65311	Mingot	65
65285	Louit	65
65121	Camalès	65
65403	Sanous	65
64173	Casteide-Doat	64
64309	Lamayou	64
65460	Vic-en-Bigorre	65
65390	Saint-Lézer	65
65409	Sarriac-Bigorre	65
65299	Marsac	65
65446	Tostat	65
65406	Sarniguet	65
65477	Villenave-près-Marsac	65
65457	Ugnouas	65
32424	Ségos	32
40027	Bassercles	40
40290	Sarron	40
40247	Saint-Agnet	40
40239	Puyol-Cazalet	40
62480	Labourse	62
62278	Drouvin-le-Marais	62
62350	Fouquières-lès-Béthune	62
62119	Béthune	62
62848	Verquin	62
62847	Verquigneul	62
62034	Annequin	62
62863	Violaines	62
32274	Monlezun-d'Armagnac	32
32246	Maupas	32
32439	Tarsac	32
32344	Riscle	32
40136	Lacajunte	40
40005	Arboucave	40
40226	Pimbo	40
40172	Mant	40
40069	Castaignos-Souslens	40
40041	Beyries	40
40188	Momuy	40
40130	Labastide-Chalosse	40
40138	Lacrabe	40
40198	Morganx	40
40190	Monségur	40
40007	Argelos	40
40232	Poudenx	40
87096	La Meyze	87
24489	Saint-Priest-les-Fougères	24
87031	Le Chalard	87
24218	Jumilhac-le-Grand	24
87082	Ladignac-le-Long	87
87027	Bussière-Galant	87
87187	Saint-Yrieix-la-Perche	87
87049	Coussac-Bonneval	87
87127	La Roche-l'Abeille	87
87039	Château-Chervix	87
87176	Saint-Priest-Ligoure	87
87095	Meuzac	87
34200	Pézènes-les-Mines	34
34285	Saint-Pons-de-Mauchiens	34
34157	Mèze	34
22015	Bréhand	22
22346	Trédaniel	22
22281	Saint-Carreuc	22
22171	Plaintel	22
22258	Quessoy	22
22099	Lanfains	22
22277	Saint-Brandan	22
22060	Gausson	22
22219	Plouguenast	22
22300	Saint-Hervé	22
22203	Plœuc-L'Hermitage	22
22153	Moncontour	22
22079	Hénon	22
22047	Corlay	22
22330	Saint-Thélo	22
22149	Merléac	22
22313	Saint-Martin-des-Prés	22
22001	Allineuc	22
22073	La Harmoye	22
22009	Le Bodéo	22
22260	Le Quillio	22
22295	Saint-Gilles-Vieux-Marché	22
22244	Plussulien	22
22334	Saint-Igeaux	22
22384	Uzel	22
22316	Saint-Mayeux	22
22100	Langast	22
22184	Plémy	22
22158	Guerlédan	22
22107	Bon Repos sur Blavet	22
22033	Caurel	22
01038	Bény	01
01350	Saint-Étienne-du-Bois	01
09100	Couflens	09
85182	Pouzauges	85
85090	Sèvremont	85
85064	Chauché	85
85196	Saint-André-Goule-d'Oie	85
85301	Vendrennes	85
85259	Saint-Paul-en-Pareds	85
85031	Le Boupère	85
85153	Mouchamps	85
85025	La Boissière-de-Montaigu	85
85038	Les Brouzils	85
85186	La Rabatelière	85
85217	Saint-Georges-de-Montaigu	85
85145	Monsireigne	85
85065	Chavagnes-en-Paillers	85
85215	Saint-Fulgent	85
85013	Bazoges-en-Paillers	85
85144	Mesnard-la-Barotière	85
85017	Beaurepaire	85
85192	Rochetrejoux	85
85109	Les Herbiers	85
85072	La Copechagnière	85
03135	Lalizolle	03
03089	Coutansouze	03
03192	Nades	03
03108	Échassières	03
63419	Servant	63
72109	Crissé	72
72255	Rouessé-Vassé	72
72216	Neuvillalais	72
72334	Sillé-le-Guillaume	72
72315	Saint-Rémy-de-Sillé	72
72370	Vernie	72
53265	Torcé-Viviers-en-Charnie	53
53276	Voutré	53
72229	Parennes	72
72256	Rouez	72
72332	Ségrie	72
72234	Pezé-le-Robert	72
77196	Fresnes-sur-Marne	77
77232	Isles-lès-Villenoy	77
77248	Lesches	77
77376	Précy-sur-Marne	77
77094	Charmentray	77
77474	Trilbardou	77
77095	Charny	77
77171	Esbly	77
77292	Messy	77
91041	Avrainville	91
91581	Saint-Yon	91
91085	Boissy-sous-Saint-Yon	91
64501	Sallespisse	64
64510	Sault-de-Navailles	64
64295	Labeyrie	64
64338	Lespourcy	64
64382	Mesplède	64
64369	Maspie-Lalonquère-Juillacq	64
64455	Portet	64
64401	Mont-Disse	64
64199	Diusse	64
64503	Samsons-Lion	64
64446	Peyrelongue-Abos	64
64331	Lembeye	64
64337	Lespielle	64
64210	Escurès	64
64182	Castillon (Canton de Lembeye)	64
64263	L'Hôpital-d'Orion	64
64499	Salies-de-Béarn	64
40079	Cazalis	40
40203	Nassiet	40
64471	Saint-Boès	64
40173	Marpaps	40
64296	Lacadée	64
64112	Bérenx	64
64462	Ramous	64
64087	Baigts-de-Béarn	64
64500	Salles-Mongiscard	64
64461	Puyoô	64
64423	Oraàs	64
91235	Fleury-Mérogis	91
91570	Saint-Michel-sur-Orge	91
91549	Sainte-Geneviève-des-Bois	91
91457	La Norville	91
91292	Guibeville	91
91156	Cheptainville	91
39183	Crotenay	39
39364	Montrond	39
39540	Valempoulières	39
39050	Besain	39
39336	Molain	39
39406	Le Pasquier	39
39554	Vers-en-Montagne	39
64450	Pomps	64
62217	Cauchy-à-la-Tour	62
62532	Lozinghem	62
62489	Lapugnoy	62
62328	Ferfay	62
62188	Burbure	62
62048	Auchel	62
62555	Marles-les-Mines	62
62186	Bully-les-Mines	62
62737	Sains-en-Gohelle	62
62051	Auchy-les-Mines	62
62735	Sailly-Labourse	62
62846	Vermelles	62
62626	Noyelles-lès-Vermelles	62
62563	Mazingarbe	62
62401	Haisnes	62
62032	Angres	62
62510	Liévin	62
62291	Éleu-dit-Leauwette	62
62498	Lens	62
62528	Loos-en-Gohelle	62
62836	Vaudricourt	62
62617	Nœux-les-Mines	62
62126	Beuvry	62
62386	Grenay	62
62200	Cambrin	62
62262	Cuinchy	62
62107	Bénifontaine	62
62842	Vendin-le-Vieil	62
62033	Annay	62
62666	Pont-à-Vendin	62
62464	Hulluch	62
62771	Sallaumines	62
62628	Noyelles-sous-Lens	62
62523	Loison-sous-Lens	62
62724	Rouvroy	62
62065	Avion	62
62274	Dourges	62
62637	Oignies	62
62215	Carvin	62
62907	Libercourt	62
59123	Camphin-en-Carembault	59
62895	Wingles	62
62573	Meurchin	62
62276	Douvrin	62
62132	Billy-Berclau	62
59052	Bauvin	59
59477	Provin	59
59550	Salomé	59
59133	Carnin	59
59011	Annœullin	59
62194	Calonne-Ricouart	62
62456	Houchin	62
62083	Barlin	62
62133	Billy-Montigny	62
62587	Montigny-en-Gohelle	62
62351	Fouquières-lès-Lens	62
59462	Phalempin	59
59630	Wahagnies	59
59452	Ostricourt	59
62413	Harnes	62
62250	Courrières	62
62311	Estevelles	62
62479	Labeuvrière	62
62445	Hesdigneul-lès-Béthune	62
62377	Gosnay	62
62349	Fouquereuil	62
62400	Haillicourt	62
62178	Bruay-la-Buissière	62
59515	Rouvignies	59
59429	Neuville-sur-Escaut	59
59440	Noyelles-sur-Selle	59
59361	Lourches	59
59179	Douchy-les-Mines	59
59288	Haulchin	59
59391	Mastaing	59
59475	Prouvy	59
59092	Bouchain	59
77164	Échouboulains	77
77210	La Grande-Paroisse	77
91244	Fontenay-le-Vicomte	91
51273	Givry-lès-Loisy	51
65465	Vielle-Aure	65
64174	Castéra-Loubix	64
65462	Vidouze	65
64357	Lucarré	64
64098	Bassillon-Vauzé	64
64356	Luc-Armau	64
64507	Saubole	64
65181	Fréchou-Fréchet	65
65290	Luc	65
65321	Montignac	65
65005	Allier	65
65083	Bernac-Debat	65
65063	Barbazan-Dessus	65
65222	Hitte	65
65062	Barbazan-Debat	65
65084	Bernac-Dessus	65
65464	Vielle-Adour	65
65016	Antist	65
65481	Barèges	65
65424	Sers	65
65007	Andrest	65
65244	Lagarde	65
65372	Pujo	65
65189	Gayan	65
65425	Siarrouy	65
65417	Séméac	65
65438	Talazac	65
64111	Bentayou-Sérée	64
65439	Tarasteix	65
64398	Montaner	64
65388	Saint-Lary-Soulan	65
65192	Gavarnie-Gèdre	65
65017	Aragnouet	65
66068	Escaro	66
66085	Fuilla	66
66043	Casteil	66
66166	Sahorre	66
66222	Vernet-les-Bains	66
66197	Souanyas	66
66123	Nyer	66
\.


--
-- Data for Name: demarches_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demarches_statuts (id, nom, couleur) FROM stdin;
acc	acceptée	success
cls	classée sans suite	neutral
dep	déposée	warning
eco	en construction	warning
ind	indeterminé	warning
ini	initiée	warning
ins	en instruction	warning
rej	rejetée	neutral
ret	retirée	neutral
ter	terminée	success
\.


--
-- Data for Name: demarches_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demarches_types (id, nom, ordre, duree, points, substances, titulaires, renouvelable, exception, auto) FROM stdin;
abr	abrogation	\N	t	\N	\N	\N	\N	\N	\N
amo	amodiation	\N	\N	\N	\N	t	t	\N	\N
con	conversion	\N	\N	\N	t	\N	\N	\N	\N
exp	extension de périmètre	\N	t	t	\N	\N	t	\N	\N
dep	déplacement de périmètre	\N	\N	t	\N	\N	t	\N	\N
exs	extension de substance	\N	t	\N	t	\N	t	\N	\N
fus	fusion	\N	t	t	\N	t	t	\N	\N
mut	mutation	\N	t	t	\N	t	t	\N	\N
vut	mutation partielle (nouveau titre)	\N	t	t	\N	t	t	\N	t
oct	octroi	1	t	t	t	t	\N	\N	\N
pr1	prolongation 1	3	t	t	\N	\N	\N	\N	\N
pr2	prolongation 2	4	t	t	\N	\N	\N	\N	\N
pre	prolongation exceptionnelle	\N	t	\N	\N	\N	\N	t	\N
pro	prolongation	2	t	t	\N	\N	t	\N	\N
prr	prorogation	\N	t	t	\N	\N	t	\N	\N
ren	renonciation	\N	t	t	\N	t	t	\N	\N
res	résiliation anticipée d'amodiation	\N	\N	\N	\N	t	t	\N	\N
ret	retrait	\N	t	\N	\N	\N	\N	\N	\N
dec	déchéance	\N	\N	\N	\N	t	\N	\N	\N
ces	cession	\N	\N	\N	\N	t	\N	\N	\N
vct	demande de titre d'exploitation	1	t	t	t	t	t	\N	t
\.


--
-- Data for Name: demarches_types__etapes_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demarches_types__etapes_types (demarche_type_id, etape_type_id, type_id, ordre) FROM stdin;
abr	mpu	apx	160
abr	dex	apx	450
abr	dpu	apx	450
oct	mfr	apx	100
oct	mdp	apx	110
oct	men	apx	120
oct	mpu	apx	160
oct	dim	apx	400
oct	dex	apx	450
oct	dpu	apx	450
ren	mfr	apx	100
ren	mdp	apx	110
ren	men	apx	120
ren	mpu	apx	160
ren	dim	apx	400
ren	apu	apx	401
ren	dex	apx	450
ren	dpu	apx	450
ret	mpu	apx	160
ret	dex	apx	450
ret	dpu	apx	450
abr	mpu	arc	160
abr	dex	arc	450
abr	dpu	arc	450
oct	mfr	arc	100
oct	mdp	arc	110
oct	men	arc	120
oct	mpu	arc	160
oct	dim	arc	400
oct	dex	arc	450
oct	dpu	arc	450
pro	mfr	arc	100
pro	mdp	arc	110
pro	men	arc	120
pro	mpu	arc	160
pro	dim	arc	400
pro	dex	arc	450
pro	dpu	arc	450
ren	mfr	arc	100
ren	mdp	arc	110
ren	men	arc	120
ren	mpu	arc	160
ren	dim	arc	400
ren	apu	arc	401
ren	dex	arc	450
ren	dpu	arc	450
ret	mpu	arc	160
ret	dex	arc	450
ret	dpu	arc	450
abr	mpu	arg	160
abr	dex	arg	450
abr	dpu	arg	450
exp	mfr	arg	100
exp	mdp	arg	110
exp	men	arg	120
exp	mpu	arg	160
exp	dim	arg	400
exp	dex	arg	450
exp	dpu	arg	450
mut	mfr	arg	100
mut	mdp	arg	110
mut	men	arg	120
mut	mpu	arg	160
mut	dim	arg	400
mut	dex	arg	450
mut	dpu	arg	450
oct	mfr	arg	100
oct	mdp	arg	110
oct	men	arg	120
oct	mpu	arg	160
oct	dim	arg	400
oct	dex	arg	450
oct	dpu	arg	450
ren	mfr	arg	100
ren	mdp	arg	110
ren	men	arg	120
ren	mpu	arg	160
ren	dim	arg	400
ren	apu	arg	401
ren	dex	arg	450
ren	dpu	arg	450
ret	mpu	arg	160
ret	dex	arg	450
ret	dpu	arg	450
abr	mpu	axm	160
abr	dex	axm	450
abr	rpu	axm	450
dep	men	axm	120
dep	mpu	axm	160
dep	dim	axm	400
dep	dex	axm	450
dep	rpu	axm	450
exp	mfr	axm	100
exp	mdp	axm	110
exp	men	axm	120
exp	mpu	axm	160
exp	dim	axm	400
exp	dex	axm	450
exp	rpu	axm	450
exs	mfr	axm	100
exs	mdp	axm	110
exs	men	axm	120
exs	mpu	axm	160
exs	dim	axm	400
exs	dex	axm	450
exs	rpu	axm	450
oct	mfr	axm	100
oct	mdp	axm	110
oct	men	axm	120
oct	mpu	axm	160
oct	cod	axm	310
oct	dim	axm	400
oct	dex	axm	450
oct	rpu	axm	450
pro	mfr	axm	100
pro	mdp	axm	110
pro	men	axm	120
pro	mpu	axm	160
pro	dim	axm	400
pro	dex	axm	450
pro	rpu	axm	450
ren	mfr	axm	100
ren	mdp	axm	110
ren	men	axm	120
ren	mpu	axm	160
ren	dim	axm	400
ren	apu	axm	401
ren	dex	axm	450
ren	rpu	axm	450
ret	mpu	axm	160
ret	dex	axm	450
ret	rpu	axm	450
abr	mpu	cxx	160
abr	dex	cxx	450
abr	dpu	cxx	450
amo	mfr	cxx	100
amo	mdp	cxx	110
amo	men	cxx	120
amo	mpu	cxx	160
amo	dim	cxx	400
amo	apu	cxx	401
amo	dex	cxx	450
amo	dpu	cxx	450
ces	mfr	cxx	100
ces	mdp	cxx	110
ces	men	cxx	120
ces	mpu	cxx	160
ces	dex	cxx	450
ces	dpu	cxx	450
con	mfr	cxx	100
con	mdp	cxx	110
con	men	cxx	120
con	mpu	cxx	160
con	dim	cxx	400
con	dex	cxx	450
con	dpu	cxx	450
dec	ide	cxx	60
dec	mpu	cxx	160
dec	dex	cxx	450
dec	dpu	cxx	450
exp	mfr	cxx	100
exp	mdp	cxx	110
exp	men	cxx	120
exp	mpu	cxx	160
exp	dim	cxx	400
exp	dex	cxx	450
exp	dpu	cxx	450
mut	mfr	cxx	100
mut	mdp	cxx	110
mut	men	cxx	120
mut	mpu	cxx	160
mut	dim	cxx	400
mut	dex	cxx	450
mut	dpu	cxx	450
oct	mfr	cxx	100
oct	mdp	cxx	110
oct	men	cxx	120
oct	mpu	cxx	160
oct	dim	cxx	400
oct	dex	cxx	450
oct	dpu	cxx	450
pr2	mpu	cxx	160
pr2	dex	cxx	450
pr2	dpu	cxx	450
pro	mfr	cxx	100
pro	mdp	cxx	110
pro	men	cxx	120
pro	dim	cxx	400
ren	mfr	cxx	100
ren	mdp	cxx	110
ren	men	cxx	120
ren	mpu	cxx	160
ren	dim	cxx	400
ren	apu	cxx	401
ren	dex	cxx	450
ren	dpu	cxx	450
res	mfr	cxx	100
res	mdp	cxx	110
res	men	cxx	120
res	mpu	cxx	160
res	dim	cxx	400
res	apu	cxx	401
res	dex	cxx	450
res	dpu	cxx	450
ret	mpu	cxx	160
ret	dex	cxx	450
ret	dpu	cxx	450
abr	mpu	prh	160
abr	dex	prh	450
abr	dpu	prh	450
exp	mfr	prh	100
exp	mdp	prh	110
exp	men	prh	120
exp	mpu	prh	160
exp	dim	prh	400
exp	dex	prh	450
exp	dpu	prh	450
exs	mfr	prh	100
exs	mdp	prh	110
exs	men	prh	120
exs	mpu	prh	160
exs	dim	prh	400
exs	dex	prh	450
exs	dpu	prh	450
fus	mfr	prh	100
fus	mdp	prh	110
fus	men	prh	120
fus	mpu	prh	160
fus	dim	prh	400
fus	apu	prh	401
fus	dex	prh	450
fus	dpu	prh	450
mut	mfr	prh	100
mut	mdp	prh	110
mut	men	prh	120
mut	mpu	prh	160
mut	dim	prh	400
mut	dex	prh	450
mut	dpu	prh	450
oct	mfr	prh	100
oct	mdp	prh	110
oct	men	prh	120
oct	mpu	prh	160
oct	dim	prh	400
oct	dex	prh	450
oct	dpu	prh	450
pr1	mfr	prh	100
pr1	mdp	prh	110
pr1	men	prh	120
pr1	mpu	prh	160
pr1	dim	prh	400
pr1	dex	prh	450
pr1	dpu	prh	450
pr2	mfr	prh	100
pr2	mdp	prh	110
pr2	men	prh	120
pr2	mpu	prh	160
pr2	dim	prh	400
pr2	dex	prh	450
pr2	dpu	prh	450
pre	mfr	prh	100
pre	mdp	prh	110
pre	men	prh	120
pre	mpu	prh	160
pre	dim	prh	400
pre	dex	prh	450
pre	dpu	prh	450
ren	mfr	prh	100
ren	mdp	prh	110
ren	men	prh	120
ren	mpu	prh	160
ren	dim	prh	400
ren	apu	prh	401
ren	dex	prh	450
ren	dpu	prh	450
ret	mpu	prh	160
ret	dex	prh	450
ret	dpu	prh	450
abr	mpu	prx	160
abr	dex	prx	450
abr	dpu	prx	450
abr	rpu	prx	450
exp	mfr	prx	100
exp	mdp	prx	110
exp	men	prx	120
exp	mpu	prx	160
exp	dim	prx	400
exp	dex	prx	450
exp	dpu	prx	450
exp	rpu	prx	450
exs	mfr	prx	100
exs	mdp	prx	110
exs	men	prx	120
exs	mpu	prx	160
exs	dim	prx	400
exs	dex	prx	450
exs	dpu	prx	450
exs	rpu	prx	450
fus	mfr	prx	100
fus	mdp	prx	110
fus	men	prx	120
fus	mpu	prx	160
fus	dim	prx	400
fus	apu	prx	401
fus	dex	prx	450
fus	dpu	prx	450
fus	rpu	prx	450
mut	mfr	prx	100
mut	mdp	prx	110
mut	men	prx	120
mut	mpu	prx	160
mut	dim	prx	400
mut	dex	prx	450
mut	dpu	prx	450
mut	rpu	prx	450
oct	mfr	prx	100
oct	mdp	prx	200
oct	men	prx	300
oct	ide	prx	400
oct	ret	prx	500
oct	mco	prx	600
oct	rco	prx	700
oct	mcr	prx	800
oct	mpu	prx	900
oct	anf	prx	1000
oct	mec	prx	1100
oct	spp	prx	1200
oct	apl	prx	1300
oct	ama	prx	1310
oct	aep	prx	1320
oct	apm	prx	1400
oct	epu	prx	1500
oct	apo	prx	1600
oct	apd	prx	1700
oct	apr	prx	1800
oct	apw	prx	1900
oct	app	prx	2000
oct	ppu	prx	2100
oct	acg	prx	2200
oct	dim	prx	2300
oct	dex	prx	2400
oct	apu	prx	2500
oct	dpu	prx	2600
oct	rpu	prx	2700
oct	mno	prx	2800
pr1	mfr	prx	100
pr1	mdp	prx	110
pr1	men	prx	120
pr1	mpu	prx	160
pr1	dim	prx	400
pr1	dex	prx	450
pr1	dpu	prx	450
pr1	rpu	prx	450
pr2	mfr	prx	100
pr2	mdp	prx	110
pr2	men	prx	120
pr2	mpu	prx	160
pr2	dim	prx	400
pr2	dex	prx	450
pr2	dpu	prx	450
pr2	rpu	prx	450
ren	mfr	prx	100
ren	mdp	prx	110
ren	men	prx	120
ren	mpu	prx	160
ren	dim	prx	400
ren	apu	prx	401
ren	dex	prx	450
ren	dpu	prx	450
ren	rpu	prx	450
ret	mpu	prx	160
ret	dex	prx	450
ret	dpu	prx	450
ret	rpu	prx	450
abr	mpu	pxc	160
abr	dex	pxc	450
abr	dpu	pxc	450
amo	mfr	pxc	100
amo	mdp	pxc	110
amo	men	pxc	120
amo	mpu	pxc	160
amo	dim	pxc	400
amo	dex	pxc	450
amo	dpu	pxc	450
mut	mfr	pxc	100
mut	mdp	pxc	110
mut	men	pxc	120
mut	mpu	pxc	160
mut	dim	pxc	400
mut	dex	pxc	450
mut	dpu	pxc	450
oct	mfr	pxc	100
oct	mdp	pxc	110
oct	men	pxc	120
oct	mpu	pxc	160
oct	mcr	pxc	170
oct	anf	pxc	180
oct	epu	pxc	190
oct	scg	pxc	200
oct	dim	pxc	400
oct	dex	pxc	450
oct	dpu	pxc	450
pro	mfr	pxc	100
pro	mdp	pxc	110
pro	men	pxc	120
pro	mpu	pxc	160
pro	dim	pxc	400
pro	dex	pxc	450
pro	dpu	pxc	450
ren	mfr	pxc	100
ren	mdp	pxc	110
ren	men	pxc	120
ren	mpu	pxc	160
ren	dim	pxc	400
ren	apu	pxc	401
ren	dex	pxc	450
ren	dpu	pxc	450
res	mfr	pxc	100
res	mdp	pxc	110
res	men	pxc	120
res	mpu	pxc	160
res	dim	pxc	400
res	dex	pxc	450
res	dpu	pxc	450
ret	mpu	pxc	160
ret	dex	pxc	450
ret	dpu	pxc	450
abr	mpu	pxg	160
abr	dex	pxg	450
abr	dpu	pxg	450
amo	mfr	pxg	100
amo	mdp	pxg	110
amo	men	pxg	120
amo	mpu	pxg	160
amo	dim	pxg	400
amo	apu	pxg	401
amo	dex	pxg	450
amo	dpu	pxg	450
exp	mfr	pxg	100
exp	mdp	pxg	110
exp	men	pxg	120
exp	mpu	pxg	160
exp	dim	pxg	400
exp	dex	pxg	450
exp	dpu	pxg	450
fus	mfr	pxg	100
fus	mdp	pxg	110
fus	men	pxg	120
fus	mpu	pxg	160
fus	dim	pxg	400
fus	dex	pxg	450
fus	dpu	pxg	450
mut	mfr	pxg	100
mut	mdp	pxg	110
mut	men	pxg	120
mut	mpu	pxg	160
mut	dim	pxg	400
mut	dex	pxg	450
mut	dpu	pxg	450
oct	mfr	pxg	100
oct	mdp	pxg	110
oct	men	pxg	120
oct	mpu	pxg	160
oct	dim	pxg	400
oct	dex	pxg	450
oct	dpu	pxg	450
pro	mfr	pxg	100
pro	mdp	pxg	110
pro	men	pxg	120
pro	mpu	pxg	160
pro	dim	pxg	400
pro	dex	pxg	450
pro	dpu	pxg	450
ren	mfr	pxg	100
ren	mdp	pxg	110
ren	men	pxg	120
ren	mpu	pxg	160
ren	dim	pxg	400
ren	apu	pxg	401
ren	dex	pxg	450
ren	dpu	pxg	450
res	mfr	pxg	100
res	mdp	pxg	110
res	men	pxg	120
res	mpu	pxg	160
res	dim	pxg	400
res	apu	pxg	401
res	dex	pxg	450
res	dpu	pxg	450
ret	mpu	pxg	160
ret	dex	pxg	450
ret	dpu	pxg	450
abr	mpu	pxh	160
abr	dex	pxh	450
abr	dpu	pxh	450
amo	mfr	pxh	100
amo	mdp	pxh	110
amo	men	pxh	120
amo	mpu	pxh	160
amo	dim	pxh	400
amo	dex	pxh	450
amo	dpu	pxh	450
exp	mfr	pxh	100
exp	mdp	pxh	110
exp	men	pxh	120
exp	mpu	pxh	160
exp	dim	pxh	400
exp	dex	pxh	450
exp	dpu	pxh	450
mut	mfr	pxh	100
mut	mdp	pxh	110
mut	men	pxh	120
mut	mpu	pxh	160
mut	dim	pxh	400
mut	dex	pxh	450
mut	dpu	pxh	450
oct	mfr	pxh	100
oct	mdp	pxh	110
oct	men	pxh	120
oct	mpu	pxh	160
oct	dim	pxh	400
oct	dex	pxh	450
oct	dpu	pxh	450
pr1	mfr	pxh	100
pr1	mdp	pxh	110
pr1	men	pxh	120
pr1	mpu	pxh	160
pr1	dim	pxh	400
pr1	dex	pxh	450
pr1	dpu	pxh	450
pr2	mfr	pxh	100
pr2	mdp	pxh	110
pr2	men	pxh	120
pr2	mpu	pxh	160
pr2	dim	pxh	400
pr2	dex	pxh	450
pr2	dpu	pxh	450
prr	mpu	pxh	160
prr	dex	pxh	450
prr	dpu	pxh	450
ren	mfr	pxh	100
ren	mdp	pxh	110
ren	men	pxh	120
ren	mpu	pxh	160
ren	dim	pxh	400
ren	dex	pxh	450
ren	dpu	pxh	450
res	mfr	pxh	100
res	mdp	pxh	110
res	men	pxh	120
res	mpu	pxh	160
res	dim	pxh	400
res	dex	pxh	450
res	dpu	pxh	450
ret	mpu	pxh	160
ret	dex	pxh	450
ret	dpu	pxh	450
abr	mpu	pxm	160
abr	dex	pxm	450
abr	dpu	pxm	450
amo	mfr	pxm	100
amo	mdp	pxm	110
amo	men	pxm	120
amo	mpu	pxm	160
amo	dim	pxm	400
amo	apu	pxm	401
amo	dex	pxm	450
amo	dpu	pxm	450
exp	mfr	pxm	100
exp	mdp	pxm	110
exp	men	pxm	120
exp	mpu	pxm	160
exp	dim	pxm	400
exp	dex	pxm	450
exp	dpu	pxm	450
exs	mfr	pxm	100
exs	mdp	pxm	110
exs	men	pxm	120
exs	mpu	pxm	160
exs	dim	pxm	400
exs	dex	pxm	450
exs	dpu	pxm	450
mut	mfr	pxm	100
mut	mdp	pxm	110
mut	men	pxm	120
mut	mpu	pxm	160
mut	dim	pxm	400
mut	dex	pxm	450
mut	dpu	pxm	450
oct	mfr	pxm	100
oct	mdp	pxm	110
oct	men	pxm	120
oct	mpu	pxm	160
oct	dim	pxm	400
oct	dex	pxm	450
oct	dpu	pxm	450
pr1	mfr	pxm	100
pr1	mdp	pxm	110
pr1	men	pxm	120
pr1	mpu	pxm	160
pr1	dim	pxm	400
pr1	dex	pxm	450
pr1	dpu	pxm	450
pr2	mfr	pxm	100
pr2	mdp	pxm	110
pr2	men	pxm	120
pr2	mpu	pxm	160
pr2	dim	pxm	400
pr2	dex	pxm	450
pr2	dpu	pxm	450
ren	mfr	pxm	100
ren	mdp	pxm	110
ren	men	pxm	120
ren	mpu	pxm	160
ren	dim	pxm	400
ren	apu	pxm	401
ren	dex	pxm	450
ren	dpu	pxm	450
res	mfr	pxm	100
res	mdp	pxm	110
res	men	pxm	120
res	mpu	pxm	160
res	dim	pxm	400
res	apu	pxm	401
res	dex	pxm	450
res	dpu	pxm	450
ret	mpu	pxm	160
ret	dex	pxm	450
ret	dpu	pxm	450
abr	mpu	pxx	160
abr	dex	pxx	450
abr	dpu	pxx	450
amo	mdp	pxx	100
amo	men	pxx	100
amo	mfr	pxx	100
amo	mpu	pxx	160
amo	dim	pxx	400
amo	dex	pxx	450
amo	dpu	pxx	450
exp	mdp	pxx	100
exp	men	pxx	100
exp	mfr	pxx	100
exp	mpu	pxx	160
exp	dim	pxx	400
exp	dex	pxx	450
exp	dpu	pxx	450
mut	mdp	pxx	100
mut	men	pxx	100
mut	mfr	pxx	100
mut	mpu	pxx	160
mut	dim	pxx	400
mut	dex	pxx	450
mut	dpu	pxx	450
oct	mdp	pxx	100
oct	men	pxx	100
oct	mfr	pxx	100
oct	mpu	pxx	160
oct	dim	pxx	400
oct	dex	pxx	450
oct	dpu	pxx	450
pr1	mdp	pxx	100
pr1	men	pxx	100
pr1	mfr	pxx	100
pr1	mpu	pxx	160
pr1	dim	pxx	400
pr1	dex	pxx	450
pr1	dpu	pxx	450
pr2	mdp	pxx	100
pr2	men	pxx	100
pr2	mfr	pxx	100
pr2	mpu	pxx	160
pr2	dim	pxx	400
pr2	dex	pxx	450
pr2	dpu	pxx	450
prr	mpu	pxx	160
prr	dex	pxx	450
prr	dpu	pxx	450
ren	mdp	pxx	100
ren	men	pxx	100
ren	mfr	pxx	100
ren	mpu	pxx	160
ren	dim	pxx	400
ren	dex	pxx	450
ren	dpu	pxx	450
res	mdp	pxx	100
res	men	pxx	100
res	mfr	pxx	100
res	mpu	pxx	160
res	dim	pxx	400
res	dex	pxx	450
res	dpu	pxx	450
ret	mpu	pxx	160
ret	dex	pxx	450
ret	dpu	pxx	450
vct	dex	axm	800
vct	dex	prx	800
vct	dex	pxh	800
vct	dex	pxm	800
vct	rpu	axm	900
vct	dpu	prx	900
vct	dpu	pxh	900
vct	dpu	pxm	900
vct	mfr	axm	100
vct	mfr	prx	100
vct	mfr	pxh	100
vct	mfr	pxm	100
vct	men	axm	200
vct	men	prx	200
vct	men	pxh	200
vct	men	pxm	200
oct	mfr	arm	100
oct	mdp	arm	110
oct	men	arm	120
oct	sde	arm	210
oct	aof	arm	450
oct	eof	arm	455
oct	edm	arm	460
oct	ede	arm	470
oct	rde	arm	310
oct	aca	arm	500
oct	pfc	arm	600
oct	def	arm	700
prr	mfr	arm	100
prr	mdp	arm	110
prr	men	arm	120
prr	sde	arm	210
prr	def	arm	450
abr	rtd	apx	550
oct	rtd	apx	550
ren	rtd	apx	550
ret	rtd	apx	550
abr	rtd	arc	550
oct	rtd	arc	550
pro	rtd	arc	550
ren	rtd	arc	550
ret	rtd	arc	550
abr	rtd	arg	550
exp	rtd	arg	550
mut	rtd	arg	550
oct	rtd	arg	550
ren	rtd	arg	550
ret	rtd	arg	550
abr	rtd	axm	550
dep	rtd	axm	550
exp	rtd	axm	550
exs	rtd	axm	550
oct	rtd	axm	550
pro	rtd	axm	550
ren	rtd	axm	550
ret	rtd	axm	550
abr	rtd	cxx	550
amo	rtd	cxx	550
ces	rtd	cxx	550
con	rtd	cxx	550
dec	rtd	cxx	550
exp	rtd	cxx	550
mut	rtd	cxx	550
oct	rtd	cxx	550
pr2	rtd	cxx	550
ren	rtd	cxx	550
res	rtd	cxx	550
ret	rtd	cxx	550
abr	rtd	prh	550
exp	rtd	prh	550
exs	rtd	prh	550
fus	rtd	prh	550
mut	rtd	prh	550
oct	rtd	prh	550
pr1	rtd	prh	550
pr2	rtd	prh	550
pre	rtd	prh	550
ren	rtd	prh	550
ret	rtd	prh	550
abr	rtd	prx	550
exp	rtd	prx	550
exs	rtd	prx	550
fus	rtd	prx	550
mut	rtd	prx	550
oct	rtd	prx	2400
pr1	rtd	prx	550
pr2	rtd	prx	550
ren	rtd	prx	550
ret	rtd	prx	550
abr	rtd	pxc	550
amo	rtd	pxc	550
mut	rtd	pxc	550
oct	rtd	pxc	550
pro	rtd	pxc	550
ren	rtd	pxc	550
res	rtd	pxc	550
ret	rtd	pxc	550
abr	rtd	pxg	550
amo	rtd	pxg	550
exp	rtd	pxg	550
fus	rtd	pxg	550
mut	rtd	pxg	550
oct	rtd	pxg	550
pro	rtd	pxg	550
ren	rtd	pxg	550
res	rtd	pxg	550
ret	rtd	pxg	550
abr	rtd	pxh	550
amo	rtd	pxh	550
exp	rtd	pxh	550
mut	rtd	pxh	550
oct	rtd	pxh	550
pr1	rtd	pxh	550
pr2	rtd	pxh	550
prr	rtd	pxh	550
ren	rtd	pxh	550
res	rtd	pxh	550
ret	rtd	pxh	550
abr	rtd	pxm	550
amo	rtd	pxm	550
exp	rtd	pxm	550
exs	rtd	pxm	550
mut	rtd	pxm	550
oct	rtd	pxm	550
pr1	rtd	pxm	550
pr2	rtd	pxm	550
ren	rtd	pxm	550
res	rtd	pxm	550
ret	rtd	pxm	550
abr	rtd	pxx	550
amo	rtd	pxx	550
exp	rtd	pxx	550
mut	rtd	pxx	550
oct	rtd	pxx	550
pr1	rtd	pxx	550
pr2	rtd	pxx	550
prr	rtd	pxx	550
ren	rtd	pxx	550
res	rtd	pxx	550
ret	rtd	pxx	550
vct	rtd	axm	800
vct	rtd	prx	800
vct	rtd	pxh	800
vct	rtd	pxm	800
abr	abd	apx	550
oct	abd	apx	550
ren	abd	apx	550
ret	abd	apx	550
abr	abd	arc	550
oct	abd	arc	550
pro	abd	arc	550
ren	abd	arc	550
ret	abd	arc	550
abr	abd	arg	550
exp	abd	arg	550
mut	abd	arg	550
oct	abd	arg	550
ren	abd	arg	550
ret	abd	arg	550
abr	abd	axm	550
dep	abd	axm	550
exp	abd	axm	550
exs	abd	axm	550
oct	abd	axm	550
pro	abd	axm	550
ren	abd	axm	550
ret	abd	axm	550
abr	abd	cxx	550
amo	abd	cxx	550
ces	abd	cxx	550
con	abd	cxx	550
dec	abd	cxx	550
exp	abd	cxx	550
mut	abd	cxx	550
oct	abd	cxx	550
pr2	abd	cxx	550
ren	abd	cxx	550
res	abd	cxx	550
ret	abd	cxx	550
abr	abd	prh	550
exp	abd	prh	550
exs	abd	prh	550
fus	abd	prh	550
mut	abd	prh	550
oct	abd	prh	550
pr1	abd	prh	550
pr2	abd	prh	550
pre	abd	prh	550
ren	abd	prh	550
ret	abd	prh	550
abr	abd	prx	550
exp	abd	prx	550
exs	abd	prx	550
fus	abd	prx	550
mut	abd	prx	550
oct	abd	prx	2400
pr1	abd	prx	550
pr2	abd	prx	550
ren	abd	prx	550
ret	abd	prx	550
abr	abd	pxc	550
amo	abd	pxc	550
mut	abd	pxc	550
oct	abd	pxc	550
pro	abd	pxc	550
ren	abd	pxc	550
res	abd	pxc	550
ret	abd	pxc	550
abr	abd	pxg	550
amo	abd	pxg	550
exp	abd	pxg	550
fus	abd	pxg	550
mut	abd	pxg	550
oct	abd	pxg	550
pro	abd	pxg	550
ren	abd	pxg	550
res	abd	pxg	550
ret	abd	pxg	550
abr	abd	pxh	550
amo	abd	pxh	550
exp	abd	pxh	550
mut	abd	pxh	550
oct	abd	pxh	550
pr1	abd	pxh	550
pr2	abd	pxh	550
prr	abd	pxh	550
ren	abd	pxh	550
res	abd	pxh	550
ret	abd	pxh	550
abr	abd	pxm	550
amo	abd	pxm	550
exp	abd	pxm	550
exs	abd	pxm	550
mut	abd	pxm	550
oct	abd	pxm	550
pr1	abd	pxm	550
pr2	abd	pxm	550
ren	abd	pxm	550
res	abd	pxm	550
ret	abd	pxm	550
abr	abd	pxx	550
amo	abd	pxx	550
exp	abd	pxx	550
mut	abd	pxx	550
oct	abd	pxx	550
pr1	abd	pxx	550
pr2	abd	pxx	550
prr	abd	pxx	550
ren	abd	pxx	550
res	abd	pxx	550
ret	abd	pxx	550
vct	abd	axm	800
vct	abd	prx	800
vct	abd	pxh	800
vct	abd	pxm	800
abr	and	apx	550
oct	and	apx	550
ren	and	apx	550
ret	and	apx	550
abr	and	arc	550
oct	and	arc	550
pro	and	arc	550
ren	and	arc	550
ret	and	arc	550
abr	and	arg	550
exp	and	arg	550
mut	and	arg	550
oct	and	arg	550
ren	and	arg	550
ret	and	arg	550
abr	and	axm	550
dep	and	axm	550
exp	and	axm	550
exs	and	axm	550
oct	and	axm	550
pro	and	axm	550
ren	and	axm	550
ret	and	axm	550
abr	and	cxx	550
amo	and	cxx	550
ces	and	cxx	550
con	and	cxx	550
dec	and	cxx	550
exp	and	cxx	550
mut	and	cxx	550
oct	and	cxx	550
pr2	and	cxx	550
ren	and	cxx	550
res	and	cxx	550
ret	and	cxx	550
abr	and	prh	550
exp	and	prh	550
exs	and	prh	550
fus	and	prh	550
mut	and	prh	550
oct	and	prh	550
pr1	and	prh	550
pr2	and	prh	550
pre	and	prh	550
ren	and	prh	550
ret	and	prh	550
abr	and	prx	550
exp	and	prx	550
exs	and	prx	550
fus	and	prx	550
mut	and	prx	550
oct	and	prx	2400
pr1	and	prx	550
pr2	and	prx	550
ren	and	prx	550
ret	and	prx	550
abr	and	pxc	550
amo	and	pxc	550
mut	and	pxc	550
oct	and	pxc	550
pro	and	pxc	550
ren	and	pxc	550
res	and	pxc	550
ret	and	pxc	550
abr	and	pxg	550
amo	and	pxg	550
exp	and	pxg	550
fus	and	pxg	550
mut	and	pxg	550
oct	and	pxg	550
pro	and	pxg	550
ren	and	pxg	550
res	and	pxg	550
ret	and	pxg	550
abr	and	pxh	550
amo	and	pxh	550
exp	and	pxh	550
mut	and	pxh	550
oct	and	pxh	550
pr1	and	pxh	550
pr2	and	pxh	550
prr	and	pxh	550
ren	and	pxh	550
res	and	pxh	550
ret	and	pxh	550
abr	and	pxm	550
amo	and	pxm	550
exp	and	pxm	550
exs	and	pxm	550
mut	and	pxm	550
oct	and	pxm	550
pr1	and	pxm	550
pr2	and	pxm	550
ren	and	pxm	550
res	and	pxm	550
ret	and	pxm	550
abr	and	pxx	550
amo	and	pxx	550
exp	and	pxx	550
mut	and	pxx	550
oct	and	pxx	550
pr1	and	pxx	550
pr2	and	pxx	550
prr	and	pxx	550
ren	and	pxx	550
res	and	pxx	550
ret	and	pxx	550
vct	and	axm	800
vct	and	prx	800
vct	and	pxh	800
vct	and	pxm	800
oct	mod	apx	200
ren	mod	apx	200
oct	mod	arc	200
pro	mod	arc	200
ren	mod	arc	200
exp	mod	arg	200
mut	mod	arg	200
oct	mod	arg	200
ren	mod	arg	200
exp	mod	axm	200
exs	mod	axm	200
oct	mod	axm	200
pro	mod	axm	200
ren	mod	axm	200
amo	mod	cxx	200
ces	mod	cxx	200
con	mod	cxx	200
exp	mod	cxx	200
mut	mod	cxx	200
oct	mod	cxx	200
pro	mod	cxx	200
ren	mod	cxx	200
res	mod	cxx	200
exp	mod	prh	200
exs	mod	prh	200
fus	mod	prh	200
mut	mod	prh	200
oct	mod	prh	200
pr1	mod	prh	200
pr2	mod	prh	200
pre	mod	prh	200
ren	mod	prh	200
exp	mod	prx	200
exs	mod	prx	200
fus	mod	prx	200
mut	mod	prx	200
oct	mod	prx	200
pr1	mod	prx	200
pr2	mod	prx	200
ren	mod	prx	200
amo	mod	pxc	200
mut	mod	pxc	200
oct	mod	pxc	200
pro	mod	pxc	200
ren	mod	pxc	200
res	mod	pxc	200
amo	mod	pxg	200
exp	mod	pxg	200
fus	mod	pxg	200
mut	mod	pxg	200
oct	mod	pxg	200
pro	mod	pxg	200
ren	mod	pxg	200
res	mod	pxg	200
amo	mod	pxh	200
exp	mod	pxh	200
mut	mod	pxh	200
oct	mod	pxh	200
pr1	mod	pxh	200
pr2	mod	pxh	200
ren	mod	pxh	200
res	mod	pxh	200
amo	mod	pxm	200
exp	mod	pxm	200
exs	mod	pxm	200
mut	mod	pxm	200
oct	mod	pxm	200
pr1	mod	pxm	200
pr2	mod	pxm	200
ren	mod	pxm	200
res	mod	pxm	200
amo	mod	pxx	200
exp	mod	pxx	200
mut	mod	pxx	200
oct	mod	pxx	200
pr1	mod	pxx	200
pr2	mod	pxx	200
ren	mod	pxx	200
res	mod	pxx	200
vct	mod	axm	200
vct	mod	prx	200
vct	mod	pxh	200
vct	mod	pxm	200
oct	mod	arm	200
prr	mod	arm	200
\.


--
-- Data for Name: demarches_types__types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demarches_types__types (type_id, demarche_type_id, duree_max, acceptation_implicite, delai_implicite, delai_recours, legal_ref, legal_lien, date_debut, date_fin) FROM stdin;
apx	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
arc	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
arg	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
axm	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
cxx	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxg	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
prh	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
prx	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxc	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxh	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxm	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxx	abr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
cxx	amo	\N	t	1.25	0,1666666667	\N	\N	\N	\N
pxc	amo	\N	f	2	0,1666666667	\N	\N	\N	\N
pxg	amo	\N	t	1	0,1666666667	\N	\N	\N	\N
pxh	amo	\N	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	amo	\N	t	1.25	0,1666666667	\N	\N	\N	\N
pxx	amo	\N	f	\N	0,1666666667	\N	\N	\N	\N
cxx	ces	\N	\N	\N	\N	\N	\N	\N	\N
cxx	con	\N	f	2	0,1666666667	\N	\N	\N	\N
cxx	dec	\N	\N	\N	\N	\N	\N	\N	\N
axm	dep	\N	f	\N	0,1666666667	\N	\N	\N	\N
arg	exp	\N	f	1,50	0,1666666667	\N	\N	\N	\N
axm	exp	\N	f	\N	0,1666666667	\N	\N	\N	\N
cxx	exp	\N	f	2	0,1666666667	\N	\N	\N	\N
prh	exp	\N	f	1.25	0,1666666667	\N	\N	\N	\N
prx	exp	\N	f	1.25	0,1666666667	\N	\N	\N	\N
pxg	exp	\N	f	1,50	0,1666666667	\N	\N	\N	\N
pxh	exp	\N	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	exp	\N	f	2.5	0,1666666667	\N	\N	\N	\N
pxx	exp	\N	f	\N	0,1666666667	\N	\N	\N	\N
axm	exs	\N	f	\N	0,1666666667	\N	\N	\N	\N
prh	exs	\N	f	1.25	0,1666666667	\N	\N	\N	\N
prx	exs	\N	f	1.25	0,1666666667	\N	\N	\N	\N
pxm	exs	\N	f	2,50	0,1666666667	\N	\N	\N	\N
prh	fus	\N	t	1,00	0,1666666667	\N	\N	\N	\N
prx	fus	\N	t	1	0,1666666667	\N	\N	\N	\N
pxg	fus	\N	f	1	0,1666666667	\N	\N	\N	\N
arg	mut	\N	f	1,00	0,1666666667	\N	\N	\N	\N
cxx	mut	\N	f	1.25	0,1666666667	\N	\N	\N	\N
prh	mut	\N	f	1.25	0,1666666667	\N	\N	\N	\N
prx	mut	\N	f	1.25	0,1666666667	\N	\N	\N	\N
pxc	mut	\N	f	2	0,1666666667	\N	\N	\N	\N
pxg	mut	\N	f	1	0,1666666667	\N	\N	\N	\N
pxh	mut	\N	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	mut	\N	f	1.25	0,1666666667	\N	\N	\N	\N
pxx	mut	\N	f	\N	0,1666666667	\N	\N	\N	\N
apx	oct	2	f	1,00	0,1666666667	\N	\N	\N	\N
arc	oct	3	f	1,00	0,1666666667	\N	\N	\N	\N
arg	oct	3	f	1,50	0,1666666667	\N	\N	\N	\N
axm	oct	4	f	\N	0,1666666667	\N	\N	\N	\N
cxx	oct	50	f	2	0,1666666667	\N	\N	\N	\N
prh	oct	5	f	1,25	0,1666666667	\N	\N	\N	\N
prx	oct	5	f	1,25	0,1666666667	\N	\N	\N	\N
pxc	oct	10	f	2	0,1666666667	\N	\N	\N	\N
pxg	oct	30	f	1,50	0,1666666667	\N	\N	\N	\N
pxh	oct	5	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	oct	5	f	2.5	0,1666666667	\N	\N	\N	\N
pxx	oct	5	f	\N	0,1666666667	\N	\N	\N	\N
prh	pr1	5	f	1.25	0,1666666667	\N	\N	\N	\N
prx	pr1	5	f	1.25	0,1666666667	\N	\N	\N	\N
pxh	pr1	5	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	pr1	5	f	1.5	0,1666666667	\N	\N	\N	\N
pxx	pr1	5	f	\N	0,1666666667	\N	\N	\N	\N
prh	pr2	5	f	1.25	0,1666666667	\N	\N	\N	\N
prx	pr2	5	f	1.25	0,1666666667	\N	\N	\N	\N
pxh	pr2	5	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	pr2	5	f	1.5	0,1666666667	\N	\N	\N	\N
pxx	pr2	5	f	\N	0,1666666667	\N	\N	\N	\N
prh	pre	3	f	1.25	0,1666666667	\N	\N	\N	\N
arc	pro	3	f	1,00	0,1666666667	\N	\N	\N	\N
axm	pro	4	f	\N	0,1666666667	\N	\N	\N	\N
cxx	pro	25	f	2	0,1666666667	\N	\N	\N	\N
pxc	pro	10	f	2	0,1666666667	\N	\N	\N	\N
pxg	pro	15	f	1,50	0,1666666667	\N	\N	\N	\N
pxh	prr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxx	prr	\N	\N	\N	0,1666666667	\N	\N	\N	\N
apx	ren	\N	t	0,3333333333	0,1666666667	\N	\N	\N	\N
arc	ren	\N	t	0,1666666667	0,1666666667	\N	\N	\N	\N
arg	ren	\N	t	1.25	0,1666666667	\N	\N	\N	\N
axm	ren	\N	t	\N	0,1666666667	\N	\N	\N	\N
cxx	ren	\N	t	1,50	0,1666666667	\N	\N	\N	\N
prh	ren	\N	t	1.25	0,1666666667	\N	\N	\N	\N
prx	ren	\N	t	1.25	0,1666666667	\N	\N	\N	\N
pxc	ren	\N	t	2	0,1666666667	\N	\N	\N	\N
pxg	ren	\N	t	1,50	0,1666666667	\N	\N	\N	\N
pxh	ren	\N	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	ren	\N	t	1.5	0,1666666667	\N	\N	\N	\N
pxx	ren	\N	f	\N	0,1666666667	\N	\N	\N	\N
cxx	res	\N	t	1.25	0,1666666667	\N	\N	\N	\N
pxc	res	\N	f	2	0,1666666667	\N	\N	\N	\N
pxg	res	\N	t	1	0,1666666667	\N	\N	\N	\N
pxh	res	\N	f	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	res	\N	t	1.25	0,1666666667	\N	\N	\N	\N
pxx	res	\N	f	\N	0,1666666667	\N	\N	\N	\N
apx	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
arc	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
arg	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
axm	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
cxx	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
prh	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
prx	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxc	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxg	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxh	ret	\N	\N	\N	0,1666666667	Loi n°94-588 du 15 juillet 1994 - art. 13 JORF 16 juillet 1994	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000006627186&cidTexte=LEGITEXT000006071785	\N	1994-07-16
pxm	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
pxx	ret	\N	\N	\N	0,1666666667	\N	\N	\N	\N
axm	vct	50	f	2	0,1666666667	\N	\N	\N	\N
prx	vct	50	f	2	0,1666666667	\N	\N	\N	\N
pxh	vct	50	f	2	0,1666666667	\N	\N	\N	\N
pxm	vct	50	f	2	0,1666666667	\N	\N	\N	\N
\.


--
-- Data for Name: departements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departements (id, nom, region_id, cheflieu_id) FROM stdin;
01	Ain	84	01053
02	Aisne	32	02408
03	Allier	84	03190
04	Alpes-de-Haute-Provence	93	04070
05	Hautes-Alpes	93	05061
06	Alpes-Maritimes	93	06088
07	Ardèche	84	07186
08	Ardennes	44	08105
09	Ariège	76	09122
10	Aube	44	10387
11	Aude	76	11069
12	Aveyron	76	12202
13	Bouches-du-Rhône	93	13055
14	Calvados	28	14118
15	Cantal	84	15014
16	Charente	75	16015
17	Charente-Maritime	75	17300
18	Cher	24	18033
19	Corrèze	75	19272
21	Côte-d'Or	27	21231
22	Côtes-d'Armor	53	22278
23	Creuse	75	23096
24	Dordogne	75	24322
25	Doubs	27	25056
26	Drôme	84	26362
27	Eure	28	27229
28	Eure-et-Loir	24	28085
29	Finistère	53	29232
2A	Corse-du-Sud	94	2A004
2B	Haute-Corse	94	2B033
30	Gard	76	30189
31	Haute-Garonne	76	31555
32	Gers	76	32013
33	Gironde	75	33063
34	Hérault	76	34172
35	Ille-et-Vilaine	53	35238
36	Indre	24	36044
37	Indre-et-Loire	24	37261
38	Isère	84	38185
39	Jura	27	39300
40	Landes	75	40192
41	Loir-et-Cher	24	41018
42	Loire	84	42218
43	Haute-Loire	84	43157
44	Loire-Atlantique	52	44109
45	Loiret	24	45234
46	Lot	76	46042
47	Lot-et-Garonne	75	47001
48	Lozère	76	48095
49	Maine-et-Loire	52	49007
50	Manche	28	50502
51	Marne	44	51108
52	Haute-Marne	44	52121
53	Mayenne	52	53130
54	Meurthe-et-Moselle	44	54395
55	Meuse	44	55029
56	Morbihan	53	56260
57	Moselle	44	57463
58	Nièvre	27	58194
59	Nord	32	59350
60	Oise	32	60057
61	Orne	28	61001
62	Pas-de-Calais	32	62041
63	Puy-de-Dôme	84	63113
64	Pyrénées-Atlantiques	75	64445
65	Hautes-Pyrénées	76	65440
66	Pyrénées-Orientales	76	66136
67	Bas-Rhin	44	67482
68	Haut-Rhin	44	68066
69	Rhône	84	69123
70	Haute-Saône	27	70550
71	Saône-et-Loire	27	71270
72	Sarthe	52	72181
73	Savoie	84	73065
74	Haute-Savoie	84	74010
75	Paris	11	75056
76	Seine-Maritime	28	76540
77	Seine-et-Marne	11	77288
78	Yvelines	11	78646
79	Deux-Sèvres	75	79191
80	Somme	32	80021
81	Tarn	76	81004
82	Tarn-et-Garonne	76	82121
83	Var	93	83137
84	Vaucluse	93	84007
85	Vendée	52	85191
86	Vienne	75	86194
87	Haute-Vienne	75	87085
88	Vosges	44	88160
89	Yonne	27	89024
90	Territoire de Belfort	27	90010
91	Essonne	11	91228
92	Hauts-de-Seine	11	92050
93	Seine-Saint-Denis	11	93008
94	Val-de-Marne	11	94028
95	Val-d'Oise	11	95500
971	Guadeloupe	01	97105
972	Martinique	02	97209
973	Guyane	03	97302
974	La Réunion	04	97411
976	Mayotte	06	97608
\.


--
-- Data for Name: devises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devises (id, nom) FROM stdin;
FRF	Francs
EUR	Euros
XPF	Francs Pacifique
\.


--
-- Data for Name: domaines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domaines (id, nom, ordre) FROM stdin;
m	minéraux et métaux	1
w	granulats marins	2
c	carrières	3
h	hydrocarbures liquides ou gazeux	4
f	combustibles fossiles	5
r	éléments radioactifs	6
g	géothermie	7
s	stockages souterrains	8
\.


--
-- Data for Name: domaines__types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.domaines__types (domaine_id, type_id, archive) FROM stdin;
c	apx	\N
w	apx	\N
h	apx	\N
m	apx	\N
c	arc	\N
w	arc	\N
g	arg	\N
m	axm	\N
w	cxx	\N
g	cxx	\N
h	cxx	\N
m	cxx	\N
s	cxx	\N
f	cxx	\N
r	cxx	\N
h	prh	\N
w	prx	\N
g	prx	\N
m	prx	\N
s	prx	\N
f	prx	\N
r	prx	\N
c	pxc	\N
g	pxg	\N
h	pxh	\N
m	pxm	\N
w	pxx	\N
r	pxx	\N
\.


--
-- Data for Name: emprises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emprises (id, nom) FROM stdin;
ter	à terre
mer	en mer
\.


--
-- Data for Name: entreprises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entreprises (id, nom, pays_id, legal_siren, legal_etranger, legal_forme, categorie, date_creation, adresse, code_postal, commune, cedex, url, email, telephone) FROM stdin;
fr-780130175	SOCIETE DES PETROLES SHELL (SPS)	FR	780130175	\N	SAS, société par actions simplifiée	GE	1954-01-01	11 Cours VALMY 	92800	PUTEAUX	\N	\N	\N	\N
fr-799372925	VOLCANERGIE	FR	799372925	\N	SAS, société par actions simplifiée	PME	2013-12-01	48 Chemin CACHALOT 	97410	SAINT PIERRE	\N	\N	\N	\N
fr-793025370	NINOR	FR	793025370	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-05-02	CARREFOUR DU LARIVOT 	97351	MATOURY	\N	\N	\N	\N
fr-799119441	GEOTHERMIE DE GUADELOUPE	FR	799119441	\N	SAS, société par actions simplifiée	PME	2013-12-09	23 TERRASSES DE LA DIGUE 	97190	LE GOSIER	\N	\N	\N	\N
fr-792695636	Geoforon	FR	792695636	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
au-000000005	East Paris Petroleum Development Ltd	AU	\N	000000005	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
au-abn112138780	Gas2Grid	AU	\N	ABN112138780	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
au-abn32075965856	Roc Oil Compagny Ltd	AU	\N	ABN32075965856	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
au-abn51108230995	Elixir Petroleum	AU	\N	ABN51108230995	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
au-abn51111418270	GippsLand Offshore Petroleum Ltd	AU	\N	ABN51111418270	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
ca-71677j	Sterling Resources Ltd	CA	\N	71677J	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
ch-170303231007	Mouvoil	CH	\N	170303231007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000000	Etat	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000002	Coparex Ile-de-France	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000003	Coparex international	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000014	Société française de développement pétrolier BP	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000017	Famille Le Bel	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000019	EnCore (E&P) Limited	GB	\N	5688680	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000020	Compagnie d'exploration pétrolière	FR	\N	\N	\N	\N	\N	\N	\N	VERSAILLES	\N	\N	\N	\N
fr-000000021	Société nationale des pétroles d'Aquitaine	FR	\N	\N	\N	\N	\N	\N	\N	TARBES	\N	\N	\N	\N
fr-000000022	Française de recherches et d'exploitation de pétrole	FR	\N	\N	Société anonyme	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000023	Société Shell Française	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000024	Nouvelle Société Shell Française	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-000000025	Société de prospection et exploitation pétrolières en Alsace	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-546380130	Régie autonome des pétroles	FR	546380130	\N	\N	\N	\N	\N	\N	TOULOUSE	\N	\N	\N	\N
fr-611620121	Compagnie des produits chimiques et raffineries de Berre	FR	611620121	\N	\N	\N	\N	\N	\N	AIX-EN-PROVENCE	\N	\N	\N	\N
gb-000000001	British Gas Exploration and Production Ltd	GB	\N	000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-327528733	AGIP EXPLORATION ET EXPLOITATION FRANCE	FR	327528733	\N	SA à conseil d'administration (s.a.i.)	\N	1983-06-01	75 Avenue PARMENTIER 	75011	PARIS 11	\N	\N	\N	\N
fr-445246994	MILLENNIUM GEO-VENTURE	FR	445246994	\N	SAS, société par actions simplifiée	PME	2003-01-02	178 Boulevard HAUSSMANN 	75008	PARIS 8	\N	\N	\N	\N
fr-484042247	ESSENCE DE PARIS	FR	484042247	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2005-10-09	12 Allée DES SPORTS 	78480	VERNEUIL SUR SEINE	\N	\N	\N	\N
fr-453852295	GALLI COZ	FR	453852295	\N	SA à conseil d'administration (s.a.i.)	PME	2004-06-03	50 Rue DU MIDI 	94300	VINCENNES	\N	\N	\N	\N
fr-481010817	SOC PETROLIERE PRODUCTION EXPLOITATION (SPPE)	FR	481010817	\N	SAS, société par actions simplifiée	PME	2005-01-24	ZA DE PENSE FOLIE 	45220	CHATEAU RENARD	\N	\N	\N	\N
fr-479920035	NEPTUNE ENERGY FRANCE	FR	479920035	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	2004-12-06	9 Allée DE L ARCHE 	92400	COURBEVOIE	\N	\N	\N	\N
fr-478826316	VERMILION PYRENEES	FR	478826316	\N	SAS, société par actions simplifiée	ETI	2004-09-24	1762 Route DE PONTENX 	40160	PARENTIS EN BORN	\N	\N	\N	\N
fr-452798887	VERMILION EXPLORATION SAS	FR	452798887	\N	SAS, société par actions simplifiée	ETI	2004-03-29	1762 Route DE PONTENX 	40160	PARENTIS EN BORN	\N	\N	\N	\N
fr-457202331	ETABLISSEMENTS MAUREL ET PROM	FR	457202331	\N	SA à conseil d'administration (s.a.i.)	PME	1957-01-01	51 Rue D'ANJOU 	75008	PARIS 8	\N	\N	\N	\N
fr-568500649	PECHELBRONN	FR	568500649	\N	Société en commandite par actions 	\N	1958-12-25	45 Boulevard HAUSSMANN 	75009	PARIS 9	\N	\N	\N	\N
fr-533562906	SOUTH ATLANTIC PETROLEUM JDN	FR	533562906	\N	SAS, société par actions simplifiée	PME	2011-06-28	9 Rue DU FAUBOURG SAINT HONORE 	75008	PARIS 8	\N	\N	\N	\N
fr-532662392	ELECTERRE DE FRANCE	FR	532662392	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2011-05-01	ZA DU ROZIER COREN 	15100	SAINT FLOUR	\N	\N	\N	\N
fr-558501912	ELECTRICITE DE STRASBOURG	FR	558501912	\N	SA à conseil d'administration (s.a.i.)	GE	1955-01-01	26 Boulevard DU PRESIDENT WILSON 	67000	STRASBOURG	\N	\N	\N	\N
fr-562034629	SOC PETROREP	FR	562034629	\N	SA à conseil d'administration (s.a.i.)	PME	1956-01-01	42 Avenue RAYMOND POINCARE 	75116	PARIS 16	\N	\N	\N	\N
fr-552092181	VERMILION EMERAUDE REP	FR	552092181	\N	SAS, société par actions simplifiée	\N	1900-01-01	Lieu-dit LE PIOULAS 	40160	PARENTIS EN BORN	\N	\N	\N	\N
fr-542034327	BP FRANCE	FR	542034327	\N	SAS, société par actions simplifiée	ETI	1900-01-01	10 Avenue DE L ENTREPRISE 	95800	CERGY	95863	\N	\N	\N
fr-542107651	ENGIE	FR	542107651	\N	SA à conseil d'administration (s.a.i.)	GE	1954-01-01	1 Place SAMUEL DE CHAMPLAIN 	92400	COURBEVOIE	\N	\N	\N	\N
fr-662006543	ERAP	FR	662006543	\N	Établissement public national à caractère industriel ou commercial non doté d'un comptable public 	\N	1985-04-22	139 Rue DE BERCY 	75012	PARIS 12	\N	\N	\N	\N
fr-572172609	EURAFREP	FR	572172609	\N	SA à conseil d'administration (s.a.i.)	\N	1957-12-25	64 Rue DU RANELAGH 	75016	PARIS 16	\N	\N	\N	\N
fr-632022711	ELF AQUITAINE PRODUCTION	FR	632022711	\N	SA à conseil d'administration (s.a.i.)	\N	1980-01-01	2 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-722043007	LUNDIN CHAMPAGNE	FR	722043007	\N	SA à conseil d'administration (s.a.i.)	\N	1972-01-01	Hameau MACLAUNAY 	51210	MONTMIRAIL	\N	\N	\N	\N
fr-572199164	IPC PETROLEUM FRANCE	FR	572199164	\N	SA à conseil d'administration (s.a.i.)	PME	1957-01-01	MACLAUNAY 	51210	MONTMIRAIL	\N	\N	\N	\N
fr-729800706	PLACOPLATRE	FR	729800706	\N	SA à conseil d'administration (s.a.i.)	GE	1900-01-01	34 Avenue FRANKLIN ROOSEVELT 	92150	SURESNES	\N	\N	\N	\N
fr-654800689	CIMENTS CALCIA	FR	654800689	\N	SAS, société par actions simplifiée	GE	1965-01-01	Rue DES TECHNODES 	78930	GUERVILLE	\N	\N	\N	\N
fr-777344664	GYPSE LAMBERT	FR	777344664	\N	SA à conseil d'administration (s.a.i.)	\N	1974-05-29	34 Avenue FRANKLIN ROOSEVELT 	92150	SURESNES	\N	\N	\N	\N
fr-789594306	TLS GEOTHERMICS	FR	789594306	\N	SAS, société par actions simplifiée	PME	2012-11-19	14 B Chemin DE L'ENGUILLE 	31180	SAINT-GENIES-BELLEVUE	\N	\N	\N	\N
gb-000000006	Egdon Resources (New Ventures) Ltd	GB	\N	000000006	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-2823058	Melrose Mediterranean Ltd	GB	\N	2823058	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-3452996	eCorp France Ltd	GB	\N	3452996	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-3606195	Osceola Hydrocarbons Ltd	GB	\N	3606195	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-4000483	Nighthawk Energy Plc	GB	\N	4000483	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-4083129	Heritage Petroleum Plc	GB	\N	4083129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-4362104	Nautical Petroleum	GB	\N	4362104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-5217946	Europa Oil & Gas	GB	\N	5217946	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-5296922	Celtique Energie Ltd	GB	\N	5296922	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-5321791	European Gas Ltd	GB	\N	5321791	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-5770790	Celtique Energie Petroleum Ltd	GB	\N	5770790	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-7237734	Aquitaine Exploration Ltd	GB	\N	7237734	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-7247502	Eagle Energy Ltd	GB	\N	7247502	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-7255850	Egdon Resources France Ltd	GB	\N	7255850	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
nl-000000012	Petrichor France BV	NL	\N	000000012	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
se-556658-1491	Tethys Oil AB	SE	\N	556658-1491	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
us-000000013	Schuepbach Energy Llc	US	\N	000000013	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
us-62161300	Marex Petroleum Corp	US	\N	62161300	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
vg-000000007	Jupiter Petroleum Juan de Nova Ltd	VG	\N	000000007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000004	Du Pont Conoco Technologies	XX	\N	000000004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000008	Madison Chart Energy	XX	\N	000000008	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000009	Malta Oil Pty Ltd	XX	\N	000000009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000010	Masefield Energy Holdings AG	XX	\N	000000010	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000011	Midland Madison Petroleum Company	XX	\N	000000011	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000015	YCI Resources Ltd	XX	\N	000000015	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000018	Pilatus Energy	XX	\N	000000018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000019	EnCore E&P Ltd	XX	\N	000000019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000020	Planet Oil Ltd	XX	\N	000000020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-000000021	TGS-NOPEC Geophysical Company	XX	\N	000000021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
arkema-france	arkema-france	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cominor	cominor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
compagnie-des-mines-de-sel-de-poligny-solvay	compagnie-des-mines-de-sel-de-poligny-solvay	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
compagnie-des-salins-du-midi-et-des-salines-de-l-est	compagnie-des-salins-du-midi-et-des-salines-de-l-est	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
compagnie-fermiere-de-salies-de-bearn	compagnie-fermiere-de-salies-de-bearn	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cordier-mines	cordier-mines	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
corp-des-part-prenants-de-la-fontaine-salee	corp-des-part-prenants-de-la-fontaine-salee	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
csme	csme	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-765801287	SOCIETE DE LA SALINE D EINVILLE	FR	765801287	\N	SAS, société par actions simplifiée	ETI	1965-01-01		54370	EINVILLE AU JARD	\N	\N	\N	\N
fr-793173675	SOCIETE D EXPLOITATION AURIFERES GUYANAISE (S.E.A.G)	FR	793173675	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-06-01	LES ECARTS DE LA DESIREE 	97351	MATOURY	\N	\N	\N	\N
fr-840965693	TUNGSTENE DU NARBONNAIS	FR	840965693	\N	SAS, société par actions simplifiée	\N	2018-06-27	1 Boulevard VICTOR 	75015	PARIS 15	\N	\N	\N	\N
fr-097180582	THERMES DE SALIES-DE-BEARN	FR	097180582	\N	SA à conseil d'administration (s.a.i.)	PME	1971-01-01	Cours DU JARDIN PUBLIC 	64270	SALIES DE BEARN	\N	\N	\N	\N
fr-601620347	Compagnie de produits chimiques et électrométallurgiques Pechiney	FR	601620347	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
garrot-chaillac	garrot-chaillac	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
imerys-ceramics-france	imerys-ceramics-france	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
novacarb	novacarb	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
saline-d-einville	saline-d-einville	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
salines-cerebos-et-de-bayonne-solvay	salines-cerebos-et-de-bayonne-solvay	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
sgz-france-sas	sgz-france-sas	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
societe-des-mines-d-orbagnoux	societe-des-mines-d-orbagnoux	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
societe-saliniere-de-provence	societe-saliniere-de-provence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
sodicapei	sodicapei	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
solvay-electrolyse-france	solvay-electrolyse-france	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
solvay-sa	solvay-sa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
variscan-mines	variscan-mines	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
be-0403091220	Solvay	BE	\N	0403091220	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-552001174	Progil Electrochimie	\N	552001174	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-400000001	Compagnie anonyme des salines de Dax	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-640000001	Sieurs François, Honoré, Franklin THORE, Victor MEYRAC, François DUBOURG oncle et François DUBOURG neveu, Claude, Laurent MAGNES	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-750000001	Denain-Anzin	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://data.bnf.fr/fr/11995786/denain-anzin/	\N	\N
fr-411129612	CHLORALP	FR	411129612	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	1997-01-21	Rue LAVOISIER 	38800	LE PONT DE CLAIX	\N	\N	\N	\N
fr-412431744	COMPAGNIE DES SALINS DU MIDI ET DES SALINES DE L'EST	FR	412431744	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	1997-06-05	92 Boulevard VICTOR HUGO 	92110	CLICHY	92115	\N	\N	\N
fr-422123984	COMPAGNIE MINIERE OR - COMINOR	FR	422123984	\N	SAS, société par actions simplifiée	PME	1999-03-05	19 Boulevard MALESHERBES 	75008	PARIS 8	\N	\N	\N	\N
fr-420610438	NOVAPEX	FR	420610438	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	1998-09-01	21 Chemin DE LA SAUVEGARDE 	69130	ECULLY	69134	\N	\N	\N
fr-490096591	IMERYS CERAMICS FRANCE	FR	490096591	\N	SAS, société par actions simplifiée	ETI	2006-05-10	43 Quai DE GRENELLE 	75015	PARIS 15	\N	\N	\N	\N
fr-528859846	VARISCAN MINES	FR	528859846	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2010-12-01	10 Rue LEONARD DE VINCI 	45100	ORLEANS	\N	\N	\N	\N
fr-538695040	KEM ONE	FR	538695040	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	2011-12-21	19 Rue JACQUELINE AURIOL 	69008	LYON 8EME	\N	\N	\N	\N
fr-572081131	DENAIN-ANZIN MINERAUX SA	FR	572081131	\N	SA à conseil d'administration (s.a.i.)	\N	1957-01-01	154 Rue DE L'UNIVERSITE 	75007	PARIS 7	\N	\N	\N	\N
fr-642058788	INDUSTRIE ANHYDRIDE CARBONIQUE	FR	642058788	\N	SA à directoire (s.a.i.)	\N	1900-01-01	84 Rue CHARLES MICHELS 	93200	SAINT DENIS	\N	\N	\N	\N
fr-642014526	RHODIA CHIMIE	FR	642014526	\N	SAS, société par actions simplifiée	GE	1979-01-01	25 Rue DE CLICHY 	75009	PARIS 9	\N	\N	\N	\N
fr-791652399	AMAZONE GOLD	FR	791652399	\N	SAS, société par actions simplifiée	PME	2013-02-01	21 Résidence ELVINA 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-792085169	NOUVEAU PROGRES GUYANE	FR	792085169	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-03-26	432 Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-792370082	SIAL	FR	792370082	\N	SAS, société par actions simplifiée	PME	2013-03-20	1530 C Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-832266175	SREDG	FR	832266175	\N	SAS, société par actions simplifiée	\N	2017-09-07	11 Boulevard DU MARONI 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-828089284	NORD GOLD GUIANA SAS	FR	828089284	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2017-01-02	1 Avenue GUSTAVE CHARLERY 	97300	CAYENNE	\N	\N	\N	\N
fr-832919286	TAKARI MINING	FR	832919286	\N	SAS, société par actions simplifiée	\N	2017-10-26	138 PARC D'ACTIVITE ECONOMIQUE 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-838049369	TOUK'OR	FR	838049369	\N	Société à responsabilité limitée (sans autre indication)	\N	2018-02-26	CARREFOUR DU LARIVOT 	97351	MATOURY	\N	\N	\N	\N
fr-824544134	AMAZONIE RESSOURCES MINIERES (A.R.M)	FR	824544134	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2016-12-16	17 Lotissement LES LOUSSAIS 	97351	MATOURY	\N	\N	\N	\N
fr-830984613	SOCIETE MINIERE AUROR (SMA)	FR	830984613	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2017-07-18	1630 F Route DE DEGRAD DES CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-827791120	CIE MINIERE PHOENIX	FR	827791120	\N	SAS, société par actions simplifiée	\N	2017-01-02	14 Rue DES EPICES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-828249896	COMPAGNIE MINIERE AURIFERE DE GUYANE (CMAG)	FR	828249896	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2017-02-22	113 ZONE INDUSTRIELLE DEGRAD CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-833619125	RESSOURCES REUNION SAS	FR	833619125	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2017-11-08	1247 Route DES PLAGES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-973000001	Société des mines d'or de Sinnamary	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-973000002	ASARCO Guyane française	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-973000003	Compagnie Minière de Roura	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-973000004	Société de développement de génie civil pour la Guyane française	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-973000005	Société anonyme des gisements d'or de Saint-Élie	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-973000006	Société d’Etudes et d’Exploitation Minière de l’Inini (SEEMI)	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
gb-224680	Celtic Resources Holdings Ltd,	GB	\N	224680	\N	\N	\N	Fetcham Park House, Lower Road, Fetcham	KT22 9HD	\N	Surrey	\N	\N	\N
pp-973000001	M. Saturnin Ponet	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000002	M. Jean-Michel Asselin	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000003	M. Abango Adam	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000004	M. Raymond Blanchard	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000005	M. René Cassous	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-424816403	COMPAGNIE MINIERE A.T.W.	FR	424816403	\N	Société à responsabilité limitée (sans autre indication)	PME	1999-09-18	9 Rue JOSEPH LEANDRE 	97313	SAINT GEORGES	\N	\N	\N	\N
fr-422052514	SOCIETE MINIERE YAOU DORLIN	FR	422052514	\N	SAS, société par actions simplifiée	PME	1999-01-01	ZONE INDUSTRIELLE DEGRAD CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-431479500	ATENOR	FR	431479500	\N	Société à responsabilité limitée (sans autre indication)	PME	2000-05-17	Avenue SAINT ANGE METHON 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-442715074	COMPAGNIE MINIERE ALOUKOU	FR	442715074	\N	Société à responsabilité limitée (sans autre indication)	PME	2004-01-01	26 Cité AMPIGNY 	97300	CAYENNE	\N	\N	\N	\N
fr-438934119	EQUINOXE RESSOURCES SARL	FR	438934119	\N	Société à responsabilité limitée (sans autre indication)	PME	2001-08-13	1 Rue THIERS 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-432993525	Monsieur Azad Yusuf	FR	432993525	\N	Entrepreneur individuel	PME	2001-02-01	42 R TOULOUSE LAUTREC 	97310	KOUROU	\N	\N	\N	\N
fr-433462660	AGELOR	FR	433462660	\N	Société à responsabilité limitée (sans autre indication)	PME	2000-10-24	69 B Avenue DE LA LIBERTE 	97300	CAYENNE	\N	\N	\N	\N
fr-440095750	CIE MINIERE JOTA	FR	440095750	\N	Société à responsabilité limitée (sans autre indication)	PME	2001-12-01	14 Rue DES EPICES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-445214208	Souffrans	FR	445214208	\N	Entrepreneur individuel	PME	2003-02-06	67 Avenue DU GENERAL DE GAULLE 	97310	KOUROU	\N	\N	\N	\N
fr-448085910	HG-GUYANE (HG)	FR	448085910	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-04-08	34 Rue JUSTIN CATAYEE 	97300	CAYENNE	\N	\N	\N	\N
fr-448575191	COMPAGNIE DE TRAVAUX AURIFERE (CTA)	FR	448575191	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-05-05	13 Rue DES ACACIAS 	97351	MATOURY	\N	\N	\N	\N
fr-479881302	SANDS RESSOURCES	FR	479881302	\N	Société à responsabilité limitée (sans autre indication)	PME	2005-01-01	Lotissement COLLERY 	97300	CAYENNE	\N	\N	\N	\N
fr-533547279	GUYANE MINES ET CARRIERES SARL (G.M. C. SARL)	FR	533547279	\N	Société à responsabilité limitée (sans autre indication)	PME	2011-07-01		97370	MARIPASOULA	\N	\N	\N	\N
fr-538269333	BONARETTO METAL INDUSTRIE (B.M.I)	FR	538269333	\N	SAS, société par actions simplifiée	PME	2011-12-28	24 Avenue PREFONTAINE 	97310	KOUROU	\N	\N	\N	\N
fr-537901332	PHENIX	FR	537901332	\N	SARL unipersonnelle 	PME	2011-11-15	1462 Route DES PLAGES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-750644700	SARL GUYANE GOLD MINE (GGM)	FR	750644700	\N	Société à responsabilité limitée (sans autre indication)	PME	2012-03-27	617 Lotissement COPAYA 1 	97351	MATOURY	\N	\N	\N	\N
fr-790530224	AMAZON'OR	FR	790530224	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-02-10	24 Avenue JEAN GALMOT 	97300	CAYENNE	\N	\N	\N	\N
fr-790856850	SUDMINE	FR	790856850	\N	SAS, société par actions simplifiée	PME	2013-01-30	2 Chemin DU CHATEAU 	45530	SEICHEBRIERES	\N	\N	\N	\N
fr-751617192	SECOM EURL	FR	751617192	\N	SARL unipersonnelle 	PME	2012-05-16	2697 Route DE BADUEL 	97300	CAYENNE	\N	\N	\N	\N
pp-973000006	M. Gabriel Devez	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000007	M. Sannemougon	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000008	Mme Sannemougon	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
pp-973000009	M. Emile de Saint-Quentin	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-793231762	ELDORADO (ELDORADO SARL)	FR	793231762	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-07-01	15 Rue ELIE ELFORT 	97313	SAINT GEORGES	\N	\N	\N	\N
fr-433653540	Figueiredo Rodrigues Renan	FR	433653540	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-448419267	Plat Stéphane	FR	448419267	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-798611158	Montanede Ruddy	FR	798611158	\N	Entrepreneur individuel	PME	2013-12-01	11 Lotissement LES OLIVETTES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
xx-97300a001	Aboeka Alphonse	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-830954806	BELIZON	FR	830954806	\N	SAS, société par actions simplifiée	\N	2017-06-01	21 Rue MEZIN GILDON 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-827687807	OB MINING SAS	FR	827687807	\N	SAS, société par actions simplifiée	\N	2017-02-02	CARREFOUR DU LARIVOT 	97351	MATOURY	\N	\N	\N	\N
fr-789382165	Thomas Lubel	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a017	Elfort Alexandre	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-453804957	Horth Gauthier	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-424816402	Sarl A.t.w	FR	424816402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a024	Sarl Smo	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-494162977	Soft Travaux	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a028	Toucouyou Edmond	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-369393590	Mydas	FR	369393590	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a012	Compagnie Minière Panda Sarl	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-499082642	Castoli Maseya	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a021	Rey Christian	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a004	Ancri Simon Georges	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a003	Adamietz Piotr	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-481743458	Tachi Bakka	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-482843794	Amba Moussoue Marcel	FR	482843794	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-491475000	Société Nakelor	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a009	Compagnie Aurifere Guyanaise - C.a.g. - Eurl	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a023	Sarl Aymarra 12 Mine	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-432100475	Roseno Dos Santos	FR	432100475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a019	Leal Cardoso Sergio	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-383789831	SOC MINIERE GUYANAISE (SOMIG)	FR	383789831	\N	SARL unipersonnelle 	PME	1991-10-01	98 Résidence BEAUREGARD 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-387752975	HADES MINING	FR	387752975	\N	Société à responsabilité limitée (sans autre indication)	\N	1992-06-01	Route BELIZON 	97311	ROURA	\N	\N	\N	\N
fr-428606339	NOUVELLE ALLIANCE	FR	428606339	\N	Entrepreneur individuel	PME	2000-01-14	12 Route DE TROU BIRAN 	97300	CAYENNE	\N	\N	\N	\N
fr-424505360	ENTREPRISE DOS SANTOS	FR	424505360	\N	Entrepreneur individuel	PME	1999-07-16	46 Allée DES CAMELIAS 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-421176744	MARONI EXPLOITATION MINIERE	FR	421176744	\N	Société à responsabilité limitée (sans autre indication)	\N	1998-12-11	Route DE BALATE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-421255274	PANDEL GUYABOIS	FR	421255274	\N	Entrepreneur individuel	PME	1998-12-14	Avenue STEPHANE BEREAU 	97360	MANA	\N	\N	\N	\N
fr-420282022	LEADER MINING	FR	420282022	\N	Entrepreneur individuel	\N	1998-10-01	CRIQUE LOUISE 	97312	SAINT ELIE	\N	\N	\N	\N
fr-441755113	STE MINIERE CINQ DEGRE (SM5)	FR	441755113	\N	Société à responsabilité limitée (sans autre indication)	PME	2002-04-03	5 Lotissement LES ALAMANDAS 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-435098512	NOUVELLE GENERATION	FR	435098512	\N	Société à responsabilité limitée (sans autre indication)	PME	2001-03-02	41 Rue DU LIEUTENANT BECKER 	97300	CAYENNE	\N	\N	\N	\N
fr-441394111	Prates Da Silva Antonio	FR	441394111	\N	Entrepreneur individuel	\N	2002-04-02	38 Avenue LOUIS PASTEUR 	97300	CAYENNE	\N	\N	\N	\N
fr-439975707	Cardoso Lucio Martins	FR	439975707	\N	Entrepreneur individuel	PME	2001-12-20	53 Lotissement ZONE ARTISANALE GALMOT 	97300	CAYENNE	\N	\N	\N	\N
fr-438296378	SOLAMINES	FR	438296378	\N	Entrepreneur individuel	\N	2001-07-07	438 COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-431931369	ROJAS COMMERCE	FR	431931369	\N	Entrepreneur individuel	PME	1999-02-01	9577 Avenue GASTON MONNERVILLE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-444749733	LA PIOCHE MINIERE	FR	444749733	\N	Société à responsabilité limitée (sans autre indication)	\N	2002-12-16	7 Rue DES AVOCATIERS 	97310	KOUROU	\N	\N	\N	\N
fr-450932777	Ribeiro Francisco	FR	450932777	\N	Entrepreneur individuel	PME	2003-11-17	18 Rue LEONARD DOMERGER 	97370	MARIPASOULA	\N	\N	\N	\N
fr-484334016	SOCIETE SAINT ELOI	FR	484334016	\N	Société à responsabilité limitée (sans autre indication)	PME	2005-09-15	1897 Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-488362955	NOUVELLE COMPAGNIE DES TRAVAUX AURIFERES (NCTA)	FR	488362955	\N	Société à responsabilité limitée (sans autre indication)	PME	2006-01-01	44 Rue PINOT 	97351	MATOURY	\N	\N	\N	\N
fr-480857036	TOMANY	FR	480857036	\N	Société à responsabilité limitée (sans autre indication)	PME	2005-02-03	2 Chemin MORNE COCO 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-517393807	SOCIETE MINIERE BONNE VOLONTE (SMBV)	FR	517393807	\N	Société à responsabilité limitée (sans autre indication)	PME	2009-10-08	18 Rue SIMAROUBA 	97351	MATOURY	\N	\N	\N	\N
fr-539937888	SOCIETE DE VALORISATION DU SOL AMAZONIA (S.V.S. AMAZONIA)	FR	539937888	\N	Société à responsabilité limitée (sans autre indication)	PME	2012-02-15	BOURG DE SAUL 	97314	SAUL	\N	\N	\N	\N
fr-750645095	METEOR	FR	750645095	\N	SARL unipersonnelle 	PME	2012-04-01	101 Rue DU LIEUTENANT BECKER 	97300	CAYENNE	\N	\N	\N	\N
fr-788811826	AMAZON METAL (A. M.)	FR	788811826	\N	Société à responsabilité limitée (sans autre indication)	PME	2012-12-01	1720 Chemin MORTHIUM 	97351	MATOURY	\N	\N	\N	\N
fr-789935145	SOCIETE MINIERE DE KOUROU (SMK)	FR	789935145	\N	Société à responsabilité limitée (sans autre indication)	PME	2012-12-11	Cité OULAPA TOPAZE 	97310	KOUROU	\N	\N	\N	\N
xx-97300a006	Cardoso Leal Sergio	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a002	Aboeka Thomas	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-792732679	PRODUCTION METAL JAUNE (P.M.J.)	FR	792732679	\N	SARL unipersonnelle 	PME	2013-04-16	13 Rue DES ACACIAS 	97351	MATOURY	\N	\N	\N	\N
fr-494688534	Sarl Codexma	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-792731622	SOCIETE MINIERE HAUT MANA (S.M.H.M.)	FR	792731622	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-04-16	41 Rue DU LIEUTENANT BECKER 	97300	CAYENNE	\N	\N	\N	\N
xx-97300a026	Tavares Raimundo	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-509853388	Fenix Sarl	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-840580328	Gold Shamz	FR	840580328	\N	Entrepreneur individuel	\N	2018-06-15	18 Rue KOUSET ALBINA 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-831101555	LA PEPITE D OR SAS	FR	831101555	\N	SAS, société par actions simplifiée	\N	2017-07-19	27 Rue DES PINS 	97310	KOUROU	\N	\N	\N	\N
fr-829591924	COMPAGNIE FRANCAISE DU MATARONI (CFM)	FR	829591924	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2017-03-01	21 Rue MEZIN GILDON 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-453077430	Joris Noéli	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a027	Tchakaichou Tiado	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a005	Asente Lesley Wilfried	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a010	Compagnie Des Anciens Placers	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a016	Egmann Marilea	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-824314710	PARIS	FR	824314710	\N	Société à responsabilité limitée (sans autre indication)	PME	2016-12-08	PONT MAGGI 	97300	CAYENNE	\N	\N	\N	\N
xx-97300a015	Djanie Rinaldo	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-839888138	ABOUNAMI GOLD	FR	839888138	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	\N	2018-05-28	1 Place ALEKE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-832854152	MINERATION IRACOUBO	FR	832854152	\N	Société à responsabilité limitée (sans autre indication)	\N	2017-10-01	36 Rue FRANTZ FANON ROCHE 	97310	KOUROU	\N	\N	\N	\N
xx-97300a025	Société P.g.r.	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a011	Compagnie Minière Bassin D'approuague	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a007	Cedia Jean-marc	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-528403173	Apanta Adam	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a013	De Sousa Trajano Jades Tadeu	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a014	Deroche Henri Michel	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a008	Chanel Joseph	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-533947149	Sarl Tektite	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a020	Phoenix Eurl	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a022	Rybarczyk Nicolas	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
xx-97300a018	Entreprise Minière Rodrigues	FR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-438934449	Equinoxe Ressources	FR	438934449	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-030000001	Casema	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-030000002	Garon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-030000005	Mercier	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-030000006	Sacab	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-030000008	SNC Octant	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fr-351483722	GEOMETHANE	FR	351483722	\N	Groupement d'intérêt économique (GIE) 	PME	1989-07-21	2 Rue DES MARTINETS 	92500	RUEIL MALMAISON	\N	\N	\N	\N
fr-390815280	Pierrez Eric	FR	390815280	\N	Entrepreneur individuel	\N	1993-04-05	CRIQUE SAPOKAYE 	97353	REGINA	\N	\N	\N	\N
fr-392425427	Abaadou Amoufini	FR	392425427	\N	Entrepreneur individuel	PME	1993-09-01	2 Rue NOUVEAU WACAPOU 	97370	MARIPASOULA	\N	\N	\N	\N
fr-420768319	Difou Casimir	FR	420768319	\N	Entrepreneur individuel	\N	1998-11-16	CRIQUE BAMBA 	97316	PAPAICHTON	\N	\N	\N	\N
fr-419847397	Pecher Charles	FR	419847397	\N	Entrepreneur individuel	\N	1998-08-03	Avenue STEPHANE BEREAU 	97360	MANA	\N	\N	\N	\N
fr-422070771	COMPAGNIE MINIERE HUILA	FR	422070771	\N	Société à responsabilité limitée (sans autre indication)	\N	1999-03-01	378 Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-428758254	SOC GUY DE GRANULATS (SGDG)	FR	428758254	\N	SAS, société par actions simplifiée	ETI	2000-01-01	Lotissement MARENGO 	97300	CAYENNE	\N	\N	\N	\N
fr-420672263	RTG	FR	420672263	\N	Entrepreneur individuel	\N	1998-11-01	CARREFOUR DE PETIT SAUT 	97310	KOUROU	\N	\N	\N	\N
fr-443197777	Cedia Jean Marc	FR	443197777	\N	Entrepreneur individuel	\N	2002-08-02	13 Cité N'ZILA 	97300	CAYENNE	\N	\N	\N	\N
fr-431802727	GRANDS PLACERS	FR	431802727	\N	Entrepreneur individuel	PME	2000-07-03	Route DE BOURDA 	97300	CAYENNE	\N	\N	\N	\N
fr-440786903	EG ACTIVITES	FR	440786903	\N	SARL unipersonnelle 	PME	2002-02-06	Route DE REMIRE 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-432161453	NANCIBO TRAVAUX	FR	432161453	\N	Société à responsabilité limitée (sans autre indication)	PME	2000-07-01	Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-449538974	AMAZONIA CHALETS	FR	449538974	\N	Entrepreneur individuel	\N	2000-02-01	Route DE L'EST 	97311	ROURA	\N	\N	\N	\N
fr-479443558	Bernardin René	FR	479443558	\N	Entrepreneur individuel	\N	2004-11-15	Avenue DIFOU 	97370	MARIPASOULA	\N	\N	\N	\N
fr-489615294	MEHDI OR	FR	489615294	\N	Société à responsabilité limitée (sans autre indication)	\N	2006-04-13	Lotissement ZEPHIR 	97300	CAYENNE	\N	\N	\N	\N
fr-529221749	TOTAL RAFFINAGE FRANCE	FR	529221749	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	2010-12-10	2 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-538720897	De Boisvilliers Rudy	FR	538720897	\N	Entrepreneur individuel	\N	2011-12-22	WAYABO MATITI 	97310	KOUROU	\N	\N	\N	\N
fr-790063911	SPENCE MINING COMPANY (SMC)	FR	790063911	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2012-11-07	Lotissement COLLERY II 	97300	CAYENNE	\N	\N	\N	\N
fr-790902332	Entreprise Miniere Rodrigues	FR	790902332	\N	Entrepreneur individuel	PME	2013-01-29	26 Cité CHATENAY 	97300	CAYENNE	\N	\N	\N	\N
fr-788214187	CIE EUROPEENNE TRANSPORTS ATLANTIQUE (CETRA)	FR	788214187	\N	SAS, société par actions simplifiée	ETI	1973-01-01	Avenue DE LA GARE 	44480	DONGES	\N	\N	\N	\N
fr-793399551	SAS ALTA ROCCA	FR	793399551	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2013-06-03	13 Lotissement CALIMBE II 	97300	CAYENNE	97346	\N	\N	\N
fr-857804660	SOCIETE DES DRAGAGE D'ANCENIS	FR	857804660	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	1957-01-01	Route D ANCENIS 	44670	JUIGNE DES MOUTIERS	\N	\N	\N	\N
fr-311933568	DEFTA AIRAX	FR	311933568	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	1978-01-01	2 Rue BOLIVERT 	25320	CHEMAUDIN ET VAUX	\N	\N	\N	\N
fr-304350887	SA GEOVEXIN	FR	304350887	\N	SA à conseil d'administration (s.a.i.)	PME	1900-01-01	2 Rue DES MARTINETS 	92500	RUEIL MALMAISON	92569	\N	\N	\N
fr-324558154	Barbosa José Grégoire	FR	324558154	\N	Entrepreneur individuel	PME	1982-02-12	245 COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-302556832	ELF ANTAR FRANCE	FR	302556832	\N	SA à conseil d'administration (s.a.i.)	\N	1985-05-17	24 Cours MICHELET 	92800	PUTEAUX	\N	\N	\N	\N
fr-310380811	GARROT-CHAILLAC	FR	310380811	\N	SAS, société par actions simplifiée	PME	1984-07-01	145 Impasse JOHN LOCKE 	34470	PEROLS	34473	\N	\N	\N
fr-304516420	DRAGAGE TRANSPORTS ET TRAVAUX MARITIMES (DTM)	FR	304516420	\N	SAS, société par actions simplifiée	PME	1975-01-01	36 Rue SAINT CLAUDE 	17000	LA ROCHELLE	\N	\N	\N	\N
fr-319712873	LUNDIN ILE DE FRANCE	FR	319712873	\N	SA à conseil d'administration (s.a.i.)	\N	1980-09-01	MACLAUNAY 	51210	MONTMIRAIL	\N	\N	\N	\N
fr-318992690	SOCIETE DE TRANSPORTS FLUVIO MARITIMES DE L'OUEST (STFMO)	FR	318992690	\N	SA à conseil d'administration (s.a.i.)	PME	1980-05-29	87 Rue LOUIS PASTEUR 	44550	MONTOIR DE BRETAGNE	\N	\N	\N	\N
fr-315014035	DEPARTEMENT D'OUTRE MER IMPORT EXPORT (DOMIEX)	FR	315014035	\N	Société à responsabilité limitée (sans autre indication)	PME	1979-01-01	14 Rue DES EPICES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-303195192	CIE MINIERE DE BOULANGER	FR	303195192	\N	SA à conseil d'administration (s.a.i.)	PME	1974-01-01	1897 Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-296400427	CORPORATION DE LA FONTAINE SALEE	FR	296400427	\N	Association syndicale autorisée 	\N	1991-01-01	Place DE LA TROMPE 	64270	SALIES DE BEARN	\N	\N	\N	\N
fr-304991342	Constable José	FR	304991342	\N	Entrepreneur individuel	\N	1995-11-07	CRIQUE GRAND VEVONY 	97353	REGINA	\N	\N	\N	\N
fr-323097899	SOCIETE DES MINES DU BOURNEIX	FR	323097899	\N	Société en nom collectif 	\N	1981-11-01	33 Rue LA FAYETTE 	75009	PARIS 9	\N	\N	\N	\N
fr-314989930	LES SABLIERS REUNIS DE LA LOIRE (SARELO)	FR	314989930	\N	Société à responsabilité limitée (sans autre indication)	ETI	1979-01-01	Route D'ANCENIS 	44670	JUIGNE DES MOUTIERS	\N	\N	\N	\N
fr-303192959	TANON ET CIE	FR	303192959	\N	SA à conseil d'administration (s.a.i.)	PME	1974-01-01	Route DE BADUEL 	97300	CAYENNE	\N	\N	\N	\N
fr-303697924	SOCIETE DES MINES DE JOUAC	FR	303697924	\N	Société en nom collectif 	GE	1983-05-24	1 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-324377068	NOUVEAU PLACER	FR	324377068	\N	Entrepreneur individuel	\N	1982-04-06	CRIQUE SABLE 	97314	SAUL	\N	\N	\N	\N
fr-302420658	SOCIETE D'ENTREPRISES, CARRIERES ET MINES DE L'ESTEREL S.E.C.M.E. (SECME)	FR	302420658	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	1975-04-01	60 Avenue CHARLES DE GAULLE 	92200	NEUILLY SUR SEINE	\N	\N	\N	\N
fr-309024685	GRAVES DE MER (GDM)	FR	309024685	\N	Société en nom collectif 	GE	1977-01-01	ZONE INDUSTRIELLE 	76370	ROUXMESNIL BOUTEILLES	\N	\N	\N	\N
fr-319632790	ARKEMA FRANCE	FR	319632790	\N	SA à conseil d'administration (s.a.i.)	GE	1980-01-01	420 Rue ESTIENNE D ORVES 	92700	COLOMBES	\N	\N	\N	\N
fr-352544571	YESEMBA CONSTRUCTION	FR	352544571	\N	Entrepreneur individuel	PME	1989-11-30	7781 Avenue GASTON MONERVILLE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-338878242	NIZEROLLES SA	FR	338878242	\N	SA à conseil d'administration (s.a.i.)	ETI	1986-09-24	43 Quai DE GRENELLE 	75015	PARIS 15	\N	\N	\N	\N
fr-347619165	SABLIMARIS	FR	347619165	\N	SAS, société par actions simplifiée	PME	1988-07-01	36 Rue SAINT CLAUDE 	17000	LA ROCHELLE	\N	\N	\N	\N
fr-330013566	BARYTINE DE HAINAUT	FR	330013566	\N	SA à conseil d'administration (s.a.i.)	\N	1984-06-13	17 Boulevard SARRAIL 	34000	MONTPELLIER	\N	\N	\N	\N
fr-347720997	HADSON FRANCE SNC	FR	347720997	\N	Société en nom collectif 	\N	1988-08-03	8 Rue DE TEMARA 	78100	SAINT GERMAIN EN LAYE	\N	\N	\N	\N
fr-339718967	SOCIETE D'INDUSTRIALISATION ET DE COMMERCIALISATION DE L'APEI DE FRONTIGNAN LA PEYRADE ( SODICAPEI ) (SODICAPEI)	FR	339718967	\N	SAS, société par actions simplifiée	ETI	1986-12-12	1 MINE DES USCLADES 1 	34560	VILLEVEYRAC	\N	\N	\N	\N
fr-331477158	AUPLATA	FR	331477158	\N	SA à conseil d'administration (s.a.i.)	PME	1984-12-01	ZONE INDUSTRIELLE DEGRAD CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-333707008	Villeroy Joël	FR	333707008	\N	Entrepreneur individuel	PME	1985-10-07	1 Rue DU DOC ETIENNE GIPPET 	97300	CAYENNE	\N	\N	\N	\N
fr-348021619	SOC ATLANTIQUE CHARENTES AGREGATS (SACA)	FR	348021619	\N	SA à conseil d'administration (s.a.i.)	\N	1988-06-01	3 Rue PAUL MORCHAIN 	17300	ROCHEFORT	\N	\N	\N	\N
fr-344778626	SARL COPERMER	FR	344778626	\N	Société à responsabilité limitée (sans autre indication)	PME	1988-04-15	PORT DE COMMERCE 	22740	LEZARDRIEUX	\N	\N	\N	\N
fr-368500773	LES GRAVES DE L'ESTUAIRE	FR	368500773	\N	SAS, société par actions simplifiée	PME	1968-01-01	Route DU PORT PETROLIER 	76600	LE HAVRE	\N	\N	\N	\N
fr-420007692	GIE MANCHE EST (GME)	FR	420007692	\N	Groupement d'intérêt économique (GIE) 	GE	1998-09-01	ZI DE LA ZONE BLEUE 	76370	ROUXMESNIL BOUTEILLES	\N	\N	\N	\N
fr-451259790	GRANULATS DE LA MANCHE ORIENTALE (GMO)	FR	451259790	\N	Groupement d'intérêt économique (GIE) 	PME	2003-11-01	251 Avenue DU BOIS 	59130	LAMBERSART	\N	\N	\N	\N
fr-479607335	STATION ANTILLAISE DE GRANULATS (SAG)	FR	479607335	\N	SAS, société par actions simplifiée	PME	2004-09-01	18 Boulevard DE LA POINTE JARRY 	97122	BAIE MAHAULT	\N	\N	\N	\N
fr-498658004	DEME BUILDING MATERIALS NV	BE	498658004	\N	Société étrangère non immatriculée au RCS 	PME	2005-06-30	SCHELDEDIJK 30 	\N	2070 ZWIJNDRECHT	\N	\N	\N	\N
fr-524468444	GRANULATS DE LA FACADE AQUITAINE (GFA)	FR	524468444	\N	Groupement d'intérêt économique (GIE) 	PME	2010-03-15	20 Rue THIERRY SABINE 	33700	MERIGNAC	\N	\N	\N	\N
fr-539702506	GROUPEMENT D'INTERET ECONOMIQUE LOIRE GRAND LARGE	FR	539702506	\N	Autre personne morale de droit privé 	PME	2012-01-26	3 Rue DU CHARRON 	44800	SAINT HERBLAIN	\N	\N	\N	\N
fr-537433187	CARRIERES ET MATERIAUX DU GRAND OUEST	FR	537433187	\N	SAS, société par actions simplifiée	GE	2011-10-04	2 Rue GASPARD CORIOLIS 	44300	NANTES	\N	\N	\N	\N
fr-623820651	GAYAM	FR	623820651	\N	SAS, société par actions simplifiée	PME	1962-01-01	15 Avenue PIERRE MENDES FRANCE 	14000	CAEN	\N	\N	\N	\N
fr-352500748	PROMO SON	FR	352500748	\N	Entrepreneur individuel	PME	1989-10-23	Route DE MONTABO 	97300	CAYENNE	\N	\N	\N	\N
fr-331129601	CLYDE EXPRO PLC	GB	331129601	\N	Société commerciale étrangère immatriculée au RCS	\N	1973-03-08	CODDINGTON LEDBURY 	\N	HEREFORDSHIRE	\N	\N	\N	\N
fr-357200054	ROQUETTE FRERES	FR	357200054	\N	SA à conseil d'administration (s.a.i.)	GE	1957-01-01	1 Rue DE LA HAUTE LOGE 	62136	LESTREM	\N	\N	\N	\N
fr-390919082	EURO RESSOURCES	FR	390919082	\N	SA à conseil d'administration (s.a.i.)	PME	1993-05-01	23 Rue DU ROULE 	75001	PARIS 1	\N	\N	\N	\N
fr-381224393	GRIS NEZ	FR	381224393	\N	Groupement d'intérêt économique (GIE) 	PME	1991-03-01	Rue DU 11 NOVEMBRE 1918 	76400	FECAMP	\N	\N	\N	\N
fr-376880183	SABLIERS DE L'ODET	FR	376880183	\N	SAS, société par actions simplifiée	PME	1968-01-01	PORT DU CORNIGUEL 	29000	QUIMPER	\N	\N	\N	\N
fr-391774650	INCOL IMPORTATION	FR	391774650	\N	Entrepreneur individuel	PME	1993-06-11	21 Allée MAURICE AQUIOUPOU 	97300	CAYENNE	\N	\N	\N	\N
fr-390455814	COMPAGNIE ARMORICAINE NAVIGATION (CAN)	FR	390455814	\N	SA à conseil d'administration (s.a.i.)	ETI	1993-04-05	ZONE INDUSTRIELLE 	22260	QUEMPER GUEZENNEC	\N	\N	\N	\N
fr-398522037	SOC DES MINES DE ST ELIE	FR	398522037	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	1994-09-29	LE BOURG 	97312	SAINT ELIE	\N	\N	\N	\N
fr-395042054	CARR PRODUCTION FRANCE	FR	395042054	\N	Société à responsabilité limitée (sans autre indication)	\N	1994-06-20	95 Rue LA BOETIE 	75008	PARIS 8	\N	\N	\N	\N
fr-394926877	MATERIAUX BAIE DE SEINE (MBS)	FR	394926877	\N	SAS, société par actions simplifiée	GE	1994-04-06	PARC DES MARAIS 	76700	GONFREVILLE L'ORCHER	\N	\N	\N	\N
fr-399380302	COMPAGNIE MINIERE DE SIKINI (CMS)	FR	399380302	\N	Société à responsabilité limitée (sans autre indication)	PME	1995-01-01	Lieu-dit COUNAMARY 	97353	REGINA	\N	\N	\N	\N
fr-402174957	AU PETIT COIN D OR	FR	402174957	\N	Entrepreneur individuel	\N	1995-09-12	10 Avenue LEONARD DOMERGER 	97370	MARIPASOULA	\N	\N	\N	\N
fr-402207153	IAMGOLD FRANCE	FR	402207153	\N	SAS, société par actions simplifiée	PME	1995-09-06	1150 A Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-402960397	BUTAGAZ	FR	402960397	\N	SAS, société par actions simplifiée	ETI	1995-11-17	47 Rue RASPAIL 	92300	LEVALLOIS PERRET	\N	\N	\N	\N
fr-404307910	Amayota Gérard	FR	404307910	\N	Entrepreneur individuel	PME	1996-04-02	10 Allée JEAN PAUL SARTRE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-410063283	Vola Kapiel	FR	410063283	\N	Entrepreneur individuel	\N	1996-12-13	16 Avenue ROSILVINE - L'ANSE 	97310	KOUROU	\N	\N	\N	\N
fr-411554595	OELWEG	FR	411554595	\N	Société à responsabilité limitée (sans autre indication)	PME	1997-04-01	50 Rue DU MIDI 	94300	VINCENNES	\N	\N	\N	\N
fr-417549029	SOCIETE DE MAINTENANCE PETROLIERE SAS (SMP)	FR	417549029	\N	SAS, société par actions simplifiée	ETI	1998-01-16	ZA DE PENSE FOLIE 	45220	CHATEAU RENARD	\N	\N	\N	\N
fr-414885863	GRANULATS OUEST (GO)	FR	414885863	\N	SAS, société par actions simplifiée	GE	1997-12-17	3 Rue DU CHARRON 	44800	SAINT HERBLAIN	44804	\N	\N	\N
fr-428162135	GIE LE ST NICOLAS	FR	428162135	\N	Groupement d'intérêt économique (GIE) 	GE	1999-11-09		27700	LES TROIS LACS	\N	\N	\N	\N
fr-487650632	STORENGY FRANCE	FR	487650632	\N	SA à conseil d'administration (s.a.i.)	GE	2005-12-06	12 Rue RAOUL NORDLING 	92270	BOIS COLOMBES	\N	\N	\N	\N
fr-490163102	ERMINA	FR	490163102	\N	SARL unipersonnelle 	PME	2006-02-28	1530 C Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-491830576	COMPAGNIE D EXPLOITATION MINIERE D AMERIQUE DU SUD (CEMAS) (CEMAS)	FR	491830576	\N	SARL unipersonnelle 	PME	2006-10-01	Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-492514955	MYDAS	FR	492514955	\N	Société à responsabilité limitée (sans autre indication)	\N	2008-03-06	103 Rue CHRISTOPHE COLOMB 	97300	CAYENNE	\N	\N	\N	\N
fr-492428552	Deroche Joséphine	FR	492428552	\N	Entrepreneur individuel	PME	2006-11-06	296 Route DE L'AEROPORT 	97370	MARIPASOULA	\N	\N	\N	\N
fr-493318794	BRIDGEOIL	FR	493318794	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2006-12-15	49 Rue ARSENE ET JEAN LAMBERT 	86100	CHATELLERAULT	\N	\N	\N	\N
fr-500460407	POROS	FR	500460407	\N	SAS, société par actions simplifiée	PME	2007-10-08	7 Rue DE LA LIBERATION 	95880	ENGHIEN LES BAINS	\N	\N	\N	\N
fr-527920391	INDORAMA OIL SAS	FR	527920391	\N	SAS, société par actions simplifiée	PME	2010-10-19	1 Rue RENNEQUIN 	75017	PARIS 17	\N	\N	\N	\N
fr-508738879	CELTIQUE ENERGIE PETROLEUM	FR	508738879	\N	Société à responsabilité limitée (sans autre indication)	\N	2008-10-01	12 Rue PERNELLE 	75004	PARIS 4	\N	\N	\N	\N
fr-519753370	SAS TRAJAN	FR	519753370	\N	SAS, société par actions simplifiée	PME	2010-01-22	2697 Route DE BADUEL 	97300	CAYENNE	\N	\N	\N	\N
fr-518087630	EQUATOR	FR	518087630	\N	Société à responsabilité limitée (sans autre indication)	PME	2009-11-10	Chemin DE LA LEVEE 	97351	MATOURY	\N	\N	\N	\N
fr-518090832	MIKAGOLD	FR	518090832	\N	Société à responsabilité limitée (sans autre indication)	PME	2009-11-10	101 Rue DU LIEUTENANT BECKER 	97300	CAYENNE	\N	\N	\N	\N
fr-712025048	COMPAGNIE INDUSTRIELLE ET MINIERE (CIM)	FR	712025048	\N	SAS, société par actions simplifiée	GE	1999-12-01	25 Rue DE CLICHY 	75009	PARIS 9	\N	\N	\N	\N
fr-791706666	MINIERE DE GUYANE	FR	791706666	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2013-03-01	1 Avenue GUSTAVE CHARLERY 	97300	CAYENNE	\N	\N	\N	\N
fr-789083805	COMPAGNIE MINIERE DE L'ININI (C.M.I)	FR	789083805	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2012-10-30	39 Avenue SAINT ANGE METHON 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-794389387	MAISON GUYANE REHABILITATION ET CONSTRUCTION	FR	794389387	\N	SARL unipersonnelle 	PME	2013-07-19	3 Rue BOULANGERE 	97351	MATOURY	\N	\N	\N	\N
fr-794312231	SOCIETE MINIERE DE L OUEST (S.M.O)	FR	794312231	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-08-01	Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-794743104	EURL C A A	FR	794743104	\N	SARL unipersonnelle 	PME	2013-07-12	1630 Route DE DEGRAD DES CANNES RN3 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-804686582	SGZ FRANCE SAS	FR	804686582	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2014-09-04	18 Rue JEAN MERMOZ 	75008	PARIS 8	\N	\N	\N	\N
fr-804070423	GUYANE CORPORATION MINIERE	FR	804070423	\N	SARL unipersonnelle 	\N	2014-07-25	430 B Lotissement SAMUEL 	97351	MATOURY	\N	\N	\N	\N
fr-812141125	APS MULTI -SERVICES (CMHM)	FR	812141125	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2015-06-11	103 Rue ADAYA PATRICK 	97370	MARIPASOULA	\N	\N	\N	\N
fr-807407630	GROUPE AL MACTOUM	FR	807407630	\N	SAS, société par actions simplifiée	PME	2014-10-23	18 Rue KOUSET ALBINA 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-811383462	SEMIR (SOCIETE EXPLOITATION MINIERE REUNIF)	FR	811383462	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-05-06	18 Boulevard NELSON MADIBA MANDELA 	97300	CAYENNE	\N	\N	\N	\N
fr-329858427	SOC D'EXPLOITATION DU SITE CHANGEMENT (SESIC)	FR	329858427	\N	Société à responsabilité limitée (sans autre indication)	\N	1984-03-15	Lieu-dit SITE CHANGEMENT 	97311	ROURA	\N	\N	\N	\N
fr-333517530	BIJOUTERIE REUNIF	FR	333517530	\N	Entrepreneur individuel	PME	1986-01-01	Route DE L'EST 	97356	MONTSINERY TONNEGRANDE	\N	\N	\N	\N
fr-379555568	PERNAUT Christian	FR	379555568	\N	Entrepreneur individuel	PME	1990-09-28	Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-377721576	Difou Mola	FR	377721576	\N	Entrepreneur individuel	PME	1990-04-04	Lieu-dit ABOUNASOUNGA 	97340	GRAND SANTI	\N	\N	\N	\N
fr-391808763	LES QUATRE   T   D'OR	FR	391808763	\N	Société à responsabilité limitée (sans autre indication)	PME	1993-07-01	CRIQUE TI LEBLOND 	97315	SINNAMARY	\N	\N	\N	\N
fr-391195997	COMPAGNIE D'EXPLOITATION MINIERE DE LA CRIQUE IPOUCIN (CEMCI)	FR	391195997	\N	Société à responsabilité limitée (sans autre indication)	PME	1993-01-01	98 Résidence BEAUREGARD 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-384486312	CIE MINIERE CHANTAL	FR	384486312	\N	Société à responsabilité limitée (sans autre indication)	\N	1992-01-01	18 Lotissement COLLERY 	97300	CAYENNE	\N	\N	\N	\N
fr-388522161	RAMBAUD CARRIERES	FR	388522161	\N	SAS, société par actions simplifiée	PME	1992-04-01	35 ROUTE DE THOUARS 	79200	CHATILLON SUR THOUET	\N	\N	\N	\N
fr-401862297	SOCIETE QUEMENEUR	FR	401862297	\N	Société à responsabilité limitée (sans autre indication)	PME	1995-04-01	17 Rue DES EMBRUNS 	29810	LAMPAUL PLOUARZEL	\N	\N	\N	\N
fr-398827451	Barbosa Rodrigues Juranildo Ei	FR	398827451	\N	Entrepreneur individuel	PME	1994-11-05	245 COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-400716536	GEOTHERMIE BOUILLANTE	FR	400716536	\N	SA à conseil d'administration (s.a.i.)	PME	1995-03-20	LE BOURG 	97125	BOUILLANTE	\N	\N	\N	\N
fr-400790614	SARL SOMIRAL	FR	400790614	\N	Société à responsabilité limitée (sans autre indication)	PME	1994-11-15	Résidence LES MOMBINS 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-400446837	Adam Abango	FR	400446837	\N	Entrepreneur individuel	PME	1995-03-09	11 Boulevard DU MARONI 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-392068102	GEOPETROL	FR	392068102	\N	SA à conseil d'administration (s.a.i.)	PME	1993-07-15	41 Boulevard DES CAPUCINES 	75002	PARIS 2	\N	\N	\N	\N
fr-400872826	Narece Alain	FR	400872826	\N	Entrepreneur individuel	PME	1995-05-02	9 Rue JOSEPH LEANDRE 	97313	SAINT GEORGES	\N	\N	\N	\N
fr-415281138	SOC MINIERE PLACER AOMA	FR	415281138	\N	Société à responsabilité limitée (sans autre indication)	\N	1998-01-02	5 Avenue GASTON MONNERVILLE 	97300	CAYENNE	\N	\N	\N	\N
fr-411178866	EXPLOITATION MINIERE DE LA CHALEUR	FR	411178866	\N	Groupement européen d'intérêt économique (GEIE) 	GE	1997-01-02	Route DE SOULTZ 	67250	KUTZENHAUSEN	\N	\N	\N	\N
fr-408589158	Pedrosa Colares José Adriano	FR	408589158	\N	Entrepreneur individuel	\N	1996-08-24	CRIQUE ALICORNE 	97314	SAUL	\N	\N	\N	\N
fr-408483675	PRIMAGAZ LAVERA	FR	408483675	\N	SAS, société par actions simplifiée	ETI	1996-07-30	22 Place DES VOSGES 	92400	COURBEVOIE	92979	\N	\N	\N
fr-408586550	GRANULATS MARINS DE NORMANDIE (GMN)	FR	408586550	\N	Groupement d'intérêt économique (GIE) 	PME	1996-06-09	Route DE L ESTUAIRE 	76600	LE HAVRE	\N	\N	\N	\N
fr-411102635	Passedat Bruno	FR	411102635	\N	Entrepreneur individuel	\N	1997-01-20	Lieu-dit FOURQUET ET RIELS 	82240	PUYLAROQUE	\N	\N	\N	\N
fr-424882066	Amayota Denis	FR	424882066	\N	Entrepreneur individuel	\N	1999-10-28	15 Cité PASCALINE 	97300	CAYENNE	\N	\N	\N	\N
fr-448669838	MARONI PHOTO ADMINISTRATIFS	FR	448669838	\N	Entrepreneur individuel	PME	2003-05-26	3 Avenue DES EMERILLONS 	97370	MARIPASOULA	\N	\N	\N	\N
fr-448591529	SOCIETE AURIFERE GUYANAISE DES MINES (SAG)	FR	448591529	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-05-05	461 Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-445248545	Cartier Gilles	FR	445248545	\N	Entrepreneur individuel	PME	2003-01-01	8 Rue ZAZI INGLANTIN 	97310	KOUROU	\N	\N	\N	\N
fr-511097669	TOTAL GAS SHALE EUROPE	FR	511097669	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	2009-03-02	2 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-509221842	TOTAL E&P GUYANE FRANCAISE	FR	509221842	\N	SAS, société par actions simplifiée	GE	2008-11-21	2 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-788183382	LES SABLIERES DE L ATLANTIQUE	FR	788183382	\N	SA à conseil d'administration (s.a.i.)	PME	1972-01-01	87 Rue LOUIS PASTEUR 	44550	MONTOIR DE BRETAGNE	\N	\N	\N	\N
fr-789740578	COMPAGNIE MINIERE DE SAINT LAURENT DU MARONI (C.M.S.L.M)	FR	789740578	\N	Société à responsabilité limitée (sans autre indication)	PME	2012-12-01	2 Rue DU BAC 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-789280971	GROUPEMENT D'INTERET ECONOMIQUE SUD ALTANTIQUE	FR	789280971	\N	Groupement d'intérêt économique (GIE) 	PME	2012-10-25	29 Rue DU DUC 	17000	LA ROCHELLE	\N	\N	\N	\N
fr-790368518	SOCIETE AURIFERE DE GUYANE (SAG)	FR	790368518	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-01-07	53 Lotissement ZONE ARTISANALE GALMOT 	97300	CAYENNE	\N	\N	\N	\N
fr-792651259	COMPAGNIE MINIERE HORTH (CMH)	FR	792651259	\N	SAS, société par actions simplifiée	PME	2013-04-03	49 Rue LALLOUETTE 	97300	CAYENNE	\N	\N	\N	\N
fr-792884827	GOLD'OR	FR	792884827	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-05-02	CARREFOUR DU LARIVOT 	97351	MATOURY	\N	\N	\N	\N
fr-793697558	Laguerre Jimmy	FR	793697558	\N	Entrepreneur individuel	PME	2013-06-01	18 Lotissement LES CEDRES 	97300	CAYENNE	\N	\N	\N	\N
fr-813079365	MINES 3C SARL (M3C SARL)	FR	813079365	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-08-01	Rue DU CAURALE SOLEIL 	97300	CAYENNE	\N	\N	\N	\N
fr-811636448	AU FORAGES	FR	811636448	\N	SAS, société par actions simplifiée	PME	2015-04-10	Lotissement COLLERY II 	97300	CAYENNE	\N	\N	\N	\N
fr-810406157	OROGUY	FR	810406157	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2015-02-01	1897 Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-803949650	TRANSPORTS VILLETTE	FR	803949650	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2014-09-01	Lotissement VILLAGE SABRINA 	97351	MATOURY	\N	\N	\N	\N
fr-803975135	CORDIER MINES	FR	803975135	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2014-08-01	6 Rue MAURICE HUREL 	31500	TOULOUSE	\N	\N	\N	\N
fr-811348200	SOCIETE MINIERE TORRES	FR	811348200	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-03-23	PK 6 DEGRAD SARAMACA 	97310	KOUROU	\N	\N	\N	\N
fr-811999044	EXALL 79	FR	811999044	\N	SAS, société par actions simplifiée	PME	2015-06-01	5 Rue DE L'ARTISANAT 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-822591715	CUB OR GUYANE (C.O.G.)	FR	822591715	\N	SAS, société par actions simplifiée	PME	2016-07-20	Résidence BEAUREGARD 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-821136710	SASU SOFERRO (SOFERRO)	FR	821136710	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2016-06-27	145 Avenue FELIX EBOUE 	97351	MATOURY	\N	\N	\N	\N
fr-339146284	COMPAGNIE MINIERE MONTAGNE D'OR (SOTRAPMAG)	FR	339146284	\N	SAS, société par actions simplifiée	PME	1986-08-01	1 Rue DE L'INDIGOTERIE 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-388249229	SA TERRE	FR	388249229	\N	SAS, société par actions simplifiée	PME	1992-07-15	14 Route DE BEAUGENCY 	41220	LA FERTE SAINT CYR	\N	\N	\N	\N
fr-382696276	COPAREX	FR	382696276	\N	SA à conseil d'administration (s.a.i.)	\N	1991-07-15	135 Rue JEAN JACQUES ROUSSEAU 	92130	ISSY LES MOULINEAUX	\N	\N	\N	\N
fr-381972439	GAZONOR	FR	381972439	\N	SAS, société par actions simplifiée	PME	1991-04-19	ZAL FOSSE 7 	62210	AVION	\N	\N	\N	\N
fr-391727450	VERMILION MORAINE	FR	391727450	\N	SAS, société par actions simplifiée	ETI	1993-06-24	1762 Route DE PONTENX 	40160	PARENTIS EN BORN	\N	\N	\N	\N
fr-381151760	COMPAGNIE MINIERE ESPERANCE	FR	381151760	\N	SAS, société par actions simplifiée	PME	1991-01-01	LE BOURG 	97317	APATOU	\N	\N	\N	\N
fr-382461325	NEWMONT LASOURCE	FR	382461325	\N	SAS, société par actions simplifiée	PME	1991-05-28	62 Boulevard PEREIRE 	75017	PARIS 17	\N	\N	\N	\N
fr-395190473	IAMGOLD GUYANE	FR	395190473	\N	SAS, société par actions simplifiée	PME	1994-05-26	1150 A Route DE MONTJOLY 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-442472197	CIE MINIERE DE L'OUEST GUYANAIS (CMOG)	FR	442472197	\N	Société à responsabilité limitée (sans autre indication)	\N	2002-06-04	Résidence MARYFLOR 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-438726655	WAPA	FR	438726655	\N	Entrepreneur individuel	PME	2001-07-30	49 Rue LALLOUETTE 	97300	CAYENNE	\N	\N	\N	\N
fr-450039466	SOCIETE GUYANAISE DES MINES (SOGUMINES)	FR	450039466	\N	Société à responsabilité limitée (sans autre indication)	\N	2003-09-16	3 Rue JEAN PAUL SARTRE 	97310	KOUROU	\N	\N	\N	\N
fr-449921758	Garcon Jean	FR	449921758	\N	Entrepreneur individuel	\N	2003-09-25	LE BOURG 	97370	MARIPASOULA	\N	\N	\N	\N
fr-452092711	METAL GOLD RESSOURCES (M G R)	FR	452092711	\N	Société à responsabilité limitée (sans autre indication)	PME	2004-02-14	52 Lotissement ZONE ARTISANALE GALMOT 	97300	CAYENNE	\N	\N	\N	\N
fr-448299487	COMPAGNIE MINIERE COOREI	FR	448299487	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-03-07	LE BOURG 	97312	SAINT ELIE	\N	\N	\N	\N
fr-478328743	SOCIETE L OR D OYAPOQUE (GOLDOYA)	FR	478328743	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2004-09-01	13 Rue DES ACACIAS 	97351	MATOURY	\N	\N	\N	\N
fr-481446052	UNION MINIERE DE SAUL	FR	481446052	\N	Société à responsabilité limitée (sans autre indication)	PME	2005-03-10	Route NATIONALE 2 	97351	MATOURY	\N	\N	\N	\N
fr-477515381	SOUTH AMERICA GOLD MINING (SAGM)	FR	477515381	\N	Société à responsabilité limitée (sans autre indication)	PME	2004-10-01	2 Rue LOUIS MOLE 	97300	CAYENNE	\N	\N	\N	\N
fr-484376330	PETROMANAS ENERGY (FRANCE) S.A.S.	FR	484376330	\N	SAS, société par actions simplifiée	PME	2005-09-30	260 Rue DU JARDIN PUBLIC 	33300	BORDEAUX	\N	\N	\N	\N
fr-492942586	EURL SEMALY	FR	492942586	\N	SARL unipersonnelle 	PME	2006-11-21	190 COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-500243290	DIAMOCO ENERGY	FR	500243290	\N	SAS, société par actions simplifiée	GE	2007-10-01	ZA LES BERGES DU RHINS 1 	42120	PARIGNY	\N	\N	\N	\N
fr-489179820	Marques Da Cruz Antonio	FR	489179820	\N	Entrepreneur individuel	PME	2006-03-20	190 COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-505332510	MINEA	FR	505332510	\N	Société à responsabilité limitée (sans autre indication)	PME	2008-08-01	132 Résidence BEAUREGARD 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-497818526	ROBERT EDA	FR	497818526	\N	Entrepreneur individuel	PME	2007-05-02	PROMENADE LAWA 	97370	MARIPASOULA	\N	\N	\N	\N
fr-528956162	PRO EXPERTS 4	FR	528956162	\N	Société à responsabilité limitée (sans autre indication)	PME	2011-01-12	7 Rue DES AVOCATIERS 	97310	KOUROU	\N	\N	\N	\N
fr-530864792	HARDMAN PETROLEUM FRANCE SAS	FR	530864792	\N	Société étrangère non immatriculée au RCS 	PME	2011-02-21	Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-528362304	GRANULATS NORD GASCOGNE (GNG)	FR	528362304	\N	Groupement d'intérêt économique (GIE) 	PME	2010-09-17	2 Rue DU VERSEAU 	94150	RUNGIS	\N	\N	\N	\N
fr-633820337	SOC PECHINEY SAINT GOBAIN	FR	633820337	\N	SA à conseil d'administration (s.a.i.)	\N	1900-01-01	Rue DE L ORATOIRE 	14000	CAEN	\N	\N	\N	\N
fr-703002535	GEOGAZ LAVERA	FR	703002535	\N	SA à conseil d'administration (s.a.i.)	PME	1900-01-01	2 Rue DES MARTINETS 	92500	RUEIL MALMAISON	92569	\N	\N	\N
fr-790653935	SAS GAIA	FR	790653935	\N	SAS, société par actions simplifiée	PME	2012-09-01	2697 Route DE BADUEL 	97300	CAYENNE	\N	\N	\N	\N
fr-792677866	Semigu Service Minier	FR	792677866	\N	Entrepreneur individuel	PME	2013-04-22	432 Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-792731127	COMPAGNIE D EXPLOITATION AURIFERIA (C.E.A)	FR	792731127	\N	Société à responsabilité limitée (sans autre indication)	PME	2013-04-16	13 Rue DES ACACIAS 	97351	MATOURY	\N	\N	\N	\N
fr-811348432	SOCIETE DE CARRIERE DE MINES (SOCARMINES)	FR	811348432	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-05-01	Rue DU CAURALE SOLEIL 	97300	CAYENNE	\N	\N	\N	\N
fr-799534920	Compagnie Miniere Marwina	FR	799534920	\N	Entrepreneur individuel	PME	2014-01-07	Résidence SAINT MAURICE N°3 APPT F ETG 2 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-810011601	MIMI MINE	FR	810011601	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-03-04	ROUTE DE L EST LARIDO 	97311	ROURA	\N	\N	\N	\N
fr-813428315	SOCIETE MINIERE DE REGINA SOMIREG	FR	813428315	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-09-08	432 B Route DE LA MADELEINE 	97300	CAYENNE	\N	\N	\N	\N
fr-809831027	Pralier Sylvestre	FR	809831027	\N	Entrepreneur individuel	PME	2015-02-24	Cité CHATENAY 2 	97300	CAYENNE	\N	\N	\N	\N
fr-804906105	GIGAMINES	FR	804906105	\N	Société à responsabilité limitée (sans autre indication)	PME	2014-10-01	3 Cité N'ZILA 	97300	CAYENNE	\N	\N	\N	\N
fr-815304399	HEIDELBERGCEMENT FRANCE S.A.S	FR	815304399	\N	SAS, société par actions simplifiée	GE	2015-12-11	Rue DES TECHNODES 	78930	GUERVILLE	\N	\N	\N	\N
fr-820192342	COMPAGNIE REICOO	FR	820192342	\N	Société à responsabilité limitée (sans autre indication)	PME	2016-04-01	LE BOURG 	97312	SAINT ELIE	\N	\N	\N	\N
fr-819225491	COMPAGNIE MINIERE GUYANAISE (C.M.G)	FR	819225491	\N	SAS, société par actions simplifiée	PME	2016-01-19	69 B Avenue DE LA LIBERTE 	97300	CAYENNE	\N	\N	\N	\N
fr-823721071	GUYANE RESSOURCES	FR	823721071	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2016-10-20	21 Rue MEZIN GILDON 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-819004854	DIVIMINES	FR	819004854	\N	SAS, société par actions simplifiée	PME	2016-01-05	5 Rue DES MOMBINS 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-816020291	SOCIETE INDUSTRIELLE DU CENTRE (SIC)	FR	816020291	\N	SA à conseil d'administration (s.a.i.)	\N	1960-01-01	11 Rue ST YVES 	75014	PARIS 14	\N	\N	\N	\N
fr-822454872	AMAZON RESOURCES	FR	822454872	\N	SAS, société par actions simplifiée	PME	2016-10-01	24 Avenue PREFONTAINE 	97310	KOUROU	\N	\N	\N	\N
fr-403310758	Daniel Didier	FR	403310758	\N	Entrepreneur individuel	PME	1996-02-05	CRIQUE BEINAN 	97340	GRAND SANTI	\N	\N	\N	\N
fr-401802863	ARMINA RESSOURCES MINIERES SARL	FR	401802863	\N	Société à responsabilité limitée (sans autre indication)	PME	1995-06-12	ZONE INDUSTRIELLE DEGRAD CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-403018427	SOCIETE MINIERE BONNE ENTENTE (SMBE)	FR	403018427	\N	Société à responsabilité limitée (sans autre indication)	PME	1995-11-16	1 Rue THIERS 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-393369590	FERNANDES COSTA Henrique	FR	393369590	\N	Entrepreneur individuel	PME	1993-12-07	CRIQUE AIMARA ET LOUPE 	97312	SAINT ELIE	\N	\N	\N	\N
fr-404167645	CIE MINIERE PROVIDENCE (CMP)	FR	404167645	\N	SARL unipersonnelle 	\N	1996-03-15	41 Rue DU LIEUTENANT BECKER 	97300	CAYENNE	\N	\N	\N	\N
fr-411309867	SOC GENERALE DES MINES	FR	411309867	\N	Société à responsabilité limitée (sans autre indication)	\N	1996-12-06	Route DE SAINT MAURICE 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-414719435	SHELL EXPLORATION AND PRODUCTION FRANCE	FR	414719435	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	1997-12-08	307 Rue ESTIENNE D ORVES 	92700	COLOMBES	92708	\N	\N	\N
fr-419619077	IPC PETROLEUM GASCOGNE	FR	419619077	\N	Société en nom collectif 	PME	1998-06-26	MACLAUNAY 	51210	MONTMIRAIL	\N	\N	\N	\N
fr-410964837	VERMILION REP SAS	FR	410964837	\N	SAS, société par actions simplifiée	ETI	1997-02-10	1762 Route DE PONTENX 	40160	PARENTIS EN BORN	\N	\N	\N	\N
fr-417496957	RECHERCHE ET EXPL MINIERE AURIFERE (REXMA)	FR	417496957	\N	SAS, société par actions simplifiée	PME	1998-02-01	52 Lotissement ZONE ARTISANALE GALMOT 	97300	CAYENNE	\N	\N	\N	\N
fr-409160132	TOTAL E ET P FRANCE	FR	409160132	\N	SAS, société par actions simplifiée	GE	1996-10-01	2 Place JEAN MILLIER 	92400	COURBEVOIE	\N	\N	\N	\N
fr-429485295	Mejia Munoz César Félipe	FR	429485295	\N	Entrepreneur individuel	\N	2000-02-11	1152 Route DE TROU BIRAN 	97300	CAYENNE	\N	\N	\N	\N
fr-450946785	CARIDISTRIBUTION EURL	FR	450946785	\N	SARL unipersonnelle 	PME	2003-12-01	3 Lotissement LES COMOUS 	97351	MATOURY	\N	\N	\N	\N
fr-448302877	Bagadi Yani	FR	448302877	\N	Entrepreneur individuel	\N	2003-04-12	Chemin MORTHIUM 	97351	MATOURY	\N	\N	\N	\N
fr-448998682	BATMINE SARL	FR	448998682	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-07-01	2 Rue ERNEST PREVOT 	97300	CAYENNE	\N	\N	\N	\N
fr-448056135	GUYAMINE	FR	448056135	\N	Société à responsabilité limitée (sans autre indication)	PME	2003-04-15	1918 Route DE MONTABO 	97300	CAYENNE	\N	\N	\N	\N
fr-484860507	TOISON D OR	FR	484860507	\N	Société à responsabilité limitée (sans autre indication)	PME	2005-11-02	Lotissement DOMAINES PARC LINDOR 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-488363177	ENTREPRISE  MINIERE BECLONG	FR	488363177	\N	Entrepreneur individuel	PME	2006-02-01	97 Lotissement COGNEAU LAMIRANDE 	97351	MATOURY	\N	\N	\N	\N
fr-501152193	LA FRANCAISE DE L'ENERGIE	FR	501152193	\N	SA à conseil d'administration (s.a.i.)	PME	2007-11-20	1 Avenue ST REMY 	57600	FORBACH	\N	\N	\N	\N
fr-504838699	INVESTAQ ENERGIE	FR	504838699	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2008-06-12	32 Avenue HOCHE 	75008	PARIS 8	\N	\N	\N	\N
fr-494240567	RENOUVEAU ENERGIE RESSOURCES	FR	494240567	\N	SAS, société par actions simplifiée	PME	2007-01-24	12 Rue VIVIENNE 	75002	PARIS 2	\N	\N	\N	\N
fr-490053378	THERMOPYLES	FR	490053378	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2006-05-12	50 Rue DU MIDI 	94300	VINCENNES	\N	\N	\N	\N
fr-502023468	COMPAGNIE MINIERE JOHNNY ET JEAN SARL (C.M.2.J SARL)	FR	502023468	\N	Société à responsabilité limitée (sans autre indication)	PME	2008-01-16	DEGRAD CORREZE 	97311	ROURA	\N	\N	\N	\N
fr-523359024	ABOEKA METAL	FR	523359024	\N	Entrepreneur individuel	PME	2010-07-24	1 A Allée DES PAGANIS BTZ 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-513863217	SOCIETE GUYANAISE DES MINES D'OR (SOGUMINOR)	FR	513863217	\N	Société à responsabilité limitée (sans autre indication)	PME	2009-07-22	8 QUESNEL OUEST 	97356	MONTSINERY TONNEGRANDE	\N	\N	\N	\N
fr-529069825	CONCORDE ENERGIE PARIS	FR	529069825	\N	SARL unipersonnelle 	PME	2010-10-27	1 Avenue ST REMY 	57600	FORBACH	\N	\N	\N	\N
fr-529770646	FONROCHE GEOTHERMIE	FR	529770646	\N	SAS, société par actions simplifiée	ETI	2011-01-15	ZAC DES CHAMPS DE LESCAZE 	47310	ROQUEFORT	\N	\N	\N	\N
fr-517872222	BLUEBACH RESSOURCES	FR	517872222	\N	Société à responsabilité limitée (sans autre indication)	PME	2009-10-27	178 Boulevard HAUSSMANN 	75008	PARIS 8	\N	\N	\N	\N
fr-532631272	SOGEMI	FR	532631272	\N	Société à responsabilité limitée (sans autre indication)	PME	2011-05-23	DEGRAD DES CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-552005969	CEMEX GRANULATS	FR	552005969	\N	SA à conseil d'administration (s.a.i.)	ETI	1984-01-01	2 Rue DU VERSEAU 	94150	RUNGIS	94583	\N	\N	\N
fr-672049616	GEOSEL MANOSQUE	FR	672049616	\N	SAS, société par actions simplifiée	ETI	1900-01-01	2 Rue DES MARTINETS 	92500	RUEIL MALMAISON	92569	\N	\N	\N
fr-625780135	INOVYN FRANCE	FR	625780135	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	ETI	1957-01-01	2 Avenue DE LA REPUBLIQUE 	39500	TAVAUX	\N	\N	\N	\N
fr-589200575	LAFARGE GRANULATS OUEST	FR	589200575	\N	SAS, société par actions simplifiée	GE	1958-01-01	125 Rue ROBERT SCHUMAN 	44800	SAINT HERBLAIN	\N	\N	\N	\N
fr-799938246	Mine Etoile Du Matin	FR	799938246	\N	Entrepreneur individuel	PME	2014-01-27	19 Résidence DU LEVANT 	97300	CAYENNE	\N	\N	\N	\N
fr-811348325	SOLEIL	FR	811348325	\N	SAS, société par actions simplifiée	PME	2015-01-01	21 Rue JOSEPH SYMPHORIEN 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-821591286	MAC MAHON (M.M.)	FR	821591286	\N	Société à responsabilité limitée (sans autre indication)	PME	2016-09-01	13 Lotissement CALIMBE I 	97300	CAYENNE	\N	\N	\N	\N
fr-814103982	J.E MINERATION	FR	814103982	\N	SAS, société par actions simplifiée	PME	2015-10-15	15 Rue JOSEPH LEANDRE 	97313	SAINT GEORGES	\N	\N	\N	\N
fr-818182156	TDG MINES ET LOCATIONS	FR	818182156	\N	SAS, société par actions simplifiée	PME	2016-01-01	67 Allée DU LAC BLEU 	97320	SAINT LAURENT DU MARONI	\N	\N	\N	\N
fr-814908869	HERA	FR	814908869	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2015-11-01	339 Chemin SAINT ANTOINE 	97300	CAYENNE	\N	\N	\N	\N
fr-818854432	SOCIETE GENERALE DE TRAVAUX ET SERVICES (SGTS SAS)	FR	818854432	\N	SAS, société par actions simplifiée	PME	2016-04-03	1630 F Route DE DEGRAD DES CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-819464041	TERRE ET OR GUYANE	FR	819464041	\N	Société à responsabilité limitée (sans autre indication)	PME	2016-03-04	98 Résidence BEAUREGARD 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-821212651	BONOR SAS	FR	821212651	\N	SAS, société par actions simplifiée	PME	2016-07-01	24 Rue PREFONTAINE 	97310	KOUROU	\N	\N	\N	\N
fr-823507553	TORTUE	FR	823507553	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2016-10-30	1462 Route DES PLAGES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-814636981	EURL C.M.P.	FR	814636981	\N	Société à responsabilité limitée (sans autre indication)	PME	2015-11-10	1630 C Route DE DEGRAD DES CANNES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-814981379	SAS AMOURETTE Y.A	FR	814981379	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	PME	2015-10-16	78 Rue VICTOR SCHOELCHER 	97300	CAYENNE	\N	\N	\N	\N
fr-820959948	OR AMAZONIE PRESTA	FR	820959948	\N	SAS, société par actions simplifiée	PME	2016-07-01	406 Route DE SUZINI 	97300	CAYENNE	\N	\N	\N	\N
fr-824490759	PATAWA	FR	824490759	\N	SAS, société par actions simplifiée	PME	2016-11-01	339 Chemin SAINT ANTOINE 	97300	CAYENNE	\N	\N	\N	\N
fr-838049344	CHAMB'OR	FR	838049344	\N	Société à responsabilité limitée (sans autre indication)	\N	2018-02-26	CARREFOUR DU LARIVOT 	97351	MATOURY	\N	\N	\N	\N
fr-831101522	COMPAGNIE MINIERE CECCON	FR	831101522	\N	SAS, société par actions simplifiée	\N	2017-07-17	3 Cité N'ZILA 	97300	CAYENNE	\N	\N	\N	\N
fr-850370248	SOCIETE MINIERE GUYANAISE DE DORLIN (SMGD)	FR	850370248	\N	Société à responsabilité limitée (sans autre indication)	\N	2019-04-25	128 Rue LA BOETIE 	75008	PARIS 8	\N	\N	\N	\N
fr-849829734	COMPAGNIE MINIERE CONTAM	FR	849829734	\N	SAS, société par actions simplifiée	\N	2019-04-11	1 Avenue GUSTAVE CHARLERY 	97300	CAYENNE	\N	\N	\N	\N
fr-840649602	PLACER APPROUAGUE GUYANE (PAG)	FR	840649602	\N	SAS, société par actions simplifiée	\N	2018-06-11	14 Rue DES EPICES 	97354	REMIRE MONTJOLY	\N	\N	\N	\N
fr-969510940	ALUMINIUM PECHINEY	FR	969510940	\N	Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle 	GE	1970-01-01	725 Rue ARISTIDE BERGES 	38340	VOREPPE	\N	\N	\N	\N
fr-095580841	TEREGA (TIGF)	FR	095580841	\N	SA à conseil d'administration (s.a.i.)	ETI	1955-01-01	40 Avenue DE L EUROPE 	64000	PAU	\N	\N	\N	\N
\.


--
-- Data for Name: entreprises_etablissements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entreprises_etablissements (id, entreprise_id, nom, legal_siret, date_debut, date_fin) FROM stdin;
fr-302556832-21604-2002-04-01	fr-302556832	ELF ANTAR FRANCE	30255683221604	2002-04-01	\N
fr-303195192-00032-2016-07-15	fr-303195192	CIE MINIERE DE BOULANGER	30319519200032	1974-01-01	\N
fr-319632790-00857-2017-04-01	fr-319632790	ARKEMA FRANCE	31963279000857	2006-04-18	\N
fr-319632790-00410-2005-01-01	fr-319632790	ARKEMA	31963279000410	2005-01-01	2006-04-17
fr-319632790-00410-2004-12-25	fr-319632790	ARKENA	31963279000410	2004-01-01	2004-12-31
fr-319632790-00410-2002-12-25	fr-319632790	ATOFINA	31963279000410	1980-01-01	2003-12-31
fr-314989930-00040-2008-01-01	fr-314989930	LES SABLIERS REUNIS DE LA LOIRE (SARELO)	31498993000040	1979-01-01	\N
fr-315014035-00044-2011-07-05	fr-315014035	DEPARTEMENT D'OUTRE MER IMPORT EXPORT (DOMIEX)	31501403500044	1979-01-01	\N
fr-304516420-00078-2018-11-12	fr-304516420	DRAGAGE TRANSPORTS ET TRAVAUX MARITIMES (DTM)	30451642000078	1975-01-01	\N
fr-311933568-00033-2019-06-25	fr-311933568	DEFTA AIRAX	31193356800033	2011-09-30	\N
fr-311933568-00033-2008-01-01	fr-311933568	TRELLEBORG AIRAX	31193356800033	2001-01-01	2011-09-29
fr-311933568-00033-1996-12-25	fr-311933568	AIRAX	31193356800033	1978-01-01	2000-12-31
fr-303697924-00130-2017-08-31	fr-303697924	SOCIETE DES MINES DE JOUAC	30369792400130	1995-01-01	\N
fr-303697924-00114-1993-10-12	fr-303697924	TOTAL COMPAGNIE MINIERE-FRANCE SNC	30369792400114	1988-01-01	1994-12-31
fr-303697924-00114-1983-05-24	fr-303697924	TOTAL COMPAGNIE MINIERE-FRANCE S N C	30369792400114	1900-01-01	1987-12-31
fr-319712873-00052-2005-01-01	fr-319712873	LUNDIN ILE DE FRANCE	31971287300052	2002-01-01	\N
fr-319712873-00052-1995-01-01	fr-319712873	COPAREX ILE DE FRANCE	31971287300052	1995-01-01	2001-12-31
fr-319712873-00052-1985-01-01	fr-319712873	TRITON FRANCE	31971287300052	1980-09-01	1994-12-31
fr-324377068-00055-2011-01-01	fr-324377068	MONSIEUR JEAN-PIERRE DE LANFRANCHI	32437706800055	1982-04-06	\N
fr-296400427-00013-2008-01-01	fr-296400427	CORPORATION DE LA FONTAINE SALEE	29640042700013	1991-01-01	\N
fr-304991342-00029-2008-05-01	fr-304991342	MONSIEUR JOSE CONSTABLE	30499134200029	1900-01-01	\N
fr-303192959-00094-2012-01-22	fr-303192959	TANON ET CIE	30319295900094	1989-01-01	\N
fr-303192959-xxxxx-1974-01-01	fr-303192959	CCAF CIE COM ANT FRANC TANON	303192959xxxxx	1974-01-01	1988-12-31
fr-310380811-00086-2016-12-26	fr-310380811	GARROT-CHAILLAC	31038081100086	2016-12-26	\N
fr-310380811-00086-2014-06-17	fr-310380811	GARROT CHAILLAC	31038081100086	2014-06-17	2016-12-25
fr-310380811-00086-2011-06-08	fr-310380811	GARROT-CHAILLAC	31038081100086	1992-01-01	2014-06-16
fr-310380811-00052-1984-07-01	fr-310380811	SOCIETE COMMERCIALE GARROT CHAILLAC	31038081100052	1900-01-01	1991-12-31
fr-318992690-00038-2013-04-10	fr-318992690	SOCIETE DE TRANSPORTS FLUVIO MARITIMES DE L'OUEST (STFMO)	31899269000038	1980-05-29	\N
fr-302420658-00155-2019-07-01	fr-302420658	SOCIETE D'ENTREPRISES, CARRIERES ET MINES DE L'ESTEREL S.E.C.M.E. (SECME)	30242065800155	1975-04-01	\N
fr-323097899-00062-2012-12-31	fr-323097899	SOCIETE DES MINES DU BOURNEIX	32309789900062	1988-01-01	\N
fr-323097899-00039-1981-11-01	fr-323097899	MINIERE&METAL PENARROYA&CHENI	32309789900039	1981-11-01	1987-12-31
fr-304350887-00051-2017-12-22	fr-304350887	SA GEOVEXIN	30435088700051	1900-01-01	\N
fr-324558154-00062-2018-08-06	fr-324558154	MONSIEUR JOSE BARBOSA	32455815400062	1982-02-12	\N
fr-324558154-xxxxx-1900-01-01	fr-324558154	\N	324558154xxxxx	1900-01-01	1982-02-11
fr-309024685-00021-2019-05-27	fr-309024685	GRAVES DE MER (GDM)	30902468500021	2012-12-28	\N
fr-309024685-00021-2011-07-22	fr-309024685	GIE DES GRAVES DE MER (GDM)	30902468500021	1992-01-01	2012-12-27
fr-309024685-00021-1989-01-01	fr-309024685	DIE DES GRAVES DE MER (GDM)	30902468500021	1989-01-01	1991-12-31
fr-309024685-00021-1981-12-25	fr-309024685	GIE DES GRAVES DE MER (GDM)	30902468500021	1977-01-01	1988-12-31
fr-333707008-00046-2010-06-01	fr-333707008	MONSIEUR JOEL VILLEROY	33370700800046	1985-10-07	\N
fr-333707008-xxxxx-1900-01-01	fr-333707008	\N	333707008xxxxx	1900-01-01	1985-10-06
fr-347619165-00058-2012-06-22	fr-347619165	SABLIMARIS	34761916500058	2005-11-29	\N
fr-347619165-00017-1993-12-25	fr-347619165	DRAGAGES TRAVAUX MARITIMES BRETAGNE	34761916500017	1988-07-01	2005-11-28
fr-339718967-00021-2019-05-20	fr-339718967	SOCIETE D'INDUSTRIALISATION ET DE COMMERCIALISATION DE L'APEI DE FRONTIGNAN LA PEYRADE ( SODICAPEI ) (SODICAPEI)	33971896700021	1992-01-01	\N
fr-339718967-00021-1986-12-12	fr-339718967	SOC INVES COMME ASS ENFAN INADA FRONT (SODICAPEI)	33971896700021	1986-12-12	1991-12-31
fr-352500748-00012-2008-01-01	fr-352500748	MONSIEUR PIERRE REY	35250074800012	1989-10-23	\N
fr-357200054-00017-2008-01-01	fr-357200054	ROQUETTE FRERES	35720005400017	1957-01-01	\N
fr-357200054-xxxxx-1900-01-01	fr-357200054	\N	357200054xxxxx	1900-01-01	1956-12-31
fr-331477158-00140-2018-10-01	fr-331477158	AUPLATA	33147715800140	2006-06-30	\N
fr-331477158-00082-2006-05-31	fr-331477158	TEXMINE	33147715800082	1994-01-01	2006-06-29
fr-331477158-00074-1984-12-01	fr-331477158	TEMSOL INTERNATIONAL	33147715800074	1984-12-01	1993-12-31
fr-329858427-00035-2004-01-21	fr-329858427	SOC D'EXPLOITATION DU SITE CHANGEMENT (SESIC)	32985842700035	1991-01-01	\N
fr-329858427-00035-1984-03-15	fr-329858427	SESIC EXPL DU SITE CHANGEMENT (SESIC)	32985842700035	1984-03-15	1990-12-31
fr-327528733-00030-1999-12-30	fr-327528733	AGIP EXPLORATION ET EXPLOITATION FRANCE	32752873300030	1999-12-30	\N
fr-351483722-00036-2019-04-19	fr-351483722	GEOMETHANE	35148372200036	1989-07-21	\N
fr-339146284-00114-2016-07-11	fr-339146284	COMPAGNIE MINIERE MONTAGNE D'OR (SOTRAPMAG)	33914628400114	2016-07-11	\N
fr-339146284-00114-2015-11-20	fr-339146284	SOCIETE DE TRAVAUX PUBLICS ET DE MINES AURIFERES EN GUYANE (SOTRAPMAG)	33914628400114	1998-01-01	2016-07-10
fr-339146284-xxxxx-1990-01-01	fr-339146284	SOC DE TR ET DE MINES AURIFERES (SOTRAPMAG)	339146284xxxxx	1990-01-01	1997-12-31
fr-339146284-xxxxx-1986-08-01	fr-339146284	SOC DE TP ET DE MINES AURIFERES (SOTRAPMAG)	339146284xxxxx	1986-08-01	1989-12-31
fr-338878242-00043-2017-11-20	fr-338878242	NIZEROLLES SA	33887824200043	1986-09-24	\N
fr-331129601-00026-2008-01-01	fr-331129601	CLYDE EXPRO PLC	33112960100026	1900-01-01	\N
fr-348021619-00021-2008-07-28	fr-348021619	SOC ATLANTIQUE CHARENTES AGREGATS (SACA)	34802161900021	1989-01-01	\N
fr-348021619-00021-1988-06-01	fr-348021619	SOCIETE ATLANTIQUECHARENTES AGREGATS (SACA)	34802161900021	1988-06-01	1988-12-31
fr-368500773-00016-2018-06-28	fr-368500773	LES GRAVES DE L'ESTUAIRE	36850077300016	1968-01-01	\N
fr-344778626-00053-2008-01-01	fr-344778626	SARL COPERMER	34477862600053	1988-04-15	\N
fr-347720997-00027-1994-01-01	fr-347720997	HADSON FRANCE SNC	34772099700027	1994-01-01	\N
fr-347720997-00027-1988-12-25	fr-347720997	SNC HADSON FRANCE	34772099700027	1988-08-03	1993-12-31
fr-347720997-xxxxx-1900-01-01	fr-347720997	\N	347720997xxxxx	1900-01-01	1988-08-02
fr-352544571-00024-2011-06-30	fr-352544571	MONSIEUR ANTOINE YESEMBA	35254457100024	1989-11-30	\N
fr-330013566-00030-1995-06-23	fr-330013566	BARYTINE DE HAINAUT	33001356600030	1995-06-23	\N
fr-333517530-00031-2014-12-15	fr-333517530	MONSIEUR MAURICE REUNIF	33351753000031	1993-01-01	\N
fr-333517530-00023-1992-06-01	fr-333517530	MONSIEUR MAURICE REUNIE	33351753000023	1986-01-01	1992-12-31
fr-383789831-00054-2008-01-01	fr-383789831	SOC MINIERE GUYANAISE (SOMIG)	38378983100054	1991-10-01	\N
fr-384486312-00059-2007-02-28	fr-384486312	CIE MINIERE CHANTAL	38448631200059	1992-01-01	\N
fr-381224393-00037-2010-11-29	fr-381224393	GRIS NEZ	38122439300037	1991-03-01	\N
fr-376880183-00029-2011-12-31	fr-376880183	SABLIERS DE L'ODET	37688018300029	1991-01-01	\N
fr-376880183-00029-1989-06-24	fr-376880183	SABLIERS DE L'ODET MONFORT & C	37688018300029	1968-01-01	1990-12-31
fr-388249229-00021-2015-01-31	fr-388249229	SA TERRE	38824922900021	1992-07-15	\N
fr-377721576-00017-2008-01-01	fr-377721576	MONSIEUR MOLA DIFOU	37772157600017	1990-04-04	\N
fr-382461325-00104-2019-02-16	fr-382461325	NEWMONT LASOURCE	38246132500104	2002-01-01	\N
fr-382461325-xxxxx-1999-01-01	fr-382461325	NORMANDY LASOURCE	382461325xxxxx	1999-01-01	2001-12-31
fr-382461325-xxxxx-1991-05-28	fr-382461325	LASOURCE	382461325xxxxx	1991-05-28	1998-12-31
fr-390815280-00016-2008-04-23	fr-390815280	MONSIEUR ERIC PIERREZ	39081528000016	1993-04-05	\N
fr-388522161-00131-2013-11-27	fr-388522161	RAMBAUD CARRIERES	38852216100131	1992-04-01	\N
fr-381972439-00073-2011-01-30	fr-381972439	GAZONOR	38197243900073	1991-04-19	\N
fr-391774650-00041-2012-09-05	fr-391774650	MONSIEUR MARIO SANTANA DE OLIVEIRA	39177465000041	1993-06-11	\N
fr-391808763-00018-2012-04-05	fr-391808763	LES QUATRE   T   D'OR	39180876300018	1993-07-01	\N
fr-391727450-00077-2012-12-21	fr-391727450	VERMILION MORAINE	39172745000077	2012-12-21	\N
fr-391727450-00069-2012-04-20	fr-391727450	ZAZA ENERGY FRANCE	39172745000069	2012-04-20	2012-12-20
fr-391727450-00069-2012-01-04	fr-391727450	TOREADOR ENERGY FRANCE	39172745000069	2012-01-04	2012-04-19
fr-391727450-00069-2011-04-27	fr-391727450	TOREADOR ENERGY FRANCE S.C.S	39172745000069	2005-11-02	2012-01-03
fr-391727450-00036-2004-12-25	fr-391727450	MADISON ENERGY FRANCE SCS	39172745000036	2001-01-01	2005-11-01
fr-391727450-00036-1998-07-01	fr-391727450	MADISON CHART ENERGY	39172745000036	1997-01-01	2000-12-31
fr-391727450-00036-1993-06-24	fr-391727450	MIDLAND MADISON PETROLEUM COMPANY	39172745000036	1993-06-24	1996-12-31
fr-381151760-00034-2008-06-15	fr-381151760	COMPAGNIE MINIERE ESPERANCE	38115176000034	1991-01-01	\N
fr-382696276-00023-1995-12-19	fr-382696276	COPAREX	38269627600023	1995-12-19	\N
fr-391195997-00047-2008-01-01	fr-391195997	COMPAGNIE D'EXPLOITATION MINIERE DE LA CRIQUE IPOUCIN (CEMCI)	39119599700047	1993-01-01	\N
fr-390919082-00086-2010-01-01	fr-390919082	EURO RESSOURCES	39091908200086	2005-01-01	\N
fr-390919082-xxxxx-2002-12-25	fr-390919082	GUYANOR RESSOURCES	390919082xxxxx	1993-05-01	2004-12-31
fr-390455814-00017-2018-05-24	fr-390455814	COMPAGNIE ARMORICAINE NAVIGATION (CAN)	39045581400017	1993-04-05	\N
fr-387752975-00020-2008-09-24	fr-387752975	HADES MINING	38775297500020	1992-06-01	\N
fr-379555568-00037-2008-01-01	fr-379555568	MONSIEUR CHRISTIAN PERNAUT	37955556800037	1990-09-28	\N
fr-395190473-00045-2008-08-21	fr-395190473	IAMGOLD GUYANE	39519047300045	2008-08-21	\N
fr-395190473-00045-2008-01-01	fr-395190473	CBJ-CAIMAN	39519047300045	2005-01-01	2008-08-20
fr-395190473-00045-2004-12-25	fr-395190473	ASARCO GUYANE FRANCAISE SARL	39519047300045	1994-05-26	2004-12-31
fr-403018427-00043-2008-01-01	fr-403018427	SOCIETE MINIERE BONNE ENTENTE (SMBE)	40301842700043	1999-01-01	\N
fr-403018427-00043-1998-12-31	fr-403018427	0OCIETE MINIERE BONNE ENTENTE (SMBE)	40301842700043	1998-12-31	1998-12-31
fr-403018427-00043-1995-11-16	fr-403018427	SOCIETE MINIERE BONNE ENTENTE (SMBE)	40301842700043	1995-11-16	1998-12-30
fr-400872826-00047-2009-02-17	fr-400872826	MONSIEUR ALAIN NARECE	40087282600047	1995-05-02	\N
fr-403310758-00012-2008-01-01	fr-403310758	MONSIEUR DIDIER DANIEL	40331075800012	1997-01-01	\N
fr-403310758-00012-1996-12-25	fr-403310758	MONSIEUR DIDIER DIDIER	40331075800012	1996-02-05	1996-12-31
fr-398522037-00058-2010-06-30	fr-398522037	SOC DES MINES DE ST ELIE	39852203700058	1994-09-29	\N
fr-392068102-00046-2019-06-27	fr-392068102	GEOPETROL	39206810200046	1993-07-15	\N
fr-400716536-00018-2017-04-07	fr-400716536	GEOTHERMIE BOUILLANTE	40071653600018	1995-03-20	\N
fr-400446837-00025-2008-01-01	fr-400446837	MONSIEUR ABANGO ADAM	40044683700025	1995-03-09	\N
fr-399380302-00030-2009-10-15	fr-399380302	COMPAGNIE MINIERE DE SIKINI (CMS)	39938030200030	1995-01-01	\N
fr-402960397-00048-2012-02-01	fr-402960397	BUTAGAZ	40296039700048	2012-02-01	\N
fr-402960397-00048-2012-01-29	fr-402960397	BUTAGAZ TRANSITION	40296039700048	2011-02-09	2012-01-31
fr-402960397-00030-2008-01-01	fr-402960397	SOCIETE SHELL FRANCE HOLDING	40296039700030	1995-11-17	2011-02-08
fr-392425427-00011-2012-09-01	fr-392425427	MONSIEUR AMOUFINI ABAADOU	39242542700011	1993-09-01	\N
fr-401862297-00017-2016-10-05	fr-401862297	SOCIETE QUEMENEUR	40186229700017	1995-04-01	\N
fr-393369590-00020-2008-01-01	fr-393369590	MONSIEUR HENRIQUE FERNANDES COSTA	39336959000020	1993-12-07	\N
fr-394926877-00017-2018-05-03	fr-394926877	MATERIAUX BAIE DE SEINE (MBS)	39492687700017	1994-04-06	\N
fr-402174957-00025-2012-12-31	fr-402174957	MADAME PATRICIA BEAUSOLEIL	40217495700025	1995-09-12	\N
fr-398827451-00020-2014-09-01	fr-398827451	MONSIEUR JURANILDO BARBOSA	39882745100020	1994-11-05	\N
fr-402207153-00048-2008-08-21	fr-402207153	IAMGOLD FRANCE	40220715300048	2008-08-21	\N
fr-402207153-00048-2008-01-01	fr-402207153	CBJ-FRANCE	40220715300048	1995-09-06	2008-08-20
fr-401802863-00043-2018-11-19	fr-401802863	ARMINA RESSOURCES MINIERES SARL	40180286300043	2010-03-30	\N
fr-401802863-00019-2008-01-01	fr-401802863	GOLDEN STAR RESSOURCES MINIERE SARL	40180286300019	2004-01-01	2010-03-29
fr-401802863-00019-2001-12-25	fr-401802863	GOLD FIELDS MINIERE SARL	40180286300019	2001-01-01	2003-12-31
fr-401802863-00019-1995-06-12	fr-401802863	WMC MINIERE SARL	40180286300019	1995-06-12	2000-12-31
fr-400790614-00038-2016-10-11	fr-400790614	SARL SOMIRAL	40079061400038	1994-11-15	\N
fr-395042054-00019-2007-12-31	fr-395042054	CARR PRODUCTION FRANCE	39504205400019	1994-06-20	\N
fr-395042054-00019-1994-03-20	fr-395042054	\N	39504205400019	1994-03-20	1994-06-19
fr-408589158-00018-2000-03-21	fr-408589158	MONSIEUR JOSE PEDROSA COLARES	40858915800018	2000-03-21	\N
fr-404167645-00047-2007-02-28	fr-404167645	CIE MINIERE PROVIDENCE (CMP)	40416764500047	1996-03-15	\N
fr-411129612-00031-2015-12-31	fr-411129612	CHLORALP	41112961200031	1997-01-01	\N
fr-410063283-00015-2008-01-01	fr-410063283	MONSIEUR KAPIEL VOLA	41006328300015	1996-12-13	\N
fr-410964837-00026-2008-01-01	fr-410964837	VERMILION REP SAS	41096483700026	2004-01-01	\N
fr-410964837-00026-1997-07-02	fr-410964837	VERMILION REP	41096483700026	1997-02-10	2003-12-31
fr-411309867-00017-2002-09-30	fr-411309867	SOC GENERALE DES MINES	41130986700017	2002-09-30	\N
fr-408483675-00042-2010-12-31	fr-408483675	PRIMAGAZ LAVERA	40848367500042	1996-07-30	\N
fr-417549029-00011-2008-12-31	fr-417549029	SOCIETE DE MAINTENANCE PETROLIERE SAS (SMP)	41754902900011	2001-01-01	\N
fr-417549029-00011-2000-12-25	fr-417549029	SA SOC DE MAINTENANCE PETROLIERE (SMP)	41754902900011	1998-01-16	2000-12-31
fr-414719435-00037-2017-12-15	fr-414719435	SHELL EXPLORATION AND PRODUCTION FRANCE	41471943500037	2009-10-26	\N
fr-414719435-00037-2009-10-15	fr-414719435	SHELL  DIVERSIFICATIONS ET ACTIVITES PET	41471943500037	1997-12-08	2009-10-25
fr-411178866-00017-2016-12-31	fr-411178866	EXPLOITATION MINIERE DE LA CHALEUR	41117886600017	1997-01-02	\N
fr-412431744-00298-2017-01-31	fr-412431744	COMPAGNIE DES SALINS DU MIDI ET DES SALINES DE L'EST	41243174400298	1999-01-01	\N
fr-412431744-00025-1998-01-01	fr-412431744	SALINS OPERATIONS	41243174400025	1998-01-01	1998-12-31
fr-412431744-00025-1997-06-05	fr-412431744	SALINS EUROPE	41243174400025	1997-06-05	1997-12-31
fr-419619077-00029-2017-05-29	fr-419619077	IPC PETROLEUM GASCOGNE	41961907700029	2017-05-29	\N
fr-419619077-00029-2008-01-01	fr-419619077	LUNDIN GASCOGNE	41961907700029	2002-01-01	2017-05-28
fr-419619077-00029-2000-12-25	fr-419619077	COPAREX GASCOGNE	41961907700029	1998-06-26	2001-12-31
fr-417496957-00024-2009-12-31	fr-417496957	RECHERCHE ET EXPL MINIERE AURIFERE (REXMA)	41749695700024	1998-02-01	\N
fr-411554595-00024-2012-01-01	fr-411554595	OELWEG	41155459500024	1997-04-01	\N
fr-414885863-00160-2016-12-31	fr-414885863	GRANULATS OUEST (GO)	41488586300160	1997-12-17	\N
fr-404307910-00038-2013-04-15	fr-404307910	MONSIEUR GERARD AMAYOTA	40430791000038	1996-04-02	\N
fr-404307910-xxxxx-1900-01-01	fr-404307910	\N	404307910xxxxx	1900-01-01	1996-04-01
fr-409160132-00018-2014-12-31	fr-409160132	TOTAL E ET P FRANCE	40916013200018	2003-01-01	\N
fr-409160132-00018-1997-12-25	fr-409160132	ELF AQUITAINE EXPLORATION PRODUCTION FR	40916013200018	1996-10-01	2002-12-31
fr-411102635-00025-2012-01-01	fr-411102635	MONSIEUR BRUNO PASSEDAT	41110263500025	1997-01-20	\N
fr-411102635-xxxxx-1900-01-01	fr-411102635	\N	411102635xxxxx	1900-01-01	1997-01-19
fr-415281138-00016-2008-04-23	fr-415281138	SOC MINIERE PLACER AOMA	41528113800016	1998-01-02	\N
fr-408586550-00019-2008-01-01	fr-408586550	GRANULATS MARINS DE NORMANDIE (GMN)	40858655000019	1996-06-09	\N
fr-420768319-00014-2008-01-01	fr-420768319	MONSIEUR CASIMIR DIFOU	42076831900014	1998-11-16	\N
fr-421255274-00027-2009-10-21	fr-421255274	MONSIEUR RONALD PANDEL	42125527400027	1998-12-14	\N
fr-421255274-xxxxx-1900-01-01	fr-421255274	\N	421255274xxxxx	1900-01-01	1998-12-13
fr-424882066-00030-2005-08-19	fr-424882066	MONSIEUR DENIS AMAYOTA	42488206600030	1999-10-28	\N
fr-428606339-00029-2014-06-16	fr-428606339	MONSIEUR JOCANIAS SILVA E SOUSA	42860633900029	2000-01-14	\N
fr-421176744-00017-2008-01-01	fr-421176744	MARONI EXPLOITATION MINIERE	42117674400017	1998-12-11	\N
fr-422123984-00052-2017-02-01	fr-422123984	COMPAGNIE MINIERE OR - COMINOR	42212398400052	1999-03-05	\N
fr-429485295-00035-2011-12-13	fr-429485295	MONSIEUR CESAR MEJIA MUNOZ	42948529500035	2000-02-11	\N
fr-420610438-00079-2017-06-19	fr-420610438	NOVAPEX	42061043800079	2003-01-01	\N
fr-420610438-00038-2002-12-31	fr-420610438	RHOD K	42061043800038	2002-01-01	2002-12-31
fr-420610438-00038-1998-12-25	fr-420610438	RHOD DEUX	42061043800038	1998-09-01	2001-12-31
fr-431479500-00040-2015-11-02	fr-431479500	ATENOR	43147950000040	2000-05-17	\N
fr-422052514-00086-2013-08-01	fr-422052514	SOCIETE MINIERE YAOU DORLIN	42205251400086	1999-01-01	\N
fr-422070771-00023-2007-12-12	fr-422070771	COMPAGNIE MINIERE HUILA	42207077100023	2000-01-01	\N
fr-422070771-00023-1999-12-25	fr-422070771	SOCIETE AURIFERE SABATIER	42207077100023	1999-03-01	1999-12-31
fr-428758254-00042-2010-01-01	fr-428758254	SOC GUY DE GRANULATS (SGDG)	42875825400042	2000-01-01	\N
fr-428162135-00019-2019-04-09	fr-428162135	GIE LE ST NICOLAS	42816213500019	1999-11-09	\N
fr-419847397-00041-2014-09-01	fr-419847397	MONSIEUR CHARLES PECHER	41984739700041	1998-08-03	\N
fr-420282022-00011-2003-02-10	fr-420282022	MONSIEUR ROBERTO VARGAS SOTO	42028202200011	1998-10-01	\N
fr-420282022-xxxxx-1900-01-01	fr-420282022	\N	420282022xxxxx	1900-01-01	1998-09-30
fr-424505360-00018-2016-10-19	fr-424505360	MONSIEUR FRANCISCO DOS SANTOS	42450536000018	1999-07-16	\N
fr-420672263-00027-2015-12-21	fr-420672263	MONSIEUR ALAN ANDREW	42067226300027	1998-11-01	\N
fr-420007692-00023-2008-01-01	fr-420007692	GIE MANCHE EST (GME)	42000769200023	1998-09-01	\N
fr-424816403-00036-2010-03-15	fr-424816403	COMPAGNIE MINIERE A.T.W.	42481640300036	1999-09-18	\N
fr-440786903-00011-2016-05-25	fr-440786903	EG ACTIVITES	44078690300011	2002-01-01	\N
fr-431931369-00034-2011-12-22	fr-431931369	MONSIEUR JOSE BORGES DA CRUZ	43193136900034	1999-02-01	\N
fr-432161453-00019-2008-01-01	fr-432161453	NANCIBO TRAVAUX	43216145300019	2000-07-01	\N
fr-442715074-00013-2008-01-01	fr-442715074	COMPAGNIE MINIERE ALOUKOU	44271507400013	2002-05-22	\N
fr-438726655-00022-2017-05-28	fr-438726655	MONSIEUR THOMAS HORTH	43872665500022	2001-07-30	\N
fr-438726655-xxxxx-1900-01-01	fr-438726655	\N	438726655xxxxx	1900-01-01	2001-07-29
fr-431802727-00021-2009-06-30	fr-431802727	MONSIEUR YANNICK MAINET	43180272700021	2000-07-03	\N
fr-438296378-00021-2009-04-04	fr-438296378	MONSIEUR GUY RIGOTTIER-GOIS	43829637800021	2001-07-07	\N
fr-438296378-xxxxx-1900-01-01	fr-438296378	\N	438296378xxxxx	1900-01-01	2001-07-06
fr-438934119-00035-2009-09-04	fr-438934119	EQUINOXE RESSOURCES SARL	43893411900035	2001-08-13	\N
fr-442472197-00015-2008-12-31	fr-442472197	CIE MINIERE DE L'OUEST GUYANAIS (CMOG)	44247219700015	2002-06-04	\N
fr-441755113-00012-2014-11-26	fr-441755113	STE MINIERE CINQ DEGRE (SM5)	44175511300012	2002-04-03	\N
fr-443197777-00016-2008-09-24	fr-443197777	MONSIEUR JEAN CEDIA	44319777700016	2002-08-02	\N
fr-509221842-00016-2019-03-27	fr-509221842	TOTAL E&P GUYANE FRANCAISE	50922184200016	2009-09-24	\N
fr-509221842-00016-2008-11-21	fr-509221842	DAJA 72	50922184200016	2008-11-21	2009-09-23
fr-529069825-00022-2019-06-05	fr-529069825	CONCORDE ENERGIE PARIS	52906982500022	2010-10-27	\N
fr-530864792-00011-2011-02-21	fr-530864792	HARDMAN PETROLEUM FRANCE SAS	53086479200011	2011-02-21	\N
fr-517393807-00014-2018-11-21	fr-517393807	SOCIETE MINIERE BONNE VOLONTE (SMBV)	51739380700014	2009-10-08	\N
fr-440095750-00046-2016-12-31	fr-440095750	CIE MINIERE JOTA	44009575000046	2001-12-01	\N
fr-435098512-00013-2008-01-01	fr-435098512	NOUVELLE GENERATION	43509851200013	2001-03-02	\N
fr-439975707-00035-2015-02-03	fr-439975707	MONSIEUR LUCIO CARDOSO	43997570700035	2001-12-20	\N
fr-432993525-00018-2016-05-30	fr-432993525	MONSIEUR AZAD YUSUF	43299352500018	2001-02-01	\N
fr-441394111-00013-2008-01-01	fr-441394111	MONSIEUR ANTONIO PRATES DA SILVA	44139411100013	2002-04-02	\N
fr-433462660-00039-2013-03-01	fr-433462660	AGELOR	43346266000039	2000-10-24	\N
fr-445248545-00029-2018-06-15	fr-445248545	MONSIEUR GILLES CARTIER	44524854500029	2003-01-01	\N
fr-445248545-xxxxx-1900-01-01	fr-445248545	\N	445248545xxxxx	1900-01-01	2002-12-31
fr-445214208-00057-2018-06-11	fr-445214208	MONSIEUR JOSE MARIEMA	44521420800057	2003-02-06	\N
fr-450946785-00018-2010-01-05	fr-450946785	CARIDISTRIBUTION EURL	45094678500018	2003-12-01	\N
fr-452092711-00020-2008-01-01	fr-452092711	METAL GOLD RESSOURCES (M G R)	45209271100020	2004-02-14	\N
fr-448056135-00016-2008-01-01	fr-448056135	GUYAMINE	44805613500016	2003-04-15	\N
fr-448998682-00018-2008-01-01	fr-448998682	BATMINE SARL	44899868200018	2003-07-01	\N
fr-448085910-00041-2019-07-21	fr-448085910	HG-GUYANE (HG)	44808591000041	2003-04-08	\N
fr-449921758-00016-2008-01-01	fr-449921758	MONSIEUR JEAN GARCON	44992175800016	2003-09-25	\N
fr-450039466-00013-2009-03-25	fr-450039466	SOCIETE GUYANAISE DES MINES (SOGUMINES)	45003946600013	2003-09-16	\N
fr-448302877-00031-2014-10-31	fr-448302877	MONSIEUR YANI BAGADI	44830287700031	2003-04-12	\N
fr-449538974-00022-2013-07-01	fr-449538974	MONSIEUR GEORGES JOACHIM	44953897400022	2000-02-01	\N
fr-448299487-00026-2018-02-04	fr-448299487	COMPAGNIE MINIERE COOREI	44829948700026	2003-03-07	\N
fr-445246994-00021-2012-12-31	fr-445246994	MILLENNIUM GEO-VENTURE	44524699400021	2003-01-02	\N
fr-448669838-00014-2008-01-01	fr-448669838	MONSIEUR FRANCOIS COMISSI	44866983800014	2003-05-26	\N
fr-448591529-00012-2008-01-01	fr-448591529	SOCIETE AURIFERE GUYANAISE DES MINES (SAG)	44859152900012	2003-05-05	\N
fr-448575191-00037-2012-07-16	fr-448575191	COMPAGNIE DE TRAVAUX AURIFERE (CTA)	44857519100037	2003-05-05	\N
fr-450932777-00011-2008-01-01	fr-450932777	MONSIEUR FRANCISCO RIBEIRO	45093277700011	2003-11-17	\N
fr-451259790-00025-2008-01-01	fr-451259790	GRANULATS DE LA MANCHE ORIENTALE (GMO)	45125979000025	2003-11-01	\N
fr-444749733-00036-2008-07-31	fr-444749733	LA PIOCHE MINIERE	44474973300036	2002-12-16	\N
fr-479443558-00016-2004-12-25	fr-479443558	MONSIEUR RENE BERNADIN	47944355800016	2004-11-15	\N
fr-453852295-00022-2018-10-31	fr-453852295	GALLI COZ	45385229500022	2004-06-03	\N
fr-480857036-00010-2008-01-01	fr-480857036	TOMANY	48085703600010	2005-02-03	\N
fr-478826316-00034-2008-12-17	fr-478826316	VERMILION PYRENEES	47882631600034	2008-12-17	\N
fr-478826316-00026-2008-01-01	fr-478826316	ENCANA FRANCE	47882631600026	2004-09-24	2008-12-16
fr-484376330-00052-2018-09-28	fr-484376330	PETROMANAS ENERGY (FRANCE) S.A.S.	48437633000052	2013-02-25	\N
fr-484376330-00011-2011-12-01	fr-484376330	EXCEED ENERGY (FRANCE) S A S	48437633000011	2005-09-30	2013-02-24
fr-484042247-00011-2008-01-01	fr-484042247	ESSENCE DE PARIS	48404224700011	2005-10-09	\N
fr-452798887-00017-2016-12-31	fr-452798887	VERMILION EXPLORATION SAS	45279888700017	2004-03-29	\N
fr-481010817-00015-2008-01-01	fr-481010817	SOC PETROLIERE PRODUCTION EXPLOITATION (SPPE)	48101081700015	2005-01-24	\N
fr-477515381-00010-2014-12-23	fr-477515381	SOUTH AMERICA GOLD MINING (SAGM)	47751538100010	2004-10-01	\N
fr-487650632-00309-2018-10-01	fr-487650632	STORENGY FRANCE	48765063200309	2018-10-01	\N
fr-487650632-00309-2010-07-01	fr-487650632	STORENGY	48765063200309	2008-12-31	2018-09-30
fr-487650632-00010-2008-01-01	fr-487650632	GDF INVESTISSEMENTS 37	48765063200010	2005-12-06	2008-12-30
fr-484334016-00033-2017-02-19	fr-484334016	SOCIETE SAINT ELOI	48433401600033	2005-09-15	\N
fr-479920035-00033-2018-03-12	fr-479920035	NEPTUNE ENERGY FRANCE	47992003500033	2018-03-12	\N
fr-479920035-00025-2017-10-12	fr-479920035	ENGIE E&P FRANCE	47992003500025	2016-04-14	2018-03-11
fr-479920035-00025-2010-10-18	fr-479920035	GDF SUEZ E ET P FRANCE	47992003500025	2009-10-29	2016-04-13
fr-479920035-00017-2008-05-02	fr-479920035	GDF E&P MANAGEMENT	47992003500017	2008-05-02	2009-10-28
fr-479920035-00017-2008-01-01	fr-479920035	GDF INVESTISSEMENTS 32	47992003500017	2004-12-06	2008-05-01
fr-481446052-00013-2013-09-25	fr-481446052	UNION MINIERE DE SAUL	48144605200013	2005-03-10	\N
fr-457202331-00072-2018-12-14	fr-457202331	ETABLISSEMENTS MAUREL ET PROM	45720233100072	1957-01-01	\N
fr-479607335-00029-2016-12-31	fr-479607335	STATION ANTILLAISE DE GRANULATS (SAG)	47960733500029	2005-04-29	\N
fr-479607335-00011-2004-12-25	fr-479607335	SOCIETE ANTILLAISE DE GRANULATS (SAG)	47960733500011	2004-09-01	2005-04-28
fr-484860507-00017-2008-01-01	fr-484860507	TOISON D OR	48486050700017	2005-11-02	\N
fr-484860507-xxxxx-2005-01-01	fr-484860507	\N	484860507xxxxx	2005-01-01	2005-11-01
fr-488362955-00012-2008-01-01	fr-488362955	NOUVELLE COMPAGNIE DES TRAVAUX AURIFERES (NCTA)	48836295500012	2006-01-01	\N
fr-478328743-00032-2017-10-05	fr-478328743	SOCIETE L OR D OYAPOQUE (GOLDOYA)	47832874300032	2014-01-27	\N
fr-478328743-00024-2008-01-01	fr-478328743	GOLDOYA	47832874300024	2004-09-01	2014-01-26
fr-479881302-00034-2017-03-26	fr-479881302	SANDS RESSOURCES	47988130200034	2005-01-01	\N
fr-498658004-00011-2008-01-01	fr-498658004	DEME BUILDING MATERIALS NV	49865800400011	2005-06-30	\N
fr-497818526-00012-2017-12-31	fr-497818526	MONSIEUR ROBERT EDA	49781852600012	2007-05-02	\N
fr-494240567-00011-2019-06-28	fr-494240567	RENOUVEAU ENERGIE RESSOURCES	49424056700011	2007-01-24	\N
fr-493318794-00028-2013-05-15	fr-493318794	BRIDGEOIL	49331879400028	2006-12-15	\N
fr-488363177-00012-2013-07-01	fr-488363177	MONSIEUR EUGENE BECLONG	48836317700012	2006-02-01	\N
fr-502023468-00015-2013-11-13	fr-502023468	COMPAGNIE MINIERE JOHNNY ET JEAN SARL (C.M.2.J SARL)	50202346800015	2008-01-16	\N
fr-505332510-00013-2008-08-01	fr-505332510	MINEA	50533251000013	2008-08-01	\N
fr-490053378-00025-2018-12-31	fr-490053378	THERMOPYLES	49005337800025	2006-05-12	\N
fr-490163102-00018-2010-12-31	fr-490163102	ERMINA	49016310200018	2006-02-28	\N
fr-491830576-00014-2008-09-01	fr-491830576	COMPAGNIE D EXPLOITATION MINIERE D AMERIQUE DU SUD (CEMAS) (CEMAS)	49183057600014	2006-12-06	\N
fr-491830576-00014-2006-10-01	fr-491830576	CEMAS	49183057600014	2006-09-12	2006-12-05
fr-490096591-00337-2018-12-31	fr-490096591	IMERYS CERAMICS FRANCE	49009659100337	2007-03-01	\N
fr-490096591-00014-2007-02-28	fr-490096591	PARNASSE VINGT QUATRE	49009659100014	2006-05-10	2007-02-28
fr-501152193-00048-2018-12-03	fr-501152193	LA FRANCAISE DE L'ENERGIE	50115219300048	2015-06-24	\N
fr-501152193-00048-2013-09-30	fr-501152193	EUROPEAN GAS	50115219300048	2007-11-20	2015-06-23
fr-500460407-00025-2011-01-09	fr-500460407	POROS	50046040700025	2007-10-08	\N
fr-492428552-00011-2010-10-20	fr-492428552	MADAME JOSEPHINE DEROCHE	49242855200011	2006-11-06	\N
fr-492428552-00011-2006-10-19	fr-492428552	\N	49242855200011	2006-10-19	2006-11-05
fr-489179820-00019-2008-03-12	fr-489179820	MONSIEUR ANTONIO MARQUES DA CRUZ	48917982000019	2006-03-20	\N
fr-504838699-00016-2018-06-01	fr-504838699	INVESTAQ ENERGIE	50483869900016	2009-07-28	\N
fr-504838699-00016-2008-06-12	fr-504838699	SCDM INVEST-2	50483869900016	2008-06-12	2009-07-27
fr-492514955-00011-2008-03-06	fr-492514955	MYDAS	49251495500011	2006-10-24	\N
fr-492942586-00016-2008-01-01	fr-492942586	EURL SEMALY	49294258600016	2006-11-21	\N
fr-489615294-00019-2008-01-01	fr-489615294	MEHDI OR	48961529400019	2006-04-13	\N
fr-500243290-00011-2013-12-31	fr-500243290	DIAMOCO ENERGY	50024329000011	2007-10-01	\N
fr-529770646-00014-2011-03-15	fr-529770646	FONROCHE GEOTHERMIE	52977064600014	2011-01-15	\N
fr-508738879-00016-2015-12-31	fr-508738879	CELTIQUE ENERGIE PETROLEUM	50873887900016	2008-10-01	\N
fr-511097669-00028-2018-12-27	fr-511097669	TOTAL GAS SHALE EUROPE	51109766900028	2010-09-27	\N
fr-511097669-00010-2009-03-02	fr-511097669	DEVON ENERGIE MONTELIMAR	51109766900010	2009-03-02	2010-09-26
fr-519753370-00047-2018-09-28	fr-519753370	SAS TRAJAN	51975337000047	2010-01-22	\N
fr-528859846-00024-2018-09-07	fr-528859846	VARISCAN MINES	52885984600024	2010-12-01	\N
fr-517872222-00016-2016-01-01	fr-517872222	BLUEBACH RESSOURCES	51787222200016	2009-10-27	\N
fr-523359024-00016-2016-01-02	fr-523359024	MONSIEUR ALPHONSE ABOEKA	52335902400016	2010-07-24	\N
fr-529221749-00011-2013-01-01	fr-529221749	TOTAL RAFFINAGE FRANCE	52922174900011	2011-12-16	\N
fr-529221749-00011-2010-12-10	fr-529221749	DAJA 119	52922174900011	2010-12-10	2011-12-15
fr-518090832-00024-2014-01-19	fr-518090832	MIKAGOLD	51809083200024	2009-11-10	\N
fr-513863217-00024-2012-03-26	fr-513863217	SOCIETE GUYANAISE DES MINES D'OR (SOGUMINOR)	51386321700024	2009-07-22	\N
fr-528362304-00016-2010-09-17	fr-528362304	GRANULATS NORD GASCOGNE (GNG)	52836230400016	2010-09-17	\N
fr-518087630-00019-2010-03-18	fr-518087630	EQUATOR	51808763000019	2009-11-10	\N
fr-532631272-00020-2018-12-17	fr-532631272	SOGEMI	53263127200020	2011-05-23	\N
fr-527920391-00028-2018-12-27	fr-527920391	INDORAMA OIL SAS	52792039100028	2010-10-19	\N
fr-524468444-00012-2018-03-20	fr-524468444	GRANULATS DE LA FACADE AQUITAINE (GFA)	52446844400012	2010-09-23	\N
fr-524468444-00012-2010-03-15	fr-524468444	GFA	52446844400012	2010-03-15	2010-09-22
fr-528956162-00010-2012-01-11	fr-528956162	PRO EXPERTS 4	52895616200010	2011-01-12	\N
fr-537433187-00011-2018-08-31	fr-537433187	CARRIERES ET MATERIAUX DU GRAND OUEST	53743318700011	2011-10-04	\N
fr-558501912-00239-2018-06-11	fr-558501912	ELECTRICITE DE STRASBOURG	55850191200239	1955-01-01	\N
fr-538695040-00120-2014-07-01	fr-538695040	KEM ONE	53869504000120	2012-07-02	\N
fr-538695040-00013-2011-12-21	fr-538695040	DIFI 7	53869504000013	2011-12-21	2012-07-01
fr-538720897-00023-2015-12-07	fr-538720897	MONSIEUR RUDY DE BOISVILLIERS	53872089700023	2011-12-22	\N
fr-568500649-00047-1991-06-28	fr-568500649	PECHELBRONN	56850064900047	1991-06-28	\N
fr-532662392-00010-2017-09-30	fr-532662392	ELECTERRE DE FRANCE	53266239200010	2011-05-01	\N
fr-542107651-13030-2016-03-01	fr-542107651	ENGIE	54210765113030	2015-08-04	\N
fr-542107651-13030-2015-04-24	fr-542107651	GDF SUEZ	54210765113030	2008-07-22	2015-08-03
fr-542107651-00011-2008-01-01	fr-542107651	GAZ DE FRANCE	54210765100011	1954-01-01	2008-07-21
fr-552092181-00114-2008-01-01	fr-552092181	VERMILION EMERAUDE REP	55209218100114	2006-09-01	\N
fr-552092181-00098-2004-12-25	fr-552092181	ESSO RECHERCHES EXPLOITATION PETROLIERES	55209218100098	1900-01-01	2006-08-31
fr-562034629-00013-2017-06-30	fr-562034629	SOC PETROREP	56203462900013	1956-01-01	\N
fr-539937888-00011-2016-08-12	fr-539937888	SOCIETE DE VALORISATION DU SOL AMAZONIA (S.V.S. AMAZONIA)	53993788800011	2012-02-15	\N
fr-552005969-00415-2017-09-20	fr-552005969	CEMEX GRANULATS	55200596900415	2007-01-01	\N
fr-552005969-00415-2005-01-01	fr-552005969	MORILLON CORVOL	55200596900415	2005-01-01	2006-12-31
fr-552005969-00415-2004-12-25	fr-552005969	SABLIERES ET ENTREPRISES MORILLON CORVOL	55200596900415	1900-01-01	2004-12-31
fr-538269333-00034-2015-01-25	fr-538269333	BONARETTO METAL INDUSTRIE (B.M.I)	53826933300034	2011-12-28	\N
fr-537901332-00032-2018-06-01	fr-537901332	PHENIX	53790133200032	2011-11-15	\N
fr-533562906-00016-2011-06-28	fr-533562906	SOUTH ATLANTIC PETROLEUM JDN	53356290600016	2011-06-28	\N
fr-533547279-00018-2019-07-21	fr-533547279	GUYANE MINES ET CARRIERES SARL (G.M. C. SARL)	53354727900018	2011-07-01	\N
fr-572081131-00508-2007-02-28	fr-572081131	DENAIN-ANZIN MINERAUX SA	57208113100508	1957-01-01	\N
fr-539702506-00012-2017-06-01	fr-539702506	GROUPEMENT D'INTERET ECONOMIQUE LOIRE GRAND LARGE	53970250600012	2012-01-26	\N
fr-542034327-13118-2018-07-18	fr-542034327	BP FRANCE	54203432713118	1900-01-01	\N
fr-642014526-00627-2018-12-31	fr-642014526	RHODIA CHIMIE	64201452600627	1997-01-01	\N
fr-642014526-00619-1979-01-01	fr-642014526	RHONE-POULENC CHIMIE	64201452600619	1900-01-01	1996-12-31
fr-633820337-00010-1984-12-25	fr-633820337	SOC PECHINEY SAINT GOBAIN	63382033700010	1984-12-25	\N
fr-632022711-00279-1997-05-30	fr-632022711	ELF AQUITAINE PRODUCTION	63202271100279	1997-05-30	\N
fr-750644700-00015-2019-06-25	fr-750644700	SARL GUYANE GOLD MINE (GGM)	75064470000015	2012-03-27	\N
fr-750645095-00019-2018-01-02	fr-750645095	METEOR	75064509500019	2018-01-02	\N
fr-750645095-00019-2012-04-01	fr-750645095	SARL METEOR	75064509500019	2012-04-01	2018-01-01
fr-642058788-00091-1995-02-09	fr-642058788	INDUSTRIE ANHYDRIDE CARBONIQUE	64205878800091	1995-02-09	\N
fr-625780135-00038-2016-12-01	fr-625780135	INOVYN FRANCE	62578013500038	2015-06-30	\N
fr-625780135-00061-2011-05-10	fr-625780135	SOLVAY-ELECTROLYSE-FRANCE	62578013500061	1999-01-01	2015-06-29
fr-625780135-00053-1996-12-25	fr-625780135	COMPAGNIE DES MINES DE SEL DE POLIGNY	62578013500053	1957-01-01	1998-12-31
fr-662006543-00059-2011-06-10	fr-662006543	ERAP	66200654300059	2005-09-30	\N
fr-662006543-00042-2002-12-02	fr-662006543	RECHERCHES ACTIVITE PETROLIERE (ERAP)	66200654300042	1900-01-01	2005-09-29
fr-572172609-00016-1990-11-30	fr-572172609	EURAFREP	57217260900016	1990-11-30	\N
fr-722043007-00045-2004-06-16	fr-722043007	LUNDIN CHAMPAGNE	72204300700045	2002-01-01	\N
fr-722043007-00045-1996-12-25	fr-722043007	COPAREX CHAMPAGNE	72204300700045	1994-01-01	2001-12-31
fr-722043007-00045-1972-01-01	fr-722043007	TOTAL EXPLORATION	72204300700045	1972-01-01	1993-12-31
fr-703002535-00051-2018-12-06	fr-703002535	GEOGAZ LAVERA	70300253500051	1995-01-01	\N
fr-703002535-00036-1900-01-01	fr-703002535	STOCKAGE GEOLOGIQUE DE GAZ DE LAVERA	70300253500036	1900-01-01	1994-12-31
fr-712025048-00208-2015-11-16	fr-712025048	COMPAGNIE INDUSTRIELLE ET MINIERE (CIM)	71202504800208	1900-01-01	\N
fr-654800689-00022-2008-05-30	fr-654800689	CIMENTS CALCIA	65480068900022	1997-01-01	\N
fr-654800689-00022-1996-12-25	fr-654800689	CALCIA	65480068900022	1992-01-01	1996-12-31
fr-654800689-00022-1965-01-01	fr-654800689	CIMENTS DE LA LOIRE	65480068900022	1965-01-01	1991-12-31
fr-672049616-00085-2019-01-28	fr-672049616	GEOSEL MANOSQUE	67204961600085	2008-09-30	\N
fr-672049616-00036-2008-01-01	fr-672049616	SOC STOCKAGE GEOLOGIQUE SEL MANOSQUE	67204961600036	1900-01-01	2008-09-29
fr-729800706-00222-2019-01-01	fr-729800706	PLACOPLATRE	72980070600222	2000-01-01	\N
fr-729800706-00222-1997-12-25	fr-729800706	PLACOPLATRE LAMBERT	72980070600222	1997-01-01	1999-12-31
fr-729800706-00222-1900-01-01	fr-729800706	PLACOPLATRE S A	72980070600222	1900-01-01	1996-12-31
fr-623820651-00080-2014-01-01	fr-623820651	GAYAM	62382065100080	2001-01-01	\N
fr-623820651-00056-2000-12-25	fr-623820651	GIRARD FOSSEZ ET CIE	62382065100056	2000-01-01	2000-12-31
fr-623820651-00056-1995-12-31	fr-623820651	ETS GIRARD ET FOSSEZ ET CIE	62382065100056	1962-01-01	1999-12-31
fr-589200575-00423-2017-12-31	fr-589200575	LAFARGE GRANULATS OUEST	58920057500423	2007-06-01	\N
fr-589200575-00183-2005-04-22	fr-589200575	SOCIETE RENNAISE DE DRAGAGES	58920057500183	1958-01-01	2007-05-31
fr-572199164-00045-2019-06-05	fr-572199164	IPC PETROLEUM FRANCE	57219916400045	2017-05-29	\N
fr-572199164-00045-2008-01-01	fr-572199164	LUNDIN INTERNATIONAL	57219916400045	2003-01-01	2017-05-28
fr-572199164-00045-2002-01-01	fr-572199164	UNDIN INTERNATIONAL	57219916400045	2002-01-01	2002-12-31
fr-572199164-00045-1991-01-23	fr-572199164	COPAREX INTERNATIONAL	57219916400045	1957-01-01	2001-12-31
fr-790653935-00029-2018-09-28	fr-790653935	SAS GAIA	79065393500029	2012-09-01	\N
fr-789594306-00019-2016-12-19	fr-789594306	TLS GEOTHERMICS	78959430600019	2012-11-19	\N
fr-789935145-00019-2016-04-20	fr-789935145	SOCIETE MINIERE DE KOUROU (SMK)	78993514500019	2012-12-11	\N
fr-790368518-00029-2014-06-30	fr-790368518	SOCIETE AURIFERE DE GUYANE (SAG)	79036851800029	2013-01-07	\N
fr-788811826-00023-2014-06-03	fr-788811826	AMAZON METAL (A. M.)	78881182600023	2012-12-01	\N
fr-789083805-00018-2018-01-01	fr-789083805	COMPAGNIE MINIERE DE L'ININI (C.M.I)	78908380500018	2012-10-30	\N
fr-790902332-00028-2017-12-31	fr-790902332	MONSIEUR ANTONIO RODRIGUES DOS SANTOS	79090233200028	2013-01-29	\N
fr-777344664-00159-2001-10-31	fr-777344664	GYPSE LAMBERT	77734466400159	2001-10-31	\N
fr-751617192-00024-2018-01-16	fr-751617192	SECOM EURL	75161719200024	2012-05-16	\N
fr-788183382-00027-2013-04-10	fr-788183382	LES SABLIERES DE L ATLANTIQUE	78818338200027	1972-01-01	\N
fr-765801287-00010-2017-05-10	fr-765801287	SOCIETE DE LA SALINE D EINVILLE	76580128700010	2017-05-10	\N
fr-765801287-00010-2008-01-01	fr-765801287	SOCIETE ANONYME DE LA SALINE D'EINVILLE	76580128700010	1965-01-01	2017-05-09
fr-791652399-00019-2013-09-16	fr-791652399	AMAZONE GOLD	79165239900019	2013-02-01	\N
fr-791706666-00025-2018-11-30	fr-791706666	MINIERE DE GUYANE	79170666600025	2013-03-01	\N
fr-790063911-00016-2012-11-07	fr-790063911	SPENCE MINING COMPANY (SMC)	79006391100016	2012-11-07	\N
fr-789740578-00016-2018-12-07	fr-789740578	COMPAGNIE MINIERE DE SAINT LAURENT DU MARONI (C.M.S.L.M)	78974057800016	2012-12-01	\N
fr-788214187-00015-2008-01-02	fr-788214187	CIE EUROPEENNE TRANSPORTS ATLANTIQUE (CETRA)	78821418700015	1973-01-01	\N
fr-790856850-00017-2013-12-30	fr-790856850	SUDMINE	79085685000017	2013-01-30	\N
fr-789280971-00019-2018-06-01	fr-789280971	GROUPEMENT D'INTERET ECONOMIQUE SUD ALTANTIQUE	78928097100019	2012-10-25	\N
fr-790530224-00019-2016-09-26	fr-790530224	AMAZON'OR	79053022400019	2013-02-10	\N
fr-780130175-14688-2018-11-02	fr-780130175	SOCIETE DES PETROLES SHELL (SPS)	78013017514688	1988-01-01	\N
fr-780130175-14035-1985-12-25	fr-780130175	SHELL FRANCAISE (SPS)	78013017514035	1954-01-01	1987-12-31
fr-793231762-00014-2013-07-01	fr-793231762	ELDORADO (ELDORADO SARL)	79323176200014	2013-07-01	\N
fr-798611158-00030-2019-04-12	fr-798611158	MONSIEUR RUDDY MONTANEDE	79861115800030	2013-12-01	\N
fr-792651259-00014-2017-01-07	fr-792651259	COMPAGNIE MINIERE HORTH (CMH)	79265125900014	2013-04-03	\N
fr-793173675-00018-2013-06-01	fr-793173675	SOCIETE D EXPLOITATION AURIFERES GUYANAISE (S.E.A.G)	79317367500018	2013-06-01	\N
fr-792085169-00011-2015-08-27	fr-792085169	NOUVEAU PROGRES GUYANE	79208516900011	2013-03-26	\N
fr-794389387-00034-2015-08-06	fr-794389387	MAISON GUYANE REHABILITATION ET CONSTRUCTION	79438938700034	2014-05-01	\N
fr-794389387-00018-2013-07-19	fr-794389387	MAISON GUYANE BRESIL	79438938700018	2013-07-19	2014-04-30
fr-799119441-00027-2017-04-30	fr-799119441	GEOTHERMIE DE GUADELOUPE	79911944100027	2013-12-09	\N
fr-794312231-00010-2019-04-15	fr-794312231	SOCIETE MINIERE DE L OUEST (S.M.O)	79431223100010	2013-08-01	\N
fr-792731622-00025-2016-10-27	fr-792731622	SOCIETE MINIERE HAUT MANA (S.M.H.M.)	79273162200025	2013-04-16	\N
fr-793025370-00016-2015-10-01	fr-793025370	NINOR	79302537000016	2013-05-02	\N
fr-793399551-00019-2017-05-03	fr-793399551	SAS ALTA ROCCA	79339955100019	2013-06-03	\N
fr-792731127-00017-2015-12-01	fr-792731127	COMPAGNIE D EXPLOITATION AURIFERIA (C.E.A)	79273112700017	2013-04-16	\N
fr-792884827-00017-2016-01-26	fr-792884827	GOLD'OR	79288482700017	2013-05-02	\N
fr-792677866-00016-2013-04-22	fr-792677866	MONSIEUR LUIZ REIS PINHEIRO	79267786600016	2013-04-22	\N
fr-794743104-00026-2016-05-02	fr-794743104	EURL C A A	79474310400026	2013-07-12	\N
fr-799372925-00021-2018-11-01	fr-799372925	VOLCANERGIE	79937292500021	2013-12-01	\N
fr-792732679-00024-2016-07-27	fr-792732679	PRODUCTION METAL JAUNE (P.M.J.)	79273267900024	2013-04-16	\N
fr-793697558-00013-2013-06-01	fr-793697558	MONSIEUR JIMMY LAGUERRE	79369755800013	2013-06-01	\N
fr-792370082-00010-2013-10-15	fr-792370082	SIAL	79237008200010	2013-03-20	\N
fr-809831027-00010-2018-01-29	fr-809831027	MONSIEUR SYLVESTRE PRALIER	80983102700010	2015-02-24	\N
fr-799534920-00019-2014-01-07	fr-799534920	MONSIEUR BRIAN SCHEINEMAN	79953492000019	2014-01-07	\N
fr-799938246-00011-2016-06-07	fr-799938246	MADAME SUZIMAR BATISTA DE LIMA INC	79993824600011	2014-01-27	\N
fr-811348325-00010-2019-01-14	fr-811348325	SOLEIL	81134832500010	2015-01-01	\N
fr-811383462-00017-2015-05-06	fr-811383462	SEMIR (SOCIETE EXPLOITATION MINIERE REUNIF)	81138346200017	2015-05-06	\N
fr-811348200-00015-2015-09-01	fr-811348200	SOCIETE MINIERE TORRES	81134820000015	2015-03-23	\N
fr-803949650-00011-2016-01-01	fr-803949650	TRANSPORTS VILLETTE	80394965000011	2014-09-01	\N
fr-804686582-00011-2014-09-04	fr-804686582	SGZ FRANCE SAS	80468658200011	2014-09-04	\N
fr-813079365-00017-2017-09-18	fr-813079365	MINES 3C SARL (M3C SARL)	81307936500017	2015-08-01	\N
fr-812141125-00029-2017-04-14	fr-812141125	APS MULTI -SERVICES (CMHM)	81214112500029	2017-04-14	\N
fr-812141125-00011-2015-06-11	fr-812141125	COMPAGNIE MINIERE DU HAUT MARONI (CMHM)	81214112500011	2015-06-11	2017-04-13
fr-810011601-00012-2018-03-26	fr-810011601	MIMI MINE	81001160100012	2015-03-04	\N
fr-804906105-00015-2014-10-01	fr-804906105	GIGAMINES	80490610500015	2014-10-01	\N
fr-803975135-00028-2016-03-01	fr-803975135	CORDIER MINES	80397513500028	2014-08-01	\N
fr-804070423-00012-2014-07-25	fr-804070423	GUYANE CORPORATION MINIERE	80407042300012	2014-07-25	\N
fr-807407630-00019-2017-05-03	fr-807407630	GROUPE AL MACTOUM	80740763000019	2014-10-23	\N
fr-810406157-00018-2015-02-01	fr-810406157	OROGUY	81040615700018	2015-02-01	\N
fr-811636448-00029-2016-05-17	fr-811636448	AU FORAGES	81163644800029	2015-04-10	\N
fr-811348432-00014-2015-05-01	fr-811348432	SOCIETE DE CARRIERE DE MINES (SOCARMINES)	81134843200014	2015-05-01	\N
fr-813428315-00010-2016-03-01	fr-813428315	SOCIETE MINIERE DE REGINA SOMIREG	81342831500010	2015-09-08	\N
fr-811999044-00019-2015-06-01	fr-811999044	EXALL 79	81199904400019	2015-06-01	\N
fr-819464041-00014-2018-06-29	fr-819464041	TERRE ET OR GUYANE	81946404100014	2016-03-04	\N
fr-819004854-00017-2016-03-01	fr-819004854	DIVIMINES	81900485400017	2016-01-05	\N
fr-815304399-00026-2018-06-29	fr-815304399	HEIDELBERGCEMENT FRANCE S.A.S	81530439900026	2015-12-11	\N
fr-822454872-00018-2016-11-02	fr-822454872	AMAZON RESOURCES	82245487200018	2016-10-01	\N
fr-823507553-00027-2018-11-07	fr-823507553	TORTUE	82350755300027	2016-10-30	\N
fr-823721071-00012-2016-10-20	fr-823721071	GUYANE RESSOURCES	82372107100012	2016-10-20	\N
fr-818182156-00013-2017-05-02	fr-818182156	TDG MINES ET LOCATIONS	81818215600013	2016-01-01	\N
fr-821136710-00018-2016-12-31	fr-821136710	SASU SOFERRO (SOFERRO)	82113671000018	2016-12-31	\N
fr-821136710-00018-2016-10-14	fr-821136710	SARL SOFERRO (SOFERRO)	82113671000018	2016-06-27	2016-12-30
fr-821212651-00011-2017-06-30	fr-821212651	BONOR SAS	82121265100011	2016-07-01	\N
fr-820192342-00013-2016-04-01	fr-820192342	COMPAGNIE REICOO	82019234200013	2016-04-01	\N
fr-821591286-00017-2016-09-01	fr-821591286	MAC MAHON (M.M.)	82159128600017	2016-09-01	\N
fr-822591715-00021-2018-06-07	fr-822591715	CUB OR GUYANE (C.O.G.)	82259171500021	2016-07-20	\N
fr-814103982-00025-2017-07-27	fr-814103982	J.E MINERATION	81410398200025	2015-10-15	\N
fr-814636981-00015-2015-11-10	fr-814636981	EURL C.M.P.	81463698100015	2015-11-10	\N
fr-814981379-00013-2016-05-01	fr-814981379	SAS AMOURETTE Y.A	81498137900013	2015-10-16	\N
fr-816020291-00083-2010-12-17	fr-816020291	SOCIETE INDUSTRIELLE DU CENTRE (SIC)	81602029100083	1960-01-01	\N
fr-814908869-00013-2018-01-08	fr-814908869	HERA	81490886900013	2015-11-01	\N
fr-818854432-00023-2019-03-19	fr-818854432	SOCIETE GENERALE DE TRAVAUX ET SERVICES (SGTS SAS)	81885443200023	2016-04-03	\N
fr-819225491-00011-2017-09-04	fr-819225491	COMPAGNIE MINIERE GUYANAISE (C.M.G)	81922549100011	2016-01-19	\N
fr-820959948-00010-2017-07-01	fr-820959948	OR AMAZONIE PRESTA	82095994800010	2016-07-01	\N
fr-832919286-00019-2017-10-26	fr-832919286	TAKARI MINING	83291928600019	2017-10-26	\N
fr-827687807-00012-2017-02-02	fr-827687807	OB MINING SAS	82768780700012	2017-02-02	\N
fr-833619125-00028-2018-09-20	fr-833619125	RESSOURCES REUNION SAS	83361912500028	2017-11-08	\N
fr-828089284-00016-2018-12-31	fr-828089284	NORD GOLD GUIANA SAS	82808928400016	2017-01-02	\N
fr-830954806-00014-2018-11-01	fr-830954806	BELIZON	83095480600014	2017-06-01	\N
fr-840580328-00010-2018-06-15	fr-840580328	MONSIEUR MICHEL ASAITIE	84058032800010	2018-06-15	\N
fr-824490759-00019-2016-11-01	fr-824490759	PATAWA	82449075900019	2016-11-01	\N
fr-828249896-00022-2019-04-15	fr-828249896	COMPAGNIE MINIERE AURIFERE DE GUYANE (CMAG)	82824989600022	2017-02-22	\N
fr-832266175-00013-2017-09-07	fr-832266175	SREDG	83226617500013	2017-09-07	\N
fr-839888138-00014-2018-05-28	fr-839888138	ABOUNAMI GOLD	83988813800014	2018-05-28	\N
fr-838049344-00016-2018-02-26	fr-838049344	CHAMB'OR	83804934400016	2018-02-26	\N
fr-829591924-00016-2017-03-01	fr-829591924	COMPAGNIE FRANCAISE DU MATARONI (CFM)	82959192400016	2017-03-01	\N
fr-838049369-00013-2018-02-26	fr-838049369	TOUK'OR	83804936900013	2018-02-26	\N
fr-827791120-00013-2017-03-01	fr-827791120	CIE MINIERE PHOENIX	82779112000013	2017-01-02	\N
fr-831101555-00017-2017-07-19	fr-831101555	LA PEPITE D OR SAS	83110155500017	2017-07-19	\N
fr-830984613-00018-2017-07-18	fr-830984613	SOCIETE MINIERE AUROR (SMA)	83098461300018	2017-07-18	\N
fr-824544134-00011-2019-01-01	fr-824544134	AMAZONIE RESSOURCES MINIERES (A.R.M)	82454413400011	2016-12-16	\N
fr-832854152-00010-2018-04-03	fr-832854152	MINERATION IRACOUBO	83285415200010	2017-10-01	\N
fr-824314710-00016-2016-12-08	fr-824314710	PARIS	82431471000016	2016-12-08	\N
fr-831101522-00017-2017-07-17	fr-831101522	COMPAGNIE MINIERE CECCON	83110152200017	2017-07-17	\N
fr-840965693-00012-2018-07-13	fr-840965693	TUNGSTENE DU NARBONNAIS	84096569300012	2018-07-13	\N
fr-840965693-00012-2018-06-27	fr-840965693	SOCIETE D'EXPLORATION DU NARBONNAIS	84096569300012	2018-06-27	2018-07-12
fr-857804660-00093-2016-04-22	fr-857804660	SOCIETE DES DRAGAGE D'ANCENIS	85780466000093	1957-01-01	\N
fr-850370248-00013-2019-04-25	fr-850370248	SOCIETE MINIERE GUYANAISE DE DORLIN (SMGD)	85037024800013	2019-04-25	\N
fr-969510940-00394-2018-12-14	fr-969510940	ALUMINIUM PECHINEY	96951094000394	1970-01-01	\N
fr-849829734-00011-2019-04-11	fr-849829734	COMPAGNIE MINIERE CONTAM	84982973400011	2019-04-11	\N
fr-095580841-00617-2018-03-29	fr-095580841	TEREGA (TIGF)	09558084100617	2018-03-29	\N
fr-095580841-00617-2015-02-02	fr-095580841	TRANSPORT ET INFRASTRUCTURES GAZ FRANCE (TIGF)	09558084100617	2012-05-29	2018-03-28
fr-095580841-00013-2009-01-09	fr-095580841	TOTAL INFRASTRUCTURES GAZ FRANCE (TIGF)	09558084100013	2005-01-01	2012-05-28
fr-095580841-00013-2004-12-25	fr-095580841	GAZ DU SUD-OUEST (TIGF)	09558084100013	1994-01-01	2004-12-31
fr-095580841-00013-1992-12-25	fr-095580841	SOCIETE NATIONALE DES GAZ DU SUD-OUEST (TIGF)	09558084100013	1955-01-01	1993-12-31
fr-840649602-00025-2019-06-01	fr-840649602	PLACER APPROUAGUE GUYANE (PAG)	84064960200025	2018-06-11	\N
fr-097180582-00013-2017-05-19	fr-097180582	THERMES DE SALIES-DE-BEARN	09718058200013	2011-12-07	\N
fr-097180582-00013-2008-01-01	fr-097180582	COMPAGNIE FERMIERE DE SALIES DE BEARN	09718058200013	1971-01-01	2011-12-06
\.


--
-- Data for Name: etapes_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etapes_statuts (id, nom, couleur) FROM stdin;
acc	accepté	success
def	défavorable	error
dre	défavorable avec réserves	warning
fav	favorable	success
fre	favorable avec réserves	warning
nul	non applicable	neutral
rej	rejeté	error
nfa	non fait	neutral
fai	fait	success
ajo	ajourné	error
\.


--
-- Data for Name: etapes_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etapes_types (id, nom, fondamentale, acceptation_auto, legal_ref, legal_lien, date_debut, date_fin, sections) FROM stdin;
mfr	formalisation de la demande	t	t	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"foret\\", \\"nom\\": \\"Forêt\\", \\"type\\": \\"text\\", \\"description\\": \\"\\"}, {\\"id\\": \\"mecanise\\", \\"nom\\": \\"Prospection mécanisée\\", \\"type\\": \\"checkbox\\", \\"description\\": \\"\\"}]}"}
mdp	dépôt de la demande	t	t	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"foret\\", \\"nom\\": \\"Forêt\\", \\"type\\": \\"text\\", \\"description\\": \\"\\"}, {\\"id\\": \\"mecanise\\", \\"nom\\": \\"Prospection mécanisée\\", \\"type\\": \\"checkbox\\", \\"description\\": \\"\\"}]}"}
men	enregistrement de la demande	\N	t	\N	\N	\N	\N	\N
ide	initiation de la procédure	\N	t	\N	\N	\N	\N	\N
ret	retrait de la demande	\N	\N	\N	\N	\N	\N	\N
mod	modification de la demande	t	\N	\N	\N	\N	\N	\N
mco	demande de compléments	t	\N	\N	\N	\N	\N	\N
rco	réception de compléments	t	\N	\N	\N	\N	\N	\N
mcr	recevabilité de la demande	\N	\N	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"agent\\", \\"nom\\": \\"Agent\\", \\"type\\": \\"text\\", \\"description\\": \\"Chargé de mission de l'étude de la recevabilité du Service Aménagement du Territoire\\"}]}"}
mpu	publication de la démarche	\N	t	\N	\N	\N	\N	\N
anf	avis de mise en concurrence au JORF	\N	\N	\N	\N	\N	\N	\N
ane	avis de mise en concurrence au JOUE	\N	\N	\N	\N	\N	\N	\N
mec	avis de demande concurrente	\N	\N	\N	\N	\N	\N	\N
spp	saisine du préfet	\N	\N	\N	\N	\N	\N	\N
apl	avis d'un service administratif local	\N	\N	\N	\N	\N	\N	\N
apm	avis de l'autorité militaire	\N	\N	\N	\N	\N	\N	\N
ama	avis d'un maire	\N	\N	\N	\N	\N	\N	\N
aep	avis d'un président d'EPCI	\N	\N	\N	\N	\N	\N	\N
epu	enquête publique	\N	\N	\N	\N	\N	\N	\N
apo	avis de la commission départementale des mines	\N	\N	\N	\N	\N	\N	\N
apd	avis du DEAL	\N	\N	\N	\N	\N	\N	\N
apr	avis du DREAL	\N	\N	\N	\N	\N	\N	\N
apw	avis du préfet maritime	\N	\N	\N	\N	\N	\N	\N
app	avis du prefet	\N	\N	\N	\N	\N	\N	\N
ppu	participation du public	\N	\N	\N	\N	\N	\N	\N
cod	consultation du conseil départemental de l'environnement et des risques sanitaires et technologiques	\N	\N	\N	\N	\N	\N	\N
cac	consultation des administrations centrales	\N	\N	\N	\N	\N	\N	\N
cim	concertation interministérielle	\N	\N	\N	\N	\N	\N	\N
scg	saisine du conseil général chargé des mines	\N	t	\N	\N	\N	\N	\N
rcg	rapport du conseil général chargé des mines	\N	\N	\N	\N	\N	\N	\N
acg	avis du conseil général chargé des mines	\N	\N	\N	\N	\N	\N	\N
spe	saisine du Conseil d'Etat	\N	t	\N	\N	\N	\N	\N
ape	avis du Conseil d'Etat	\N	\N	\N	\N	\N	\N	\N
rpe	rapport du Conseil d’État	\N	\N	\N	\N	\N	\N	\N
dim	décision implicite	t	\N	\N	\N	\N	\N	\N
dex	décision expresse	t	\N	\N	\N	\N	\N	\N
apu	publication de l'avis de décision implicite	\N	\N	\N	\N	\N	\N	\N
rpu	publication de décision au recueil des actes administratifs	t	\N	\N	\N	\N	\N	\N
dpu	publication de décision au JORF	t	\N	\N	\N	\N	\N	\N
mno	notification du demandeur	\N	\N	\N	\N	\N	\N	\N
pfd	paiement des frais de dossier	\N	\N	\N	\N	\N	\N	\N
pin	passage en instruction	\N	\N	\N	\N	\N	\N	\N
aof	avis de l'ONF	\N	\N	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"signataire\\", \\"nom\\": \\"Signataire\\", \\"type\\": \\"text\\", \\"description\\": \\"Directeur ONF ou responsable du service Service Aménagement du Territoire qui apparaitra sur les documents externe pour signature\\"}]}"}
eof	expertise ONF	\N	\N	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"expert\\", \\"nom\\": \\"Expert\\", \\"type\\": \\"text\\", \\"description\\": \\"Agent ONF qui a réalisé l'expertise\\"}, {\\"id\\": \\"agent\\", \\"nom\\": \\"Agent\\", \\"type\\": \\"text\\", \\"description\\": \\"Chargé de mission foncier du Service Aménagement du Territoire\\"}]}"}
aon	analyse ONF	\N	\N	\N	\N	\N	\N	\N
adm	analyse DEAL service mines	\N	\N	\N	\N	\N	\N	\N
ade	analyse DEAL service eau	\N	\N	\N	\N	\N	\N	\N
rde	récépissé de délcaration loi sur l'eau	\N	\N	\N	\N	\N	\N	\N
aca	avis de la commission des autorisations de recherches minières (CARM)	\N	\N	\N	\N	\N	\N	\N
pfc	paiement des frais de dossier complementaires	\N	\N	\N	\N	\N	\N	\N
def	décision de l'Office national des forêts	\N	\N	\N	\N	\N	\N	{"{\\"id\\": \\"onf\\", \\"nom\\": \\"Office National des Forêts\\", \\"elements\\": [{\\"id\\": \\"signataire\\", \\"nom\\": \\"Signataire\\", \\"type\\": \\"text\\", \\"description\\": \\"Directeur ONF ou responsable du service Service Aménagement du Territoire qui apparaitra sur les documents externe pour signature\\"}, {\\"id\\": \\"validateur\\", \\"nom\\": \\"Validateur\\", \\"type\\": \\"text\\", \\"description\\": \\"Directeur ONF ou responsable du service Service Aménagement du Territoire qui apparaitra sur les documents externe pour signature\\"}, {\\"id\\": \\"agent\\", \\"nom\\": \\"Agent\\", \\"type\\": \\"text\\", \\"description\\": \\"Chargé de mission foncier du Service Aménagement du Territoire\\"}]}"}
edm	expertise DEAL service mines	\N	\N	\N	\N	\N	\N	\N
ede	expertise DEAL service eau	\N	\N	\N	\N	\N	\N	\N
sde	saisine du DEAL	\N	\N	\N	\N	\N	\N	\N
rtd	décision de retrait	t	\N	\N	\N	\N	\N	\N
abd	décision abrogation	t	\N	\N	\N	\N	\N	\N
and	décision d'annulation par le juge administratif	t	\N	\N	\N	\N	\N	\N
sco	signature de la convention d'occupation temporaire pour activité minière (COTAM)	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: etapes_types__etapes_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etapes_types__etapes_statuts (etape_type_id, etape_statut_id, ordre) FROM stdin;
ama	fav	1
ama	def	2
ama	fre	3
ama	dre	4
aep	fav	1
aep	def	2
aep	fre	3
aep	dre	4
acg	fav	1
acg	def	2
acg	fre	3
acg	dre	4
apd	fav	1
apd	def	2
apd	fre	3
apd	dre	4
ape	fav	1
ape	def	2
ape	fre	3
ape	dre	4
apl	fav	1
apl	def	2
apl	fre	3
apl	dre	4
apm	fav	1
apm	def	2
apm	fre	3
apm	dre	4
apo	fav	1
apo	def	2
apo	fre	3
apo	dre	4
app	fav	1
app	def	2
app	fre	3
app	dre	4
apr	fav	1
apr	def	2
apr	fre	3
apr	dre	4
apu	acc	1
apu	rej	2
apw	fav	1
apw	def	2
apw	fre	3
apw	dre	4
cod	fav	1
cod	fre	2
cod	def	3
cod	dre	4
dex	acc	1
dex	rej	2
dim	acc	1
dim	rej	2
dpu	acc	1
dpu	rej	2
dpu	fai	3
mfr	nfa	1
mfr	fai	2
rpu	acc	1
rpu	rej	2
rpu	fai	3
mdp	acc	1
mdp	rej	2
mdp	fai	3
rtd	fai	3
abd	fai	3
and	fai	3
rtd	rej	2
abd	rej	2
and	rej	2
rtd	acc	1
abd	acc	1
and	acc	1
men	fai	1
mod	fai	1
\.


--
-- Data for Name: frequences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.frequences (id, nom, periodes_nom) FROM stdin;
tri	trimestriel	trimestres
men	mensuel	mois
ann	annuel	annees
\.


--
-- Data for Name: geo_systemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_systemes (id, nom, unite, zone) FROM stdin;
27561	NTF (Paris) / Lambert Nord France	mètre	France - continentale au nord de  53,5 grades North (48°09'N).
2972	RGFG95 / UTM zone 22N	mètre	Guyane française - onshore et offshore.
4275	NTF (Greenwich)	degré	France - onshore - continentale et Corse.
4807	NTF (Paris)	grade	France - onshore - continentale et Corse.
27573	NTF (Paris) / Lambert zone III	mètre	France - continentale au sud de 50,5 grades nord (45°27'N).
3949	RGF93 / CC49	mètre	France - continentale entre 48°N et 50°N.
2154	RGF93 / Lambert-93	mètre	France - onshore et offshore - continentale et Corse.
27572	NTF (Paris) / Lambert zone II	mètre	France - continentale entre 45°27'N et 48°09'N.
32620	WGS84 / UTM zone 20N	mètre	Hémisphère Nord - entre 66°W et 60°W
4171	RGF93	degré	France - onshore et offshore - continentale et Corse.
27571	NTF (Paris) / Lambert zone I	mètre	France - continentale au nord de 53,5 grades nord (48°09'N).
4326	WGS84	degré	Monde
32622	WGS84 / UTM zone 22N	mètre	Hémisphère Nord - entre 54°W et 48°W
32621	WGS84 / UTM zone 21N	mètre	Hémisphère Nord - entre 60°W et 54°W
27563	NTF (Paris) / Lambert Sud france	mètre	France - continentale au sud de 50,5 grades nord (45°27'N).
4230	ED50	degré	Europe
32630	WGS84 / UTM zone 30N	mètre	Hémisphère Nord - entre 6°W et 0°W
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1259	20180521000001_domaines_types_statuts.js	1	2019-08-05 16:06:15.05+02
1260	20180521000002_demarches_etapes.js	1	2019-08-05 16:06:15.089+02
1261	20180521000003_unites.js	1	2019-08-05 16:06:15.1+02
1262	20180521000004_substances.js	1	2019-08-05 16:06:15.127+02
1263	20180521000005_territoires.js	1	2019-08-05 16:06:15.143+02
1264	20180521000006_calendrier.js	1	2019-08-05 16:06:15.157+02
1265	20180521000006_repertoire.js	1	2019-08-05 16:06:15.196+02
1266	20180522000001_titres.js	1	2019-08-05 16:06:15.203+02
1267	20180522000002_titres_demarches_etapes.js	1	2019-08-05 16:06:15.234+02
1268	20180522000003_titres_etapes_substances_emprises.js	1	2019-08-05 16:06:15.247+02
1269	20180522000004_titres_etapes_utilisateurs_titulaires_amodiataires_administrations.js	1	2019-08-05 16:06:15.266+02
1270	20180522000005_titres_etapes_points.js	1	2019-08-05 16:06:15.279+02
1271	20180522000006_titres_etapes_communes.js	1	2019-08-05 16:06:15.286+02
1272	20180522000007_titres_etapes_documents.js	1	2019-08-05 16:06:15.294+02
1273	20180522000008_titres_etapes_incertitudes.js	1	2019-08-05 16:06:15.3+02
1274	20181106000001_metas_activites.js	1	2019-08-05 16:06:15.323+02
1275	20181106000002_titres_activites.js	1	2019-08-05 16:06:15.335+02
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: mois; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mois (id, nom, frequence_id, trimestre_id) FROM stdin;
1	janvier	men	1
2	février	men	1
3	mars	men	1
4	avril	men	2
5	mai	men	2
6	juin	men	2
7	juillet	men	3
8	août	men	3
9	septembre	men	3
10	octobre	men	4
11	novembre	men	4
12	décembre	men	4
\.


--
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pays (id, nom, timezone) FROM stdin;
FR	République Française	Europe/Paris
GP	Département de la Guadeloupe	\N
GF	Département de la Guyane	\N
MQ	Département de la Martinique	\N
NC	Nouvelle-Calédonie	\N
PF	Polynésie Française	\N
XX	Clipperton (Île)	\N
PM	Collectivité Territoriale de Saint-Pierre-et-Miquelon	\N
TF	Terres Australes Françaises	\N
WF	Wallis-et-Futuna	\N
YT	Département de Mayotte	\N
BL	Collectivité d'outre-mer de Saint-Barthélemy	\N
MF	Collectivité d'outre-mer de Saint-Martin	\N
RE	Département de La Réunion	\N
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, nom, ordre) FROM stdin;
super	Super	1
admin	Admin	2
editeur	Éditeur	3
onf	Onf	5
lecteur	Lecteur	4
entreprise	Entreprise	6
defaut	Défaut	7
\.


--
-- Data for Name: phases_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phases_statuts (id, nom, couleur) FROM stdin;
ech	échu	neutral
val	valide	success
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, nom, pays_id, cheflieu_id) FROM stdin;
01	Guadeloupe	GP	97105
02	Martinique	MQ	97209
03	Guyane	GF	97302
04	La Réunion	RE	97411
06	Mayotte	YT	97608
11	Île-de-France	FR	75056
24	Centre-Val de Loire	FR	45234
27	Bourgogne-Franche-Comté	FR	21231
28	Normandie	FR	76540
32	Hauts-de-France	FR	59350
44	Grand Est	FR	67482
52	Pays de la Loire	FR	44109
53	Bretagne	FR	35238
75	Nouvelle-Aquitaine	FR	33063
76	Occitanie	FR	31555
84	Auvergne-Rhône-Alpes	FR	69123
93	Provence-Alpes-Côte d'Azur	FR	13055
94	Corse	FR	2A004
\.


--
-- Data for Name: statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuts (id, nom, couleur) FROM stdin;
dmc	demande classée	neutral
dmi	demande initiale	warning
ech	échu	neutral
ind	indéterminé	warning
mod	modification en instance	warning
val	valide	success
\.


--
-- Data for Name: substances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substances (id, nom, symbole, gerep, description) FROM stdin;
acti	actinium	Ac	\N	\N
aloh	bauxite	Al	\N	\N
amph	amphibolite	\N	1401	Roche métamorphique présentant de bonnes caractéristiques géomécaniques, de couleur sombre (gris à vert foncé) riche en silicates calciques et ferromagnésiens (essentiellement hornblende, mais aussi feldspath plagioclase) et de minéraux annexes (pyroxène, micas). Elle est utilisée comme roche ornementale et de construction et comme granulat.
anda	andalousite / sillimanite / kyanite - (cyanite - disthène)	\N	2002	Minéral - Silicate d'alumine (SiAl2O5). L'andalousite, la silimanite et la Kyanite (Cyanite ou Disthème) ont la même composition chimique mais avec une structure cristalline et des propriétés physico-minéraloriques différentes (triclinique) autrement dit une variété allotropique (même formule chimique mais système cristallin différent). En France, on ne connait pas de gisement de Kyanite à ce jour. L'andalousite et la silimanite y sont exploitées et sont utilisées dans l'industrie. L'andalousite est utilisée pour ses propriétés réfractaires et son excellente résistance aux chocs thermiques. La silimanite, utilisée pour le même usage réfractaire, a toutefois des propriétés physico-minéraloriques sensiblement différentes de l'andalousite.
ande	andésite	\N	1301	Roche volcanique de couleur gris-clair constituée de cristaux de silicates (plagioclases, biotite, hornblende, pyroxène) dans une matrice vitreuse, avec une bonne homogénéité texturale. Elle présente une bonne résistance mécanique et à l'abrasion.
anhy	anhydrite	\N	2003	Forme anhydre (CaSO4) du sulfate de calcium hydraté (gypse), utilisée comme charge dans l'industrie des peintures, plastiques et comme régulateur de prise dans les ciments, plus rarement comme amendement.
anti	antimoine	Sb	\N	\N
ardo	ardoises	\N	1402	Roche schistosée, à l'origine une argile, ayant subi un faible métamorphisme. Variétés gris-bleuté à noire dont la texture (à grains très fin et homogène) et la fissillité (débit en plaques fines) sont mis à profit pour la fabrication d'éléments de toiture, de parement et de dallage pour les variétés plus gréseuses (autres utilisations possibles: additifs pour la fabrication du clinker et des ciments).
argc	argiles communes	\N	1101	Roche sédimentaire tendre à grain très fin, constituée de minéraux argileux à dominante de smectites-illites, ainsi que d'autres minéraux (quartz, oxydes...) de couleur gris-foncé, brune, jaune-oranger ou rougeâtre. Elles forment une pâte en présence d'eau et durcissent à la cuisson (terres-cuites). peuvent être utilisées (10 à 20%) dans la fabrication du clinker, constituant de base de tous les ciments.
arge	argent	Ag	\N	\N
argf	argiles fibreuses (attapulgites ou palygorskites, sépiolites)	\N	1103	Roches sédimentaires tendre à grains fins, constituées majoritairement d'argiles alumino-magnésiennes (fibres de 1 à 3 µm de long et de 100 à 300 Angstroms de large. La différence entre la largeur des fibres permet de différentier les sépiolites des attapulgites). L'existence de micropores entre les fibres, confèrent à ces argiles une grande capacité d'absorption.
argk	argiles kaoliniques	\N	1102	Roche sédimentaire tendre à grains très fins constituée principalement de kaolinite (minéral argileux blanc à crème) utilisée pour ses propriétés en céramiques communes (sanitaires) et pour matériaux réfractaires (fabrication de chamottes).
args	argiles	\N	1104	Roches sédimentaires peu consolidées formées de minéraux argileux comme la montmorillonite (silicate d'aluminium et de magnésium hydraté) et la beidellite (silicate naturel d'aluminium hydraté). Ces phyllosilicates ont des propriétés physico-chimiques (gonflement en présence d'eau, rhéologie, adsorption, échanges cationiques...) avec de nombreuses applications dans les secteurs industriels (chimie, métallurgie, environnement, produit de collage en œnologie pour l'élimination des protéines des vins blancs et rosés. Synonyme : bentonite, "terre à foulon".
arse	arsenic	As	\N	\N
asta	astate	At	\N	\N
auru	or	Au	\N	\N
bary	barytine	\N	2004	Minéral - Sulfate de baryum (BaSO4) présentant une forte densité (4,5) et une bonne inertie chimique utilisé comme charge minérale dans les boues de forage, les bétons spéciaux des installations nucléaires (radioprotection) et certaines peintures industrielles.
basa	basalte	\N	1302	Roche volcanique dure et massive de couleur gris-foncé à noire, constituée de fin cristaux (pyroxène et olivine) dans une masse vitreuse. Excellentes propriétés mécaniques (dureté), utilisation en tant que granulats et roche ornementale et de construction.
bery	béryllium	Be	\N	\N
bism	bismuth	Bi	\N	\N
buta	butane	\N	\N	\N
cadm	cadmium	Cd	\N	\N
calc	calcaires	\N	1105	Roche sédimentaire (couleur blanc-beige-gris) principalement constituée de calcite (carbonate de calcium (CaCO3) faisant effervescence à l'acide). Caractéristiques pétrophysiques et géomécaniques très hétérogènes en fonction de la cristallinité, porosité, teneur en autres constituants (argiles, quartz...). Pour les variétés de haute pureté et blancheur, utilisations comme charges minérales. Autres utilisations : sidérurgie, verrerie, amendements, principale matière première pour la fabrication du clinker et de la chaux. Elle est également très employée en tant pierre ornementale et de construction et pour les granulats.
caci	calcaires cimentiers	\N	1105	\N
cals	calcschiste	\N	1403	Roche métamorphique, d'aspect rubané, provenant de formations argileuses plus ou moins carbonatées comme les marnes et calcaires marneux. Peut être utilisée comme matière première en remplacement du calcaire et/ou des marnes dans la fabrication du clinker, le constituant de base des ciments.
cend	cendres volcaniques riches en silice	\N	1303	Roche volcanique formée de fragments généralement à grains fins, peu indurée (pulvérulente) ou indurée. Elle est utilisée en tant que granulats ou comme roches ornementales et de construction.
ceri	cérium	Ce	\N	\N
cesi	césium	Cs	\N	\N
cfan	anthracite	\N	\N	\N
cfch	charbon	\N	\N	\N
cfho	houille	\N	\N	\N
cfli	lignite	\N	\N	\N
cfxx	combustibles fossiles	\N	\N	\N
chro	chrome	Cr	\N	\N
coba	cobalt	Co	\N	\N
coox	gaz carbonique	CO2	\N	\N
corn	cornéenne	\N	1404	Roche métamorphique cristalline plus ou moins orientée, habituellement très dure produite sous l'action de la chaleur d'un magma en fusion (métamorphisme de contact). Les grains sont d'une grosseur homogène et ne suivent pas une orientation préférentielle. Leur composition minéralogique varie selon le degré de métamorphisme et la nature des roches initiales. Elles présentent en général de bonnes résistances au choc et à l'abrasion.
ocre	ocres	\N	1113	Mélange sédimentaire naturel de kaolinite (argile), d'oxyde de fer rouge (hématite) et d'hydroxyde de fer jaune-oranger (limonite) utilisé pour la production de pigments naturels dans les peintures et les enduits.
oooo	non précisée(s)	\N	\N	\N
crai	craie	\N	1106	Roche sédimentaire fine, tendre, friable, de couleur blanche, composée de calcite(CaCO3) d'origine fossilifère. En amendement, est utilisée sous forme pulvérisée, broyée, concassée ou brute pour corriger les sols acides. En liant hydraulique, elle est utilisée dans des proportions de 80 à 90% dans la fabrication du clinker, le constituant de base du ciment mais sert également à la fabrication de chaux et de mortier. Pour les minéraux industriels, la pureté et la blancheur autorisent une utilisation comme charge minérale.
cuiv	cuivre	Cu	\N	\N
daci	dacite	\N	1304	Roche volcanique de couleur gris-clair constituée de fins cristaux de quartz, plagioclase et silicates ferro-magnésiens baignant dans un verre. Elle est utilisée comme roche ornementale ou de construction et comme granulat.
diab	diabase	\N	1405	Roche métamorphique dure, d'origine volcanique à grain fin de couleur sombre (issue de dolérite). Elle est utilisé comme granulat.
diam	diamant	\N	\N	\N
diat	diatomites	\N	1108	Roche sédimentaire tendre et légère formée par accumulation de carapaces siliceuses de micro-organismes en milieux lacustes ou marins. Utilisations industrielles : filtration de liquides alimentaires, charge minérale, absorbant de pollutions. En liant hydraulique, elle peut être utilisée comme additifs pour la fabrication de certains ciments.
dior	diorites	\N	1201	Roche plutonique cristalline à texture grenue et homogène, constituée de feldspaths blanchâtres et de silicates ferro-magnésiens colorés (amphiboles, biotite...). En roche ornemental et de construction, elle est sélectionnée pour son aspect décoratif. En granulat, cette roche présente de bonnes caractéristiques mécaniques.
dole	dolérite	\N	1305	Roche volcanique massive, compacte, de couleur sombre (grise à noire), composée de fins cristaux de feldspaths calciques, de pyroxène et parfois d'oxydes de fer. Elle est utilisée en tant que granulats ou en roche ornementale et de construction. On la trouve en association possible des dolérites altérées (diabases issues du métamorphisme des dolérites).
dolo	dolomie	\N	1109	Roche sédimentaire constituée principalement de dolomite (carbonate double de calcium et de magnésium). Utilisée comme charge minérale dans de nombreuses applications : peintures et enduits, élastomères, papiers et revêtements de sol ou dans l'industrie du verre. Au regard de ses propriétés chimiques, est utilisée comme amendement sous forme pulvérisée, broyée, pour corriger le pH des sols acides.
dysp	dysprosium	Dy	\N	\N
erbi	erbium	Er	\N	\N
etai	étain	Sn	\N	\N
ethy	éthylène	\N	\N	\N
euro	europium	Eu	\N	\N
falu	faluns	\N	1129	Roche sédimentaire meuble d'origine détritique riche en débris de coquilles d'animaux marins. Facilement délitable et transformée en sable, elle est utilisée en tant qu'amendement agricole en substitution de carbonate de calcium ou de calcite. Par le passé, cette roche a été utilisée comme sarcophage pour conserver les corps au regard de sa porosité qui permet d'éviter la putréfaction des chairs et d'absorber les exudats.
feld	feldspaths	\N	2007	Minéral - Principal constituant de nombreuses roches magmatiques dont la composition varie entre des pôles potassique (KAlSi3O8), sodique (NaAlSi3O8) et calcique (CaAl2Si2O8), utilisé en céramique et dans la verrerie.
ferx	fer	Fe	\N	\N
fluo	fluorine	F	\N	\N
gabb	gabbro	\N	1202	Roche plutonique grenue de couleur sombre, contenant des feldspaths calciques et du pyroxène (olivine, biotite et hornblende associés). Cette roche présente généralement de bonnes caractéristiques mécaniques qui la rendent utilisable comme roche ornementale et de construction et comme granulat.
gado	gadolinium	Gd	\N	\N
gall	gallium	Ga	\N	\N
galt	galets	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
gazn	gaz naturel	\N	\N	\N
geob	gîtes géothermiques basse température	\N	\N	\N
geoh	gîtes géothermiques haute température	\N	\N	\N
geom	activités géothermiques de minime importance	\N	\N	\N
germ	germanium	Ge	\N	\N
glac	dépôt glaciaire	\N	1107	Mélange de roches sédimentaires détritiques hétérogènes d'origine glaciaire constituées de fragments hétérométriques, unis par un ciment naturel (moraines et tillites). Les moraines se présentent sous forme de blocs, de cailloux de sables et d'argiles. Elles peuvent être valorisées comme granulat. Les tillites sont des conglomérats à éléments arrondis et anguleux, suffisamment indurées (dures) pour être valorisées également comme granulat ou comme roche ornementale et de construction.
gnei	gneiss	\N	1406	Roche métamorphique cristalline à faciès rubanné ou lenticulaire (alternance de lits clairs quartzo-feldspathiques et de lits sombres à micas, amphiboles et pyroxènes). Utilisée en tant que granulats pour ses propriétés mécaniques ou en tant que roche ornementale et de construction pour son aspect décoratif.
grai	granite et granulite	\N	1203	Roche plutonique cristalline à texture grenue de couleur claire (gris, rose ou jaune) composée de quartz, feldspaths et micas, sélectionnée pour son aspect décoratif. Pour les roches ornementales et de construction, une définition "commerciale" existe également et est différente de celle-ci dite "acceptation scientifique" (cf. point 2.1.156 NF EN 12670 : 2001 page 16). Pour les granulats, cette roche présente de bonnes caractéristiques de rugosité. Pour les minéraux industriels, cette roche rendue friable par l'altération (arénisation) facilite l'extraction de tout ou partie de ses constituants (quartz, feldspaths et micas). Nota : Le terme GRANULITE était utilisé autrefois pour désigner des granites de couleur claire à 2 micas (noir et blanc). qui sont valorisées pour leur aspect esthétique dans le domaine des roches ornementales et de construction.
grao	granodiorite	\N	1204	Roche plutonique grenue dont la composition est intermédiaire entre le granite et la diorite. Elle est principalement constituée de quartz (> 10 %) et de feldspaths de couleur claire. Les minéraux secondaires sont la biotite (grains sombres vert, brun ou noir), l'amphibole et le pyroxène. La Pierre de Rosette qui permit de percer le mystère des hiéroglyphes est en granodiorite.
grap	graphite	\N	\N	\N
gref	grès silico-ferrugineux	\N	1111	Roche sédimentaire de couleur brun-orangé constituée d'un mélange de silice et d'oxydes et hydroxydes de fer, utilisée en tant que minéraux industriels, comme agent colorant en céramique.
mylo	mylonites	\N	1501	Roche autre cataclastique résultant du cisaillement et du broyage puis de la recristallisation plus ou moins intense de roches préexistantes de différentes natures (éventuellement recristallisées) dans une zone de formation intense de failles. Elle est constituée d'une hétérogénéité de roches.
nacl	sels de sodium	Na	\N	\N
neod	néodyme	Nd	\N	\N
gres	grès	\N	1110	Roche sédimentaire plus ou moins indurée et stratifiée, composée de grains de quartz d'origine détritique (d'une taille comprise entre 63 µm et 2 mm) soudés par un ciment interstitiel de nature variable (calcite, oxydes de fer, silice, minéraux argileux). Dans le domaine des granulats et des roches ornementales et de construction, les propriétés mécaniques et l'aspect esthétique sont valorisés. Dans le domaine des minéraux industriels, elle est utilisée comme source de silice pour la production de ferro-silicium.
grma	granulats marins	\N	\N	\N
grsi	graviers siliceux	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
gyps	gypse	\N	2008	Minéral - Sulfate de calcium hydraté (CaSO4,2H2O). Dans le domaine des liants hydrauliques, ce minéral est utilisé pour la fabrication du plâtre et comme régulateur de prise dans les ciments. Dans le domaine des minéraux industriel, sa pureté chimique et ses caractéristiques physiques comme la blancheur lui permettent d'être utilisé comme charge minérale. Dans le domaine de l'amendement, sa propriété chimique (base) est utilisée pour corriger les sols acides.
hafn	hafnium	Hf	\N	\N
heli	hélium	He	\N	\N
holm	holmium	Ho	\N	\N
hyda	asphalte	\N	\N	\N
hydc	hydrocarbures conventionnels liquides ou gazeux	\N	\N	\N
hydg	gaz combustible	\N	\N	\N
hydl	hydrocarbures liquides	\N	\N	\N
hydo	hydrocarbures liquides	\N	\N	\N
hydr	hydrocarbures	\N	\N	\N
hydx	hydrocarbures liquides ou gazeux	\N	\N	\N
indi	indium	In	\N	\N
irid	iridium	Ir	\N	\N
kals	alun	\N	\N	\N
kaol	kaolin	\N	2009	Minéral - Extrait de roches granitiques ou sédimentaires composées principalement de kaolinite (silicate d'alumine hydraté Al2Si2O5(OH)4). Le kaolin est utilisé pour sa grande pureté et sa blancheur en céramique (porcelaine) ou comme charges minérales (papier, peinture, etc.). Il peut être également utilisé comme matière première en remplacement de l'argile dans la fabrication de certains clinkers pour ciments blancs (Portland).
kclx	sels de potassium	K	\N	\N
lant	lanthane	La	\N	\N
lept	leptynite	\N	1407	Roche métamorphique cristallisée et orientée de couleur claire composée de quartz, feldspath et micas en faible quantité présentant une bonne résistance mécanique.
lith	lithium	Li	\N	\N
lute	lutécium	Lu	\N	\N
maer	maërl	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
mais	minerais	\N	\N	\N
mang	manganèse	Mn	\N	\N
marb	marbres	\N	1408	Roche métamorphique cristalline plus ou moins rubanée, contenant plus de 50 % de carbonates (calcite et plus rarement dolomite) dans laquelle les minéraux ont totalement recristallisé avec des traces d'oxydes métalliques ou d'impuretés lui donnant une grande variété de couleurs. Le métamorphisme de cette roche lui confère une plus grande dureté. Dans le domaine des roches ornementales, elle est sélectionnée pour son aspect décoratif, la recristallisation de ses composants favorise son polissage. Une définition "commerciale" existe également et est différente de celle-ci dite "acceptation scientifique" (cf. point 2.1.243 NF EN 12670 : 2001 page 22). Dans le domaine des granulats, elle est sélectionnée pour ses propriétés mécaniques (dureté, résistance aux chocs). Dans le domaine des liants hydrauliques, elle peut être utilisée comme matière première en remplacement du calcaire dans la fabrication du clinker, le constituant de base des ciments. Dans le domaine de l'amendement les composants calciques ou magnésiens sont particulièrement utiles pour la correction de pH des milieux acides. Dans le domaine des minéraux industriels, elle est utilisée, après calcination en carbonate de calcium, comme: - charge minérale dans de nombreuses applications industrielles (papier, peinture, plastiques, élastomères) - ou transformée en chaux pour la correction de pH des milieux acides.
marn	marnes	\N	1112	Roche sédimentaire plus ou moins indurée (dure) et stratifiée (couches successives de sédiments) composée d'un mélange de carbonate de calcium (CaCO3) et d'argiles de différentes natures (de 35% à 65%). Usages : Dans le domaine des granulats, l'emploi de cette roche est exceptionnel bien que présent dans les couches de découverte et que ces caractéristiques mécaniques soient compatibles avec cet usage. Si elle est utilisée comme granulat, c'est principalement sous forme de remblai et encore plus exceptionnellement en granulat pour béton. Dans le domaine de l'agriculture, cette roche est employée comme amendement du fait du mélange carbonate de calcium et argile qu'elle contient. Dans le domaine des liants hydrauliques, cette roche est souvent utilisée comme matière première en remplacement du calcaire et/ou de l'argile dans la fabrication du clinker, le constituant de base des ciments. Dans le domaine des minéraux industriels, elle est exploitée en fonction de sa richesse en calcite afin de constituer des charges minérales. Nota: Les marnes ont une composition chimique intermédiaire entre les calcaires marneux (5 à 35% d'argiles) et les argiles calcareuses ou marnes argileuses (65 à 95% d'argiles).
meba	métaux de base	\N	\N	\N
meco	métaux connexes	\N	\N	\N
mepr	métaux précieux	\N	\N	\N
merc	mercure	Hg	\N	\N
mica	micas	\N	2011	Minéral - Silicates en feuillets riches en aluminium et potassium (micas blancs) ou en magnésium et fer (micas noirs) dont les propriétés physico-minéralogiques trouvent de nombreuses applications dans les domaines de l'isolation et des charges minérales.
mics	micaschistes	\N	1409	Roche métamorphique cristallisée et schisteuse caractérisée par l'abondance de la fraction micacée et une plus faible teneur en quartz. Dans le domaine des roches ornementales et de construction, les proportions de quartz et de micas déterminent les propriétés de la roche comme la fissilité pour la production de dallage ou de couverture. Sa richesse en mica confère un aspect brillant à sa surface. Dans le domaine des minéraux industriel, cette roche est valorisée dans des applications de type charge minérale.
migm	migmatite	\N	1410	Roche métamorphique formée d'une alternance de roches de type granite de couleur sombre et de roche de type gneiss de couleur clair. La partie de couleur claire est assimilé à la partie de la roche ayant fondu et est appelée "le mobilisat". La partie de couleur sombre constitue la partie de la roche étant restée solide et est appelée "la restite". Ses bonnes propriétés mécaniques, permettent de l'utiliser comme roche ornementale et de construction ou comme granulat.
moly	molybdène	Mo	\N	\N
nick	nickel	Ni	\N	\N
niob	niobium	Nb	\N	\N
selg	sel gemme	\N	\N	\N
selh	sources d'eau salée	\N	\N	\N
ophi	ophite	\N	1205	Roche plutonique intermédiaire entre basalte et gabbro présentant un faciès plus ou moins altéré de couleur vert-foncé. En tant que roche ornementale et de construction elle est sélectionnée pour son aspect décoratif. Son emploi en tant que granulats est dû à sa dureté et à sa compacité.
osmi	osmium	Os	\N	\N
pall	palladium	Pd	\N	\N
perl	perlite	\N	1306	Roche volcanique de couleur claire à texture vitreuse plus ou moins hydratée et composition rhyolitique utilisée dans l'industrie pour la production d'agents filtrants et d'additifs fonctionnels. Elle est utilisée dans l'industrie pour la production d'agents filtrants et d'additifs fonctionnels.
phon	phonolite	\N	1307	Roche volcanique à grain très fin, de couleur grise tirant parfois sur le vert ou le brun, qui se débite en plaques et qui, sous le choc du métal, rend un son clair (dalles sonores). Sa composition chimique est déficitaire en silice (dite sous-saturées en silice). Le silicium y représente donc moins de la moitié des cations. Ces caractéristiques mécaniques (dureté) permettent son utilisation en tant que granulat. En tant que roche ornementale et de construction, elle est utilisée comme pierre ardoisière en Auvergne. En tant que minéraux industriels, sa composition chimique sous-saturée en silice est recherchée pour les industries du verre et de la céramique.
phos	phosphates	P	\N	\N
pipe	pierres précieuses	\N	\N	\N
plat	platine	Pt	\N	\N
plax	métaux de la mine du platine	\N	\N	\N
plom	plomb	Pb	\N	\N
polo	polonium	Po	\N	\N
porp	porphyre	\N	1206	Roche plutonique caractérisée par une texture intermédiaire constituée de cristaux de feldpaths baignant dans une matrice finement cristallisée. Dans le domaine des roches ornementales et de construction, la couleur variable de cette roche est utilisée pour son aspect décoratif. Dans le domaine des minéraux industriels, cette roche est employée pour ces propriétés mécaniques (dureté, résistance aux chocs et à l'abrasion).
pouz	pouzzolane	\N	1308	Roche volcanique scoriacée à texture bulleuse de couleur noire ou rouge brique. Elle est donc assez rarement exploitée en roche de construction sauf dans la région de Clermont-Ferrand et sur l'île de la Réunion. Elle permet la fabrication de moellons utilisés dans le bâtiment compte tenu de leurs propriétés (isolation thermique et phonique) (voir la fiche pouzzolane de Ph. Rocher). L'exploitation en roche ornementale est marginale et est destinée la construction de rocaille décorative dans les jardins d'agrément. En tant que granulats, elle est utilisée comme agent de sablage ou comme agrégat pour la réalisation de massifs drainants. Sa texture bulleuse peu résistante mécaniquement en fait tout de même un granulat léger notamment dans les bétons spéciaux. Dans le domaine des liants hydrauliques, elle peut être utilisée comme additifs pour la fabrication de certains ciments. Dans le domaine des minéraux industriels, elle est utilisée pour ses propriétés d'isolation phonique et thermique.
pras	praséodyme	Pr	\N	\N
prom	prométhium	Pm	\N	\N
prot	protactinium	Pa	\N	\N
prpa	propane	\N	\N	\N
prpy	propylène	\N	\N	\N
quar	quartz	\N	2012	Minéral - Oxyde de silicium (SiO2) Dans le domaine des granulats, sans grand degré de pureté le quartz est valorisé pour ses caractéristiques mécaniques et certains aspects décoratifs. Dans le domaine des minéraux industriels, sa pureté en SiO2 est recherchée pour sa résistance à l'abrasion dans les revêtements de sols ou comme agent de décapage. Elle constitue une source de silicium pour des applications verre et céramique lorsqu'il présente un très haut degré de pureté.
quat	quartzites	\N	1411	Roche métamorphique massive composée principalement de quartz issue de la recristallisation et de la cimentation du quartz. Les caractéristiques mécaniques sont favorables à la production de granulats de haute qualité (forte résistance à l'abrasion) ou à une utilisation comme roche ornementale et de construction. Le tombeau de Napoléon, aux Invalides, est réalisé dans un bloc de quartzite. Dans le domaine des minéraux industriels, sa pureté est recherchée pour être utilisée comme matériaux réfractaires.
radi	radium	Ra	\N	\N
rado	radon	Rn	\N	\N
rard	roches ardoisières	\N	1412	Roche métamorphique qui est à l'origine de l'argile ayant subi un faible métamorphisme et qui est devenue schisteuse. Ces roches ardoisières ont un plan de schistocité épais et peuvent avoir une fraction gréseuse. Elle comprend notamment les lauzes qui sont utilisées comme pierres de construction (dallage ou toiture).
rdet	roches détritiques grossières	\N	1114	Famille de roches sédimentaire détritiques (issues de la dégradation mécanique d'autres roches) constituées d'éléments grossiers (galets) arrondis (qui traduisent un transport long avant sédimentation) cimentés par des éléments plus fins de type sables et graviers. Devenues suffisamment dures (indurées) ces roches sont utilisées pour la production de granulats. En tant que roches ornementales et de construction, elles présentent des caractéristiques mécaniques et esthétiques valorisables en décoration. Cette famille regroupe les roches suivantes : les arkoses, les brèches, les conglomérats et les poudingues. Ces dernières sont celles qui sont le plus souvent utilisées comme roches ornementales.
rhen	rhénium	Re	\N	\N
rhod	rhodium	Rh	\N	\N
rhyo	rhyolite	\N	1309	Roche volcanique effusive riche en silice de couleur claire constituée de fins cristaux de feldspaths dispersés dans une matrice vitreuse valorisée pour ses propriétés mécaniques et son aspect esthétique soit en tant que roche ornementale et de construction ou en tant que granulats.
rubi	rubidium	Rb	\N	\N
ruth	ruthénium	Ru	\N	\N
rxxx	autres éléments radioactifs	\N	\N	\N
saco	sables coquilliers	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
sama	samarium	Sm	\N	\N
samg	sables moyens à grossiers	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
sasi	sables siliceux	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
scan	scandium	Sc	\N	\N
scbi	schistes bitumineux	\N	\N	\N
selp	puits d'eau salée	\N	\N	\N
pyri	pyrite	\N	\N	\N
bitu	bitume	\N	\N	\N
schi	schistes	\N	1413	Roche métamorphique à grains très fins peu ou pas décelables à l'œil nu présentant un débit en feuillet dû à la schistosité et à la présence de minéraux plats (micas, hornblende...) orientés. Utilisée pour ses propriétés mécaniques, cette roche est particulièrement délitable et donne des granulats de forme assez plate. Son aspect décoratif est valorisé en tant que roche ornementale et de construction.
sele	sélénium	Se	\N	\N
sels	sels	\N	\N	\N
selx	sel	\N	\N	\N
serp	serpentinite	\N	1414	Roche métamorphique de couleur jaunâtre à verdâtre (voire vert sombre) ou présentant des inclusions verdâtres (forme porphyrique) essentiellement constituée (plus de 75 %) d'antigorite (phyllosilicate magnésien). Cette roche provient de l'altération d'une péridotite en présence d'eau. Les serpentinites sont essentiellement exploitées aujourd'hui pour la production de granulats et plus rarement comme roches ornementales.
sexs	sable extra siliceux	\N	1120	Roche sédimentaire meuble d'origine détritique presque exclusivement constituée de grains calibrés de quartz de très grande pureté (égale ou > 98% de silice), utilisée dans les industries du verre et de la céramique et comme additif fonctionnel.
sgra	sables et graviers alluvionnaires	\N	1117	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme de sables, graviers et galets de nature variable extraits d'anciens lits de cours d'eau et utilisé comme granulat encore aujourd'hui principalement dans des bétons spéciaux ou pour des couches drainantes.
sgrm	sables et graviers marins	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
sgsc	sables et graviers silico-calcaires marins	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
sgsm	sables et graviers siliceux marins	\N	1118	Mélange sédimentaire meuble constituée d'éléments rocheux de nature variée sous forme sous forme de sables et graviers d'origine détritique, de nature siliceuse et calcaire extrait des fonds marins. Leur utilité est destinée au granulat.
sili	sillimanite	\N	2014	Minéral - Silicate d'alumine (SiAl2O5) de même composition chimique que l'andalousite mais avec une structure cristalline et des propriétés physico-minéralogiques sensiblement différentes.
silx	silex / chert	\N	1121	Roche sédimentaire d'origine détritique issue d'une précipitation chimique et constituée de silice calcédonieuse presque pure la rendant très dure et quelques impuretés telles que de l'eau ou des oxydes, ces derniers influant sur sa couleur. De part, la dureté de cette roche, elle est valorisée sous forme de granulat. Pour l'industrie, elle est utilisée, sous forme de galet plus ou moins arrondis dont les propriétés mécaniques permettent d'en faire des charges broyantes ou des produits abrasifs ou dont la grande pureté chimique permet de faire de la silice industrielle. [Définition de la norme européenne EN 932-3 : Roche sédimentaire composée de silice cryptocristalline ou microcristalline (cristaux indétectables à l'œil nu), se formant en général en couches ou en nodules dans le calcaire.] Préférer le terme SILEX au terme CHERT qui vaut dire la même chose. Le silex est un chert se formant dans la craie du Crétacé (cf. falaise d'Etretat).
skst	stockage souterrain	\N	\N	\N
smil	sables a minéraux lourds	\N	1115	Sables alluvionnaires ou de plage composés de minéraux lourds (rutile, zircon, barytine, grenat). L'accumulation des minéraux lourds se fait dans des placers dont l'origine est liée aux paramètres favorables de sédimentation. Ces minéraux peuvent être utilisés en industrie.
souf	soufre	S	\N	\N
soxx	sulfates autres que les sulfates alcalino-terreux	\N	\N	\N
sssc	sable siliceux ou silico-calcaire	\N	1119	Roche sédimentaire meuble d'origine détritique pouvant soit être constituée majoritairement de grains de quartz (fort % de silice mais < à 98%) soit de calcaire et de silice (silico-calcaire). Ce sable est principalement utilisé comme produits de correction pour la fabrication du clinker, le constituant de base des ciments.
stex	stérile d'exploitation	\N	1502	Roche d'origine diverse, caractérisée par des roches constituant des stériles d'ancienne exploitation (schiste, grès, carbonates ou roche grenue) dont les caractéristiques mécaniques et physiques permettent de les valoriser comme granulat.
suco	substances connexes	\N	\N	\N
syen	syénite	\N	1207	Roche plutonique grenue de couleur rose à rouge, composée de feldspath alcalin (assez riche en silice). Elle se rapproche du granite et du gabbro mais ne contient pas de quartz. L'équivalent volcanique d'une syénite est un trachyte. Elle est utilisée en tant que granulats ou roche ornementale et de construction.
talc	talc	\N	2015	Minéral - Silicate de magnésium hydraté (Mg3 Si4 O10 (OH)2) présentant une structure en feuillets dont les propriétés comme la dureté (1 de l'échelle de Mohs), hydrophobie, grande inertie chimique, blancheur en font un remarquable additif fonctionnel de nombreux domaines (peintures, plastiques, pharmacopée...).
tant	tantale	Ta	\N	\N
tech	technétium	Tc	\N	\N
tell	tellure	Te	\N	\N
terb	terbium	Tb	\N	\N
terv	terre végétale	\N	1122	Horizon sédimentaire humifère constitué suivant la profondeur de l'accumulation de matière organique associée à la croissance des végétaux et de l'altération du substratum rocheux sous-jacent.
thal	thallium	Tl	\N	\N
thor	thorium	Th	\N	\N
thul	thulium	Tm	\N	\N
tita	titane	Ti	\N	\N
tmas	tous métaux associés	\N	\N	\N
tour	tourbe	\N	1123	Roche sédimentaire organique résultant de l'accumulation de la matière organique liée à la croissance des végétaux et de leur transformation sous certaines conditions. Elle est utilisée principalement comme amendement.
trac	trachyte	\N	1310	Roche volcanique effusive de couleur gris-clair, à texture souvent poreuse constituée de fins cristaux (microlites) de feldspaths baignant dans une matrice vitreuse (du fait de sa teneur en silice assez élevée). Elle est utilisée pour ses bonnes caractéristiques mécaniques en tant que granulats et comme roches ornementales et de constructions (ex: lave de Volvic, lave de Chambois).
trxx	autres éléments de terres rares	\N	\N	\N
tufo	tuffeau	\N	1124	Roche sédimentaire blanchâtre peu stratifiée à texture crayeuse constituée de calcite, utilisée comme pierre de construction.
uran	uranium	U	\N	\N
vana	vanadium	V	\N	\N
wolf	tungstène	W	\N	\N
ytri	yttrium	Y	\N	\N
ytte	ytterbium	Yb	\N	\N
zinc	zinc	Zn	\N	\N
zirc	zirconium	Zr	\N	\N
\.


--
-- Data for Name: substances__substances_legales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substances__substances_legales (substance_id, substance_legale_id) FROM stdin;
acti	rxxx
aloh	aloh
amph	carx
anda	carx
ande	carx
anhy	carx
anti	anti
ardo	carx
argc	carx
arge	arge
argf	carx
argk	carx
args	carx
arse	arse
asta	rxxx
auru	auru
bary	carx
basa	carx
bery	bery
bism	bism
buta	skst
cadm	cadm
calc	carx
caci	carx
cals	carx
cend	carx
ceri	ceri
cesi	cesi
cfan	cfxx
cfch	cfxx
cfho	cfxx
cfli	cfxx
cfxx	cfxx
chro	chro
coba	coba
coox	coox
corn	carx
crai	carx
cuiv	cuiv
daci	carx
diab	carx
diam	diam
diat	carx
dior	carx
dole	carx
dolo	carx
dysp	trxx
erbi	trxx
etai	etai
ethy	skst
euro	trxx
falu	carx
feld	carx
ferx	ferx
fluo	fluo
gabb	carx
gado	trxx
gall	gall
galt	grma
gazn	skst
geob	geob
geoh	geoh
geom	geom
germ	germ
glac	carx
gnei	carx
grai	carx
grao	carx
grap	grap
gref	carx
gres	carx
grma	grma
grsi	grma
gyps	carx
hafn	hafn
heli	heli
holm	trxx
hyda	hydx
hydc	hydx
hydg	skst
hydl	skst
hydo	hydx
hydr	hydx
hydx	hydx
indi	indi
irid	plax
kals	kals
kaol	carx
kclx	kclx
lant	trxx
lept	carx
lith	lith
lute	trxx
maer	grma
mais	suco
mang	mang
marb	carx
marn	carx
meba	ferx
meba	mang
meba	chro
meba	aloh
meba	cuiv
meba	plom
meba	zinc
meba	etai
meba	tita
meba	nick
meco	suco
mepr	arge
mepr	auru
mepr	plat
mepr	plax
merc	merc
mica	carx
mics	carx
migm	carx
moly	moly
mylo	carx
nacl	nacl
neod	trxx
nick	nick
niob	niob
ocre	carx
oooo	oooo
ophi	carx
osmi	plax
pall	plax
perl	carx
phon	carx
phos	phos
pipe	diam
plat	plat
plax	plax
plom	plom
polo	rxxx
porp	carx
pouz	carx
pras	trxx
prom	trxx
prot	rxxx
prpa	skst
prpy	skst
quar	carx
quat	carx
radi	rxxx
rado	rxxx
rard	carx
rdet	carx
rhen	rhen
rhod	plax
rhyo	carx
rubi	rubi
ruth	plax
rxxx	rxxx
saco	grma
sama	trxx
samg	grma
sasi	grma
scan	trxx
scbi	cfxx
schi	carx
sele	sele
sels	kclx
sels	nacl
selx	nacl
serp	carx
sexs	carx
sgra	carx
sgrm	carx
sgsc	grma
sgsm	grma
sili	carx
silx	carx
skst	skst
smil	carx
souf	souf
soxx	soxx
sssc	carx
stex	carx
suco	suco
syen	carx
talc	carx
tant	tant
tech	rxxx
tell	tell
terb	trxx
terv	carx
thal	thal
thor	thor
thul	trxx
tita	tita
tmas	suco
tour	carx
trac	carx
trxx	trxx
tufo	carx
uran	uran
vana	vana
wolf	wolf
ytri	trxx
ytte	trxx
zinc	zinc
zirc	zirc
selg	kclx
selg	nacl
selp	kclx
selp	nacl
pyri	ferx
bitu	cfxx
\.


--
-- Data for Name: substances_legales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substances_legales (id, nom, domaine_id, description, substance_legale_code_id) FROM stdin;
carx	substances de carrière	c	\N	l100_2
cfxx	combustibles fossiles solides	f	A l'exeption de la tourbe	l111_1-1
geob	géothermie basse température	g	\N	l112_2
geoh	géothermie haute température	g	\N	l212_2
geom	géothermie de minime importance	g	\N	l112_3
coox	gaz carbonique	m	A l'exception du gaz naturellement contenu dans les eaux qui sont ou qui viendraient à être utilisées pour l'alimentation humaine ou à des fins thérapeutiques	l111_1-13
hydx	hydrocarbures liquides ou gazeux	h	A l'exeption de la tourbe	l111_1-1
aloh	bauxite	m	\N	l111_1-4
anti	antimoine	m	\N	l111_1-12
arge	argent	m	\N	l111_1-9
arse	arsenic	m	\N	l111_1-12
auru	or	m	\N	l111_1-9
bery	béryllium	m	\N	l111_1-15
bism	bismuth	m	\N	l111_1-12
cadm	cadmium	m	\N	l111_1-6
ceri	cérium	m	\N	l111_1-7
chro	chrome	m	\N	l111_1-5
coba	cobalt	m	\N	l111_1-5
cuiv	cuivre	m	\N	l111_1-6
diam	diamant	m	\N	l111_1-1
etai	étain	m	\N	l111_1-6
ferx	fer	m	\N	l111_1-5
fluo	fluorine	m	\N	l111_1-4
gall	gallium	m	\N	l111_1-15
germ	germanium	m	\N	l111_1-6
grap	graphite	m	\N	l111_1-1
hafn	hafnium	m	\N	l111_1-5
heli	hélium	m	\N	l111_1-10
indi	indium	m	\N	l111_1-6
kals	alun	m	\N	l111_1-3
kclx	sels de potassium	m	A l'état solide ou en dissolution, à l'exception de ceux contenus dans les eaux salées utilisées à des fins thérapeutiques ou de loisirs	l111_1-2
lith	lithium	m	\N	l111_1-10
mang	manganèse	m	\N	l111_1-5
merc	mercure	m	\N	l111_1-9
moly	molybdène	m	\N	l111_1-5
nacl	sels de sodium	m	A l'état solide ou en dissolution, à l'exception de ceux contenus dans les eaux salées utilisées à des fins thérapeutiques ou de loisirs	l111_1-2
nick	nickel	m	\N	l111_1-5
niob	niobium	m	\N	l111_1-8
oooo	non précisé(e)s	m	\N	l100_2
phos	phosphates	m	\N	l111_1-14
plat	platine	m	\N	l111_1-9
plax	métaux de la mine du platine	m	\N	l111_1-9
plom	plomb	m	\N	l111_1-6
rhen	rhénium	m	\N	l111_1-5
rubi	rubidium	m	\N	l111_1-10
scan	scandium	m	\N	l111_1-7
sele	sélénium	m	\N	l111_1-11
souf	soufre	m	\N	l111_1-11
soxx	sulfates non alcalino-terreux	m	\N	l111_1-3
suco	substances connexes	m	\N	l100_2
tant	tantale	m	\N	l111_1-8
tell	tellure	m	\N	l111_1-11
thal	thallium	m	\N	l111_1-15
tita	titane	m	\N	l111_1-5
trxx	autres éléments des terres rares	m	\N	l111_1-7
vana	vanadium	m	\N	l111_1-5
wolf	tungstène	m	\N	l111_1-5
zinc	zinc	m	\N	l111_1-6
zirc	zirconium	m	\N	l111_1-5
cesi	césium	r	\N	l111_1-10
radi	radium	r	\N	l111_1-10
rxxx	autres éléments radioactifs	r	\N	l111_1-10
thor	thorium	r	\N	l111_1-10
uran	uranium	r	\N	l111_1-10
skst	stockage souterrain	s	\N	l211_1
grma	granulats marins	w	\N	l100_2
\.


--
-- Data for Name: substances_legales_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.substances_legales_codes (id, nom, description, lien) FROM stdin;
l100_2	L100-2	Substances de carrière	https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000023504020
l111_1	L111-1	substances connexes	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-1	L111-1, 1°	Des hydrocarbures et des combustibles fossiles, la tourbe exceptée, qu'ils soient sous forme solide, liquide ou gazeuse, du graphite, du diamant	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-10	L111-1, 10°	De l'hélium, du lithium, du rubidium, du césium, du radium, du thorium, de l'uranium et autres éléments radioactifs	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-11	L111-1, 11°	Du soufre, du sélénium, du tellure	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-12	L111-1, 12°	De l'arsenic, de l'antimoine, du bismuth	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-13	L111-1, 13°	Du gaz carbonique, à l'exception du gaz naturellement contenu dans les eaux qui sont ou qui viendraient à être utilisées pour l'alimentation humaine ou à des fins thérapeutiques	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-14	L111-1, 14°	Des phosphates	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-15	L111-1, 15°	Du béryllium, du gallium, du thallium	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-2	L111-1, 2°	Des sels de sodium et de potassium à l'état solide ou en dissolution, à l'exception de ceux contenus dans les eaux salées utilisées à des fins thérapeutiques ou de loisirs	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-3	L111-1, 3°	De l'alun, des sulfates autres que les sulfates alcalino-terreux	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-4	L111-1, 4°	De la bauxite, de la fluorine	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-5	L111-1, 5°	Du fer, du cobalt, du nickel, du chrome, du manganèse, du vanadium, du titane, du zirconium, du molybdène, du tungstène, de l'hafnium, du rhénium	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-6	L111-1, 6°	Du cuivre, du plomb, du zinc, du cadmium, du germanium, de l'étain, de l'indium	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-7	L111-1, 7°	Du cérium, du scandium et autres éléments des terres rares	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-8	L111-1, 8°	Du niobium, du tantale	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l111_1-9	L111-1, 9°	Du mercure, de l'argent, de l'or, du platine, des métaux de la mine du platine	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000036435815&cidTexte=LEGITEXT000023501962
l112_2	L112-2	Les gîtes géothermiques basse température	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000023504069&cidTexte=LEGITEXT000023501962
l112_3	L112-3	Les activités géothermiques de minime importance	https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000025557131
l133_1	L133-1	Granulats marins	https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000023504020
l211_1	L211-1	Stockages souterrains	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000023505383&cidTexte=LEGITEXT000023501962
l212_2	L212-2	Les gîtes géothermiques haute température	https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=LEGIARTI000023504069&cidTexte=LEGITEXT000023501962
\.


--
-- Data for Name: titres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres (id, nom, type_id, domaine_id, statut_id, "references", date_debut, date_fin, date_demande, activites_deposees, activites_en_construction, activites_absentes, points_titre_etape_id, titulaires_titre_etape_id, amodiataires_titre_etape_id, administrations_titre_etape_id, surface_titre_etape_id, volume_titre_etape_id, volume_unite_id_titre_etape_id, substances_titre_etape_id, communes_titre_etape_id, engagement_titre_etape_id, engagement_devise_id_titre_etape_id) FROM stdin;
h-cxx-pezarches-1998	Pézarches	cxx	h	val	{"DGEC": "C59", "RNTM": "77TM0011"}	1998-05-07	2023-05-07	\N	\N	\N	\N	h-cxx-pezarches-1998-oct01-dpu01	h-cxx-pezarches-1998-mut01-dex01	\N	h-cxx-pezarches-1998-mut01-dpu01	h-cxx-pezarches-1998-oct01-dex01	\N	\N	h-cxx-pezarches-1998-mut01-dex01	h-cxx-pezarches-1998-oct01-dpu01	\N	\N
m-cxx-drouville-1894	Drouville	cxx	m	mod	{"DEB": "2013-0272-MI", "RNTM": "54TM0150"}	1894-11-24	2018-12-31	\N	\N	\N	\N	m-cxx-drouville-1894-oct01-dpu01	m-cxx-drouville-1894-mut06-dpu01	\N	m-cxx-drouville-1894-mut06-dpu01	\N	\N	\N	m-cxx-drouville-1894-mut06-dpu01	m-cxx-drouville-1894-oct01-dpu01	\N	\N
m-prx-bonneval-2017	Bonneval	prx	m	val	{"DEB": "2015-0004-MI", "BRGM": "TMVX01"}	2017-07-01	2022-07-01	\N	\N	\N	\N	m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01-dpu01	\N	m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01-dpu01	\N	\N	m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01-dpu01
m-cxx-le-chatelard-1978	Le Châtelard	cxx	m	mod	{"DEB": "2013-0215-MI", "RNTM": "26TM0003"}	1966-06-30	2018-12-31	\N	\N	\N	\N	m-cxx-le-chatelard-1978-mut06-dex01	m-cxx-le-chatelard-1978-mut06-dpu01	\N	m-cxx-le-chatelard-1978-mut06-dpu01	m-cxx-le-chatelard-1978-mut05-dpu01	\N	\N	m-cxx-le-chatelard-1978-mut06-dpu01	m-cxx-le-chatelard-1978-mut06-dex01	\N	\N
m-prx-crique-awa-2016	Crique Awa	prx	m	dmi	{"DEB": "2017-0006-MI"}	\N	\N	2016-10-26	\N	\N	\N	m-prx-crique-awa-2016-oct01-anf01	m-prx-crique-awa-2016-oct01-anf01	\N	m-prx-crique-awa-2016-oct01-anf01	m-prx-crique-awa-2016-oct01-anf01	\N	\N	m-prx-crique-awa-2016-oct01-anf01	m-prx-crique-awa-2016-oct01-anf01	\N	\N
m-cxx-cerville-buissoncourt-1962	Cerville-Buissoncourt	cxx	m	val	{"DEB": "2013-0274-MI", "RNTM": "54TM0152"}	1962-07-03	2043-12-31	\N	\N	\N	\N	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	\N	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	m-cxx-cerville-buissoncourt-1962-oct01-dpu02	\N	\N	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	\N	\N
m-axm-crique-nelson-2018	Crique Nelson	axm	m	val	{"DEAL": "07/2018"}	2018-10-01	2022-09-30	\N	3	\N	1	m-axm-crique-nelson-2018-oct01-dex01	m-axm-crique-nelson-2018-oct01-dex01	\N	m-axm-crique-nelson-2018-oct01-dex01	m-axm-crique-nelson-2018-oct01-dex01	\N	\N	m-axm-crique-nelson-2018-oct01-dex01	m-axm-crique-nelson-2018-oct01-dex01	\N	\N
m-prx-nem-4-2016	Nem 4	prx	m	val	{"DEB": "2013-0047-MI", "DEAL": "06/2016"}	2016-01-20	2021-01-20	\N	\N	\N	\N	m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01-dpu01	\N	m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01-dpu01	\N	\N	m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01-dpu01
w-cxx-le-minou-2011	Le Minou	cxx	w	val	{"deb": "2013-0013-GM", "ifremer": "Lmi"}	2011-07-10	2031-07-10	\N	\N	\N	\N	w-cxx-le-minou-2011-oct01-dpu01	w-cxx-le-minou-2011-oct01-dpu01	\N	w-cxx-le-minou-2011-oct01-dpu01	w-cxx-le-minou-2011-oct01-dpu01	\N	\N	w-cxx-le-minou-2011-oct01-dpu01	\N	\N	\N
g-cxx-soultz-2015	Soultz	cxx	g	val	{"DGEC": "CG-002"}	2015-09-24	2040-09-24	\N	\N	\N	\N	g-cxx-soultz-2015-oct01-dpu01	g-cxx-soultz-2015-oct01-dpu01	\N	g-cxx-soultz-2015-oct01-dpu01	g-cxx-soultz-2015-oct01-dpu01	\N	\N	g-cxx-soultz-2015-oct01-dpu01	g-cxx-soultz-2015-oct01-dpu01	\N	\N
g-cxx-bouillante-2009	Bouillante	cxx	g	val	{"DGEC": "CG-001"}	2009-06-19	2050-04-30	\N	\N	\N	\N	g-cxx-bouillante-2009-oct01-dpu01	g-cxx-bouillante-2009-oct01-dpu01	\N	g-cxx-bouillante-2009-oct01-dpu01	g-cxx-bouillante-2009-oct01-dpu01	\N	\N	g-cxx-bouillante-2009-oct01-dpu01	g-cxx-bouillante-2009-oct01-dpu01	\N	\N
g-prx-saleve-2013	Salève	prx	g	dmi	{"DGEC": "DPG027"}	\N	\N	2013-05-13	\N	\N	\N	g-prx-saleve-2013-oct01-mfr01	g-prx-saleve-2013-oct01-mfr01	\N	g-prx-saleve-2013-oct01-men01	g-prx-saleve-2013-oct01-men01	\N	\N	g-prx-saleve-2013-oct01-mfr01	g-prx-saleve-2013-oct01-mfr01	\N	\N
h-cxx-la-croix-blanche-1994	La Croix-Blanche	cxx	h	mod	{"DGEC": "C52", "RNTM": "91TM0003"}	1994-02-12	2019-02-12	\N	\N	\N	\N	h-cxx-la-croix-blanche-1994-oct01-dpu01	h-cxx-la-croix-blanche-1994-mut02-dex01	\N	h-cxx-la-croix-blanche-1994-mut02-dpu01	h-cxx-la-croix-blanche-1994-oct01-dex01	\N	\N	h-cxx-la-croix-blanche-1994-mut02-dex01	h-cxx-la-croix-blanche-1994-oct01-dpu01	\N	\N
m-axm-auror-2018	Auror	axm	m	val	{"DEAL": "20/2018"}	2018-10-01	2022-09-30	\N	\N	\N	4	m-axm-auror-2018-oct01-dex01	m-axm-auror-2018-oct01-dex01	\N	m-axm-auror-2018-oct01-dex01	m-axm-auror-2018-oct01-dex01	\N	\N	m-axm-auror-2018-oct01-dex01	m-axm-auror-2018-oct01-dex01	\N	\N
m-prx-orapu-2018	Orapu	prx	m	val	{"DEB": "2014-0004-MI"}	2018-04-26	2021-04-26	\N	\N	\N	\N	m-prx-orapu-2018-oct01-dex01	m-prx-orapu-2018-oct01-dpu01	\N	m-prx-orapu-2018-oct01-dpu01	m-prx-orapu-2018-oct01-dpu01	\N	\N	m-prx-orapu-2018-oct01-dpu01	m-prx-orapu-2018-oct01-dex01	m-prx-orapu-2018-oct01-dpu01	m-prx-orapu-2018-oct01-dpu01
m-prx-nouvelle-esperance-2010	Nouvelle Espérance	prx	m	mod	{"DEB": "2013-0089-MI", "DEAL": "18/2010", "DEB2": "2013-0556-MI"}	2010-11-05	2018-11-05	\N	\N	\N	\N	m-prx-nouvelle-esperance-2010-oct01-dpu01	m-prx-nouvelle-esperance-2010-pr101-dpu01	\N	m-prx-nouvelle-esperance-2010-pr101-dpu01	m-prx-nouvelle-esperance-2010-pr101-dpu01	\N	\N	m-prx-nouvelle-esperance-2010-pr101-dpu01	m-prx-nouvelle-esperance-2010-oct01-dpu01	m-prx-nouvelle-esperance-2010-pr101-dpu01	m-prx-nouvelle-esperance-2010-pr101-dpu01
w-cxx-les-duons-2011	Les Duons	cxx	w	val	{"deb": "2013-0014-GM", "ifremer": "Duo"}	2011-07-21	2036-07-21	\N	\N	\N	\N	w-cxx-les-duons-2011-oct01-dpu01	w-cxx-les-duons-2011-oct01-dpu01	\N	w-cxx-les-duons-2011-oct01-dpu01	w-cxx-les-duons-2011-oct01-dpu01	\N	\N	w-cxx-les-duons-2011-oct01-dpu01	\N	\N	\N
\.


--
-- Data for Name: titres_activites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_activites (id, titre_id, utilisateur_id, date, date_saisie, contenu, activite_type_id, activite_statut_id, annee, frequence_periode_id) FROM stdin;
\.


--
-- Data for Name: titres_administrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_administrations (titre_etape_id, administration_id, coordinateur) FROM stdin;
g-cxx-soultz-2015-oct01-dpu01	prefecture-67482-01	\N
g-cxx-soultz-2015-oct01-dpu01	dea-grand-est-01	\N
g-cxx-soultz-2015-oct01-dpu01	min-mtes-dgec-01	\N
g-cxx-soultz-2015-oct01-dex01	min-mtes-dgec-01	\N
g-cxx-bouillante-2009-oct01-dpu01	prefecture-97105-01	\N
g-cxx-bouillante-2009-oct01-dpu01	dea-guadeloupe-01	\N
g-cxx-bouillante-2009-oct01-dpu01	min-mtes-dgec-01	\N
g-cxx-bouillante-2009-oct01-dex01	min-mtes-dgec-01	\N
g-prx-saleve-2013-oct01-men01	min-mtes-dgec-01	\N
g-prx-saleve-2013-oct01-mfr01	prefecture-01053-01	\N
g-prx-saleve-2013-oct01-mfr01	prefecture-74010-01	\N
g-prx-saleve-2013-oct01-mfr01	deal-aura-01	\N
h-cxx-pezarches-1998-mut01-dpu01	min-mtes-dgec-01	\N
h-cxx-pezarches-1998-mut01-dex01	min-mtes-dgec-01	\N
h-cxx-pezarches-1998-oct01-dpu01	min-mtes-dgec-01	\N
h-cxx-pezarches-1998-oct01-dpu01	prefecture-77288-01	\N
h-cxx-pezarches-1998-oct01-dex01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-pro01-men01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-mut02-dpu01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-mut02-dex01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-mut01-dpu01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-mut01-dex01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01	min-mtes-dgec-01	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01	prefecture-91228-01	\N
h-cxx-la-croix-blanche-1994-oct01-dex01	min-mtes-dgec-01	\N
m-axm-auror-2018-oct01-dex01	dea-guyane-01	\N
m-axm-auror-2018-oct01-dex01	prefecture-97302-01	\N
m-cxx-drouville-1894-pro01-men01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut06-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut06-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut05-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut05-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut04-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut04-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut03-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut03-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut02-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut02-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-amo02-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-amo02-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-amo01-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-amo01-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut01-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-mut01-dex01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-oct01-dpu01	dea-grand-est-01	\N
m-cxx-drouville-1894-oct01-dpu01	min-mtes-dgaln-01	\N
m-cxx-drouville-1894-oct01-dpu01	prefecture-54395-01	\N
m-cxx-drouville-1894-oct01-dex01	min-mtes-dgaln-01	\N
m-prx-bonneval-2017-oct01-dpu01	dea-nouvelle-aquitaine-01	\N
m-prx-bonneval-2017-oct01-dpu01	min-mtes-dgaln-01	\N
m-prx-bonneval-2017-oct01-dpu01	prefecture-24322-01	\N
m-prx-bonneval-2017-oct01-dpu01	prefecture-87085-01	\N
m-prx-bonneval-2017-oct01-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-pro01-rco01	deal-aura-01	\N
m-cxx-le-chatelard-1978-pro01-rco01	prefecture-26362-01	\N
m-cxx-le-chatelard-1978-pro01-men01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut06-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut06-dex01	deal-aura-01	\N
m-cxx-le-chatelard-1978-mut06-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut06-dex01	prefecture-26362-01	\N
m-cxx-le-chatelard-1978-mut05-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut05-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut04-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut04-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut03-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut03-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut02-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut02-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut01-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-mut01-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-exp01-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-exp01-dex01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-oct01-dpu02	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-oct01-dex02	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-oct01-dpu01	min-mtes-dgaln-01	\N
m-cxx-le-chatelard-1978-oct01-dex01	min-mtes-dgaln-01	\N
m-prx-crique-awa-2016-oct01-anf01	dea-guyane-01	\N
m-prx-crique-awa-2016-oct01-anf01	prefecture-97302-01	\N
m-prx-crique-awa-2016-oct01-men01	min-mtes-dgaln-01	\N
m-prx-crique-awa-2016-oct01-mfr01	dea-guyane-01	\N
m-prx-crique-awa-2016-oct01-mfr01	prefecture-97302-01	\N
m-prx-orapu-2018-oct01-dpu01	min-mtes-dgaln-01	\N
m-prx-orapu-2018-oct01-dex01	dea-guyane-01	\N
m-prx-orapu-2018-oct01-dex01	min-mtes-dgaln-01	\N
m-prx-orapu-2018-oct01-dex01	prefecture-97302-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	dea-grand-est-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	min-mtes-dgaln-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	prefecture-54395-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01	dea-grand-est-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01	min-mtes-dgaln-01	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01	prefecture-54395-01	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu02	min-mtes-dgaln-01	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01	min-mtes-dgaln-01	\N
m-cxx-cerville-buissoncourt-1962-oct01-dex01	min-mtes-dgaln-01	\N
m-axm-crique-nelson-2018-oct01-dex01	dea-guyane-01	\N
m-axm-crique-nelson-2018-oct01-dex01	prefecture-97302-01	\N
m-prx-nem-4-2016-oct01-dpu01	dea-guyane-01	\N
m-prx-nem-4-2016-oct01-dpu01	min-mtes-dgaln-01	\N
m-prx-nem-4-2016-oct01-dpu01	prefecture-97302-01	\N
m-prx-nem-4-2016-oct01-dex01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-mut01-men01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-pr201-men01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-pr101-dpu01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-pr101-dex01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-vct01-men01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	dea-guyane-01	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	min-mtes-dgaln-01	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	prefecture-97302-01	\N
m-prx-nouvelle-esperance-2010-oct01-dex01	min-mtes-dgaln-01	\N
w-cxx-le-minou-2011-oct01-dpu01	min-mtes-dgaln-01	\N
w-cxx-le-minou-2011-oct01-dex01	min-mtes-dgaln-01	\N
w-cxx-les-duons-2011-oct01-dpu01	min-mtes-dgaln-01	\N
w-cxx-les-duons-2011-oct01-dex01	min-mtes-dgaln-01	\N
\.


--
-- Data for Name: titres_amodiataires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_amodiataires (titre_etape_id, entreprise_id, operateur) FROM stdin;
\.


--
-- Data for Name: titres_communes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_communes (titre_etape_id, commune_id) FROM stdin;
m-prx-crique-awa-2016-oct01-mfr01	97357
m-prx-crique-awa-2016-oct01-mfr01	97362
m-cxx-cerville-buissoncourt-1962-pro01-dex01	54250
m-cxx-cerville-buissoncourt-1962-pro01-dex01	54104
m-cxx-cerville-buissoncourt-1962-pro01-dex01	54110
m-cxx-cerville-buissoncourt-1962-pro01-dex01	54311
m-cxx-le-chatelard-1978-mut06-dex01	26349
m-cxx-le-chatelard-1978-mut06-dex01	26148
m-cxx-le-chatelard-1978-mut06-dex01	26083
m-cxx-le-chatelard-1978-mut06-dex01	26314
m-axm-auror-2018-oct01-dex01	97311
m-prx-orapu-2018-oct01-dex01	97310
g-prx-saleve-2013-oct01-mfr01	01109
g-prx-saleve-2013-oct01-mfr01	74077
g-prx-saleve-2013-oct01-mfr01	74074
g-prx-saleve-2013-oct01-mfr01	01209
g-prx-saleve-2013-oct01-mfr01	74069
g-prx-saleve-2013-oct01-mfr01	01308
g-prx-saleve-2013-oct01-mfr01	74309
g-prx-saleve-2013-oct01-mfr01	74250
g-prx-saleve-2013-oct01-mfr01	74042
g-prx-saleve-2013-oct01-mfr01	74024
g-prx-saleve-2013-oct01-mfr01	74240
g-prx-saleve-2013-oct01-mfr01	74244
g-prx-saleve-2013-oct01-mfr01	74021
g-prx-saleve-2013-oct01-mfr01	74298
g-prx-saleve-2013-oct01-mfr01	74197
g-prx-saleve-2013-oct01-mfr01	74040
g-prx-saleve-2013-oct01-mfr01	74012
g-prx-saleve-2013-oct01-mfr01	74094
g-prx-saleve-2013-oct01-mfr01	74128
g-prx-saleve-2013-oct01-mfr01	74153
g-prx-saleve-2013-oct01-mfr01	74145
g-prx-saleve-2013-oct01-mfr01	74305
g-prx-saleve-2013-oct01-mfr01	74008
g-prx-saleve-2013-oct01-mfr01	74133
g-prx-saleve-2013-oct01-mfr01	74118
g-prx-saleve-2013-oct01-mfr01	74243
g-prx-saleve-2013-oct01-mfr01	74304
g-prx-saleve-2013-oct01-mfr01	74311
g-prx-saleve-2013-oct01-mfr01	74226
g-prx-saleve-2013-oct01-mfr01	74037
g-prx-saleve-2013-oct01-mfr01	74122
g-prx-saleve-2013-oct01-mfr01	74087
g-prx-saleve-2013-oct01-mfr01	74209
g-prx-saleve-2013-oct01-mfr01	74284
g-prx-saleve-2013-oct01-mfr01	74162
g-prx-saleve-2013-oct01-mfr01	74043
g-prx-saleve-2013-oct01-mfr01	74229
g-prx-saleve-2013-oct01-mfr01	74158
g-prx-saleve-2013-oct01-mfr01	74193
g-prx-saleve-2013-oct01-mfr01	74211
g-prx-saleve-2013-oct01-mfr01	74220
g-prx-saleve-2013-oct01-mfr01	74262
g-prx-saleve-2013-oct01-mfr01	74185
g-prx-saleve-2013-oct01-mfr01	74018
g-prx-saleve-2013-oct01-mfr01	74044
g-prx-saleve-2013-oct01-mfr01	74082
g-prx-saleve-2013-oct01-mfr01	74016
g-prx-saleve-2013-oct01-mfr01	74313
g-prx-saleve-2013-oct01-mfr01	74177
g-prx-saleve-2013-oct01-mfr01	74259
g-prx-saleve-2013-oct01-mfr01	74059
g-prx-saleve-2013-oct01-mfr01	74015
g-prx-saleve-2013-oct01-mfr01	74282
g-prx-saleve-2013-oct01-mfr01	74306
g-prx-saleve-2013-oct01-mfr01	74224
g-prx-saleve-2013-oct01-mfr01	74253
g-prx-saleve-2013-oct01-mfr01	74116
g-prx-saleve-2013-oct01-mfr01	74007
g-prx-saleve-2013-oct01-mfr01	74090
g-prx-saleve-2013-oct01-mfr01	74052
g-prx-saleve-2013-oct01-mfr01	74296
g-prx-saleve-2013-oct01-mfr01	74009
g-prx-saleve-2013-oct01-mfr01	74228
g-prx-saleve-2013-oct01-mfr01	74216
g-prx-saleve-2013-oct01-mfr01	74031
g-prx-saleve-2013-oct01-mfr01	74124
g-prx-saleve-2013-oct01-mfr01	74201
g-prx-saleve-2013-oct01-mfr01	74260
g-prx-saleve-2013-oct01-mfr01	74101
g-prx-saleve-2013-oct01-mfr01	74184
g-prx-saleve-2013-oct01-mfr01	74144
g-prx-saleve-2013-oct01-mfr01	74288
g-prx-saleve-2013-oct01-mfr01	74314
g-prx-saleve-2013-oct01-mfr01	74088
g-prx-saleve-2013-oct01-mfr01	74096
m-axm-crique-nelson-2018-oct01-dex01	97304
m-prx-nem-4-2016-oct01-dpu01	97306
m-prx-nem-4-2016-oct01-dpu01	97303
m-prx-nouvelle-esperance-2010-oct01-dpu01	97357
m-prx-nouvelle-esperance-2010-oct01-dpu01	97360
g-cxx-soultz-2015-oct01-dpu01	67206
g-cxx-soultz-2015-oct01-dpu01	67339
g-cxx-soultz-2015-oct01-dpu01	67288
g-cxx-soultz-2015-oct01-dpu01	67290
g-cxx-soultz-2015-oct01-dpu01	67394
g-cxx-soultz-2015-oct01-dpu01	67455
g-cxx-soultz-2015-oct01-dpu01	67474
g-cxx-soultz-2015-oct01-dpu01	67254
g-cxx-soultz-2015-oct01-dpu01	67487
g-cxx-bouillante-2009-oct01-dpu01	97106
m-cxx-drouville-1894-oct01-dpu01	54139
m-cxx-drouville-1894-oct01-dpu01	54219
m-cxx-drouville-1894-oct01-dpu01	54173
m-cxx-drouville-1894-oct01-dpu01	54250
m-prx-bonneval-2017-oct01-dpu01	87096
m-prx-bonneval-2017-oct01-dpu01	87031
m-prx-bonneval-2017-oct01-dpu01	24218
m-prx-bonneval-2017-oct01-dpu01	87082
m-prx-bonneval-2017-oct01-dpu01	87187
m-prx-bonneval-2017-oct01-dpu01	87095
m-prx-bonneval-2017-oct01-dpu01	87049
m-prx-bonneval-2017-oct01-dpu01	87127
m-prx-bonneval-2017-oct01-dpu01	87039
m-prx-bonneval-2017-oct01-dpu01	87176
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	54250
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	54104
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	54110
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	54311
h-cxx-la-croix-blanche-1994-oct01-dpu01	91235
h-cxx-la-croix-blanche-1994-oct01-dpu01	91570
h-cxx-la-croix-blanche-1994-oct01-dpu01	91549
h-cxx-la-croix-blanche-1994-oct01-dpu01	91648
h-cxx-la-croix-blanche-1994-oct01-dpu01	91103
h-cxx-la-croix-blanche-1994-oct01-dpu01	91494
h-cxx-la-croix-blanche-1994-oct01-dpu01	91086
h-cxx-pezarches-1998-oct01-dpu01	77224
h-cxx-pezarches-1998-oct01-dpu01	77176
h-cxx-pezarches-1998-oct01-dpu01	77433
h-cxx-pezarches-1998-oct01-dpu01	77360
h-cxx-pezarches-1998-oct01-dpu01	77469
m-cxx-le-chatelard-1978-pro01-rco01	26349
m-cxx-le-chatelard-1978-pro01-rco01	26148
m-cxx-le-chatelard-1978-pro01-rco01	26083
m-cxx-le-chatelard-1978-pro01-rco01	26314
m-prx-crique-awa-2016-oct01-anf01	97357
m-prx-crique-awa-2016-oct01-anf01	97362
\.


--
-- Data for Name: titres_demarches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_demarches (id, titre_id, type_id, statut_id, ordre, annulation_titre_demarche_id) FROM stdin;
g-cxx-soultz-2015-oct01	g-cxx-soultz-2015	oct	acc	1	\N
g-cxx-bouillante-2009-oct01	g-cxx-bouillante-2009	oct	acc	1	\N
g-prx-saleve-2013-oct01	g-prx-saleve-2013	oct	ins	1	\N
h-cxx-pezarches-1998-mut01	h-cxx-pezarches-1998	mut	acc	2	\N
h-cxx-pezarches-1998-oct01	h-cxx-pezarches-1998	oct	acc	1	\N
h-cxx-la-croix-blanche-1994-pro01	h-cxx-la-croix-blanche-1994	pro	ins	4	\N
h-cxx-la-croix-blanche-1994-mut02	h-cxx-la-croix-blanche-1994	mut	acc	3	\N
h-cxx-la-croix-blanche-1994-mut01	h-cxx-la-croix-blanche-1994	mut	acc	2	\N
h-cxx-la-croix-blanche-1994-oct01	h-cxx-la-croix-blanche-1994	oct	acc	1	\N
m-axm-auror-2018-oct01	m-axm-auror-2018	oct	acc	1	\N
m-cxx-drouville-1894-pro01	m-cxx-drouville-1894	pro	ins	10	\N
m-cxx-drouville-1894-mut06	m-cxx-drouville-1894	mut	acc	9	\N
m-cxx-drouville-1894-mut05	m-cxx-drouville-1894	mut	acc	8	\N
m-cxx-drouville-1894-mut04	m-cxx-drouville-1894	mut	acc	7	\N
m-cxx-drouville-1894-mut03	m-cxx-drouville-1894	mut	acc	6	\N
m-cxx-drouville-1894-mut02	m-cxx-drouville-1894	mut	acc	5	\N
m-cxx-drouville-1894-amo02	m-cxx-drouville-1894	amo	acc	4	\N
m-cxx-drouville-1894-amo01	m-cxx-drouville-1894	amo	acc	3	\N
m-cxx-drouville-1894-mut01	m-cxx-drouville-1894	mut	acc	2	\N
m-cxx-drouville-1894-oct01	m-cxx-drouville-1894	oct	acc	1	\N
m-prx-bonneval-2017-oct01	m-prx-bonneval-2017	oct	acc	1	\N
m-cxx-le-chatelard-1978-pro01	m-cxx-le-chatelard-1978	pro	ins	9	\N
m-cxx-le-chatelard-1978-mut06	m-cxx-le-chatelard-1978	mut	acc	8	\N
m-cxx-le-chatelard-1978-mut05	m-cxx-le-chatelard-1978	mut	acc	7	\N
m-cxx-le-chatelard-1978-mut04	m-cxx-le-chatelard-1978	mut	acc	6	\N
m-cxx-le-chatelard-1978-mut03	m-cxx-le-chatelard-1978	mut	acc	5	\N
m-cxx-le-chatelard-1978-mut02	m-cxx-le-chatelard-1978	mut	acc	4	\N
m-cxx-le-chatelard-1978-mut01	m-cxx-le-chatelard-1978	mut	acc	3	\N
m-cxx-le-chatelard-1978-exp01	m-cxx-le-chatelard-1978	exp	acc	2	\N
m-cxx-le-chatelard-1978-oct01	m-cxx-le-chatelard-1978	oct	acc	1	\N
m-prx-crique-awa-2016-oct01	m-prx-crique-awa-2016	oct	ins	1	\N
m-prx-orapu-2018-oct01	m-prx-orapu-2018	oct	acc	1	\N
m-cxx-cerville-buissoncourt-1962-pro01	m-cxx-cerville-buissoncourt-1962	pro	acc	2	\N
m-cxx-cerville-buissoncourt-1962-oct01	m-cxx-cerville-buissoncourt-1962	oct	acc	1	\N
m-axm-crique-nelson-2018-oct01	m-axm-crique-nelson-2018	oct	acc	1	\N
m-prx-nem-4-2016-oct01	m-prx-nem-4-2016	oct	acc	1	\N
m-prx-nouvelle-esperance-2010-mut01	m-prx-nouvelle-esperance-2010	mut	ins	5	\N
m-prx-nouvelle-esperance-2010-pr201	m-prx-nouvelle-esperance-2010	pr2	ins	4	\N
m-prx-nouvelle-esperance-2010-pr101	m-prx-nouvelle-esperance-2010	pr1	acc	3	\N
m-prx-nouvelle-esperance-2010-vct01	m-prx-nouvelle-esperance-2010	vct	ins	2	\N
m-prx-nouvelle-esperance-2010-oct01	m-prx-nouvelle-esperance-2010	oct	acc	1	\N
w-cxx-le-minou-2011-oct01	w-cxx-le-minou-2011	oct	acc	1	\N
w-cxx-les-duons-2011-oct01	w-cxx-les-duons-2011	oct	acc	1	\N
\.


--
-- Data for Name: titres_demarches_liens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_demarches_liens (enfant_titre_demarche_id, parent_titre_demarche_id) FROM stdin;
\.


--
-- Data for Name: titres_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_documents (id, titre_etape_id, type, nom, jorf, nor, url, uri, fichier, public) FROM stdin;
g-cxx-soultz-2015-oct01-dpu01-431b619a	g-cxx-soultz-2015-oct01-dpu01	Décret	Décret du 22 septembre 2015 accordant la concession de gîtes géothermiques dite « concession de Soultz » (Bas-Rhin) au profit du groupement européen d'intérêt économique (GEIE) « Exploitation minière de la chaleur »	JORFTEXT000031204176	DEVR1510640D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000031204176	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000031204176	\N	t
g-cxx-soultz-2015-oct01-dex01-c7798f6f	g-cxx-soultz-2015-oct01-dex01	Décret	Décret du 22 septembre 2015 accordant la concession de gîtes géothermiques dite « concession de Soultz » (Bas-Rhin) au profit du groupement européen d'intérêt économique (GEIE) « Exploitation minière de la chaleur »	\N	DEVR1510640D	\N	\N	\N	t
g-cxx-bouillante-2009-oct01-dpu01-2c3dbd33	g-cxx-bouillante-2009-oct01-dpu01	Décret	Décret du 17 juin 2009 accordant à la société Géothermie Bouillante une concession de gîtes géothermiques dite « Concession de Bouillante » (Guadeloupe)	JORFTEXT000020756227	DEVE0829067D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000020756227	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000020756227	\N	t
g-cxx-bouillante-2009-oct01-dex01-f0e6dac7	g-cxx-bouillante-2009-oct01-dex01	Décret	Décret du 17 juin 2009 accordant à la société Géothermie Bouillante une concession de gîtes géothermiques dite « Concession de Bouillante » (Guadeloupe)	\N	DEVE0829067D	\N	\N	\N	t
h-cxx-pezarches-1998-mut01-dpu01-e54d8fae	h-cxx-pezarches-1998-mut01-dpu01	Arrêté	Arrêté du 28 février 2001 autorisant la mutation de la concession de mines d'hydrocarbures liquides ou gazeux dite « Concession de Pézarches » (Seine-et-Marne) au profit de la société Géopétrol	JORFTEXT000000768901	ECOI0100094A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000768901	\N	\N	t
h-cxx-pezarches-1998-mut01-dex01-dbbfd21b	h-cxx-pezarches-1998-mut01-dex01	Arrêté	Arrêté du 28 février 2001 autorisant la mutation de la concession de mines d'hydrocarbures liquides ou gazeux dite « Concession de Pézarches » (Seine-et-Marne) au profit de la société Géopétrol	\N	\N	\N	\N	\N	t
h-cxx-pezarches-1998-oct01-dpu01-21b89f04	h-cxx-pezarches-1998-oct01-dpu01	Décret	Décret du 30 avril 1998 accordant la concession de mines d'hydrocarbures liquides ou gazeux dite « Concession de Pézarches » (Seine-et-Marne) à la société Elf Aquitaine Production	JORFTEXT000000190600	ECOI9800326D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000190600	\N	h-cxx-pezarches-1998-oct01-dpu01	t
h-cxx-pezarches-1998-oct01-dex01-74e5f3a7	h-cxx-pezarches-1998-oct01-dex01	Décret	Décret du 30 avril 1998 accordant la concession de mines d'hydrocarbures liquides ou gazeux dite « Concession de Pézarches » (Seine-et-Marne) à la société Elf Aquitaine Production	\N	\N	\N	\N	\N	t
h-cxx-la-croix-blanche-1994-mut02-dpu01-668e1fde	h-cxx-la-croix-blanche-1994-mut02-dpu01	Arrêté	Arrêté du 21 octobre 2013 autorisant la mutation des concessions de mines d'hydrocarbures liquides ou gazeux dites « Concession de la Croix Blanche » et « Concession de Vert-le-Petit » au profit de la société Vermilion Pyrénées SAS	JORFTEXT000028114735	DEVR1322342A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000028114735	https://www.legifrance.gouv.fr/eli/arrete/2013/10/21/DEVR1322342A/jo/texte	\N	t
h-cxx-la-croix-blanche-1994-mut02-dex01-9a3e24f8	h-cxx-la-croix-blanche-1994-mut02-dex01	Arrêté	Arrêté du 21 octobre 2013 autorisant la mutation des concessions de mines d'hydrocarbures liquides ou gazeux dites « Concession de la Croix Blanche » et « Concession de Vert-le-Petit » au profit de la société Vermilion Pyrénées SAS	\N	\N	\N	\N	\N	t
h-cxx-la-croix-blanche-1994-mut01-dpu01-9e5ea84d	h-cxx-la-croix-blanche-1994-mut01-dpu01	Arrêté	Arrêté du 2 septembre 1999 autorisant la mutation de concessions de mines d'hydrocarbures liquides ou gazeux	JORFTEXT000000578504	ECOI9900437A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000578504	\N	\N	t
h-cxx-la-croix-blanche-1994-mut01-dex01-f68508c4	h-cxx-la-croix-blanche-1994-mut01-dex01	Arrêté	Arrêté du 2 septembre 1999 autorisant la mutation de concessions de mines d'hydrocarbures liquides ou gazeux	\N	\N	\N	\N	\N	t
h-cxx-la-croix-blanche-1994-oct01-dpu01-90a1ffd6	h-cxx-la-croix-blanche-1994-oct01-dpu01	Décret	Décret du 7 février 1994 accordant la concession de mines d'hydrocarbures liquides ou gazeux dite " Concession de La Croix Blanche " à la société Elf Aquitaine Production	JORFTEXT000000529441	INDE9400027D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000529441	\N	\N	t
h-cxx-la-croix-blanche-1994-oct01-dex01-7b60c8cd	h-cxx-la-croix-blanche-1994-oct01-dex01	Décret	Décret du 7 février 1994 accordant la concession de mines d'hydrocarbures liquides ou gazeux dite " Concession de La Croix Blanche " à la société Elf Aquitaine Production	\N	\N	\N	\N	\N	t
m-axm-auror-2018-oct01-dex01-171bc1c5	m-axm-auror-2018-oct01-dex01	Arrêté	Arrêté autorisant la Société Minière AUROR à exploiter une mine aurifère de type alluvionnaire sur le territoire de la commune de Saint Laurent du Maroni, sur la crique Serpent (AEX n°20-2018)	\N	R03-2018-10-01-007	\N	\N	m-axm-auror-2018-oct01-dex01	t
m-cxx-drouville-1894-mut06-dpu01-2fb02118	m-cxx-drouville-1894-mut06-dpu01	Arrêté	Arrêté du 16 juin 1999 autorisant la mutation de concessions minières	JORFTEXT000000379521	ECOI9900344A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000379521	\N	\N	t
m-cxx-drouville-1894-mut06-dex01-5fbe50df	m-cxx-drouville-1894-mut06-dex01	Arrêté	Arrêté du 16 juin 1999 autorisant la mutation de concessions minières	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-mut05-dpu01-b053ffda	m-cxx-drouville-1894-mut05-dpu01	Décret	Décret du 29 juin 1982 portant autorisation de mutation d'une concession de mines.	\N	\N	\N	\N	m-cxx-drouville-1894-mut05-dpu01	t
m-cxx-drouville-1894-mut05-dex01-f9acfa8b	m-cxx-drouville-1894-mut05-dex01	Décret	Décret du 29 juin 1982 autorisant la mutation de la concession de mines de sel gemme et sources salées de Drouville (Meurthe-et-Moselle), au profit de la Compagnie des salins du Midi et des salines de l'Est (C.S.M.S.E.)	\N	\N	\N	\N	m-cxx-drouville-1894-mut05-dex01	t
m-cxx-drouville-1894-mut04-dpu01-9981a3cb	m-cxx-drouville-1894-mut04-dpu01	Décret	Décret du 24 novembre 1975 autorisant la mutation de cinq concessions de mines de sel gemme et de sources salées au profit de la Compagnie industrielle et minière	\N	\N	\N	\N	m-cxx-drouville-1894-mut04-dpu01	t
m-cxx-drouville-1894-mut04-dex01-dac1368b	m-cxx-drouville-1894-mut04-dex01	Décret	Décret du 24 novembre 1975 autorisant la mutation de cinq concessions de mines de sel gemme et de sources salées au profit de la Compagnie industrielle et minière	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-mut03-dpu01-2b938e17	m-cxx-drouville-1894-mut03-dpu01	Décret	Décret du 16 novembre 1970 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la société Produits chimiques Pechlney-Saint-Gobaln.	\N	\N	\N	\N	m-cxx-drouville-1894-mut03-dpu01	t
m-cxx-drouville-1894-mut03-dex01-6cff56dc	m-cxx-drouville-1894-mut03-dex01	Décret	Décret du 16 novembre 1970 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la société Produits chimiques Pechlney-Saint-Gobaln.	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-mut02-dpu01-b8068b6c	m-cxx-drouville-1894-mut02-dpu01	Décret	Décret du 12 décembre 1969 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la compagnie de Saint-Gobain	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-mut02-dex01-10441a82	m-cxx-drouville-1894-mut02-dex01	Décret	Décret du 12 décembre 1969 autorisant la mutation de propriété de cinq concessions de mines de sel gemme et de sources salées au profit de la compagnie de Saint-Gobain	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-amo02-dpu01-d5b96bca	m-cxx-drouville-1894-amo02-dpu01	Décret	Décret du 13 septembre 1968 autorisant au profit de la Compagnie des salins du Midi la mutation de propriété et le transfert du bénéfice des contrats d'amodiation de concessions de sources salées, de mines de sel gemme et de houille appartenant à la Société salinière de l'Est et du Sud-Ouest.	\N	\N	\N	\N	m-cxx-drouville-1894-amo02-dpu01	t
m-cxx-drouville-1894-amo02-dex01-3c301663	m-cxx-drouville-1894-amo02-dex01	Décret	Décret du 13 septembre 1968 autorisant au profit de la Compagnie des salins du Midi la mutation de propriété et le transfert du bénéfice des contrats d'amodiation de concessions de sources salées, de mines de sel gemme et de houille appartenant à la Société salinière de l'Est et du Sud-Ouest.	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-amo01-dpu01-e54444cd	m-cxx-drouville-1894-amo01-dpu01	Décret	Décret du 13 janvier 1968 autorisant au profit de la Société salinière de l'Est l'amodiation de la concession de mines de sel gemme et sources salées de Drouville (Meurthe-et-Moselle)	\N	\N	\N	\N	m-cxx-drouville-1894-amo01-dpu01	t
m-cxx-drouville-1894-amo01-dex01-0e90e2e0	m-cxx-drouville-1894-amo01-dex01	Décret	Décret du 13 janvier 1968 autorisant au profit de la Société salinière de l'Est l'amodiation de la concession de mines de sel gemme et sources salées de Drouville (Meurthe-et-Moselle)	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-mut01-dpu01-caff92ae	m-cxx-drouville-1894-mut01-dpu01	Décret	Décret n°49-1204 du 23 août 1949 autorisant la mutation et la réunion de concessions de mines	\N	\N	\N	\N	m-cxx-drouville-1894-mut01-dpu01	t
m-cxx-drouville-1894-mut01-dex01-c8c7502c	m-cxx-drouville-1894-mut01-dex01	Décret	Décret n°49-1204 du 23 août 1949 autorisant la mutation et la réunion de concessions de mines	\N	\N	\N	\N	\N	t
m-cxx-drouville-1894-oct01-dpu01-a6425b46	m-cxx-drouville-1894-oct01-dpu01	Décret	Décret du 24 novembre 1894 instituant la concession de mines de sel et sources salées de Drouville	\N	\N	\N	\N	m-cxx-drouville-1894-oct01-dpu01	t
m-cxx-drouville-1894-oct01-dex01-bf0927bb	m-cxx-drouville-1894-oct01-dex01	Décret	Décret du 24 novembre 1894 instituant la concession de mines de sel et sources salées de Drouville	\N	\N	\N	\N	\N	t
m-prx-bonneval-2017-oct01-dpu01-d026505f	m-prx-bonneval-2017-oct01-dpu01	Arrêté	Arrêté du 22 décembre 2016 accordant un permis exclusif de recherches de mines d'or, argent, antimoine et substances connexes dit « Permis Bonneval » à la société Cordier Mines, dans les départements de la Haute-Vienne et de la Dordogne	JORFTEXT000033834947	ECFL1633782A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000033834947	https://www.legifrance.gouv.fr/eli/arrete/2016/12/22/ECFL1633782A/jo/texte	\N	t
m-prx-bonneval-2017-oct01-dex01-5c8a320a	m-prx-bonneval-2017-oct01-dex01	Arrêté	Arrêté du 22 décembre 2016 accordant un permis exclusif de recherches de mines d'or, argent, antimoine et substances connexes dit « Permis Bonneval » à la société Cordier Mines, dans les départements de la Haute-Vienne et de la Dordogne	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut06-dpu01-e457071d	m-cxx-le-chatelard-1978-mut06-dpu01	Arrêté	Arrêté du 3 juin 2009 acceptant la mutation partielle d'une concession de mines de sels de sodium	JORFTEXT000020740844	DEVO0910473A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000020740844	https://www.legifrance.gouv.fr/eli/arrete/2009/6/3/DEVO0910473A/jo/texte	m-cxx-le-chatelard-1966-mut06-dpu01	t
m-cxx-le-chatelard-1978-mut06-dex01-c23e95ca	m-cxx-le-chatelard-1978-mut06-dex01	Arrêté	Arrêté du 3 juin 2009 acceptant la mutation partielle d'une concession de mines de sels de sodium	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut05-dpu01-fb7e5c22	m-cxx-le-chatelard-1978-mut05-dpu01	Arrêté	Arrêté du 19 juillet 1999 autorisant la mutation partielle d'une concession de mines de sels de sodium et substances connexes	JORFTEXT000000560545	ECOI9900395A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000560545	\N	m-cxx-le-chatelard-1966-mut05-dpu01	t
m-cxx-le-chatelard-1978-mut05-dex01-e4305e92	m-cxx-le-chatelard-1978-mut05-dex01	Arrêté	Arrêté du 19 juillet 1999 autorisant la mutation partielle d'une concession de mines de sels de sodium et substances connexes	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut04-dpu01-afa3ade1	m-cxx-le-chatelard-1978-mut04-dpu01	Décret	Décret du 2 mars 1998 autorisant la mutation de la concession de mines de sel de sodium et substances connexes dite « Concession du Châtelard »	JORFTEXT000000555076	ECOI9800149D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000555076	\N	\N	t
m-cxx-le-chatelard-1978-mut04-dex01-efa5df45	m-cxx-le-chatelard-1978-mut04-dex01	Décret	Décret du 2 mars 1998 autorisant la mutation de la concession de mines de sel de sodium et substances connexes dite « Concession du Châtelard »	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut03-dpu01-d3cb67e1	m-cxx-le-chatelard-1978-mut03-dpu01	Décret	Décret du 24 novembre 1975 autorisant la mutation de la concession de mines de cuivre, plomb, sulfates de cuivre et de fer de Sain-Bel (Rhône) et de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Compagnie industrielle et minière.	\N	\N	\N	\N	m-cxx-le-chatelard-1966-mut03-dpu01	t
m-cxx-le-chatelard-1978-mut03-dex01-c219897f	m-cxx-le-chatelard-1978-mut03-dex01	Décret	Décret du 24 novembre 1975 autorisant la mutation de la concession de mines de cuivre, plomb, sulfates de cuivre et de fer de Sain-Bel (Rhône) et de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Compagnie industrielle et minière	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut02-dpu01-f97ed7aa	m-cxx-le-chatelard-1978-mut02-dpu01	Décret	Décret du 5 avril 1972 autorisant la mutation de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société Rhône-Progil	\N	\N	\N	\N	m-cxx-le-chatelard-1966-mut02-dpu01	t
m-cxx-le-chatelard-1978-mut02-dex01-4f936f08	m-cxx-le-chatelard-1978-mut02-dex01	Décret	Décret du 5 avril 1972 autorisant la mutation de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société Rhône-Progil	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-mut01-dpu01-8887aca0	m-cxx-le-chatelard-1978-mut01-dpu01	Décret	Décret du 5 décembre 1969 autorisant la mutation de propriété de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société financière et industrielle pour l'industrie chimique (Sofichim).	\N	\N	\N	\N	m-cxx-le-chatelard-1966-mut01-dpu01	t
m-cxx-le-chatelard-1978-mut01-dex01-c0f1d795	m-cxx-le-chatelard-1978-mut01-dex01	Décret	Décret du 5 décembre 1969 autorisant la mutation de propriété de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société financière et industrielle pour l'industrie chimique (Sofichim).	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-exp01-dpu01-8ab4e2be	m-cxx-le-chatelard-1978-exp01-dpu01	Décret	Décret du 18 juillet 1969 portant extension de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme), au profit de la Société Progil	\N	\N	\N	\N	m-cxx-le-chatelard-1966-exp01-dpu01	t
m-cxx-le-chatelard-1978-exp01-dex01-69886646	m-cxx-le-chatelard-1978-exp01-dex01	Décret	Décret du 18 juillet 1969 portant extension de la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme), au profit de la Société Progil	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-oct01-dpu02-bfd226ad	m-cxx-le-chatelard-1978-oct01-dpu02	Décret	Décret du 27 février 1978 modifiant les conditions auxquelles est soumise la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme)	\N	\N	\N	\N	m-cxx-le-chatelard-1966-oct02-dpu01	t
m-cxx-le-chatelard-1978-oct01-dex02-2b73fa7a	m-cxx-le-chatelard-1978-oct01-dex02	Décret	Décret du 27 février 1978 modifiant les conditions auxquelles est soumise la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme)	\N	\N	\N	\N	\N	t
m-cxx-le-chatelard-1978-oct01-dpu01-18c9c3b8	m-cxx-le-chatelard-1978-oct01-dpu01	Décret	Décret du 23 juin 1966 instituant la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société Progil	\N	\N	\N	\N	m-cxx-le-chatelard-1966-oct01-dpu01	t
m-cxx-le-chatelard-1978-oct01-dex01-05a735b4	m-cxx-le-chatelard-1978-oct01-dex01	Décret	Dêcret du 23 juin 1966 instituant la concession de mines de sels de sodium et substances connexes du Châtelard (Drôme) au profit de la Société Progil	\N	\N	\N	\N	\N	t
m-prx-crique-awa-2016-oct01-anf01-1a5cde63	m-prx-crique-awa-2016-oct01-anf01	Avis	Avis de mise en concurence - Demande de permis exclusif de recherches de mines d'or dit « Crique Awa » déposée par la Société Norgold Guiana SAS	JORFTEXT000037308680	\N	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000037308680	\N	\N	t
m-prx-orapu-2018-oct01-dpu01-faf377bd	m-prx-orapu-2018-oct01-dpu01	Arrêté	Arrêté du 17 avril 2018 accordant un permis exclusif de recherches de mines d'or et substances connexes (argent, cuivre et zinc) dit « Permis Orapu » (Guyane) à la société par actions simplifiée IAMGOLD France	JORFTEXT000036836927	ECOL1807030A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000036836927	https://www.legifrance.gouv.fr/eli/arrete/2018/4/17/ECOL1807030A/jo/texte	\N	t
m-prx-orapu-2018-oct01-dex01-c2dca366	m-prx-orapu-2018-oct01-dex01	Arrêté	Arrêté du 17 avril 2018 accordant un permis exclusif de recherches de mines d'or et substances connexes (argent, cuivre et zinc) dit "Permis Orapu" (Guyane) à la société par actions simplifiée IAMGOLD FRANCE	\N	\N	\N	\N	m-prx-orapu-2018-oct01-dex01	t
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-f01cbe6d	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	Décret	Décret du 12 avril 2019 accordant la prolongation et le changement de nom de la concession de mines de sel de sodium de Cercueil-Buissoncourt (Meurthe-et-Moselle), à la société SOLVAY SA	JORFTEXT000038370790	ECOL1835067D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000038370790	https://www.legifrance.gouv.fr/eli/decret/2019/4/12/ECOL1835067D/jo/texte	\N	t
m-cxx-cerville-buissoncourt-1962-pro01-dex01-6dadba9b	m-cxx-cerville-buissoncourt-1962-pro01-dex01	Décret	Décret du 12 avril 2019 accordant la prolongation et le changement de nom de la concession de mines de sel de sodium de Cercueil-Buissoncourt (Meurthe-et-Moselle), à la société SOLVAY SA	\N	\N	\N	\N	\N	t
m-cxx-cerville-buissoncourt-1962-oct01-dpu02-afab326b	m-cxx-cerville-buissoncourt-1962-oct01-dpu02	Décret	Additif au décret du 23 juin 1962 instituant au profit de la société Solvay la concession de mines de sel de sodium de Cercueil-Buissoncourt (M & M)	\N	\N	\N	\N	m-cxx-cerville-buissoncourt-1962-oct01-dpu02	t
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-7f85f04c	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	Décret	Décret du 23 juin 1962 instituant au profit de la société Solvay la concession de mines de sel de sodium de Cercueil-Buissoncourt (M & M)	\N	\N	\N	\N	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	t
m-cxx-cerville-buissoncourt-1962-oct01-dex01-e9d64d75	m-cxx-cerville-buissoncourt-1962-oct01-dex01	Décret	Décret du 23 juin 1962 instituant au profit de la société Solvay la concession de mines de sel de sodium de Cercueil-Buissoncourt (M & M)	\N	\N	\N	\N	m-cxx-cerville-buissoncourt-1962-oct01-dex01	t
m-axm-crique-nelson-2018-oct01-dex01-88fd7c71	m-axm-crique-nelson-2018-oct01-dex01	Arrêté	Arrêté autorisant la SAS TRAJAN à exploiter une mine aurifère de type alluvionnaire sur le terrltolre de la commune de KOUROU, sur la crique « Nelson » (AEX n°07/2018)	\N	R03-2018-10-01-004	\N	\N	m-axm-crique-nelson-2018-oct01-dex01	t
m-prx-nem-4-2016-oct01-dpu01-a2ac93da	m-prx-nem-4-2016-oct01-dpu01	Arrêté	Arrêté du 12 janvier 2016 accordant un permis exclusif de recherches de mines d'or, d'argent, de platine, des métaux de la mine de platine, de cuivre, de cérium, de scandium et autres éléments de terres rares, de zinc, de plomb, de chrome, de nickel, de tellure et de diamant dit « Permis NEM 4 » à la société Newmont LaSource dans le département de la Guyane	JORFTEXT000031873208	EINL1532532A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000031873208	https://www.legifrance.gouv.fr/eli/arrete/2016/1/12/EINL1532532A/jo/texte	\N	t
m-prx-nem-4-2016-oct01-dex01-1f8cc10d	m-prx-nem-4-2016-oct01-dex01	Arrêté	Arrêté du 12 janvier 2016 accordant un permis exclusif de recherches de mines d'or, d'argent, de platine, des métaux de la mine de platine, de cuivre, de cérium, de scandium et autres éléments de terres rares, de zinc, de plomb, de chrome, de nickel, de tellure et de diamant dit « Permis NEM 4 » à la société Newmont LaSource dans le département de la Guyane	\N	\N	\N	\N	m-prx-nem-4-2016-oct01-dex01	t
m-prx-nouvelle-esperance-2010-pr101-dpu01-bec49a12	m-prx-nouvelle-esperance-2010-pr101-dpu01	Arrêté	Arrêté du 4 décembre 2015 prolongeant la validité du permis exclusif de recherches de mines d'or et substances connexes attribué à la compagnie minière Espérance dit « Permis Nouvelle Espérance » et réduisant sa surface dans le département de la Guyane	JORFTEXT000031633080	EINL1529428A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000031633080	https://www.legifrance.gouv.fr/eli/arrete/2015/12/4/EINL1529428A/jo/texte	\N	t
m-prx-nouvelle-esperance-2010-pr101-dex01-e785320e	m-prx-nouvelle-esperance-2010-pr101-dex01	Arrêté	Arrêté du 4 décembre 2015 prolongeant la validité du permis exclusif de recherches de mines d'or et substances connexes attribué à la compagnie minière Espérance dit « Permis Nouvelle Espérance » et réduisant sa surface dans le département de la Guyane	\N	\N	\N	\N	m-prx-nouvelle-esperance-2010-pr101-dex01	t
m-prx-nouvelle-esperance-2010-oct01-dpu01-85a39c8a	m-prx-nouvelle-esperance-2010-oct01-dpu01	Arrêté	Arrêté du 18 octobre 2010 accordant à la Compagnie minière Espérance un permis exclusif de recherches de mines d'or et substances connexes	JORFTEXT000023001760	DEVO1024665A	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000023001760	https://www.legifrance.gouv.fr/eli/arrete/2010/10/18/DEVO1024665A/jo/texte	\N	t
m-prx-nouvelle-esperance-2010-oct01-dex01-7bea64c3	m-prx-nouvelle-esperance-2010-oct01-dex01	Arrêté	Arrêté du 18 octobre 2010 accordant le permis exclusif de recherches de mines d'or et substances connexes dit "Permis Nouvelle Espérance" à la Compagnie Minière Espérance (Guyane)	\N	\N	\N	\N	m-prx-nouvelle-esperance-2010-oct01-dex01	t
w-cxx-le-minou-2011-oct01-dpu01-04fg5d8	w-cxx-le-minou-2011-oct01-dpu01	Décret	Décret du 8 juillet 2011 accordant la concession de sables coquilliers dite « Concession du Minou » au large des côtes du département du Finistère à la société Quemeneur	JORFTEXT000024327365	EFIL1106625D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000024327365	https://www.legifrance.gouv.fr/eli/decret/2011/7/8/EFIL1106625D/jo/texte	\N	t
w-cxx-le-minou-2011-oct01-dex01-045635d7	w-cxx-le-minou-2011-oct01-dex01	Décret	Décret du 8 juillet 2011 accordant la concession de sables coquilliers dite « Concession du Minou » au large des côtes du département du Finistère à la société Quemeneur	\N	EFIL1106625D	\N	\N	\N	t
w-cxx-les-duons-2011-oct01-dpu01-946311ab	w-cxx-les-duons-2011-oct01-dpu01	Décret	Décret du 19 juillet 2011 accordant la concession de sables coquilliers dite « Concession des Duons », au large des côtes du département du Finistère, à la Compagnie armoricaine de navigation	JORFTEXT000024382365	EFIL1106622D	https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000024382365	https://www.legifrance.gouv.fr/eli/decret/2011/7/19/EFIL1106622D/jo/texte	\N	t
w-cxx-les-duons-2011-oct01-dex01-447756fe	w-cxx-les-duons-2011-oct01-dex01	Décret	Décret du 19 juillet 2011 accordant la concession de sables coquilliers dite « Concession des Duons », au large des côtes du département du Finistère, à la Compagnie armoricaine de navigation	\N	EFIL1106622D	\N	\N	\N	t
\.


--
-- Data for Name: titres_emprises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_emprises (titre_etape_id, emprise_id) FROM stdin;
g-cxx-soultz-2015-oct01-dpu01	ter
g-cxx-soultz-2015-oct01-dex01	ter
g-cxx-bouillante-2009-oct01-dpu01	ter
g-cxx-bouillante-2009-oct01-dex01	ter
w-cxx-le-minou-2011-oct01-dpu01	mer
w-cxx-le-minou-2011-oct01-dex01	mer
w-cxx-les-duons-2011-oct01-dpu01	mer
w-cxx-les-duons-2011-oct01-dex01	mer
\.


--
-- Data for Name: titres_etapes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_etapes (id, titre_demarche_id, type_id, statut_id, ordre, date, date_debut, date_fin, duree, surface, volume, volume_unite_id, visas, engagement, engagement_devise_id, source_indisponible, contenu) FROM stdin;
m-prx-nem-4-2016-oct01-dex01	m-prx-nem-4-2016-oct01	dex	acc	1	2016-01-12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-axm-crique-nelson-2018-oct01-dex01	m-axm-crique-nelson-2018-oct01	dex	acc	1	2018-10-01	\N	2022-09-30	48	1	\N	\N	\N	\N	\N	\N	\N
m-prx-nem-4-2016-oct01-dpu01	m-prx-nem-4-2016-oct01	dpu	acc	2	2016-01-20	\N	2021-01-20	60	155.009995	\N	\N	\N	1773800	EUR	\N	\N
m-prx-nouvelle-esperance-2010-mut01-men01	m-prx-nouvelle-esperance-2010-mut01	men	fai	2	2019-05-06	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-mut01-mfr01	m-prx-nouvelle-esperance-2010-mut01	mfr	fai	1	2019-05-02	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-pr201-men01	m-prx-nouvelle-esperance-2010-pr201	men	fai	2	2018-07-04	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-pr201-mfr01	m-prx-nouvelle-esperance-2010-pr201	mfr	fai	1	2018-06-29	\N	\N	60	127.699997	\N	\N	\N	2060000	EUR	\N	\N
m-prx-nouvelle-esperance-2010-pr101-dpu01	m-prx-nouvelle-esperance-2010-pr101	dpu	acc	2	2015-12-17	\N	2018-11-05	\N	127.699997	\N	\N	\N	985600	EUR	\N	\N
m-prx-nouvelle-esperance-2010-pr101-dex01	m-prx-nouvelle-esperance-2010-pr101	dex	acc	1	2015-12-04	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-vct01-men01	m-prx-nouvelle-esperance-2010-vct01	men	fai	2	2015-07-31	\N	\N	540	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-vct01-mfr01	m-prx-nouvelle-esperance-2010-vct01	mfr	fai	1	2015-07-31	\N	\N	540	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	m-prx-nouvelle-esperance-2010-oct01	dpu	acc	2	2010-11-05	\N	\N	36	175	\N	\N	\N	794000	EUR	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dex01	m-prx-nouvelle-esperance-2010-oct01	dex	acc	1	2010-10-18	\N	\N	\N	174	\N	\N	\N	794000	EUR	\N	\N
w-cxx-le-minou-2011-oct01-dpu01	w-cxx-le-minou-2011-oct01	dpu	acc	2	2011-07-10	\N	\N	240	0.0599999987	\N	\N	\N	\N	\N	\N	\N
w-cxx-le-minou-2011-oct01-dex01	w-cxx-le-minou-2011-oct01	dex	acc	1	2011-07-08	\N	\N	240	0.0599999987	\N	\N	\N	\N	\N	\N	\N
w-cxx-les-duons-2011-oct01-dpu01	w-cxx-les-duons-2011-oct01	dpu	acc	2	2011-07-21	\N	\N	300	0.180000007	\N	\N	\N	\N	\N	\N	\N
w-cxx-les-duons-2011-oct01-dex01	w-cxx-les-duons-2011-oct01	dex	acc	1	2011-07-19	\N	\N	300	0.180000007	\N	\N	\N	\N	\N	\N	\N
g-cxx-soultz-2015-oct01-dpu01	g-cxx-soultz-2015-oct01	dpu	acc	2	2015-09-24	\N	2040-09-24	300	23.4200001	\N	\N	\N	\N	\N	\N	\N
g-cxx-soultz-2015-oct01-dex01	g-cxx-soultz-2015-oct01	dex	acc	1	2015-09-22	\N	2040-09-24	300	23.4200001	\N	\N	\N	\N	\N	\N	\N
g-cxx-bouillante-2009-oct01-dpu01	g-cxx-bouillante-2009-oct01	dpu	acc	2	2009-06-19	\N	2050-04-30	600	24	\N	\N	\N	\N	\N	\N	\N
g-cxx-bouillante-2009-oct01-dex01	g-cxx-bouillante-2009-oct01	dex	acc	1	2009-06-17	\N	2050-04-30	600	24	\N	\N	\N	\N	\N	\N	\N
g-prx-saleve-2013-oct01-men01	g-prx-saleve-2013-oct01	men	fai	2	2013-05-13	\N	\N	\N	497	\N	\N	\N	\N	\N	\N	\N
g-prx-saleve-2013-oct01-mfr01	g-prx-saleve-2013-oct01	mfr	fai	1	2013-04-22	\N	\N	\N	497	\N	\N	\N	\N	\N	\N	\N
h-cxx-pezarches-1998-mut01-dpu01	h-cxx-pezarches-1998-mut01	dpu	acc	2	2001-03-09	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-pezarches-1998-mut01-dex01	h-cxx-pezarches-1998-mut01	dex	acc	1	2001-02-28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-pezarches-1998-oct01-dpu01	h-cxx-pezarches-1998-oct01	dpu	acc	3	1998-05-07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-pezarches-1998-oct01-dex01	h-cxx-pezarches-1998-oct01	dex	acc	2	1998-04-30	\N	\N	300	9.30000019	\N	\N	{"Vu le décret du 9 novembre 1988 accordant aux sociétés Enterprise Oil Exploration Limited et Du Pont Conoco Technologies (France SA) et à la Société nationale Elf Aquitaine (Production), conjointes et solidaires, un permis exclusif de recherches d'hydrocarbures liquides ou gazeux, dit « Permis de Beautheil », portant sur partie du département de Seine-et-Marne, ensemble les décrets du 25 novembre 1993 et du 6 janvier 1995, le premier prolongeant la validité dudit permis jusqu'au 13 novembre 1996 et le second autorisant, notamment, sa mutation au profit de la société Elf Aquitaine Production","Vu l'arrêté du 5 janvier 1994 accordant aux sociétés Elf Aquitaine Production et Du Pont Conoco Technologies (France) SA, conjointes et solidaires, un permis d'exploitation de mines d'hydrocarbures liquides ou gazeux, dit « Permis d'exploitation de La Vignotte », portant sur partie du département de Seine-et-Marne","Vu la demande du 27 décembre 1994 par laquelle la société Elf Aquitaine Production, dont le siège social est à Courbevoie (Hauts-de-Seine), tour Elf, 2, place de la Coupole, et la société Du Pont de Nemours (France) SA, dont le siège social est à Paris (7e), 137, rue de l'Université, sollicitent, pour une durée de vingt-cinq ans et au seul profit de la société Elf Aquitaine Production, une concession de mines d'hydrocarbures liquides ou gazeux, dite « Concession de Pézarches », portant sur 9,3 kilomètres carrés du département de Seine-et-Marne","Vu les mémoires, engagements, plans, pouvoirs et autres pièces produits à l'appui de cette demande","Vu les pièces de l'enquête publique à laquelle ladite demande a été soumise du 1er au 30 septembre 1995, inclus","Vu le rapport et l'avis du directeur régional de l'industrie, de la recherche et de l'environnement d'Ile-de-France en date du 21 décembre 1995","Vu l'avis du préfet de Seine-et-Marne en date du 27 décembre 1995","Vu l'avis du Conseil général des mines en date du 8 décembre 1997",""}	\N	\N	\N	\N
h-cxx-pezarches-1998-oct01-mfr01	h-cxx-pezarches-1998-oct01	mfr	fai	1	1994-12-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-pro01-men01	h-cxx-la-croix-blanche-1994-pro01	men	fai	2	2017-02-14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-pro01-mfr01	h-cxx-la-croix-blanche-1994-pro01	mfr	fai	1	2017-02-10	\N	\N	300	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-mut02-dpu01	h-cxx-la-croix-blanche-1994-mut02	dpu	acc	2	2013-10-26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-mut02-dex01	h-cxx-la-croix-blanche-1994-mut02	dex	acc	1	2013-10-21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-mut01-dpu01	h-cxx-la-croix-blanche-1994-mut01	dpu	acc	2	1999-09-11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-mut01-dex01	h-cxx-la-croix-blanche-1994-mut01	dex	acc	1	1999-09-02	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01	h-cxx-la-croix-blanche-1994-oct01	dpu	acc	3	1994-02-12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dex01	h-cxx-la-croix-blanche-1994-oct01	dex	acc	2	1994-02-07	\N	\N	300	14.6000004	\N	\N	{"Vu l'arrêté du 12 juillet 1989 accordant à la Société nationale Elf-Aquitaine (Production), à la société BP France et à la Société française de développement pétrolier BP, conjointes et solidaires, un permis d'exploitation de mines d'hydrocarbures liquides ou gazeux, dit « Permis d'exploitation de Vert-le-Grand », d'une superficie de 26,57 kilomètres carrés environ, portant sur partie du département de l'Essonne","Vu la pétition du 27 février 1987 par laquelle la Société nationale Elf-Aquitaine (Production) (S.N.E.A.[P.]), dont le siège social est à Courbevoie (Hauts-de-Seine), la Société française des pétroles BP (S.F.P.-BP) et la Société française de développement pétrolier BP (S.F.D.P.-BP), dont les sièges sociaux sont à Courbevoie (Hauts-de-Seine), 10, quai Paul-Doumer,conjointes et solidaires, sollicitent, pour une durée de vingt-cinq ans, une concession de mines d'hydrocarbures liquides ou gazeux, dite « Concession de Vert-le-Grand », portant sur 47,83 kilomètres carrés environ du département de l'Essonne, ensemble la lettre du 30 avril 1987, par laquelle la société BP France fait connaître le changement de dénomination de la Société française des pétroles BP en BP France","Vu la lettre du 8 mars 1989 portant désistement des sociétés S.N.E.A. (P),BP France et S.F.D.P.-BP des surfaces extérieures sollicitées par la pétition du 27 février 1987 susvisée, ensemble la lettre du 10 juillet 1990 par laquelle la société BP France, susmentionnée, confirme la cession, au profit de la S.N.E.A. (P), à compter du 1er juillet 1990, de l'ensemble des activités exploration-production du groupe BP en France","Vu les mémoires, engagements plans, pouvoirs et autres pièces produits à l'appui de cette pétition","Vu les pièces de l'enquête publique à laquelle ladite pétition a été soumise, du 7 décembre 1988 au 6 janvier 1989 inclus","Vu les rapport et avis du directeur régional de l'industrie, de la recherche et de l'environnement d'Ile-de-France en date du 24 mars 1989","Vu l'avis du préfet de l'Essonne en date du 11 avril 1989","Vu l'avis du Conseil général des mines en date du 3 mai 1993",""}	\N	\N	\N	\N
h-cxx-la-croix-blanche-1994-oct01-mfr01	h-cxx-la-croix-blanche-1994-oct01	mfr	fai	1	1987-02-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-axm-auror-2018-oct01-dex01	m-axm-auror-2018-oct01	dex	acc	1	2018-10-01	\N	2022-09-30	48	1	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-pro01-men01	m-cxx-drouville-1894-pro01	men	fai	2	2016-12-16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-pro01-mfr01	m-cxx-drouville-1894-pro01	mfr	fai	1	2016-12-01	\N	\N	300	4.66699982	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut06-dpu01	m-cxx-drouville-1894-mut06	dpu	acc	2	1999-07-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut06-dex01	m-cxx-drouville-1894-mut06	dex	acc	1	1999-06-16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut05-dpu01	m-cxx-drouville-1894-mut05	dpu	acc	2	1982-07-04	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut05-dex01	m-cxx-drouville-1894-mut05	dex	acc	1	1982-06-29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut04-dpu01	m-cxx-drouville-1894-mut04	dpu	acc	2	1975-11-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut04-dex01	m-cxx-drouville-1894-mut04	dex	acc	1	1975-11-24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut03-dpu01	m-cxx-drouville-1894-mut03	dpu	acc	2	1970-11-19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut03-dex01	m-cxx-drouville-1894-mut03	dex	acc	1	1970-11-16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut02-dpu01	m-cxx-drouville-1894-mut02	dpu	acc	2	1969-12-12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut02-dex01	m-cxx-drouville-1894-mut02	dex	acc	1	1969-12-12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-amo02-dpu01	m-cxx-drouville-1894-amo02	dpu	acc	2	1968-09-15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-amo02-dex01	m-cxx-drouville-1894-amo02	dex	acc	1	1968-09-13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-amo01-dpu01	m-cxx-drouville-1894-amo01	dpu	acc	2	1968-01-21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-amo01-dex01	m-cxx-drouville-1894-amo01	dex	acc	1	1968-01-13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut01-dpu01	m-cxx-drouville-1894-mut01	dpu	acc	2	1949-08-31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-mut01-dex01	m-cxx-drouville-1894-mut01	dex	acc	1	1949-08-23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-oct01-dpu01	m-cxx-drouville-1894-oct01	dpu	acc	2	1894-11-24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-drouville-1894-oct01-dex01	m-cxx-drouville-1894-oct01	dex	acc	1	1894-11-24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-bonneval-2017-oct01-dex01	m-prx-bonneval-2017-oct01	dex	acc	1	2016-12-22	\N	\N	60	261	\N	\N	\N	4696230	EUR	\N	\N
m-prx-bonneval-2017-oct01-dpu01	m-prx-bonneval-2017-oct01	dpu	acc	2	2017-07-01	\N	\N	60	261	\N	\N	\N	4696230	EUR	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01	m-cxx-le-chatelard-1978-pro01	rco	fai	4	2019-04-03	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-pro01-mcr01	m-cxx-le-chatelard-1978-pro01	mcr	acc	3	2017-11-20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-pro01-men01	m-cxx-le-chatelard-1978-pro01	men	fai	2	2016-12-15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-pro01-mfr01	m-cxx-le-chatelard-1978-pro01	mfr	fai	1	2016-12-14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut06-dpu01	m-cxx-le-chatelard-1978-mut06	dpu	acc	2	2009-06-16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01	m-cxx-le-chatelard-1978-mut06	dex	acc	1	2009-06-03	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut05-dpu01	m-cxx-le-chatelard-1978-mut05	dpu	acc	2	1999-10-06	\N	\N	\N	20.7000008	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut05-dex01	m-cxx-le-chatelard-1978-mut05	dex	acc	1	1999-07-19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut04-dpu01	m-cxx-le-chatelard-1978-mut04	dpu	acc	2	1998-03-07	\N	2018-12-31	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut04-dex01	m-cxx-le-chatelard-1978-mut04	dex	acc	1	1998-03-02	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut03-dpu01	m-cxx-le-chatelard-1978-mut03	dpu	acc	2	1975-11-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut03-dex01	m-cxx-le-chatelard-1978-mut03	dex	acc	1	1975-11-24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut02-dpu01	m-cxx-le-chatelard-1978-mut02	dpu	acc	2	1972-04-11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut02-dex01	m-cxx-le-chatelard-1978-mut02	dex	acc	1	1972-04-05	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut01-dpu01	m-cxx-le-chatelard-1978-mut01	dpu	acc	2	1969-12-17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-mut01-dex01	m-cxx-le-chatelard-1978-mut01	dex	acc	1	1969-12-05	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-exp01-dpu01	m-cxx-le-chatelard-1978-exp01	dpu	acc	2	1969-07-25	\N	\N	\N	23.3899994	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-exp01-dex01	m-cxx-le-chatelard-1978-exp01	dex	acc	1	1969-07-18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-oct01-dpu02	m-cxx-le-chatelard-1978-oct01	dpu	acc	4	1978-03-07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-oct01-dex02	m-cxx-le-chatelard-1978-oct01	dex	acc	3	1978-02-27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-oct01-dpu01	m-cxx-le-chatelard-1978-oct01	dpu	acc	2	1966-06-30	\N	\N	\N	5.76000023	\N	\N	\N	\N	\N	\N	\N
m-cxx-le-chatelard-1978-oct01-dex01	m-cxx-le-chatelard-1978-oct01	dex	acc	1	1966-06-23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-crique-awa-2016-oct01-anf01	m-prx-crique-awa-2016-oct01	anf	fai	4	2018-08-11	\N	\N	60	184.240005	\N	\N	\N	\N	\N	\N	\N
m-prx-crique-awa-2016-oct01-rco01	m-prx-crique-awa-2016-oct01	rco	fai	3	2017-04-25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-crique-awa-2016-oct01-men01	m-prx-crique-awa-2016-oct01	men	fai	2	2016-10-26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-prx-crique-awa-2016-oct01-mfr01	m-prx-crique-awa-2016-oct01	mfr	fai	1	2016-10-18	\N	\N	60	184.270004	\N	\N	\N	\N	\N	\N	\N
m-prx-orapu-2018-oct01-dpu01	m-prx-orapu-2018-oct01	dpu	acc	2	2018-04-26	\N	\N	36	6.69999981	\N	\N	\N	150000	EUR	\N	\N
m-prx-orapu-2018-oct01-dex01	m-prx-orapu-2018-oct01	dex	acc	1	2018-04-17	\N	\N	\N	6.69999981	\N	\N	\N	150000	EUR	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	m-cxx-cerville-buissoncourt-1962-pro01	dpu	acc	2	2019-04-14	\N	2043-12-31	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01	m-cxx-cerville-buissoncourt-1962-pro01	dex	acc	1	2019-04-12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu02	m-cxx-cerville-buissoncourt-1962-oct01	dpu	acc	3	1962-07-21	\N	\N	\N	5.9000001	\N	\N	\N	\N	\N	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01	m-cxx-cerville-buissoncourt-1962-oct01	dpu	acc	2	1962-07-03	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dex01	m-cxx-cerville-buissoncourt-1962-oct01	dex	acc	1	1962-06-23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: titres_incertitudes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_incertitudes (titre_etape_id, date, date_debut, date_fin, duree, surface, volume, engagement, points, substances, titulaires, amodiataires, administrations) FROM stdin;
m-cxx-drouville-1894-oct01-dpu01	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N
\.


--
-- Data for Name: titres_phases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_phases (titre_demarche_id, statut_id, date_debut, date_fin) FROM stdin;
g-cxx-soultz-2015-oct01	val	2015-09-24	2040-09-24
g-cxx-bouillante-2009-oct01	val	2009-06-19	2050-04-30
h-cxx-pezarches-1998-oct01	val	1998-05-07	2023-05-07
h-cxx-la-croix-blanche-1994-oct01	ech	1994-02-12	2019-02-12
m-axm-auror-2018-oct01	val	2018-10-01	2022-09-30
m-cxx-drouville-1894-oct01	ech	1894-11-24	2018-12-31
m-prx-bonneval-2017-oct01	val	2017-07-01	2022-07-01
m-cxx-le-chatelard-1978-oct01	ech	1966-06-30	2018-12-31
m-prx-orapu-2018-oct01	val	2018-04-26	2021-04-26
m-cxx-cerville-buissoncourt-1962-pro01	val	2018-12-31	2043-12-31
m-cxx-cerville-buissoncourt-1962-oct01	ech	1962-07-03	2018-12-31
m-axm-crique-nelson-2018-oct01	val	2018-10-01	2022-09-30
m-prx-nem-4-2016-oct01	val	2016-01-20	2021-01-20
m-prx-nouvelle-esperance-2010-pr101	ech	2013-11-05	2018-11-05
m-prx-nouvelle-esperance-2010-oct01	ech	2010-11-05	2013-11-05
w-cxx-le-minou-2011-oct01	val	2011-07-10	2031-07-10
w-cxx-les-duons-2011-oct01	val	2011-07-21	2036-07-21
\.


--
-- Data for Name: titres_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_points (id, titre_etape_id, coordonnees, groupe, contour, point, nom, description, securite) FROM stdin;
w-cxx-le-minou-2011-oct01-dpu01-g01-c01-p001	w-cxx-le-minou-2011-oct01-dpu01	(-4.61500002770645956,48.3353333809568966)	1	1	1	0	\N	\N
w-cxx-le-minou-2011-oct01-dpu01-g01-c01-p002	w-cxx-le-minou-2011-oct01-dpu01	(-4.60733333236725962,48.3376666706175016)	1	1	2	1	\N	\N
w-cxx-le-minou-2011-oct01-dpu01-g01-c01-p003	w-cxx-le-minou-2011-oct01-dpu01	(-4.6066666532795999,48.3370000511516977)	1	1	3	2	\N	\N
w-cxx-le-minou-2011-oct01-dpu01-g01-c01-p004	w-cxx-le-minou-2011-oct01-dpu01	(-4.61416666948475029,48.3345000168512016)	1	1	4	3	\N	\N
w-cxx-les-duons-2011-oct01-dpu01-g01-c01-p001	w-cxx-les-duons-2011-oct01-dpu01	(-3.87866592407227007,48.7246665954589986)	1	1	1	0	\N	\N
w-cxx-les-duons-2011-oct01-dpu01-g01-c01-p002	w-cxx-les-duons-2011-oct01-dpu01	(-3.87416648864746005,48.7246665954589986)	1	1	2	1	\N	\N
w-cxx-les-duons-2011-oct01-dpu01-g01-c01-p003	w-cxx-les-duons-2011-oct01-dpu01	(-3.87750053405761985,48.7208328247071023)	1	1	3	2	\N	\N
w-cxx-les-duons-2011-oct01-dpu01-g01-c01-p004	w-cxx-les-duons-2011-oct01-dpu01	(-3.88333320617670008,48.7208328247071023)	1	1	4	3	\N	\N
w-cxx-les-duons-2011-oct01-dpu01-g01-c01-p005	w-cxx-les-duons-2011-oct01-dpu01	(-3.88333320617670008,48.7216663360596982)	1	1	5	4	\N	\N
g-cxx-soultz-2015-oct01-dpu01-g01-c01-p001	g-cxx-soultz-2015-oct01-dpu01	(7.84002264736074039,48.9518938206902021)	1	1	1	1	\N	\N
g-cxx-soultz-2015-oct01-dpu01-g01-c01-p002	g-cxx-soultz-2015-oct01-dpu01	(7.90815728347236035,48.9519219718640031)	1	1	2	2	\N	\N
g-cxx-soultz-2015-oct01-dpu01-g01-c01-p003	g-cxx-soultz-2015-oct01-dpu01	(7.90835940918574032,48.9100228872589966)	1	1	3	3	\N	\N
g-cxx-soultz-2015-oct01-dpu01-g01-c01-p004	g-cxx-soultz-2015-oct01-dpu01	(7.8400245211322197,48.9100231846569997)	1	1	4	4	\N	\N
g-cxx-bouillante-2009-oct01-dpu01-g01-c01-p001	g-cxx-bouillante-2009-oct01-dpu01	(-61.7785560000000018,16.1751390000000015)	1	1	1	O	\N	\N
g-cxx-bouillante-2009-oct01-dpu01-g01-c01-p002	g-cxx-bouillante-2009-oct01-dpu01	(-61.7505000000000024,16.1749720000000003)	1	1	2	P	\N	\N
g-cxx-bouillante-2009-oct01-dpu01-g01-c01-p003	g-cxx-bouillante-2009-oct01-dpu01	(-61.7509439999999969,16.1071939999999998)	1	1	3	W	\N	\N
g-cxx-bouillante-2009-oct01-dpu01-g01-c01-p004	g-cxx-bouillante-2009-oct01-dpu01	(-61.7556390000000022,16.1026939999999996)	1	1	4	V	\N	\N
g-cxx-bouillante-2009-oct01-dpu01-g01-c01-p005	g-cxx-bouillante-2009-oct01-dpu01	(-61.7790000000000035,16.1028330000000004)	1	1	5	S	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p001	g-prx-saleve-2013-oct01-mfr01	(6.31009670032524994,46.2437069286490967)	1	1	1	1	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p002	g-prx-saleve-2013-oct01-mfr01	(6.36151507078344025,46.2366926812404984)	1	1	2	2	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p003	g-prx-saleve-2013-oct01-mfr01	(6.34341845309135,46.1768318984128996)	1	1	3	3	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p004	g-prx-saleve-2013-oct01-mfr01	(6.43446273925404011,46.1465052904125983)	1	1	4	4	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p005	g-prx-saleve-2013-oct01-mfr01	(6.42957684790429962,46.0543651301140002)	1	1	5	5	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p006	g-prx-saleve-2013-oct01-mfr01	(6.13034242812125996,46.0519427479214016)	1	1	6	6	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p007	g-prx-saleve-2013-oct01-mfr01	(5.88686812659317038,46.0857049783332968)	1	1	7	7	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p008	g-prx-saleve-2013-oct01-mfr01	(5.89079698262220042,46.0878152371742971)	1	1	8	8	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p009	g-prx-saleve-2013-oct01-mfr01	(5.89345703813688981,46.0954680157607015)	1	1	9	9	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p010	g-prx-saleve-2013-oct01-mfr01	(5.89192573055102997,46.1005865756398023)	1	1	10	10	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p011	g-prx-saleve-2013-oct01-mfr01	(5.88546701329207966,46.1069950370535011)	1	1	11	11	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p012	g-prx-saleve-2013-oct01-mfr01	(5.88619234240092037,46.1095744716176981)	1	1	12	12	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p013	g-prx-saleve-2013-oct01-mfr01	(5.89302864003550031,46.1189243518545027)	1	1	13	13	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p014	g-prx-saleve-2013-oct01-mfr01	(5.90410072841754019,46.1207007910928013)	1	1	14	14	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p015	g-prx-saleve-2013-oct01-mfr01	(5.91767882817449031,46.1298630858372007)	1	1	15	15	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p016	g-prx-saleve-2013-oct01-mfr01	(5.92090610135833018,46.1310753088708978)	1	1	16	16	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p017	g-prx-saleve-2013-oct01-mfr01	(5.92439783422284982,46.1305950931878002)	1	1	17	17	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p018	g-prx-saleve-2013-oct01-mfr01	(5.92637476076048042,46.1285418906569973)	1	1	18	18	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p019	g-prx-saleve-2013-oct01-mfr01	(5.93695317997356042,46.1286562118524017)	1	1	19	19	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p020	g-prx-saleve-2013-oct01-mfr01	(5.94732205938339042,46.1281808645616991)	1	1	20	20	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p021	g-prx-saleve-2013-oct01-mfr01	(5.95606751364350018,46.132098620216702)	1	1	21	21	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p022	g-prx-saleve-2013-oct01-mfr01	(5.95605357029799976,46.1320897801795979)	1	1	22	22	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p023	g-prx-saleve-2013-oct01-mfr01	(5.96092183262040987,46.1303033964649032)	1	1	23	23	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p024	g-prx-saleve-2013-oct01-mfr01	(5.96527910022544994,46.1295867340335022)	1	1	24	24	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p025	g-prx-saleve-2013-oct01-mfr01	(5.97012334666569,46.1319085524394978)	1	1	25	25	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p026	g-prx-saleve-2013-oct01-mfr01	(5.97635043990513992,46.1326357784015997)	1	1	26	26	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p027	g-prx-saleve-2013-oct01-mfr01	(5.98036310463283005,46.1358744679506003)	1	1	27	27	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p028	g-prx-saleve-2013-oct01-mfr01	(5.9821581394561596,46.1371497463360996)	1	1	28	28	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p029	g-prx-saleve-2013-oct01-mfr01	(5.9827243043697802,46.1421391457750971)	1	1	29	29	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p030	g-prx-saleve-2013-oct01-mfr01	(5.98481381968287973,46.143152080945697)	1	1	30	30	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p031	g-prx-saleve-2013-oct01-mfr01	(5.98688255986659001,46.1426983278796001)	1	1	31	31	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p032	g-prx-saleve-2013-oct01-mfr01	(5.99225357651956969,46.143587548500598)	1	1	32	32	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p033	g-prx-saleve-2013-oct01-mfr01	(5.99398172984936028,46.1444324633679983)	1	1	33	33	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p034	g-prx-saleve-2013-oct01-mfr01	(6.00376697437191975,46.1419442872954022)	1	1	34	34	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p035	g-prx-saleve-2013-oct01-mfr01	(6.00851033926587963,46.1427457913747006)	1	1	35	35	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p036	g-prx-saleve-2013-oct01-mfr01	(6.01320537424305979,46.1422319830399985)	1	1	36	36	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p037	g-prx-saleve-2013-oct01-mfr01	(6.01526221819569962,46.142949284380002)	1	1	37	37	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p038	g-prx-saleve-2013-oct01-mfr01	(6.02307102118216964,46.1415236257024972)	1	1	38	38	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p039	g-prx-saleve-2013-oct01-mfr01	(6.02476128272748035,46.1404603119060965)	1	1	39	39	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p040	g-prx-saleve-2013-oct01-mfr01	(6.02823246022269021,46.1404460317124006)	1	1	40	40	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p041	g-prx-saleve-2013-oct01-mfr01	(6.02929345733651978,46.1394744021826)	1	1	41	41	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p042	g-prx-saleve-2013-oct01-mfr01	(6.03198198316333034,46.1393679408061033)	1	1	42	42	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p043	g-prx-saleve-2013-oct01-mfr01	(6.03197868708048013,46.1379811744495001)	1	1	43	43	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p044	g-prx-saleve-2013-oct01-mfr01	(6.03285165154535985,46.1386192309676986)	1	1	44	44	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p045	g-prx-saleve-2013-oct01-mfr01	(6.03379592831084999,46.1380300811497008)	1	1	45	45	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p046	g-prx-saleve-2013-oct01-mfr01	(6.03394860231731034,46.1364483401494994)	1	1	46	46	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p047	g-prx-saleve-2013-oct01-mfr01	(6.03488309678087997,46.1366798619572975)	1	1	47	47	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p048	g-prx-saleve-2013-oct01-mfr01	(6.0357259185350598,46.1347690517587026)	1	1	48	48	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p049	g-prx-saleve-2013-oct01-mfr01	(6.03584587894053026,46.1365399971537968)	1	1	49	49	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p050	g-prx-saleve-2013-oct01-mfr01	(6.04291625644385011,46.1410726231807971)	1	1	50	50	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p051	g-prx-saleve-2013-oct01-mfr01	(6.04565329700244991,46.1399746466046992)	1	1	51	51	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p052	g-prx-saleve-2013-oct01-mfr01	(6.04780598858527974,46.1409389752873977)	1	1	52	52	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p053	g-prx-saleve-2013-oct01-mfr01	(6.04850423920161973,46.1414928799544981)	1	1	53	53	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p054	g-prx-saleve-2013-oct01-mfr01	(6.04744322610330975,46.1430497932409978)	1	1	54	54	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p055	g-prx-saleve-2013-oct01-mfr01	(6.04869885427383025,46.1474127515499006)	1	1	55	55	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p056	g-prx-saleve-2013-oct01-mfr01	(6.05192919534219964,46.1512701824284974)	1	1	56	56	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p057	g-prx-saleve-2013-oct01-mfr01	(6.07222696012753005,46.1499799188519972)	1	1	57	57	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p058	g-prx-saleve-2013-oct01-mfr01	(6.07560825034436025,46.149011609632602)	1	1	58	58	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p059	g-prx-saleve-2013-oct01-mfr01	(6.09184715881137961,46.1516711895764971)	1	1	59	59	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p060	g-prx-saleve-2013-oct01-mfr01	(6.09913045136257015,46.1439618318909979)	1	1	60	60	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p061	g-prx-saleve-2013-oct01-mfr01	(6.10414973080218992,46.1443890082222978)	1	1	61	61	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p062	g-prx-saleve-2013-oct01-mfr01	(6.10871777215743972,46.1431830053190026)	1	1	62	62	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p063	g-prx-saleve-2013-oct01-mfr01	(6.12116233695051992,46.1426771430987017)	1	1	63	63	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p064	g-prx-saleve-2013-oct01-mfr01	(6.1266192764720504,46.1404674881215016)	1	1	64	64	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p065	g-prx-saleve-2013-oct01-mfr01	(6.13554348024487961,46.1411585040697005)	1	1	65	65	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p066	g-prx-saleve-2013-oct01-mfr01	(6.13718064443600042,46.1432654226176027)	1	1	66	66	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p067	g-prx-saleve-2013-oct01-mfr01	(6.14107285543648995,46.1453676339705012)	1	1	67	67	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p068	g-prx-saleve-2013-oct01-mfr01	(6.14161467862757959,46.1470067348924999)	1	1	68	68	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p069	g-prx-saleve-2013-oct01-mfr01	(6.14489669742370026,46.1448250187912024)	1	1	69	69	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p070	g-prx-saleve-2013-oct01-mfr01	(6.1466966208739704,46.1459170616487029)	1	1	70	70	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p071	g-prx-saleve-2013-oct01-mfr01	(6.14839424126719969,46.1492642954722996)	1	1	71	71	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p072	g-prx-saleve-2013-oct01-mfr01	(6.15224683283386042,46.1515305398902029)	1	1	72	72	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p073	g-prx-saleve-2013-oct01-mfr01	(6.16811757141587957,46.1568037041460997)	1	1	73	73	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p074	g-prx-saleve-2013-oct01-mfr01	(6.17541848652367964,46.1581411218600977)	1	1	74	74	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p075	g-prx-saleve-2013-oct01-mfr01	(6.18884633180296007,46.1661972575871999)	1	1	75	75	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p076	g-prx-saleve-2013-oct01-mfr01	(6.18610330007982956,46.1782257541361005)	1	1	76	76	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p077	g-prx-saleve-2013-oct01-mfr01	(6.18907794521349963,46.1814299437398006)	1	1	77	77	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p078	g-prx-saleve-2013-oct01-mfr01	(6.19134950913374027,46.1812813249238019)	1	1	78	78	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p079	g-prx-saleve-2013-oct01-mfr01	(6.19549027196253999,46.1840761499164003)	1	1	79	79	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p080	g-prx-saleve-2013-oct01-mfr01	(6.19842588911467018,46.1837777937382015)	1	1	80	80	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p081	g-prx-saleve-2013-oct01-mfr01	(6.19892304088233992,46.1853016011557003)	1	1	81	81	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p082	g-prx-saleve-2013-oct01-mfr01	(6.20180390982261986,46.1867883395187988)	1	1	82	82	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p083	g-prx-saleve-2013-oct01-mfr01	(6.20681665132109028,46.1921835769808027)	1	1	83	83	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p084	g-prx-saleve-2013-oct01-mfr01	(6.21169396820600017,46.1931063848951027)	1	1	84	84	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p085	g-prx-saleve-2013-oct01-mfr01	(6.21335069702907994,46.1941487085013023)	1	1	85	85	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p086	g-prx-saleve-2013-oct01-mfr01	(6.21424685091359041,46.1937939359301026)	1	1	86	86	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p087	g-prx-saleve-2013-oct01-mfr01	(6.21754929559570968,46.1979140101132018)	1	1	87	87	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p088	g-prx-saleve-2013-oct01-mfr01	(6.22152327122360038,46.1987053804354986)	1	1	88	88	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p089	g-prx-saleve-2013-oct01-mfr01	(6.2223334525797096,46.2007942291673004)	1	1	89	89	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p090	g-prx-saleve-2013-oct01-mfr01	(6.22538007468000032,46.2020414863705966)	1	1	90	90	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p091	g-prx-saleve-2013-oct01-mfr01	(6.22708870580863039,46.2019909925398977)	1	1	91	91	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p092	g-prx-saleve-2013-oct01-mfr01	(6.22791634856177989,46.2034042650946972)	1	1	92	92	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p093	g-prx-saleve-2013-oct01-mfr01	(6.23012003107583023,46.2035627107748965)	1	1	93	93	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p094	g-prx-saleve-2013-oct01-mfr01	(6.23019305653768996,46.2043982033750993)	1	1	94	94	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p095	g-prx-saleve-2013-oct01-mfr01	(6.23413398437020039,46.2063606125821025)	1	1	95	95	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p096	g-prx-saleve-2013-oct01-mfr01	(6.23663267915499997,46.2064643948914977)	1	1	96	96	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p097	g-prx-saleve-2013-oct01-mfr01	(6.23980476432090025,46.2050938524580985)	1	1	97	97	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p098	g-prx-saleve-2013-oct01-mfr01	(6.24341826658120969,46.2048246346460019)	1	1	98	98	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p099	g-prx-saleve-2013-oct01-mfr01	(6.24466898087722999,46.2049166314849984)	1	1	99	99	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p100	g-prx-saleve-2013-oct01-mfr01	(6.2450077356708702,46.2065530911544968)	1	1	100	100	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p101	g-prx-saleve-2013-oct01-mfr01	(6.24587774594358969,46.2065591522912982)	1	1	101	101	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p102	g-prx-saleve-2013-oct01-mfr01	(6.24874859114837999,46.2049913208687997)	1	1	102	102	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p103	g-prx-saleve-2013-oct01-mfr01	(6.25442715597004018,46.2090736528857988)	1	1	103	103	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p104	g-prx-saleve-2013-oct01-mfr01	(6.26554468218019966,46.2133818747514979)	1	1	104	104	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p105	g-prx-saleve-2013-oct01-mfr01	(6.26915737787810023,46.213445230990402)	1	1	105	105	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p106	g-prx-saleve-2013-oct01-mfr01	(6.27637309430660029,46.2152479965488965)	1	1	106	106	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p107	g-prx-saleve-2013-oct01-mfr01	(6.29446476033180957,46.2249310952130017)	1	1	107	107	\N	\N
g-prx-saleve-2013-oct01-mfr01-g01-c01-p108	g-prx-saleve-2013-oct01-mfr01	(6.29950325585145965,46.2310545383162008)	1	1	108	108	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p001	h-cxx-pezarches-1998-oct01-dpu01	(2.98453346107404993,48.7709389619751974)	1	1	1	1	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p010	h-cxx-pezarches-1998-oct01-dpu01	(2.98453357552378984,48.7439390656746028)	1	1	10	10	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p002	h-cxx-pezarches-1998-oct01-dpu01	(3.00253346492279016,48.7709395015336966)	1	1	2	2	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p003	h-cxx-pezarches-1998-oct01-dpu01	(3.00253505368708007,48.7619392301833017)	1	1	3	3	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p004	h-cxx-pezarches-1998-oct01-dpu01	(3.02053506785911985,48.7619380567147971)	1	1	4	4	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p005	h-cxx-pezarches-1998-oct01-dpu01	(3.02053510966509009,48.7529387427674976)	1	1	5	5	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p006	h-cxx-pezarches-1998-oct01-dpu01	(3.03853518925284982,48.7529399743785987)	1	1	6	6	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p007	h-cxx-pezarches-1998-oct01-dpu01	(3.03853681090010008,48.7349400822322991)	1	1	7	7	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p008	h-cxx-pezarches-1998-oct01-dpu01	(3.02053519318035013,48.7349399258405001)	1	1	8	8	\N	\N
h-cxx-pezarches-1998-oct01-dpu01-g01-c01-p009	h-cxx-pezarches-1998-oct01-dpu01	(3.0205351514388199,48.7439393657331976)	1	1	9	9	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p001	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.3185078454674799,48.6359358236562969)	1	1	1	1	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p002	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.35450962186724988,48.6359360488385022)	1	1	2	2	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p003	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.3545098732169798,48.6179352876529975)	1	1	3	3	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p004	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.37251075835086001,48.6179364493963035)	1	1	4	4	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p005	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.37250945258892987,48.5999364784655015)	1	1	5	5	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p006	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.30950715059121992,48.5999353869396984)	1	1	6	6	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p007	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.30950688770976997,48.6179353574087969)	1	1	7	7	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dpu01-g01-c01-p008	h-cxx-la-croix-blanche-1994-oct01-dpu01	(2.31850655319742005,48.6179350622868967)	1	1	8	8	\N	\N
m-axm-auror-2018-oct01-dex01-g01-c01-p004	m-axm-auror-2018-oct01-dex01	(-54.1130169578245983,5.21036597243675992)	1	1	4	D	\N	\N
m-axm-auror-2018-oct01-dex01-g01-c01-p003	m-axm-auror-2018-oct01-dex01	(-54.1134002694188965,5.20586546870084987)	1	1	3	C	\N	\N
m-axm-auror-2018-oct01-dex01-g01-c01-p002	m-axm-auror-2018-oct01-dex01	(-54.0954347319798998,5.20435517507967038)	1	1	2	B	\N	\N
m-axm-auror-2018-oct01-dex01-g01-c01-p001	m-axm-auror-2018-oct01-dex01	(-54.0950602907813973,5.2088556995437898)	1	1	1	A	\N	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p008	m-cxx-drouville-1894-oct01-dpu01	(6.41123954750602021,48.6724128349749989)	1	1	8	H	Intersection du bord septentrional du chemin de Drouville à Sainte-Libaire, avec le bord occidental du chemin des Charmilles	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p007	m-cxx-drouville-1894-oct01-dpu01	(6.39687420556728981,48.6638832525338998)	1	1	7	G	La bifurcation des chemins de Crévic à Serres et de Maixe à Drouville, arrêté au point G, où elle rencontre le bord sud-est du chemin de Haraucourt à Drouville (la ligne E F G formant la limite Nord-ouest et une partie de la limite nord-est de la concession de Sommerviller, étendue par décret du 17 mai 1886)	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p006	m-cxx-drouville-1894-oct01-dpu01	(6.38650813646594973,48.6666722047515989)	1	1	6	F	Où la ligne droite joignant les clocher de Haraucourt et de Drouville rencontre la limite des communes de Haraucourt et de Gellenoncourt	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p005	m-cxx-drouville-1894-oct01-dpu01	(6.36667750476483008,48.6550622936400003)	1	1	5	E	Rencontre de la ligne droite joignant le point D au clocher de Sommerviller et une perpendiculaire à la ligne droite joignant les clochers de Sommerviller et de Lenoncourt ; cette perpendiculaire étant élevée en un point pris sur la dite ligne, à 1373 mètres de la rive septentrionale du canal de la Marne au Rhin, en se rapprochant de Lenoncourt (La ligne DE formant la limite est de la concession des Rosières-aux-Salines, étendue par décret du 17 février 1881)	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p004	m-cxx-drouville-1894-oct01-dpu01	(6.36405810845691988,48.6618704916504967)	1	1	4	D	Clocher de Haraucourt (la ligne C D formant une partie de la limite sud-est de la concession de Haraucourt, instituée par décret du 17 mai 1886)	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p003	m-cxx-drouville-1894-oct01-dpu01	(6.38663129029746024,48.6786426005498996)	1	1	3	C	Clocher de Gellenoncourt (la ligne C D formant une partie de la limite sud-est de la concession de Haraucourt, instituée par décret du 17 mai 1886)	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p002	m-cxx-drouville-1894-oct01-dpu01	(6.39207718203839015,48.6829531419877028)	1	1	2	B	Point commun aux trois communes de Courbesseaux, Gellenoncourt et Drouville	\N
m-cxx-drouville-1894-oct01-dpu01-g01-c01-p001	m-cxx-drouville-1894-oct01-dpu01	(6.40594581316075029,48.6831697921601005)	1	1	1	A	Angle saillant de la limite de la commune de Drouville, placé à l'angle nord de l'ancien bois de Franant	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c04-p004	m-prx-bonneval-2017-oct01-dpu01	(1.25250478099529006,45.5767002826558993)	1	4	4	4	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c04-p003	m-prx-bonneval-2017-oct01-dpu01	(1.25916610583016997,45.5610234827860978)	1	4	3	3	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c04-p002	m-prx-bonneval-2017-oct01-dpu01	(1.24238191143911991,45.5553670822379004)	1	4	2	2	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c04-p001	m-prx-bonneval-2017-oct01-dpu01	(1.22726707910128008,45.5653706310461999)	1	4	1	1	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p008	m-prx-bonneval-2017-oct01-dpu01	(1.13926033471514998,45.5428531790027975)	1	3	8	8	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p007	m-prx-bonneval-2017-oct01-dpu01	(1.14739296372195998,45.5580296078216023)	1	3	7	7	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p006	m-prx-bonneval-2017-oct01-dpu01	(1.17079278264609998,45.5673480131265976)	1	3	6	6	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p005	m-prx-bonneval-2017-oct01-dpu01	(1.1778777850864699,45.5589603536777972)	1	3	5	5	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p004	m-prx-bonneval-2017-oct01-dpu01	(1.17083271794301003,45.567303627228199)	1	3	4	4	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p003	m-prx-bonneval-2017-oct01-dpu01	(1.19685103207247989,45.5716691327957975)	1	3	3	3	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p002	m-prx-bonneval-2017-oct01-dpu01	(1.19564785564152998,45.5574096146791021)	1	3	2	2	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c03-p001	m-prx-bonneval-2017-oct01-dpu01	(1.17860215914854005,45.5517393729974032)	1	3	1	1	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c02-p005	m-prx-bonneval-2017-oct01-dpu01	(1.35137042908097005,45.5902535616585993)	1	2	5	5	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c02-p004	m-prx-bonneval-2017-oct01-dpu01	(1.39199647387942993,45.5668571993087994)	1	2	4	4	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c02-p003	m-prx-bonneval-2017-oct01-dpu01	(1.30492233928924994,45.5427275435629966)	1	2	3	3	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c02-p002	m-prx-bonneval-2017-oct01-dpu01	(1.26124130611005003,45.5365478116669991)	1	2	2	2	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c02-p001	m-prx-bonneval-2017-oct01-dpu01	(1.3045668177504901,45.5845588354278988)	1	2	1	1	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p010	m-prx-bonneval-2017-oct01-dpu01	(1.24035294156130993,45.6253827770842975)	1	1	10	10	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p009	m-prx-bonneval-2017-oct01-dpu01	(1.22394102450523001,45.5967526739202995)	1	1	9	9	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p008	m-prx-bonneval-2017-oct01-dpu01	(1.08601262872776005,45.596741616034997)	1	1	8	8	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p007	m-prx-bonneval-2017-oct01-dpu01	(1.07119084140654008,45.5433445274984976)	1	1	7	7	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p006	m-prx-bonneval-2017-oct01-dpu01	(1.02366463781389005,45.5100914682122024)	1	1	6	6	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p005	m-prx-bonneval-2017-oct01-dpu01	(1.07428444433161996,45.4726898430610973)	1	1	5	5	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p004	m-prx-bonneval-2017-oct01-dpu01	(1.14510263370102994,45.5180178863585994)	1	1	4	4	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p003	m-prx-bonneval-2017-oct01-dpu01	(1.39614447022692989,45.5205325945795991)	1	1	3	3	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p002	m-prx-bonneval-2017-oct01-dpu01	(1.45200568565076993,45.5618454276241991)	1	1	2	2	\N	\N
m-prx-bonneval-2017-oct01-dpu01-g01-c01-p001	m-prx-bonneval-2017-oct01-dpu01	(1.35518975380247997,45.627120020305199)	1	1	1	1	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p012	m-cxx-le-chatelard-1978-pro01-rco01	(4.98423981994018028,45.249198444393798)	1	1	12	M	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p011	m-cxx-le-chatelard-1978-pro01-rco01	(4.98473642528746996,45.231265461240497)	1	1	11	N	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p010	m-cxx-le-chatelard-1978-pro01-rco01	(5.00384284224151976,45.2266099883091002)	1	1	10	O	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p009	m-cxx-le-chatelard-1978-pro01-rco01	(5.04268759043980985,45.2344633797292985)	1	1	9	D’	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p008	m-cxx-le-chatelard-1978-pro01-rco01	(5.0380902855651204,45.2478510790693988)	1	1	8	A’	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p007	m-cxx-le-chatelard-1978-pro01-rco01	(5.05866683528518024,45.2522388240775015)	1	1	7	B’	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p006	m-cxx-le-chatelard-1978-pro01-rco01	(5.06345441941552021,45.2386034702575017)	1	1	6	C’	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p005	m-cxx-le-chatelard-1978-pro01-rco01	(5.0653177726769103,45.2390013974641008)	1	1	5	P	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p004	m-cxx-le-chatelard-1978-pro01-rco01	(5.07803990137314987,45.2543573414186966)	1	1	4	Q	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p003	m-cxx-le-chatelard-1978-pro01-rco01	(5.06089817823959986,45.2525760109426969)	1	1	3	R	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p002	m-cxx-le-chatelard-1978-pro01-rco01	(5.06418984321818044,45.2674314994644007)	1	1	2	S	\N	\N
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p001	m-cxx-le-chatelard-1978-pro01-rco01	(5.04407119541829019,45.2663059375897987)	1	1	1	A	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p012	m-cxx-le-chatelard-1978-mut06-dex01	(4.98423981994018028,45.249198444393798)	1	1	12	M	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p011	m-cxx-le-chatelard-1978-mut06-dex01	(4.98473642528746996,45.231265461240497)	1	1	11	N	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p010	m-cxx-le-chatelard-1978-mut06-dex01	(5.00384284224151976,45.2266099883091002)	1	1	10	O	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p009	m-cxx-le-chatelard-1978-mut06-dex01	(5.04268759043980985,45.2344633797292985)	1	1	9	D’	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p008	m-cxx-le-chatelard-1978-mut06-dex01	(5.0380902855651204,45.2478510790693988)	1	1	8	A’	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p007	m-cxx-le-chatelard-1978-mut06-dex01	(5.05866683528518024,45.2522388240775015)	1	1	7	B’	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p006	m-cxx-le-chatelard-1978-mut06-dex01	(5.06345441941552021,45.2386034702575017)	1	1	6	C’	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p005	m-cxx-le-chatelard-1978-mut06-dex01	(5.0653177726769103,45.2390013974641008)	1	1	5	P	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p004	m-cxx-le-chatelard-1978-mut06-dex01	(5.07803990137314987,45.2543573414186966)	1	1	4	Q	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p003	m-cxx-le-chatelard-1978-mut06-dex01	(5.06089817823959986,45.2525760109426969)	1	1	3	R	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p002	m-cxx-le-chatelard-1978-mut06-dex01	(5.06418984321818044,45.2674314994644007)	1	1	2	S	\N	\N
m-cxx-le-chatelard-1978-mut06-dex01-g01-c01-p001	m-cxx-le-chatelard-1978-mut06-dex01	(5.04407119541829019,45.2663059375897987)	1	1	1	A	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p018	m-prx-crique-awa-2016-oct01-anf01	(-54.3664182167076007,4.33014493480767015)	1	1	18	R	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p017	m-prx-crique-awa-2016-oct01-anf01	(-54.2910912581886009,4.28351088146851033)	1	1	17	Q	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p016	m-prx-crique-awa-2016-oct01-anf01	(-54.3146616951425969,4.24545750128550026)	1	1	16	P	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p015	m-prx-crique-awa-2016-oct01-anf01	(-54.3076885788965029,4.23889426437297967)	1	1	15	O	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p014	m-prx-crique-awa-2016-oct01-anf01	(-54.2981437918196974,4.23472627735787022)	1	1	14	N	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p013	m-prx-crique-awa-2016-oct01-anf01	(-54.3034444447661002,4.22667429863620026)	1	1	13	M	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p012	m-prx-crique-awa-2016-oct01-anf01	(-54.3135481012984016,4.22902449542450043)	1	1	12	L	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p011	m-prx-crique-awa-2016-oct01-anf01	(-54.3242958001721021,4.22630497883091039)	1	1	11	K	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p010	m-prx-crique-awa-2016-oct01-anf01	(-54.3259164024972989,4.2223963408248002)	1	1	10	J	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p009	m-prx-crique-awa-2016-oct01-anf01	(-54.3257364086140981,4.17994834959498007)	1	1	9	I	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p008	m-prx-crique-awa-2016-oct01-anf01	(-54.3121979192792992,4.16916767328981042)	1	1	8	H	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p007	m-prx-crique-awa-2016-oct01-anf01	(-54.2546264404219016,4.16940877616127015)	1	1	7	G	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p006	m-prx-crique-awa-2016-oct01-anf01	(-54.2304924058894997,4.3149318716949896)	1	1	6	F	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p005	m-prx-crique-awa-2016-oct01-anf01	(-54.3004006281323015,4.35572559405694992)	1	1	5	E	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p004	m-prx-crique-awa-2016-oct01-anf01	(-54.3132555655461005,4.37355181388801029)	1	1	4	D	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p003	m-prx-crique-awa-2016-oct01-anf01	(-54.3238727369242014,4.37350468866554021)	1	1	3	C	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p002	m-prx-crique-awa-2016-oct01-anf01	(-54.3318915705710026,4.35558648720273034)	1	1	2	B	\N	\N
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p001	m-prx-crique-awa-2016-oct01-anf01	(-54.3665304286014006,4.35543195083612034)	1	1	1	A	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p018	m-prx-crique-awa-2016-oct01-mfr01	(-54.3664182167076007,4.33014493480767015)	1	1	18	R	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p017	m-prx-crique-awa-2016-oct01-mfr01	(-54.2910912581886009,4.28351088146851033)	1	1	17	Q	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p016	m-prx-crique-awa-2016-oct01-mfr01	(-54.3146616951425969,4.24545750128550026)	1	1	16	P	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p015	m-prx-crique-awa-2016-oct01-mfr01	(-54.3076885788965029,4.23889426437297967)	1	1	15	O	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p014	m-prx-crique-awa-2016-oct01-mfr01	(-54.2981437918196974,4.23472627735787022)	1	1	14	N	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p013	m-prx-crique-awa-2016-oct01-mfr01	(-54.3034444447661002,4.22667429863620026)	1	1	13	M	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p012	m-prx-crique-awa-2016-oct01-mfr01	(-54.3135481012984016,4.22902449542450043)	1	1	12	L	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p011	m-prx-crique-awa-2016-oct01-mfr01	(-54.3242958001721021,4.22630497883091039)	1	1	11	K	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p010	m-prx-crique-awa-2016-oct01-mfr01	(-54.3259164024972989,4.2223963408248002)	1	1	10	J	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p009	m-prx-crique-awa-2016-oct01-mfr01	(-54.3257364086140981,4.17994834959498007)	1	1	9	I	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p008	m-prx-crique-awa-2016-oct01-mfr01	(-54.3121979192792992,4.16916767328981042)	1	1	8	H	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p007	m-prx-crique-awa-2016-oct01-mfr01	(-54.2546264404219016,4.16940877616127015)	1	1	7	G	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p006	m-prx-crique-awa-2016-oct01-mfr01	(-54.2304924058894997,4.3149318716949896)	1	1	6	F	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p005	m-prx-crique-awa-2016-oct01-mfr01	(-54.3004006281323015,4.35572559405694992)	1	1	5	E	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p004	m-prx-crique-awa-2016-oct01-mfr01	(-54.3132555655461005,4.37355181388801029)	1	1	4	D	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p003	m-prx-crique-awa-2016-oct01-mfr01	(-54.3238727369242014,4.37350468866554021)	1	1	3	C	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p002	m-prx-crique-awa-2016-oct01-mfr01	(-54.3318915705710026,4.35558648720273034)	1	1	2	B	\N	\N
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p001	m-prx-crique-awa-2016-oct01-mfr01	(-54.3665304286014006,4.35543195083612034)	1	1	1	A	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p006	m-prx-orapu-2018-oct01-dex01	(-52.376790790505197,4.47516947277660027)	1	1	6	F	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p005	m-prx-orapu-2018-oct01-dex01	(-52.3587678690012979,4.47520317223325037)	1	1	5	E	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p004	m-prx-orapu-2018-oct01-dex01	(-52.3588212123512022,4.50403606956960001)	1	1	4	D	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p003	m-prx-orapu-2018-oct01-dex01	(-52.3692028391265012,4.50401658766061974)	1	1	3	C	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p002	m-prx-orapu-2018-oct01-dex01	(-52.3692092862237999,4.50746240986538016)	1	1	2	B	\N	\N
m-prx-orapu-2018-oct01-dex01-g01-c01-p001	m-prx-orapu-2018-oct01-dex01	(-52.3768513239218976,4.50744796325207009)	1	1	1	A	\N	\N
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p004	m-axm-crique-nelson-2018-oct01-dex01	(-52.9155988449963033,4.9953092328996096)	1	1	4	4	\N	\N
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p003	m-axm-crique-nelson-2018-oct01-dex01	(-52.9037222733005024,4.98184458963245014)	1	1	3	3	\N	\N
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p002	m-axm-crique-nelson-2018-oct01-dex01	(-52.90034997387,4.98482906087610989)	1	1	2	2	\N	\N
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p001	m-axm-crique-nelson-2018-oct01-dex01	(-52.9122176136294016,4.99831187923204023)	1	1	1	1	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p005	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	(6.31623027226498035,48.6761662451228005)	1	1	5	K	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p004	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	(6.33042745754451008,48.6685681686828033)	1	1	4	A	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p003	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	(6.3454237392553301,48.675431245044301)	1	1	3	N	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p002	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	(6.34103917785200988,48.6991320612728984)	1	1	2	M	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p001	m-cxx-cerville-buissoncourt-1962-pro01-dpu01	(6.3134163931584899,48.6965360899264965)	1	1	1	L	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p005	m-cxx-cerville-buissoncourt-1962-pro01-dex01	(6.31623027226498035,48.6761662451228005)	1	1	5	K	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p004	m-cxx-cerville-buissoncourt-1962-pro01-dex01	(6.33042745754451008,48.6685681686828033)	1	1	4	A	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p003	m-cxx-cerville-buissoncourt-1962-pro01-dex01	(6.3454237392553301,48.675431245044301)	1	1	3	N	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p002	m-cxx-cerville-buissoncourt-1962-pro01-dex01	(6.34103917785200988,48.6991320612728984)	1	1	2	M	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p001	m-cxx-cerville-buissoncourt-1962-pro01-dex01	(6.3134163931584899,48.6965360899264965)	1	1	1	L	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p005	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	(5.70888249388911984,39.7309440805632974)	1	1	5	K	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p004	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	(5.72109983088849017,39.7243395974034996)	1	1	4	A	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p003	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	(5.73325294476726022,39.7310767920405965)	1	1	3	N	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p002	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	(5.72959786094101009,39.754311580184897)	1	1	2	M	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p001	m-cxx-cerville-buissoncourt-1962-oct01-dpu01	(5.70616306563837039,39.7516014829701021)	1	1	1	L	\N	\N
m-prx-nem-4-2016-oct01-dpu01-g01-c01-p004	m-prx-nem-4-2016-oct01-dpu01	(-53.5695581534726983,4.88642918729831965)	1	1	4	4	\N	\N
m-prx-nem-4-2016-oct01-dpu01-g01-c01-p003	m-prx-nem-4-2016-oct01-dpu01	(-53.3894320527412987,4.88709565743922969)	1	1	3	3	\N	\N
m-prx-nem-4-2016-oct01-dpu01-g01-c01-p002	m-prx-nem-4-2016-oct01-dpu01	(-53.3896822871133026,4.95719097800504027)	1	1	2	2	\N	\N
m-prx-nem-4-2016-oct01-dpu01-g01-c01-p001	m-prx-nem-4-2016-oct01-dpu01	(-53.5698272027941016,4.95651490309365972)	1	1	1	1	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p017	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3277869661519972,4.67292034838405002)	1	1	17	17	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p016	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3605649498344974,4.62259513080929008)	1	1	16	16	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p015	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3838487127150003,4.58258498397719993)	1	1	15	15	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p014	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.4073815884438972,4.53270406168689988)	1	1	14	14	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p013	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.4192366157188019,4.49697656494315012)	1	1	13	13	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p012	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3722317889242035,4.49583233715851982)	1	1	12	12	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p011	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3166717392248017,4.60193905194831032)	1	1	11	11	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p010	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2809639566893978,4.62702402162028026)	1	1	10	10	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p009	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2816151138548975,4.62768936642262041)	1	1	9	9	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p008	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3269344111083967,4.62747754605260031)	1	1	8	8	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p007	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.3271535985732967,4.67222792814212973)	1	1	7	7	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p006	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2818224495864001,4.67244184841238042)	1	1	6	6	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p005	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2816151138548975,4.62768936642262041)	1	1	5	5	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p004	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2809639566893978,4.62702402162028026)	1	1	4	4	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p003	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2497742948203978,4.67609583301678011)	1	1	3	3	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p002	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2403792117545009,4.70216157566195037)	1	1	2	2	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01-g01-c01-p001	m-prx-nouvelle-esperance-2010-oct01-dpu01	(-54.2470225337483996,4.70592416567548)	1	1	1	1	\N	\N
\.


--
-- Data for Name: titres_points_references; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_points_references (id, titre_point_id, geo_systeme_id, coordonnees) FROM stdin;
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p004-2972	m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p004	2972	{287604,552457}
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p003-2972	m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p003	2972	{288917,550964}
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p002-2972	m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p002	2972	{289292,551293}
m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p001-2972	m-axm-crique-nelson-2018-oct01-dex01-g01-c01-p001	2972	{287980,552788}
m-axm-auror-2018-oct01-dex01-g01-c01-p004-2972	m-axm-auror-2018-oct01-dex01-g01-c01-p004	2972	{154850,576772}
m-axm-auror-2018-oct01-dex01-g01-c01-p003-2972	m-axm-auror-2018-oct01-dex01-g01-c01-p003	2972	{154805,576274}
m-axm-auror-2018-oct01-dex01-g01-c01-p002-2972	m-axm-auror-2018-oct01-dex01-g01-c01-p002	2972	{156798,576097}
m-axm-auror-2018-oct01-dex01-g01-c01-p001-2972	m-axm-auror-2018-oct01-dex01-g01-c01-p001	2972	{156842,576595}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p012-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p012	2154	{855645,6463}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p011-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p011	2154	{855734,6461}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p010-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p010	2154	{857246,6461}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p009-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p009	2154	{860271,6462}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p008-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p008	2154	{859872,6463}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p007-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p007	2154	{861473,6464}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p006-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p006	2154	{861888,6462}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p005-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p005	2154	{862033,6462}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p004-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p004	2154	{862986,6464}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p003-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p003	2154	{861647,6464}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p002-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p002	2154	{861862,6465}
m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p001-2154	m-cxx-le-chatelard-1978-pro01-rco01-g01-c01-p001	2154	{860288,6465}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p018-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p018	2972	{126250,479450}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p017-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p017	2972	{134600,474250}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p016-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p016	2972	{131962,470048}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p015-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p015	2972	{132734,469318}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p014-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p014	2972	{133793,468852}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p013-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p013	2972	{133200,467963}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p012-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p012	2972	{132078,468228}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p011-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p011	2972	{130882,467932}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p010-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p010	2972	{130700,467500}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p009-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p009	2972	{130700,462800}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p008-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p008	2972	{132200,461600}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p007-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p007	2972	{138600,461600}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p006-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p006	2972	{141350,477700}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p005-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p005	2972	{133600,482250}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p004-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p004	2972	{132180,484230}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p003-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p003	2972	{131000,484230}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p002-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p002	2972	{130100,482250}
m-prx-crique-awa-2016-oct01-anf01-g01-c01-p001-2972	m-prx-crique-awa-2016-oct01-anf01-g01-c01-p001	2972	{126250,482250}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p018-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p018	2972	{126250,479450}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p017-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p017	2972	{134600,474250}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p016-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p016	2972	{131962,470048}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p015-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p015	2972	{132734,469318}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p014-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p014	2972	{133793,468852}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p013-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p013	2972	{133200,467963}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p012-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p012	2972	{132078,468228}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p011-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p011	2972	{130882,467932}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p010-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p010	2972	{130700,467500}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p009-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p009	2972	{130700,462800}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p008-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p008	2972	{132200,461600}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p007-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p007	2972	{138600,461600}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p006-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p006	2972	{141350,477700}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p005-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p005	2972	{133600,482250}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p004-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p004	2972	{132180,484230}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p003-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p003	2972	{131000,484230}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p002-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p002	2972	{130100,482250}
m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p001-2972	m-prx-crique-awa-2016-oct01-mfr01-g01-c01-p001	2972	{126250,482250}
m-prx-orapu-2018-oct01-dex01-g01-c01-p006-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p006	32622	{347247,4948}
m-prx-orapu-2018-oct01-dex01-g01-c01-p005-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p005	32622	{349247,4948}
m-prx-orapu-2018-oct01-dex01-g01-c01-p004-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p004	32622	{349247,498}
m-prx-orapu-2018-oct01-dex01-g01-c01-p003-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p003	32622	{348095,498}
m-prx-orapu-2018-oct01-dex01-g01-c01-p002-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p002	32622	{348095,4984}
m-prx-orapu-2018-oct01-dex01-g01-c01-p001-32622	m-prx-orapu-2018-oct01-dex01-g01-c01-p001	32622	{347247,4984}
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p005-2154	m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p005	2154	{944095,6847}
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p004-2154	m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p004	2154	{945175,6846}
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p003-2154	m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p003	2154	{946246,6847}
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p002-2154	m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p002	2154	{945812,685}
m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p001-2154	m-cxx-cerville-buissoncourt-1962-pro01-dpu01-g01-c01-p001	2154	{943793,6849}
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p005-2154	m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p005	2154	{944095,6847}
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p004-2154	m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p004	2154	{945175,6846}
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p003-2154	m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p003	2154	{946246,6847}
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p002-2154	m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p002	2154	{945812,685}
m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p001-2154	m-cxx-cerville-buissoncourt-1962-pro01-dex01-g01-c01-p001	2154	{943793,6849}
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p005-27571	m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p005	27571	{892955,1161}
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p004-27571	m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p004	27571	{894049,1154}
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p003-27571	m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p003	27571	{895070,1162}
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p002-27571	m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p002	27571	{894635,1188}
m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p001-27571	m-cxx-cerville-buissoncourt-1962-oct01-dpu01-g01-c01-p001	27571	{892615,1184}
\.


--
-- Data for Name: titres_substances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_substances (titre_etape_id, substance_id, connexe, ordre) FROM stdin;
g-cxx-soultz-2015-oct01-dpu01	geoh	\N	\N
g-cxx-soultz-2015-oct01-dex01	geoh	\N	\N
g-cxx-bouillante-2009-oct01-dpu01	geoh	\N	\N
g-cxx-bouillante-2009-oct01-dex01	geoh	\N	\N
g-prx-saleve-2013-oct01-mfr01	geoh	\N	\N
h-cxx-pezarches-1998-mut01-dex01	hydx	\N	\N
h-cxx-pezarches-1998-oct01-dex01	hydx	\N	\N
h-cxx-la-croix-blanche-1994-mut02-dex01	hydx	\N	\N
h-cxx-la-croix-blanche-1994-mut01-dex01	hydx	\N	\N
h-cxx-la-croix-blanche-1994-oct01-dex01	hydx	\N	\N
m-axm-auror-2018-oct01-dex01	auru	\N	\N
m-cxx-drouville-1894-mut06-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut06-dpu01	selh	\N	\N
m-cxx-drouville-1894-mut05-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut05-dpu01	selh	\N	\N
m-cxx-drouville-1894-mut04-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut04-dpu01	selh	\N	\N
m-cxx-drouville-1894-mut03-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut03-dpu01	selh	\N	\N
m-cxx-drouville-1894-mut02-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut02-dpu01	selh	\N	\N
m-cxx-drouville-1894-amo02-dpu01	selg	\N	\N
m-cxx-drouville-1894-amo02-dpu01	selh	\N	\N
m-cxx-drouville-1894-amo01-dpu01	selg	\N	\N
m-cxx-drouville-1894-amo01-dpu01	selh	\N	\N
m-cxx-drouville-1894-mut01-dpu01	selg	\N	\N
m-cxx-drouville-1894-mut01-dpu01	selh	\N	\N
m-cxx-drouville-1894-oct01-dpu01	selg	\N	\N
m-cxx-drouville-1894-oct01-dpu01	selh	\N	\N
m-prx-bonneval-2017-oct01-dpu01	anti	\N	\N
m-prx-bonneval-2017-oct01-dpu01	arge	\N	\N
m-prx-bonneval-2017-oct01-dpu01	auru	\N	\N
m-prx-bonneval-2017-oct01-dpu01	suco	\N	\N
m-prx-bonneval-2017-oct01-dex01	anti	\N	\N
m-prx-bonneval-2017-oct01-dex01	arge	\N	\N
m-prx-bonneval-2017-oct01-dex01	auru	\N	\N
m-prx-bonneval-2017-oct01-dex01	suco	\N	\N
m-cxx-le-chatelard-1978-mut06-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-mut05-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-mut05-dpu01	suco	\N	\N
m-cxx-le-chatelard-1978-mut04-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-mut04-dpu01	suco	\N	\N
m-cxx-le-chatelard-1978-mut02-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-mut02-dpu01	suco	\N	\N
m-cxx-le-chatelard-1978-mut01-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-mut01-dpu01	suco	\N	\N
m-cxx-le-chatelard-1978-exp01-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-exp01-dpu01	suco	\N	\N
m-cxx-le-chatelard-1978-oct01-dpu02	nacl	\N	\N
m-cxx-le-chatelard-1978-oct01-dpu01	nacl	\N	\N
m-cxx-le-chatelard-1978-oct01-dpu01	suco	\N	\N
m-prx-crique-awa-2016-oct01-anf01	auru	\N	1
m-prx-crique-awa-2016-oct01-anf01	suco	\N	2
m-prx-crique-awa-2016-oct01-mfr01	auru	\N	1
m-prx-crique-awa-2016-oct01-mfr01	suco	\N	2
m-prx-orapu-2018-oct01-dpu01	arge	\N	\N
m-prx-orapu-2018-oct01-dpu01	auru	\N	\N
m-prx-orapu-2018-oct01-dpu01	cuiv	\N	\N
m-prx-orapu-2018-oct01-dpu01	suco	\N	\N
m-prx-orapu-2018-oct01-dpu01	zinc	\N	\N
m-prx-orapu-2018-oct01-dex01	arge	\N	\N
m-prx-orapu-2018-oct01-dex01	auru	\N	\N
m-prx-orapu-2018-oct01-dex01	cuiv	\N	\N
m-prx-orapu-2018-oct01-dex01	suco	\N	\N
m-prx-orapu-2018-oct01-dex01	zinc	\N	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	nacl	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu02	nacl	\N	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01	nacl	\N	\N
m-axm-crique-nelson-2018-oct01-dex01	auru	\N	\N
m-prx-nem-4-2016-oct01-dpu01	arge	\N	\N
m-prx-nem-4-2016-oct01-dpu01	auru	\N	\N
m-prx-nem-4-2016-oct01-dpu01	ceri	\N	\N
m-prx-nem-4-2016-oct01-dpu01	chro	\N	\N
m-prx-nem-4-2016-oct01-dpu01	cuiv	\N	\N
m-prx-nem-4-2016-oct01-dpu01	diam	\N	\N
m-prx-nem-4-2016-oct01-dpu01	nick	\N	\N
m-prx-nem-4-2016-oct01-dpu01	plat	\N	\N
m-prx-nem-4-2016-oct01-dpu01	plax	\N	\N
m-prx-nem-4-2016-oct01-dpu01	plom	\N	\N
m-prx-nem-4-2016-oct01-dpu01	scan	\N	\N
m-prx-nem-4-2016-oct01-dpu01	tell	\N	\N
m-prx-nem-4-2016-oct01-dpu01	trxx	\N	\N
m-prx-nem-4-2016-oct01-dpu01	zinc	\N	\N
m-prx-nouvelle-esperance-2010-pr101-dpu01	auru	\N	\N
m-prx-nouvelle-esperance-2010-pr101-dpu01	suco	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	auru	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	suco	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dex01	auru	\N	\N
m-prx-nouvelle-esperance-2010-oct01-dex01	suco	\N	\N
w-cxx-le-minou-2011-oct01-dpu01	saco	f	1
w-cxx-le-minou-2011-oct01-dex01	saco	f	1
w-cxx-les-duons-2011-oct01-dpu01	saco	f	1
w-cxx-les-duons-2011-oct01-dex01	grma	f	1
\.


--
-- Data for Name: titres_titulaires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titres_titulaires (titre_etape_id, entreprise_id, operateur) FROM stdin;
g-cxx-soultz-2015-oct01-dpu01	fr-411178866	\N
g-cxx-soultz-2015-oct01-dex01	fr-411178866	\N
g-cxx-bouillante-2009-oct01-dpu01	fr-400716536	\N
g-cxx-bouillante-2009-oct01-dex01	fr-400716536	\N
g-prx-saleve-2013-oct01-mfr01	fr-792695636	\N
h-cxx-pezarches-1998-mut01-dex01	fr-392068102	\N
h-cxx-pezarches-1998-oct01-dex01	fr-632022711	\N
h-cxx-la-croix-blanche-1994-mut02-dex01	fr-478826316	\N
h-cxx-la-croix-blanche-1994-mut01-dex01	fr-409160132	\N
h-cxx-la-croix-blanche-1994-oct01-dex01	fr-632022711	\N
m-axm-auror-2018-oct01-dex01	fr-830984613	\N
m-cxx-drouville-1894-pro01-mfr01	fr-412431744	\N
m-cxx-drouville-1894-mut06-dpu01	fr-412431744	\N
m-prx-bonneval-2017-oct01-dpu01	fr-803975135	\N
m-prx-bonneval-2017-oct01-dex01	fr-803975135	\N
m-cxx-le-chatelard-1978-mut06-dpu01	fr-411129612	\N
m-cxx-le-chatelard-1978-mut05-dpu01	fr-411129612	\N
m-cxx-le-chatelard-1978-mut04-dpu01	fr-642014526	\N
m-cxx-le-chatelard-1978-mut03-dpu01	fr-712025048	\N
m-cxx-le-chatelard-1978-mut02-dpu01	fr-633820337	\N
m-cxx-le-chatelard-1978-mut01-dpu01	fr-311933568	\N
m-cxx-le-chatelard-1978-exp01-dpu01	fr-552001174	\N
m-cxx-le-chatelard-1978-oct01-dpu01	fr-552001174	\N
m-prx-crique-awa-2016-oct01-anf01	fr-828089284	\N
m-prx-crique-awa-2016-oct01-rco01	fr-828089284	\N
m-prx-crique-awa-2016-oct01-mfr01	gb-224680	\N
m-prx-orapu-2018-oct01-dpu01	fr-402207153	\N
m-cxx-cerville-buissoncourt-1962-pro01-dpu01	be-0403091220	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu02	be-0403091220	\N
m-cxx-cerville-buissoncourt-1962-oct01-dpu01	be-0403091220	\N
m-axm-crique-nelson-2018-oct01-dex01	fr-519753370	\N
m-prx-nem-4-2016-oct01-dpu01	fr-382461325	\N
m-prx-nouvelle-esperance-2010-mut01-mfr01	fr-381151760	\N
m-prx-nouvelle-esperance-2010-mut01-mfr01	fr-827687807	\N
m-prx-nouvelle-esperance-2010-pr201-mfr01	fr-381151760	\N
m-prx-nouvelle-esperance-2010-pr101-dpu01	fr-381151760	\N
m-prx-nouvelle-esperance-2010-vct01-mfr01	fr-381151760	\N
m-prx-nouvelle-esperance-2010-oct01-dpu01	fr-381151760	\N
w-cxx-le-minou-2011-oct01-dpu01	fr-401862297	\N
w-cxx-le-minou-2011-oct01-dex01	fr-401862297	\N
w-cxx-les-duons-2011-oct01-dpu01	fr-390455814	\N
w-cxx-les-duons-2011-oct01-dex01	fr-390455814	\N
\.


--
-- Data for Name: trimestres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trimestres (id, nom, frequence_id) FROM stdin;
1	1er trimestre	tri
2	2e trimestre	tri
3	3e trimestre	tri
4	4e trimestre	tri
\.


--
-- Data for Name: types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types (id, nom) FROM stdin;
apx	autorisation de prospections préalables
arc	autorisation de recherches
arg	autorisation de recherches
arm	autorisation de recherches
axm	autorisation d'exploitation
cxx	concession
prh	permis exclusif de recherches
prx	permis exclusif de recherches
pxc	permis exclusif de carrières
pxg	permis d'exploitation
pxh	permis d'exploitation
pxm	permis d'exploitation
pxx	permis d'exploitation
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, email, mot_de_passe, nom, prenom, administration_id, telephone_fixe, telephone_mobile, permission_id, preferences) FROM stdin;
\.


--
-- Data for Name: utilisateurs__entreprises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs__entreprises (utilisateur_id, entreprise_id) FROM stdin;
\.


--
-- Data for Name: volume_unites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volume_unites (id, nom) FROM stdin;
m3x	m³
km3	km³
m3a	m³ / an
txa	t / an
\.


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 1275, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: activites_statuts activites_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_statuts
    ADD CONSTRAINT activites_statuts_pkey PRIMARY KEY (id);


--
-- Name: activites_types__pays activites_types__pays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__pays
    ADD CONSTRAINT activites_types__pays_pkey PRIMARY KEY (pays_id, activite_type_id);


--
-- Name: activites_types__types activites_types__types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__types
    ADD CONSTRAINT activites_types__types_pkey PRIMARY KEY (domaine_id, type_id, activite_type_id);


--
-- Name: activites_types activites_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types
    ADD CONSTRAINT activites_types_pkey PRIMARY KEY (id);


--
-- Name: administrations administrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations
    ADD CONSTRAINT administrations_pkey PRIMARY KEY (id);


--
-- Name: administrations_types administrations_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations_types
    ADD CONSTRAINT administrations_types_pkey PRIMARY KEY (id);


--
-- Name: communes communes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communes
    ADD CONSTRAINT communes_pkey PRIMARY KEY (id);


--
-- Name: demarches_statuts demarches_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_statuts
    ADD CONSTRAINT demarches_statuts_pkey PRIMARY KEY (id);


--
-- Name: demarches_types__etapes_types demarches_types__etapes_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__etapes_types
    ADD CONSTRAINT demarches_types__etapes_types_pkey PRIMARY KEY (demarche_type_id, etape_type_id, type_id);


--
-- Name: demarches_types__types demarches_types__types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__types
    ADD CONSTRAINT demarches_types__types_pkey PRIMARY KEY (demarche_type_id, type_id);


--
-- Name: demarches_types demarches_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types
    ADD CONSTRAINT demarches_types_pkey PRIMARY KEY (id);


--
-- Name: departements departements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departements
    ADD CONSTRAINT departements_pkey PRIMARY KEY (id);


--
-- Name: devises devises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devises
    ADD CONSTRAINT devises_pkey PRIMARY KEY (id);


--
-- Name: domaines__types domaines__types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domaines__types
    ADD CONSTRAINT domaines__types_pkey PRIMARY KEY (domaine_id, type_id);


--
-- Name: domaines domaines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domaines
    ADD CONSTRAINT domaines_pkey PRIMARY KEY (id);


--
-- Name: emprises emprises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprises
    ADD CONSTRAINT emprises_pkey PRIMARY KEY (id);


--
-- Name: entreprises_etablissements entreprises_etablissements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entreprises_etablissements
    ADD CONSTRAINT entreprises_etablissements_pkey PRIMARY KEY (id);


--
-- Name: entreprises entreprises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entreprises
    ADD CONSTRAINT entreprises_pkey PRIMARY KEY (id);


--
-- Name: etapes_statuts etapes_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapes_statuts
    ADD CONSTRAINT etapes_statuts_pkey PRIMARY KEY (id);


--
-- Name: etapes_types__etapes_statuts etapes_types__etapes_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapes_types__etapes_statuts
    ADD CONSTRAINT etapes_types__etapes_statuts_pkey PRIMARY KEY (etape_type_id, etape_statut_id);


--
-- Name: etapes_types etapes_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapes_types
    ADD CONSTRAINT etapes_types_pkey PRIMARY KEY (id);


--
-- Name: frequences frequences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frequences
    ADD CONSTRAINT frequences_pkey PRIMARY KEY (id);


--
-- Name: geo_systemes geo_systemes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_systemes
    ADD CONSTRAINT geo_systemes_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: mois mois_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mois
    ADD CONSTRAINT mois_pkey PRIMARY KEY (id);


--
-- Name: pays pays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pays
    ADD CONSTRAINT pays_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: phases_statuts phases_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phases_statuts
    ADD CONSTRAINT phases_statuts_pkey PRIMARY KEY (id);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- Name: statuts statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuts
    ADD CONSTRAINT statuts_pkey PRIMARY KEY (id);


--
-- Name: substances__substances_legales substances__substances_legales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances__substances_legales
    ADD CONSTRAINT substances__substances_legales_pkey PRIMARY KEY (substance_id, substance_legale_id);


--
-- Name: substances_legales_codes substances_legales_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances_legales_codes
    ADD CONSTRAINT substances_legales_codes_pkey PRIMARY KEY (id);


--
-- Name: substances_legales substances_legales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances_legales
    ADD CONSTRAINT substances_legales_pkey PRIMARY KEY (id);


--
-- Name: substances substances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances
    ADD CONSTRAINT substances_pkey PRIMARY KEY (id);


--
-- Name: titres_activites titres_activites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_activites
    ADD CONSTRAINT titres_activites_pkey PRIMARY KEY (id);


--
-- Name: titres_administrations titres_administrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_administrations
    ADD CONSTRAINT titres_administrations_pkey PRIMARY KEY (titre_etape_id, administration_id);


--
-- Name: titres_amodiataires titres_amodiataires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_amodiataires
    ADD CONSTRAINT titres_amodiataires_pkey PRIMARY KEY (titre_etape_id, entreprise_id);


--
-- Name: titres_communes titres_communes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_communes
    ADD CONSTRAINT titres_communes_pkey PRIMARY KEY (titre_etape_id, commune_id);


--
-- Name: titres_demarches_liens titres_demarches_liens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches_liens
    ADD CONSTRAINT titres_demarches_liens_pkey PRIMARY KEY (enfant_titre_demarche_id, parent_titre_demarche_id);


--
-- Name: titres_demarches titres_demarches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches
    ADD CONSTRAINT titres_demarches_pkey PRIMARY KEY (id);


--
-- Name: titres_documents titres_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_documents
    ADD CONSTRAINT titres_documents_pkey PRIMARY KEY (id);


--
-- Name: titres_emprises titres_emprises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_emprises
    ADD CONSTRAINT titres_emprises_pkey PRIMARY KEY (titre_etape_id, emprise_id);


--
-- Name: titres_etapes titres_etapes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titres_etapes_pkey PRIMARY KEY (id);


--
-- Name: titres_incertitudes titres_incertitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_incertitudes
    ADD CONSTRAINT titres_incertitudes_pkey PRIMARY KEY (titre_etape_id);


--
-- Name: titres_phases titres_phases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_phases
    ADD CONSTRAINT titres_phases_pkey PRIMARY KEY (titre_demarche_id);


--
-- Name: titres titres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres
    ADD CONSTRAINT titres_pkey PRIMARY KEY (id);


--
-- Name: titres_points titres_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_points
    ADD CONSTRAINT titres_points_pkey PRIMARY KEY (id);


--
-- Name: titres_points_references titres_points_references_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_points_references
    ADD CONSTRAINT titres_points_references_pkey PRIMARY KEY (id);


--
-- Name: titres_substances titres_substances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_substances
    ADD CONSTRAINT titres_substances_pkey PRIMARY KEY (titre_etape_id, substance_id);


--
-- Name: titres_titulaires titres_titulaires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_titulaires
    ADD CONSTRAINT titres_titulaires_pkey PRIMARY KEY (titre_etape_id, entreprise_id);


--
-- Name: trimestres trimestres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trimestres
    ADD CONSTRAINT trimestres_pkey PRIMARY KEY (id);


--
-- Name: types types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: volume_unites volume_unites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volume_unites
    ADD CONSTRAINT volume_unites_pkey PRIMARY KEY (id);


--
-- Name: activites_types__pays activitestypes__pays_activitetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__pays
    ADD CONSTRAINT activitestypes__pays_activitetypeid_foreign FOREIGN KEY (activite_type_id) REFERENCES public.activites_types(id) ON DELETE CASCADE;


--
-- Name: activites_types__pays activitestypes__pays_paysid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__pays
    ADD CONSTRAINT activitestypes__pays_paysid_foreign FOREIGN KEY (pays_id) REFERENCES public.pays(id);


--
-- Name: activites_types__types activitestypes__types_activitetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__types
    ADD CONSTRAINT activitestypes__types_activitetypeid_foreign FOREIGN KEY (activite_type_id) REFERENCES public.activites_types(id);


--
-- Name: activites_types__types activitestypes__types_domaineid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__types
    ADD CONSTRAINT activitestypes__types_domaineid_foreign FOREIGN KEY (domaine_id) REFERENCES public.domaines(id);


--
-- Name: activites_types__types activitestypes__types_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types__types
    ADD CONSTRAINT activitestypes__types_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.types(id);


--
-- Name: activites_types activitestypes_frequenceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites_types
    ADD CONSTRAINT activitestypes_frequenceid_foreign FOREIGN KEY (frequence_id) REFERENCES public.frequences(id);


--
-- Name: administrations__domaines administrations__domaines_administrationid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations__domaines
    ADD CONSTRAINT administrations__domaines_administrationid_foreign FOREIGN KEY (administration_id) REFERENCES public.administrations(id);


--
-- Name: administrations__domaines administrations__domaines_domaineid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations__domaines
    ADD CONSTRAINT administrations__domaines_domaineid_foreign FOREIGN KEY (domaine_id) REFERENCES public.domaines(id);


--
-- Name: administrations administrations_departementid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations
    ADD CONSTRAINT administrations_departementid_foreign FOREIGN KEY (departement_id) REFERENCES public.departements(id);


--
-- Name: administrations administrations_regionid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations
    ADD CONSTRAINT administrations_regionid_foreign FOREIGN KEY (region_id) REFERENCES public.regions(id);


--
-- Name: administrations administrations_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrations
    ADD CONSTRAINT administrations_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.administrations_types(id);


--
-- Name: communes communes_departementid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communes
    ADD CONSTRAINT communes_departementid_foreign FOREIGN KEY (departement_id) REFERENCES public.departements(id);


--
-- Name: demarches_types__etapes_types demarchestypes__etapestypes_demarchetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__etapes_types
    ADD CONSTRAINT demarchestypes__etapestypes_demarchetypeid_foreign FOREIGN KEY (demarche_type_id) REFERENCES public.demarches_types(id) ON DELETE CASCADE;


--
-- Name: demarches_types__etapes_types demarchestypes__etapestypes_etapetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__etapes_types
    ADD CONSTRAINT demarchestypes__etapestypes_etapetypeid_foreign FOREIGN KEY (etape_type_id) REFERENCES public.etapes_types(id) ON DELETE CASCADE;


--
-- Name: demarches_types__etapes_types demarchestypes__etapestypes_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__etapes_types
    ADD CONSTRAINT demarchestypes__etapestypes_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.types(id) ON DELETE CASCADE;


--
-- Name: demarches_types__types demarchestypes__types_demarchetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__types
    ADD CONSTRAINT demarchestypes__types_demarchetypeid_foreign FOREIGN KEY (demarche_type_id) REFERENCES public.demarches_types(id) ON DELETE CASCADE;


--
-- Name: demarches_types__types demarchestypes__types_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demarches_types__types
    ADD CONSTRAINT demarchestypes__types_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.types(id) ON DELETE CASCADE;


--
-- Name: departements departements_regionid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departements
    ADD CONSTRAINT departements_regionid_foreign FOREIGN KEY (region_id) REFERENCES public.regions(id);


--
-- Name: domaines__types domaines__types_domaineid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domaines__types
    ADD CONSTRAINT domaines__types_domaineid_foreign FOREIGN KEY (domaine_id) REFERENCES public.domaines(id) ON DELETE CASCADE;


--
-- Name: domaines__types domaines__types_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domaines__types
    ADD CONSTRAINT domaines__types_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.types(id) ON DELETE CASCADE;


--
-- Name: entreprises_etablissements entreprisesetablissements_entrepriseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entreprises_etablissements
    ADD CONSTRAINT entreprisesetablissements_entrepriseid_foreign FOREIGN KEY (entreprise_id) REFERENCES public.entreprises(id) ON DELETE CASCADE;


--
-- Name: etapes_types__etapes_statuts etapestypes__etapesstatuts_etapestatutid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapes_types__etapes_statuts
    ADD CONSTRAINT etapestypes__etapesstatuts_etapestatutid_foreign FOREIGN KEY (etape_statut_id) REFERENCES public.etapes_statuts(id) ON DELETE CASCADE;


--
-- Name: etapes_types__etapes_statuts etapestypes__etapesstatuts_etapetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapes_types__etapes_statuts
    ADD CONSTRAINT etapestypes__etapesstatuts_etapetypeid_foreign FOREIGN KEY (etape_type_id) REFERENCES public.etapes_types(id) ON DELETE CASCADE;


--
-- Name: mois mois_frequenceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mois
    ADD CONSTRAINT mois_frequenceid_foreign FOREIGN KEY (frequence_id) REFERENCES public.frequences(id);


--
-- Name: mois mois_trimestreid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mois
    ADD CONSTRAINT mois_trimestreid_foreign FOREIGN KEY (trimestre_id) REFERENCES public.trimestres(id);


--
-- Name: regions regions_paysid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_paysid_foreign FOREIGN KEY (pays_id) REFERENCES public.pays(id);


--
-- Name: substances__substances_legales substances__substanceslegales_substanceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances__substances_legales
    ADD CONSTRAINT substances__substanceslegales_substanceid_foreign FOREIGN KEY (substance_id) REFERENCES public.substances(id) ON DELETE CASCADE;


--
-- Name: substances__substances_legales substances__substanceslegales_substancelegaleid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances__substances_legales
    ADD CONSTRAINT substances__substanceslegales_substancelegaleid_foreign FOREIGN KEY (substance_legale_id) REFERENCES public.substances_legales(id);


--
-- Name: substances_legales substanceslegales_domaineid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances_legales
    ADD CONSTRAINT substanceslegales_domaineid_foreign FOREIGN KEY (domaine_id) REFERENCES public.domaines(id);


--
-- Name: substances_legales substanceslegales_substancelegalecodeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.substances_legales
    ADD CONSTRAINT substanceslegales_substancelegalecodeid_foreign FOREIGN KEY (substance_legale_code_id) REFERENCES public.substances_legales_codes(id);


--
-- Name: titres_activites titresactivites_activitestatutid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_activites
    ADD CONSTRAINT titresactivites_activitestatutid_foreign FOREIGN KEY (activite_statut_id) REFERENCES public.activites_statuts(id);


--
-- Name: titres_activites titresactivites_activitetypeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_activites
    ADD CONSTRAINT titresactivites_activitetypeid_foreign FOREIGN KEY (activite_type_id) REFERENCES public.activites_types(id);


--
-- Name: titres_activites titresactivites_titreid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_activites
    ADD CONSTRAINT titresactivites_titreid_foreign FOREIGN KEY (titre_id) REFERENCES public.titres(id) ON DELETE CASCADE;


--
-- Name: titres_activites titresactivites_utilisateurid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_activites
    ADD CONSTRAINT titresactivites_utilisateurid_foreign FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: titres_administrations titresadministrations_administrationid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_administrations
    ADD CONSTRAINT titresadministrations_administrationid_foreign FOREIGN KEY (administration_id) REFERENCES public.administrations(id);


--
-- Name: titres_administrations titresadministrations_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_administrations
    ADD CONSTRAINT titresadministrations_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_amodiataires titresamodiataires_entrepriseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_amodiataires
    ADD CONSTRAINT titresamodiataires_entrepriseid_foreign FOREIGN KEY (entreprise_id) REFERENCES public.entreprises(id);


--
-- Name: titres_amodiataires titresamodiataires_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_amodiataires
    ADD CONSTRAINT titresamodiataires_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON DELETE CASCADE;


--
-- Name: titres_communes titrescommunes_communeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_communes
    ADD CONSTRAINT titrescommunes_communeid_foreign FOREIGN KEY (commune_id) REFERENCES public.communes(id);


--
-- Name: titres_communes titrescommunes_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_communes
    ADD CONSTRAINT titrescommunes_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_demarches titresdemarches_statutid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches
    ADD CONSTRAINT titresdemarches_statutid_foreign FOREIGN KEY (statut_id) REFERENCES public.demarches_statuts(id);


--
-- Name: titres_demarches titresdemarches_titreid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches
    ADD CONSTRAINT titresdemarches_titreid_foreign FOREIGN KEY (titre_id) REFERENCES public.titres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_demarches titresdemarches_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches
    ADD CONSTRAINT titresdemarches_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.demarches_types(id);


--
-- Name: titres_demarches_liens titresdemarchesliens_enfanttitredemarcheid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches_liens
    ADD CONSTRAINT titresdemarchesliens_enfanttitredemarcheid_foreign FOREIGN KEY (enfant_titre_demarche_id) REFERENCES public.titres_demarches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_demarches_liens titresdemarchesliens_parenttitredemarcheid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_demarches_liens
    ADD CONSTRAINT titresdemarchesliens_parenttitredemarcheid_foreign FOREIGN KEY (parent_titre_demarche_id) REFERENCES public.titres_demarches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_documents titresdocuments_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_documents
    ADD CONSTRAINT titresdocuments_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_emprises titresemprises_empriseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_emprises
    ADD CONSTRAINT titresemprises_empriseid_foreign FOREIGN KEY (emprise_id) REFERENCES public.emprises(id);


--
-- Name: titres_emprises titresemprises_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_emprises
    ADD CONSTRAINT titresemprises_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_etapes titresetapes_engagementdeviseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titresetapes_engagementdeviseid_foreign FOREIGN KEY (engagement_devise_id) REFERENCES public.devises(id);


--
-- Name: titres_etapes titresetapes_statutid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titresetapes_statutid_foreign FOREIGN KEY (statut_id) REFERENCES public.etapes_statuts(id);


--
-- Name: titres_etapes titresetapes_titredemarcheid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titresetapes_titredemarcheid_foreign FOREIGN KEY (titre_demarche_id) REFERENCES public.titres_demarches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_etapes titresetapes_typeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titresetapes_typeid_foreign FOREIGN KEY (type_id) REFERENCES public.etapes_types(id);


--
-- Name: titres_etapes titresetapes_volumeuniteid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_etapes
    ADD CONSTRAINT titresetapes_volumeuniteid_foreign FOREIGN KEY (volume_unite_id) REFERENCES public.volume_unites(id);


--
-- Name: titres_incertitudes titresincertitudes_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_incertitudes
    ADD CONSTRAINT titresincertitudes_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_phases titresphases_statutid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_phases
    ADD CONSTRAINT titresphases_statutid_foreign FOREIGN KEY (statut_id) REFERENCES public.phases_statuts(id);


--
-- Name: titres_phases titresphases_titredemarcheid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_phases
    ADD CONSTRAINT titresphases_titredemarcheid_foreign FOREIGN KEY (titre_demarche_id) REFERENCES public.titres_demarches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_points titrespoints_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_points
    ADD CONSTRAINT titrespoints_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_points_references titrespointsreferences_titrepointid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_points_references
    ADD CONSTRAINT titrespointsreferences_titrepointid_foreign FOREIGN KEY (titre_point_id) REFERENCES public.titres_points(id) ON DELETE CASCADE;


--
-- Name: titres_substances titressubstances_substanceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_substances
    ADD CONSTRAINT titressubstances_substanceid_foreign FOREIGN KEY (substance_id) REFERENCES public.substances(id);


--
-- Name: titres_substances titressubstances_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_substances
    ADD CONSTRAINT titressubstances_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: titres_titulaires titrestitulaires_entrepriseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_titulaires
    ADD CONSTRAINT titrestitulaires_entrepriseid_foreign FOREIGN KEY (entreprise_id) REFERENCES public.entreprises(id);


--
-- Name: titres_titulaires titrestitulaires_titreetapeid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titres_titulaires
    ADD CONSTRAINT titrestitulaires_titreetapeid_foreign FOREIGN KEY (titre_etape_id) REFERENCES public.titres_etapes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: trimestres trimestres_frequenceid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trimestres
    ADD CONSTRAINT trimestres_frequenceid_foreign FOREIGN KEY (frequence_id) REFERENCES public.frequences(id);


--
-- Name: utilisateurs__entreprises utilisateurs__entreprises_entrepriseid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs__entreprises
    ADD CONSTRAINT utilisateurs__entreprises_entrepriseid_foreign FOREIGN KEY (entreprise_id) REFERENCES public.entreprises(id) ON DELETE CASCADE;


--
-- Name: utilisateurs__entreprises utilisateurs__entreprises_utilisateurid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs__entreprises
    ADD CONSTRAINT utilisateurs__entreprises_utilisateurid_foreign FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: utilisateurs utilisateurs_administrationid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_administrationid_foreign FOREIGN KEY (administration_id) REFERENCES public.administrations(id) ON DELETE CASCADE;


--
-- Name: utilisateurs utilisateurs_permissionid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_permissionid_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

