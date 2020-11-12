import { Inject, Injectable, Optional } from '@angular/core'

import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { FS_COUNTRY_CONFIG } from '../providers/country-config';

import { IFsCountryConfig } from '../interfaces/country-config.interface';
import { IFsCountry } from '../interfaces/country.interface';

const DEFAULT_LOAD_PATH = '/assets/countries.json';


@Injectable({
  providedIn: 'root',
})
export class FsCountry {

  private _countriesByName = new Map<string, IFsCountry>();
  private _countriesByCode = new Map<string, IFsCountry>();
  private _countriesByCallingCode = new Map<string, IFsCountry[]>();

  private _countries$ = new BehaviorSubject<IFsCountry[]>(null);

  private _loaded = new BehaviorSubject<boolean>(false);

  constructor(
    @Optional() @Inject(FS_COUNTRY_CONFIG) private readonly _countryConfig: IFsCountryConfig,
  ) {
    this._loadCountries();
  }

  public get countries$(): Observable<IFsCountry[]> {
    return this._countries$
      .pipe(
        shareReplay(1),
      );
  }

  public get countries(): IFsCountry[] {
    return this._countries$.getValue();
  }

  public get loaded$(): Observable<boolean> {
    return this._loaded.asObservable();
  }

  public get loaded(): boolean {
    return this._loaded.getValue();
  }

  public countryByCode(code: string): IFsCountry {
    return this._countriesByCode.get(code);
  }

  public countryByName(name: string): IFsCountry {
    return this._countriesByName.get(name);
  }

  public countriesByCallingCode(code: string): IFsCountry[] {
    return this._countriesByCallingCode.get(code);
  }

  private _loadCountries(): void {
    fetch(this._countryConfig?.countriesPath || DEFAULT_LOAD_PATH)
      .then((response) => {
        response
          .json()
          .then((data: IFsCountry[]) => {
            this._countries$.next(data);
            this._loaded.next(true);

            this._processCountries();
          });
      })
      .catch((e) => {
        throw new Error('Countries can not be loaded ' + e);
      })
  }

  private _processCountries(): void {
    this.countries.forEach((country) => {
      this._countriesByName.set(country.name, country);
      this._countriesByCode.set(country.code, country);

      if (this._countriesByCallingCode.has(country.callingCode)) {
        this._countriesByCallingCode
          .get(country.callingCode)
          .push(country);
      } else {
        this._countriesByCallingCode.set(country.callingCode, [country]);
      }
    })
  }
}