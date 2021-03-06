import { Pipe, PipeTransform } from '@angular/core';

import { FsCountry } from '../services/country.service';


@Pipe({ name: 'fsCountryCallingCode' })
export class FsCountryCallingCodePipe implements PipeTransform {

  constructor(private _countryService: FsCountry) {

  }

  public transform(code: string, includeEmoji = true): string {
    const country = this._countryService.countryByISOCode(code);

    if (!country) {
      return '';
    }

    if (includeEmoji) {
      return `${country.emoji} +${country.countryCode}`;
    } else {
      return `+${country.countryCode}`;
    }
  }
}

