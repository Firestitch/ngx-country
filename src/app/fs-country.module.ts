import { NgModule, ModuleWithProviders } from '@angular/core';

import { FS_COUNTRY_CONFIG } from './providers/country-config';
import { IFsCountryConfig } from './interfaces/country-config.interface';
import { FsCountryCallingCode } from './pipe/country-code.pipe';


@NgModule({
  imports: [
  ],
  exports: [
    FsCountryCallingCode,
  ],
  declarations: [
    FsCountryCallingCode,
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
