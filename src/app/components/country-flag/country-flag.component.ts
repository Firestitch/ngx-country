import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnDestroy,
  OnInit, Optional,
} from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsCountry } from '../../services/country.service';
import { FS_COUNTRY_CONFIG } from '../../providers/country-config';
import { IFsCountryConfig } from '../../interfaces/country-config.interface';
import { DEFAULT_FLAGS_PATH } from '../../consts/default-flag-path.const';


@Component({
  selector: 'fs-country-flag',
  templateUrl: './country-flag.component.html',
  styleUrls: [
    './country-flag.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryFlagComponent implements OnInit, OnDestroy {

  @Input()
  public set code(value: string) {
    this._countryISOCode = value?.trim().toUpperCase();
    this._updateFlag();
    this._updateFlagPath();
  };

  private _countryEmoji: string;
  private _countryISOCode: string;
  private _countryFlagPath: string;

  private _destroy$ = new Subject<void>();

  constructor(
    public countryService: FsCountry,
    private _cdRef: ChangeDetectorRef,
    @Optional() @Inject(FS_COUNTRY_CONFIG) private _config: IFsCountryConfig,
  ) {
  }

  public get emojiSupported(): boolean {
    return this.countryService.emojiSupported;
  }

  public get countryFlagPath(): string {
    return this._countryFlagPath;
  }

  public get countryEmoji(): string {
    return this._countryEmoji;
  }

  public ngOnInit(): void {
    if (this.countryService.emojiSupported) {
      this.countryService.ready$
        .pipe(
          take(1),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._updateFlag();

          this._cdRef.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateFlag(): void {
    if (!this.countryService.ready) {
      return;
    }

    this._countryEmoji = this.countryService.countryByCode(this._countryISOCode)?.emoji;
  }

  private _updateFlagPath(): void {
    if (!this.emojiSupported) {
      const path = this._config?.countriesPath || DEFAULT_FLAGS_PATH;

      this._countryFlagPath = `${path}${this._countryISOCode}.svg`;
    }
  }
}
