import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsCountry } from '../../services/country.service';
import { IFsCountry } from '../../interfaces/country.interface';


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

  private _country: IFsCountry;
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

        this._cdRef.markForCheck();
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.code) {
      this._countryISOCode = this.code?.toUpperCase();
      this._updateFlag();
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

    this._country = this.countryService.countryByCode(this._countryISOCode);
  }
}
