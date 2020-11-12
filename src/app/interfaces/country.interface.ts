export interface IFsCountry {
  code: string;
  name: string;
  callingCode?: string;
  emoji?: string;
  regions?: IFsCountryRegion[];
}

export interface IFsCountryRegion {
  code: string;
  name: string;
}
