import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnDestroy,
  OnInit, Optional,
} from '@angular/core';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { IFsCountryConfig } from '../../interfaces/country-config.interface';
import { FS_COUNTRY_CONFIG } from '../../providers/country-config';
import { FsCountry } from '../../services/country.service';


@Component({
  selector: 'fs-country-flag',
  templateUrl: './country-flag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryFlagComponent implements OnInit, OnDestroy {

  @Input()
  public set code(value: string) {
    this._countryISOCode = value?.trim().toUpperCase();
    this._updateFlag();
    this._updateFlagPath();
  }

  @Input() public width = 16;

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
          filter((value) => {
            return value;
          }),
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _updateFlag(): void {
    this._countryEmoji = this.countryService.countryByISOCode(this._countryISOCode)?.emoji;
  }

  private _updateFlagPath(): void {
    if (!this.emojiSupported) {
      this._countryFlagPath = this.countryService.getFlagUrl(this._countryISOCode);
    }
  }
}
