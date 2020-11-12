import { InjectionToken } from '@angular/core';
import { IFsCountryConfig } from '../interfaces/country-config.interface';

export const FS_COUNTRY_CONFIG = new InjectionToken<IFsCountryConfig>('Config for country package');
