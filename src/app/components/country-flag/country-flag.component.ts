import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsCountry } from '../../services/country.service';


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
    this._countryISOCode = value?.toUpperCase();
    this._updateFlag();
  };

  private _countryEmoji: string;
  private _countryISOCode: string;

  private _destroy$ = new Subject<void>();

  constructor(
    public countryService: FsCountry,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public get emojiSupported(): boolean {
    return this.countryService.emojiSupported;
  }

  public get countryISOCode(): string {
    return this._countryISOCode;
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
}
