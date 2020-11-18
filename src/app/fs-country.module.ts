import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsSkeletonModule } from '@firestitch/skeleton';

import { FsCountryFlagComponent } from './components/country-flag/country-flag.component';
import { FsCountryPhoneCodeComponent } from './components/country-phone-code/country-phone-code.component';
import { FsCountryComponent } from './components/country/country.component';
import { FS_COUNTRY_CONFIG } from './providers/country-config';
import { FsCountryCallingCodePipe } from './pipe/country-code.pipe';
import { IFsCountryConfig } from './interfaces/country-config.interface';


@NgModule({
  imports: [
    CommonModule,
    FsSkeletonModule,
  ],
  declarations: [
    FsCountryCallingCodePipe,
    FsCountryFlagComponent,
    FsCountryPhoneCodeComponent,
    FsCountryComponent,
  ],
  exports: [
    FsCountryCallingCodePipe,
    FsCountryFlagComponent,
    FsCountryPhoneCodeComponent,
    FsCountryComponent,
  ],
  providers: [
  ],
})
export class FsCountryModule {
  static forRoot(config: IFsCountryConfig): ModuleWithProviders<FsCountryModule> {
    return {
      ngModule: FsCountryModule,
      providers: [
        {
          provide: FS_COUNTRY_CONFIG,
          useValue: config,
        }
      ]
    };
  }
}
