export interface IFsCountry {
  isoCode: string;
  name: string;
  countryCode?: string;
  emoji?: string;
  regions?: IFsCountryRegion[];
}

export interface IFsCountryRegion {
  code: string;
  name: string;
}
