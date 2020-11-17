import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FS_COUNTRY_CONFIG } from './providers/country-config';
import { IFsCountryConfig } from './interfaces/country-config.interface';
import { FsCountryFlagComponent } from './components/country-flag/country-flag.component';
import { FsCountryPhoneCodeComponent } from './components/country-phone-code/country-phone-code.component';
import { FsCountryCallingCodePipe } from './pipe/country-code.pipe';
import { FsCountryComponent } from './components/country/country.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsCountryCallingCodePipe,
    FsCountryFlagComponent,
    FsCountryPhoneCodeComponent,
    FsCountryComponent,
  ],
  declarations: [
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
