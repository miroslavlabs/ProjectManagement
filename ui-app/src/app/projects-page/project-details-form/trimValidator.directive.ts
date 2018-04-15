import { AbstractControl, FormControl } from '@angular/forms';

import * as $ from "jquery";

export function trimValidator(control: FormControl): any {
    let inputString = $.trim(control.value);

    return inputString.length == 0 ? { isInputMissing: true } : null;
}