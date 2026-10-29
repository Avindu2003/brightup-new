import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";


const allCharacters = [];

export const passportValidator = Validators.pattern('^N[0-9]{7}$')
export const capitalRegexValidator = Validators.pattern('^([A-Z]*[A-Z]){3}$');  
export const minimum3ValueValidator = Validators.minLength(3);  
export const maximum3ValueValidator = Validators.maxLength(3); 
export const maximum15ValueValidator = Validators.maxLength(15); 
export const nameValidator = Validators.pattern('^[a-zA-Z0-9& ]*[a-zA-Z0-9&]$');
export const languageDescriptionValidator = Validators.pattern('^[a-zA-Z0-9\u0D80,\u0D81,\u0D82,\u0D83,\u0D84,\u0D85,\u0D86,\u0D87,\u0D88,\u0D89,\u0D8A,\u0D8B,\u0D8C,\u0D8D,\u0D8E,\u0D8F,\u0D90,\u0D91,\u0D92,\u0D93,\u0D94,\u0D95,\u0D96,\u0D97,\u0D98,\u0D99,\u0D9A,\u0D9B,\u0D9C,\u0D9D,\u0D9E,\u0D9F,\u0DA0,\u0DA1,\u0DA2,\u0DA3,\u0DA4,\u0DA5,\u0DA6,\u0DA7,\u0DA8,\u0DA9,\u0DAA,\u0DAB,\u0DAC,\u0DAD,\u0DAE,\u0DAF,\u0DB0,\u0DB1,\u0DB2,\u0DB3,\u0DB4,\u0DB5,\u0DB6,\u0DB7,\u0DB8,\u0DB9,\u0DBA,\u0DBB,\u0DBC,\u0DBD,\u0DBE,\u0DBF,\u0DC0,\u0DC1,\u0DC2,\u0DC3,\u0DC4,\u0DC5,\u0DC6,\u0DC7,\u0DC8,\u0DC9,\u0DCA,\u0DCB,\u0DCC,\u0DCD,\u0DCE,\u0DCF,\u0DD0,\u0DD1,\u0DD2,\u0DD3,\u0DD4,\u0DD5,\u0DD6,\u0DD7,\u0DD8,\u0DD9,\u0DDA,\u0DDB,\u0DDC,\u0DDD,\u0DDE,\u0DDF,\u0DE0,\u0DE1,\u0DE2,\u0DE3,\u0DE4,\u0DE5,\u0DE6,\u0DE7,\u0DE8,\u0DE9,\u0DEA,\u0DEB,\u0DEC,\u0DED,\u0DEE,\u0DEF,\u0DF0,\u0DF1,\u0DF2,\u0DF3,\u0DF4,\u0DF5,\u0DF6,\u0DF7,\u0DF8,\u0DF9,\u0DFA,\u0DFB,\u0DFC,\u0DFD,\u0DFE,\u0DFF,\u0B80,\u0B81,\u0B82,\u0B83,\u0B84,\u0B85,\u0B86,\u0B87,\u0B88,\u0B89,\u0B8A,\u0B8B,\u0B8C,\u0B8D,\u0B8E,\u0B8F,\u0B90,\u0B91,\u0B92,\u0B93,\u0B94,\u0B95,\u0B96,\u0B97,\u0B98,\u0B99,\u0B9A,\u0B9B,\u0B9C,\u0B9D,\u0B9E,\u0B9F,\u0BA0,\u0BA1,\u0BA2,\u0BA3,\u0BA4,\u0BA5,\u0BA6,\u0BA7,\u0BA8,\u0BA9,\u0BAA,\u0BAB,\u0BAC,\u0BAD,\u0BAE,\u0BAF,\u0BB0,\u0BB1,\u0BB2,\u0BB3,\u0BB4,\u0BB5,\u0BB6,\u0BB7,\u0BB8,\u0BB9,\u0BBA,\u0BBB,\u0BBC,\u0BBD,\u0BBE,\u0BBF,\u0BC0,\u0BC1,\u0BC2,\u0BC3,\u0BC4,\u0BC5,\u0BC6,\u0BC7,\u0BC8,\u0BC9,\u0BCA,\u0BCB,\u0BCC,\u0BCD,\u0BCE,\u0BCF,\u0BD0,\u0BD1,\u0BD2,\u0BD3,\u0BD4,\u0BD5,\u0BD6,\u0BD7,\u0BD8,\u0BD9,\u0BDA,\u0BDB,\u0BDC,\u0BDD,\u0BDE,\u0BDF,\u0BE0,\u0BE1,\u0BE2,\u0BE3,\u0BE4,\u0BE5,\u0BE6,\u0BE7,\u0BE8,\u0BE9,\u0BEA,\u0BEB,\u0BEC,\u0BED,\u0BEE,\u0BEF,\u0BF0,\u0BF1,\u0BF2,\u0BF3,\u0BF4,\u0BF5,\u0BF6,\u0BF7,\u0BF8,\u0BF9,\u0BFA,\u0BFB,\u0BFC,\u0BFD,\u0BFE,\u0BFF& ]*[a-zA-Z0-9\u0D80,\u0D81,\u0D82,\u0D83,\u0D84,\u0D85,\u0D86,\u0D87,\u0D88,\u0D89,\u0D8A,\u0D8B,\u0D8C,\u0D8D,\u0D8E,\u0D8F,\u0D90,\u0D91,\u0D92,\u0D93,\u0D94,\u0D95,\u0D96,\u0D97,\u0D98,\u0D99,\u0D9A,\u0D9B,\u0D9C,\u0D9D,\u0D9E,\u0D9F,\u0DA0,\u0DA1,\u0DA2,\u0DA3,\u0DA4,\u0DA5,\u0DA6,\u0DA7,\u0DA8,\u0DA9,\u0DAA,\u0DAB,\u0DAC,\u0DAD,\u0DAE,\u0DAF,\u0DB0,\u0DB1,\u0DB2,\u0DB3,\u0DB4,\u0DB5,\u0DB6,\u0DB7,\u0DB8,\u0DB9,\u0DBA,\u0DBB,\u0DBC,\u0DBD,\u0DBE,\u0DBF,\u0DC0,\u0DC1,\u0DC2,\u0DC3,\u0DC4,\u0DC5,\u0DC6,\u0DC7,\u0DC8,\u0DC9,\u0DCA,\u0DCB,\u0DCC,\u0DCD,\u0DCE,\u0DCF,\u0DD0,\u0DD1,\u0DD2,\u0DD3,\u0DD4,\u0DD5,\u0DD6,\u0DD7,\u0DD8,\u0DD9,\u0DDA,\u0DDB,\u0DDC,\u0DDD,\u0DDE,\u0DDF,\u0DE0,\u0DE1,\u0DE2,\u0DE3,\u0DE4,\u0DE5,\u0DE6,\u0DE7,\u0DE8,\u0DE9,\u0DEA,\u0DEB,\u0DEC,\u0DED,\u0DEE,\u0DEF,\u0DF0,\u0DF1,\u0DF2,\u0DF3,\u0DF4,\u0DF5,\u0DF6,\u0DF7,\u0DF8,\u0DF9,\u0DFA,\u0DFB,\u0DFC,\u0DFD,\u0DFE,\u0DFF, \u0B80,\u0B81,\u0B82,\u0B83,\u0B84,\u0B85,\u0B86,\u0B87,\u0B88,\u0B89,\u0B8A,\u0B8B,\u0B8C,\u0B8D,\u0B8E,\u0B8F,\u0B90,\u0B91,\u0B92,\u0B93,\u0B94,\u0B95,\u0B96,\u0B97,\u0B98,\u0B99,\u0B9A,\u0B9B,\u0B9C,\u0B9D,\u0B9E,\u0B9F,\u0BA0,\u0BA1,\u0BA2,\u0BA3,\u0BA4,\u0BA5,\u0BA6,\u0BA7,\u0BA8,\u0BA9,\u0BAA,\u0BAB,\u0BAC,\u0BAD,\u0BAE,\u0BAF,\u0BB0,\u0BB1,\u0BB2,\u0BB3,\u0BB4,\u0BB5,\u0BB6,\u0BB7,\u0BB8,\u0BB9,\u0BBA,\u0BBB,\u0BBC,\u0BBD,\u0BBE,\u0BBF,\u0BC0,\u0BC1,\u0BC2,\u0BC3,\u0BC4,\u0BC5,\u0BC6,\u0BC7,\u0BC8,\u0BC9,\u0BCA,\u0BCB,\u0BCC,\u0BCD,\u0BCE,\u0BCF,\u0BD0,\u0BD1,\u0BD2,\u0BD3,\u0BD4,\u0BD5,\u0BD6,\u0BD7,\u0BD8,\u0BD9,\u0BDA,\u0BDB,\u0BDC,\u0BDD,\u0BDE,\u0BDF,\u0BE0,\u0BE1,\u0BE2,\u0BE3,\u0BE4,\u0BE5,\u0BE6,\u0BE7,\u0BE8,\u0BE9,\u0BEA,\u0BEB,\u0BEC,\u0BED,\u0BEE,\u0BEF,\u0BF0,\u0BF1,\u0BF2,\u0BF3,\u0BF4,\u0BF5,\u0BF6,\u0BF7,\u0BF8,\u0BF9,\u0BFA,\u0BFB,\u0BFC,\u0BFD,\u0BFE,\u0BFF&]$');
export const fullNameValidator = Validators.pattern('^[a-zA-Z ]*[a-zA-Z]$');
export const phoneValidator = Validators.pattern('[- +()0-9]+');
export const phoneCode = Validators.pattern('[- +][0-9]+'); 
export const contactNoLKR = Validators.pattern('^[7][0-9]{8}$');   
export const interestRatePattern = Validators.pattern('[0-1]?[0-9]?[0-9]?');  
export const checkWhiteSpace = Validators.pattern('^\w+( +\w+)*$');  
export const lankanNicValidator = Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$');
export const numbersOnlyValidator = Validators.pattern('^[0-9\.,]+$');
export const mobileNoValidator = Validators.pattern('^[0-9]{10}$');
export const cdcNoValidator = Validators.pattern('^(c|C)+[0-9]{6}');
export const cdcNoValidatorWithOutC = Validators.pattern('^[0-9]{6}');
export const memeberNoValidator = Validators.pattern('^([0-9a-zA-Z]){8}$')

