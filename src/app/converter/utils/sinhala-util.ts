import { FormControl } from "@angular/forms";

export class SinhalaUtil {
    text!: string;
    nVowels!: number;
    consonants: any[] = [];
    consonantsUni: any[] = [];
    vowels: any[] = [];
    vowelsUni: any[] = [];
    vowelModifiersUni: any[] = [];
    specialConsonants: any[] = [];
    specialConsonantsUni: any[] = [];
    specialCharUni: any[] = [];
    specialChar: any[] = [];

    constructor() {
        this.vowelsUni[0] = 'ඌ'; this.vowels[0] = 'oo'; this.vowelModifiersUni[0] = 'ූ';
        this.vowelsUni[1] = 'ඕ'; this.vowels[1] = 'o\\)'; this.vowelModifiersUni[1] = 'ෝ';
        this.vowelsUni[2] = 'ඕ'; this.vowels[2] = 'oe'; this.vowelModifiersUni[2] = 'ෝ';
        this.vowelsUni[3] = 'ආ'; this.vowels[3] = 'aa'; this.vowelModifiersUni[3] = 'ා';
        this.vowelsUni[4] = 'ආ'; this.vowels[4] = 'a\\)'; this.vowelModifiersUni[4] = 'ා';
        this.vowelsUni[5] = 'ඈ'; this.vowels[5] = 'Aa'; this.vowelModifiersUni[5] = 'ෑ';
        this.vowelsUni[6] = 'ඈ'; this.vowels[6] = 'A\\)'; this.vowelModifiersUni[6] = 'ෑ';
        this.vowelsUni[7] = 'ඈ'; this.vowels[7] = 'ae'; this.vowelModifiersUni[7] = 'ෑ';
        this.vowelsUni[8] = 'ඊ'; this.vowels[8] = 'ii'; this.vowelModifiersUni[8] = 'ී';
        this.vowelsUni[9] = 'ඊ'; this.vowels[9] = 'i\\)'; this.vowelModifiersUni[9] = 'ී';
        this.vowelsUni[10] = 'ඊ'; this.vowels[10] = 'ie'; this.vowelModifiersUni[10] = 'ී';
        this.vowelsUni[11] = 'ඊ'; this.vowels[11] = 'ee'; this.vowelModifiersUni[11] = 'ී';
        this.vowelsUni[12] = 'ඒ'; this.vowels[12] = 'ea'; this.vowelModifiersUni[12] = 'ේ';
        this.vowelsUni[13] = 'ඒ'; this.vowels[13] = 'e\\)'; this.vowelModifiersUni[13] = 'ේ';
        this.vowelsUni[14] = 'ඒ'; this.vowels[14] = 'ei'; this.vowelModifiersUni[14] = 'ේ';
        this.vowelsUni[15] = 'ඌ'; this.vowels[15] = 'uu'; this.vowelModifiersUni[15] = 'ූ';
        this.vowelsUni[16] = 'ඌ'; this.vowels[16] = 'u\\)'; this.vowelModifiersUni[16] = 'ූ';
        this.vowelsUni[17] = 'ඖ'; this.vowels[17] = 'au'; this.vowelModifiersUni[17] = 'ෞ';
        this.vowelsUni[18] = 'ඇ'; this.vowels[18] = '/\a'; this.vowelModifiersUni[18] = 'ැ';

        this.vowelsUni[19] = 'අ'; this.vowels[19] = 'a'; this.vowelModifiersUni[19] = '';
        this.vowelsUni[20] = 'ඇ'; this.vowels[20] = 'A'; this.vowelModifiersUni[20] = 'ැ';
        this.vowelsUni[21] = 'ඉ'; this.vowels[21] = 'i'; this.vowelModifiersUni[21] = 'ි';
        this.vowelsUni[22] = 'එ'; this.vowels[22] = 'e'; this.vowelModifiersUni[22] = 'ෙ';
        this.vowelsUni[23] = 'උ'; this.vowels[23] = 'u'; this.vowelModifiersUni[23] = 'ු';
        this.vowelsUni[24] = 'ඔ'; this.vowels[24] = 'o'; this.vowelModifiersUni[24] = 'ො';
        this.vowelsUni[25] = 'ඓ'; this.vowels[25] = 'I'; this.vowelModifiersUni[25] = 'ෛ';
        this.nVowels = 26;

        this.specialConsonantsUni[0] = 'ං'; this.specialConsonants[0] = /\\n/g;
        this.specialConsonantsUni[1] = 'ඃ'; this.specialConsonants[1] = /\\h/g;
        this.specialConsonantsUni[2] = 'ඞ'; this.specialConsonants[2] = /\\N/g;
        this.specialConsonantsUni[3] = 'ඍ'; this.specialConsonants[3] = /\\R/g;
        //special characher Repaya
        this.specialConsonantsUni[4] = 'ර්' + '\u200D'; this.specialConsonants[4] = /R/g;
        this.specialConsonantsUni[5] = 'ර්' + '\u200D'; this.specialConsonants[5] = /\\r/g;

        this.consonantsUni[0] = 'ඬ'; this.consonants[0] = 'nnd';
        this.consonantsUni[1] = 'ඳ'; this.consonants[1] = 'nndh';
        this.consonantsUni[2] = 'ඟ'; this.consonants[2] = 'nng';
        this.consonantsUni[3] = 'ථ'; this.consonants[3] = 'Th';
        this.consonantsUni[4] = 'ධ'; this.consonants[4] = 'Dh';
        this.consonantsUni[5] = 'ඝ'; this.consonants[5] = 'gh';
        this.consonantsUni[6] = 'ඡ'; this.consonants[6] = 'Ch';
        this.consonantsUni[7] = 'ඵ'; this.consonants[7] = 'ph';
        this.consonantsUni[8] = 'භ'; this.consonants[8] = 'bh';
        this.consonantsUni[9] = 'ශ'; this.consonants[9] = 'sh';
        this.consonantsUni[10] = 'ෂ'; this.consonants[10] = 'Sh';
        this.consonantsUni[11] = 'ඥ'; this.consonants[11] = 'GN';
        this.consonantsUni[12] = 'ඤ'; this.consonants[12] = 'KN';
        this.consonantsUni[13] = 'ළු'; this.consonants[13] = 'Lu';
        this.consonantsUni[14] = 'ද'; this.consonants[14] = 'dh';
        this.consonantsUni[15] = 'ච'; this.consonants[15] = 'ch';
        this.consonantsUni[16] = 'ඛ'; this.consonants[16] = 'kh';
        this.consonantsUni[17] = 'ත'; this.consonants[17] = 'th';

        this.consonantsUni[18] = 'ට'; this.consonants[18] = 't';
        this.consonantsUni[19] = 'ක'; this.consonants[19] = 'k';
        this.consonantsUni[20] = 'ඩ'; this.consonants[20] = 'd';
        this.consonantsUni[21] = 'න'; this.consonants[21] = 'n';
        this.consonantsUni[22] = 'ප'; this.consonants[22] = 'p';
        this.consonantsUni[23] = 'බ'; this.consonants[23] = 'b';
        this.consonantsUni[24] = 'ම'; this.consonants[24] = 'm';
        this.consonantsUni[25] = '‍ය'; this.consonants[25] = '\\u005C' + 'y';
        this.consonantsUni[26] = '‍ය'; this.consonants[26] = 'Y';
        this.consonantsUni[27] = 'ය'; this.consonants[27] = 'y';
        this.consonantsUni[28] = 'ජ'; this.consonants[28] = 'j';
        this.consonantsUni[29] = 'ල'; this.consonants[29] = 'l';
        this.consonantsUni[30] = 'ව'; this.consonants[30] = 'v';
        this.consonantsUni[31] = 'ව'; this.consonants[31] = 'w';
        this.consonantsUni[32] = 'ස'; this.consonants[32] = 's';
        this.consonantsUni[33] = 'හ'; this.consonants[33] = 'h';
        this.consonantsUni[34] = 'ණ'; this.consonants[34] = 'N';
        this.consonantsUni[35] = 'ළ'; this.consonants[35] = 'L';
        this.consonantsUni[36] = 'ඛ'; this.consonants[36] = 'K';
        this.consonantsUni[37] = 'ඝ'; this.consonants[37] = 'G';
        this.consonantsUni[38] = 'ඨ'; this.consonants[38] = 'T';
        this.consonantsUni[39] = 'ඪ'; this.consonants[39] = 'D';
        this.consonantsUni[40] = 'ඵ'; this.consonants[40] = 'P';
        this.consonantsUni[41] = 'ඹ'; this.consonants[41] = 'B';
        this.consonantsUni[42] = 'ෆ'; this.consonants[42] = 'f';
        this.consonantsUni[43] = 'ඣ'; this.consonants[43] = 'q';
        this.consonantsUni[44] = 'ග'; this.consonants[44] = 'g';
        //last because we need to ommit this in dealing with Rakaransha
        this.consonantsUni[45] = 'ර'; this.consonants[45] = 'r';

        this.specialCharUni[0] = 'ෲ'; this.specialChar[0] = 'ruu';
        this.specialCharUni[1] = 'ෘ'; this.specialChar[1] = 'ru';
        //this.specialCharUni[2]='්‍ර'; this.specialChar[2]='ra';
    }


