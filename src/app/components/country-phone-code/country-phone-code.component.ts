import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Optional,
  SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsCountry } from '../../services/country.service';
import { IFsCountry } from '../../interfaces/country.interface';
import { FS_COUNTRY_CONFIG } from '../../providers/country-config';
import { IFsCountryConfig } from '../../interfaces/country-config.interface';
import { DEFAULT_FLAGS_PATH } from '../../consts/default-flag-path.const';


@Component({
  selector: 'fs-country-phone-code',
  templateUrl: './country-phone-code.component.html',
  styleUrls: [
    './country-phone-code.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryPhoneCodeComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public code: string;

  @Input()
  public icon = true;

  @Input()
  public text = true;

  private _country: IFsCountry;
  private _countryISOCode: string;
  private _countryFlagPath: string;
  private _destroy$ = new Subject<void>();

  constructor(
    public countryService: FsCountry,
    private _cdRef: ChangeDetectorRef,
    @Optional() @Inject(FS_COUNTRY_CONFIG) private _config: IFsCountryConfig,
  ) {}

  public get emojiSupported(): boolean {
    return this.countryService.emojiSupported;
  }

  public get countryISOCode(): string {
    return this._countryISOCode;
  }

  public get countryFlagPath(): string {
    return this._countryFlagPath;
  }

  public get country(): IFsCountry | undefined {
    return this._country;
  }

  public ngOnInit(): void {
    this.countryService.ready$
      .pipe(
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._updateFlag();
        this._updateFlagPath();

        this._cdRef.markForCheck();
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.code) {
      this._countryISOCode = this.code?.trim().toUpperCase();
      this._updateFlag();
      this._updateFlagPath();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateFlag(): void {
    if (!this.countryService.ready || !this._countryISOCode) {
      return;
    }

    this._country = this.countryService.countryByISOCode(this._countryISOCode);
  }

  private _updateFlagPath(): void {
    if (this.emojiSupported) {
      return;
    }

    const path = this._config?.countriesPath || DEFAULT_FLAGS_PATH;

    this._countryFlagPath = `${path}${this._countryISOCode}.svg`;
  }
}