export const emailValidator = Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export class DateValidators {
    static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const date1 = c.get(dateField1).value;
            const date2 = c.get(dateField2).value;
            if ((date1 !== null && date2 !== null) && date1 > date2) {
                return validatorField;
            }
            return null;
        };
    }
}
export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

export function DateLessThanOrEqualsValidator(dateCompareControlName: string) {

    let thisDateControl: AbstractControl;
    let otherDateControl: AbstractControl;

    return function DateLessThanOrEqualsValidate(control: AbstractControl): ValidationErrors {
        if (!control.parent) {
            return null;
        }
        if (!thisDateControl) {
            thisDateControl = control;
            otherDateControl = control.parent.get(dateCompareControlName) as AbstractControl;
            if (!otherDateControl) {
                throw new Error('dateLessThanOrEqualsValidator(): other control is not found in parent group');
            }
            otherDateControl.valueChanges.subscribe(() => {
                thisDateControl.updateValueAndValidity();
            });
        }
        if (!otherDateControl || !otherDateControl.value) {
            return null;
        }
        const date1 = thisDateControl.value;
        const date2 = otherDateControl.value;
        const today = new Date();
        
        // console.log("lessthan");
        // console.log(date1);
        // console.log(today);
        // console.log("lessthan");
        if (date1 !== null && date2 !== null && date1 >= date2) {
            return {
                'date_less_than_or_equal': true
            };
        }
        return null;
    };
}

