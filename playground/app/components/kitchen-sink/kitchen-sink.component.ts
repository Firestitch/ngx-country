import { Component, inject } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsCountry } from '@firestitch/country';
import { FsCountryComponent } from '../../../../src/app/components/country/country.component';
import { FsCountryFlagComponent } from '../../../../src/app/components/country-flag/country-flag.component';
import { FsCountryPhoneCodeComponent } from '../../../../src/app/components/country-phone-code/country-phone-code.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'kitchen-sink',
    templateUrl: 'kitchen-sink.component.html',
    styleUrls: ['kitchen-sink.component.scss'],
    standalone: true,
    imports: [FsCountryComponent, FsCountryFlagComponent, FsCountryPhoneCodeComponent, AsyncPipe]
})
export class KitchenSinkComponent {
  countryService = inject(FsCountry);


  public config = {};
}
