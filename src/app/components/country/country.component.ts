import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Optional,
  SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';


import { IFsCountryConfig } from '../../interfaces/country-config.interface';
import { IFsCountry } from '../../interfaces/country.interface';
import { FS_COUNTRY_CONFIG } from '../../providers/country-config';
import { FsCountry } from '../../services/country.service';


@Component({
  selector: 'fs-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public code: string;

  @Input() 
  @HostBinding('class.show-icon') 
  public showIcon = true;

  @Input() 
  @HostBinding('class.show-name') 
  public showName = true;

  @Input()
  public region: string;
  
  @Input()
  public width = 16;

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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _updateFlag(): void {
    this._country = this.countryService.countryByISOCode(this._countryISOCode);
  }

  private _updateFlagPath(): void {
    if (this.emojiSupported) {
      return;
    }

    this._countryFlagPath = this.countryService.getFlagUrl(this._countryISOCode);
  }
}