export function DateLessThanValidator(dateCompareControlName: string) {

    let thisDateControl: AbstractControl;
    let otherDateControl: AbstractControl;

    return function DateLessThanValidate(control: AbstractControl): ValidationErrors {
        if (!control.parent) {
            return null;
        }
        if (!thisDateControl) {
            thisDateControl = control;
            otherDateControl = control.parent.get(dateCompareControlName) as AbstractControl;
            if (!otherDateControl) {
                throw new Error('dateLessThanOrEqualsValidator(): other control is not found in parent group');
            }
            otherDateControl.valueChanges.subscribe(() => {
                thisDateControl.updateValueAndValidity();
            });
        }
        if (!otherDateControl || !otherDateControl.value) {
            return null;
        }
        const date1 = thisDateControl.value;
        const date2 = otherDateControl.value;
        if (date1 !== null && date2 !== null && date1 > date2) {
            return {
                'date_less_than_or_equal': true
            };
        }
        return null;
    };
}
export function ValidateTodayDate(dateCompareControlName: string) {

    let thisDateControl: AbstractControl;
    let otherDateControl: AbstractControl;

    return function ValidateTodayDate(control: AbstractControl): ValidationErrors {
        if (!control.parent) {
            return null;
        }
        if (!thisDateControl) {
            thisDateControl = control;
            otherDateControl = control.parent.get(dateCompareControlName) as AbstractControl;
            if (!otherDateControl) {
                throw new Error('dateLessThanOrEqualsValidator(): other control is not found in parent group');
            }
            thisDateControl.valueChanges.subscribe(() => {
                thisDateControl.updateValueAndValidity();
            });
        }
        if (!thisDateControl || !thisDateControl.value) {
            return null;
        }
        const date1 = thisDateControl.value;
        const date2 = otherDateControl.value;
        const today = new Date();
        const year = today.getFullYear();
        const mes = today.getMonth()+1;
        // const mes = 11;
        const dia = today.getDate();
        let month = null;
        let date = null;
        if(mes<10){
            month = "0"+mes;
        }else{
            month = mes;
        }
        if(dia<10){
            date = "0"+dia;
        }else{
            date = dia;
        }
        const fecha =year+"-"+month+"-"+date;
        // console.log("date1");
        // console.log(date1);
        // console.log(today);
        // console.log(fecha);
        // console.log("today");
        if (date1 < fecha) {
            return {
                'date_should_be_today_or_greater': true
            };
        }
        return null;
    };
}
export function amountGreaterThanZeroValidator(control: FormControl) {
    // control.value is assumed as a String
    let value = control.value;
    
    if(value != null){
        if(!isNaN(control.value)){
            value = control.value.toString();
        }
        const isLess = parseFloat(value.replace(/\,/g, '')) <= 0;
        const isValid = !isLess;
        return isValid ? null : { 'amountLessEqualZero': true };
    }
    return null;
    
}