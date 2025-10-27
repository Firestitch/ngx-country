import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { FsCountryComponent } from '../country/country.component';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'fs-country-phone-code',
    templateUrl: './country-phone-code.component.html',
    styleUrls: ['./country-phone-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsSkeletonModule, AsyncPipe],
})
export class FsCountryPhoneCodeComponent extends FsCountryComponent {

  @Input() 
  @HostBinding('class.show-code') 
  public showCode = true;

}
