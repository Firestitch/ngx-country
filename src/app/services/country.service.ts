import { Inject, Injectable, Optional } from '@angular/core';

import { delayedRetry } from '@firestitch/common';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

import { fromFetch } from 'rxjs/fetch';


import { emojSupported } from '../helpers';
import { IFsCountryConfig } from '../interfaces/country-config.interface';
import { IFsCountry } from '../interfaces/country.interface';
import { FS_COUNTRY_CONFIG } from '../providers/country-config';


@Injectable({
  providedIn: 'root',
})
export class FsCountry {

  public defaultAssetPath = '/assets/country';

  private _countriesByName = new Map<string, IFsCountry>();
  private _countriesByCode = new Map<string, IFsCountry>();
  private _countriesByCountryCode = new Map<string, IFsCountry[]>();
  private _countries$ = new BehaviorSubject<IFsCountry[]>(null);
  private _emojiSupported = false;
  private _ready$ = new ReplaySubject<boolean>();

  constructor(
    @Optional() @Inject(FS_COUNTRY_CONFIG) private readonly _countryConfig: IFsCountryConfig,
  ) {
    this._checkIfEmojiAvailable();
    this._loadCountries();
  }

  public get emojiSupported(): boolean {
    return this._emojiSupported;
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

  public get ready$(): Observable<boolean> {
    return this._ready$.asObservable();
  }

  public countryByISOCode(code: string): IFsCountry {
    return this._countriesByCode.get(code);
  }

  public countryByName(name: string): IFsCountry {
    return this._countriesByName.get(name);
  }

  public countriesByCountryCode(code: string): IFsCountry[] {
    return this._countriesByCountryCode.get(code);
  }

  public getFlagUrl(code: string): string {
    return `${this.assetPath}/flag-icons/${code}.svg`;
  }

  public get assetPath(): string {
    return (this._countryConfig?.assetPath || this.defaultAssetPath)
      .replace(/\/{2,}/g, '/');
  }

  private _loadCountries(): void {
    fromFetch(`${this.assetPath}/countries.json`)
      .pipe(
        switchMap((response) => response.json()),
        delayedRetry(2000, 3),
      )
      .subscribe({
        next: (data: IFsCountry[]) => {
          this._countries$.next(data);
          this._processCountries();
          this._ready$.next(true);
        },
        error: (e) => {
          throw new Error(`Countries list can not be loaded. ${  e}`);
        },
      });
  }

  private _processCountries(): void {
    this.countries.forEach((country) => {
      this._countriesByName.set(country.name, country);
      this._countriesByCode.set(country.isoCode, country);

      if (this._countriesByCountryCode.has(country.countryCode)) {
        this._countriesByCountryCode
          .get(country.countryCode)
          .push(country);
      } else {
        this._countriesByCountryCode.set(country.countryCode, [country]);
      }
    });
  }

  private _checkIfEmojiAvailable() {
    this._emojiSupported = emojSupported('🇺🇸');
  }
}