    startText(text: string, formControl: FormControl) {
        var s, r, v;
        // text = document.txtBox.box1.value;
        //special consonents
        for (var i = 0; i < this.specialConsonants.length; i++) {
            text = text.replace(this.specialConsonants[i], this.specialConsonantsUni[i]);
        }
        //consonents + special Chars
        for (var i = 0; i < this.specialCharUni.length; i++) {
            for (var j = 0; j < this.consonants.length; j++) {
                s = this.consonants[j] + this.specialChar[i];
                v = this.consonantsUni[j] + this.specialCharUni[i];
                r = new RegExp(s, "g");
                text = text.replace(r, v);
            }
        }
        //consonants + Rakaransha + vowel modifiers
        for (var j = 0; j < this.consonants.length; j++) {
            for (var i = 0; i < this.vowels.length; i++) {
                s = this.consonants[j] + "r" + this.vowels[i];
                v = this.consonantsUni[j] + "්‍ර" + this.vowelModifiersUni[i];
                r = new RegExp(s, "g");
                text = text.replace(r, v);
            }
            s = this.consonants[j] + "r";
            v = this.consonantsUni[j] + "්‍ර";
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
        //consonents + vowel modifiers
        for (var i = 0; i < this.consonants.length; i++) {
            for (var j = 0; j < this.nVowels; j++) {
                s = this.consonants[i] + this.vowels[j];
                v = this.consonantsUni[i] + this.vowelModifiersUni[j];
                r = new RegExp(s, "g");
                text = text.replace(r, v);
            }
        }

        //consonents + HAL
        for (var i = 0; i < this.consonants.length; i++) {
            r = new RegExp(this.consonants[i], "g");
            text = text.replace(r, this.consonantsUni[i] + "්");
        }

        //vowels
        for (var i = 0; i < this.vowels.length; i++) {
            r = new RegExp(this.vowels[i], "g");
            text = text.replace(r, this.vowelsUni[i]);
        }

        formControl.setValue(text);
        // document.txtBox.box2.value = text;
    }

    // function copyit(theField) {
    //     var tempval = eval("document." + theField);
    //     tempval.focus();
    //     tempval.select();
    //     therange = tempval.createTextRange();
    //     therange.execCommand("Copy")
    // }

    // var schemeVisible = 0;
    // function changeVisibility() {
    //     if (schemeVisible) {
    //         document.getElementById('scheme').style.visibility = 'hidden';
    //         document.getElementById('link').innerHTML = "&nbsp;Show Transliteration Scheme&nbsp;";
    //         schemeVisible = 0;
    //     }
    //     else {
    //         document.getElementById('scheme').style.visibility = 'visible';
    //         document.getElementById('link').innerHTML = "&nbsp;&nbsp;Hide Transliteration Scheme&nbsp;";
    //         schemeVisible = 1;
    //     }
    // }
}