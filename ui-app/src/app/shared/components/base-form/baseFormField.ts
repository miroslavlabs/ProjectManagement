import { ValidatorFn } from "../../../../../node_modules/@angular/forms";

export class BaseFormField {
    value: any;
    label: string;
    validators: ValidatorFn[];
    mandatory?: boolean;
    canUseHalfSpace?: boolean; //can use the whole row or the half of it
    typeOfField?: string; // type of the field in the form (example: dropdown, input)
    values?: any[];
}