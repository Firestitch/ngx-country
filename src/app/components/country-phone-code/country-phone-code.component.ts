import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { FsCountryComponent } from '../country/country.component';


@Component({
  selector: 'fs-country-phone-code',
  templateUrl: './country-phone-code.component.html',
  styleUrls: [ './country-phone-code.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCountryPhoneCodeComponent extends FsCountryComponent {

  @Input() 
  @HostBinding('class.show-code') 
  public showCode = true;

}
