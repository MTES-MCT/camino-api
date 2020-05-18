/* eslint-disable no-undef */
interface IApiSirenUniteLegalePeriode
  extends IApiSirenUnionUniteLegalePeriodeEtablissmentUnite {
  dateDebut: Date
  dateFin: Date
}

interface IApiSirenUnionUniteLegalePeriodeEtablissmentUnite {
  nicSiegeUniteLegale: string | null
  denominationUniteLegale: string | null
  denominationUsuelle1UniteLegale: string | null
  nomUniteLegale: string | null
}

interface IApiSirenUnionUniteLegaleEtablissmentUnite {
  prenomUsuelUniteLegale: string
  sexeUniteLegale: 'F' | 'M' | null
  sigleUniteLegale: string | null
}

interface IApiSirenEtablissementUnite
  extends IApiSirenUnionUniteLegalePeriodeEtablissmentUnite,
    IApiSirenUnionUniteLegaleEtablissmentUnite {
  categorieEntreprise: string
  categorieJuridiqueUniteLegale: string
  dateCreationUniteLegale: Date | null
}

interface IApiSirenEtablissementAdresse {
  codeCedexEtablissement: string | null
  codePaysEtrangerEtablissement: string | null
  numeroVoieEtablissement: string | null
  indiceRepetitionEtablissement: string | null
  typeVoieEtablissement: string | null
  libelleVoieEtablissement: string | null
  codePostalEtablissement: string | null
  libelleCommuneEtablissement: string
  libelleCommuneEtrangerEtablissement: string
}

interface IApiSirenEtablissement {
  adresseEtablissement: IApiSirenEtablissementAdresse
  siren: string
  uniteLegale: IApiSirenEtablissementUnite
}

interface IApiSirenUniteLegale
  extends IApiSirenUnionUniteLegaleEtablissmentUnite {
  siren: string
  periodesUniteLegale: IApiSirenUniteLegalePeriode[]
}

interface IApiSirenQuery {
  fault?: {
    code: number
    description: string
    message: string
  }
  error?: {
    // eslint-disable-next-line camelcase
    error_description: string
  }
  header: {
    debut: number
    nombre: number
    message: 'OK' | string
    statut: number
    total: number
  }
}

interface IApiSirenQueryTypes extends IApiSirenQuery {
  etablissements?: IApiSirenEtablissement[]
  unitesLegales?: IApiSirenUniteLegale[]
}

interface IApiSirenQueryToken extends IApiSirenQuery {
  result?: {
    // eslint-disable-next-line camelcase
    access_token: string
  }
}

export {
  IApiSirenEtablissement,
  IApiSirenUniteLegalePeriode,
  IApiSirenEtablissementUnite,
  IApiSirenUniteLegale,
  IApiSirenQuery,
  IApiSirenUnionUniteLegalePeriodeEtablissmentUnite,
  IApiSirenUnionUniteLegaleEtablissmentUnite,
  IApiSirenQueryTypes,
  IApiSirenQueryToken
}
