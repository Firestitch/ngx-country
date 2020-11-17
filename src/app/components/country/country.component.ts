import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FsCountryPhoneCodeComponent } from '../country-phone-code/country-phone-code.component';


@Component({
  selector: 'fs-country',
  templateUrl: './country.component.html',
  styleUrls: [
    './country.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryComponent extends FsCountryPhoneCodeComponent {

}
