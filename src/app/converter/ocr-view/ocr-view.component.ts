import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NbWindowService, NbWindowRef } from '@nebular/theme';
import { OcrViewService } from './ocr-view.service';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormArrayName, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Mistral } from '@mistralai/mistralai';
import { Paper } from '../paper/paper.component';
import { LocalStorageService } from '../../local-storage.service';
import { NgbActiveOffcanvas, NgbDropdownModule, NgbOffcanvas, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SinhalaUtilService } from '../utils/sinhala-util.service';
// import FileSaver, { saveAs } from 'file-saver';
import { saveAs } from 'file-saver';
interface QuestionFlat {
  questionNumber: number;

  questionText1?: string;
  questionImg1?: string;
  questionImg2?: string;
  questionText2?: string;
  questionImg3?: string;
  questionText3?: string;
  option1AText?: string;
  option1AImg?: string;
  option1BText?: string;
  option1BImg?: string;
  option1CText?: string;
  option1CImg?: string;
  option1DText?: string;
  option1DImg?: string;
  option1EText?: string;
  option1EImg?: string;

  option2AText?: string;
  option2AImg?: string;
  option2BText?: string;
  option2BImg?: string;
  option2CText?: string;
  option2CImg?: string;
  option2DText?: string;
  option2DImg?: string;
  option2EText?: string;
  option2EImg?: string;

  answer1Text?: string;
  answer1Img?: string;
  answer2Text?: string;
  answer2Img?: string;
  answer3Text?: string;
  answer3Img?: string;
  answer4Text?: string;
  answer4Img?: string;
  answer5Text?: string;
  answer5Img?: string;
}

interface QuestionComponent {
  [key: string]: string;
}

@Component({
  selector: 'app-ocr-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbDropdownModule,
    NgbPaginationModule
  ],
  templateUrl: './ocr-view.component.html',
  styleUrls: [ './ocr-view.component.scss']
})

export class OcrViewComponent {

  result: any = null;
  // questions: QuestionFlat[] = [];
  questions: any[] = [];
  base64Images: any[] = [];
  completeMarkdown: any = "";
  tempMarkdown: any = "";
  selectedPaper: Paper = {} as Paper;

  imageRegex = /!\[.*?\]\((.*?)\)/g;
  optionRegex = /(I\.|II\.|III\.|IV\.|V\.)\s*(.*)/g;
  answerRegex = /\((a|b|c|d|e)\)\s*(.*)/g;

  forms: FormGroup[] = [];
  currentIndex = 0;
  isPreview = false;
  view = 'form'; // 'papers' or 'form'
  // view = 'papers'; // 'papers' or 'form'

  enteredPapers: Paper[] = [];

  questionIdentifiers: string[] = ["1)", "(1)", "1.", "I."];
  optionIdentifiers: string[] = ["I.", "(I)", "(i)", "(A)", "A -", "(a)"];
  answerIdentifiers: string[] = ["1)", "(1)", "1.", "I.", "(I)", "(i)", "(A)", "(a)"];
  questionIdentifier: string = this.questionIdentifiers[0];
  optionIdentifier: string = this.optionIdentifiers[0];
  answerIdentifier: string = this.answerIdentifiers[0];

  viewPaper(paper: Paper) {
    // console.log('Clicked Paper:', paper);
    this.forms = this.createFormList(paper.questions as any[]);
    this.questions = paper.questions || [];
    this.localStorageService.setSelectedPaper(paper);
    this.view = 'form';
  }

  async ngOnInit() {
    this.setSettings();
   
    this.selectedPaper = this.localStorageService.getSelectedPaper();
    // console.log('Selected Paper:', this.selectedPaper);
    if (this.selectedPaper && Object.keys(this.selectedPaper).length > 0) {
      if (this.selectedPaper.paperBase64) {
        await this.parseOcr(this.selectedPaper.paperBase64);
        this.selectedPaper.questions = this.questions;
        this.selectedPaper.paperImages = this.base64Images;
        this.selectedPaper.paperBase64 = '';
        this.selectedPaper.paperMarkdown = this.completeMarkdown;
        this.localStorageService.setSelectedPaper(this.selectedPaper);
        this.localStorageService.setPaper(this.selectedPaper);
      }else if (this.selectedPaper.paperMarkdown) {
        this.questions = [];
        this.forms = [];  
        this.base64Images = this.selectedPaper.paperImages || [];
        this.completeMarkdown = this.selectedPaper.paperMarkdown;
        await this.parseOcrFromMarkdown(this.completeMarkdown); 
        this.selectedPaper.questions = this.questions;

        this.localStorageService.setSelectedPaper(this.selectedPaper);
        this.localStorageService.setPaper(this.selectedPaper);
      }
      this.viewPaper(this.selectedPaper);
    }
     
    else {
      this.view = 'papers';
      this.enteredPapers = this.localStorageService.getPapers();
    }
  }

  convert(formControl: FormControl) {
    // console.log("formControl")
    // console.log(formControl)
    if (this.selectedPaper.medium == "SIN") {
      // this.sinhalaUtilService.startText(formControl.value);
      this.sinhalaUtilService.translate(formControl.value, formControl);
      
    }

  }

  showPaperMarkdown() {
    this.view = 'markdown';
    this.completeMarkdown = this.selectedPaper.paperMarkdown || '';
    this.tempMarkdown = this.completeMarkdown;
    // console.log("this.completeMarkdown")

    // console.log(this.completeMarkdown)
  }

  updateMarkdown() {
    // console.log("completeMarkdown")
    // console.log(this.completeMarkdown)
    this.questions = [];
    this.forms = [];
    this.base64Images = this.selectedPaper.paperImages as any[];
    this.selectedPaper.paperMarkdown = this.completeMarkdown;
    this.parseOcrFromMarkdown(this.completeMarkdown);
    this.selectedPaper.questions = this.questions;
    this.localStorageService.setSelectedPaper(this.selectedPaper);
    this.localStorageService.setPaper(this.selectedPaper);
    this.view = 'form';

  }

  cancelMarkdown() {
    this.completeMarkdown = this.tempMarkdown;
    this.view = 'form';
  }

 
  parseSequentialSlotWithOptionImagesNew(input: string) {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;

    const questionPattern = this.getQuestionRegex(this.questionIdentifier);
    const optionPattern = this.getOptionRegex(this.optionIdentifier);
    const answerPattern = this.getAnswerRegex(this.answerIdentifier);

    const cleanLatex = (content: string) => {
      return content
        .replace(/\\mathrm{([^}]*)}/g, '$1')
        .replace(/\\bar{([^}]*)}/g, '$1̅')
        .replace(/\\overline{([^}]*)}/g, '$1̅')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1/$2)')
        .replace(/\\cdot/g, '·')
        .replace(/\$\$/g, '')
        .replace(/\$/g, '')
        .replace(/\\\\/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\s*/g, '')
        .replace(/ +/g, ' ')
        .trim();
    };

    for (const match of input.matchAll(questionPattern)) {
      const questionNumber = parseInt(match[1]);
      const questionBlock = match[2].trim();
      const question: any = { questionNumber };

      const slots = [
        { key: 'questionText1', type: 'text' },
        { key: 'questionImg1', type: 'image' },
        { key: 'questionImg2', type: 'image' },
        { key: 'questionText2', type: 'text' },

        { key: 'option1A', type: 'option' },
        { key: 'option1B', type: 'option' },
        { key: 'option1C', type: 'option' },
        { key: 'option1D', type: 'option' },
        { key: 'option1E', type: 'option' },

        { key: 'questionImg3', type: 'image' },
        { key: 'questionText3', type: 'text' },

        { key: 'option2A', type: 'option' },
        { key: 'option2B', type: 'option' },
        { key: 'option2C', type: 'option' },
        { key: 'option2D', type: 'option' },
        { key: 'option2E', type: 'option' },

        { key: 'answer1', type: 'answer' },
        { key: 'answer2', type: 'answer' },
        { key: 'answer3', type: 'answer' },
        { key: 'answer4', type: 'answer' },
        { key: 'answer5', type: 'answer' },
      ];

      const elements: {
        type: 'text' | 'image' | 'option' | 'answer';
        label?: string;
        text?: string;
        img?: string;
        imgBase64?: string;
      }[] = [];


      const answerStart = (questionBlock.search(answerPattern) != -1) ? questionBlock.search(answerPattern) : questionBlock.length;
      const questionWithoutAnswersBlock = questionBlock.substring(0, answerStart);
      // console.log("answerStart", answerStart);
      // console.log("questionWithoutAnswersBlock", questionWithoutAnswersBlock);

      const imgMatches = [...questionWithoutAnswersBlock.matchAll(imageRegex)];
      const optionMatches = [...questionWithoutAnswersBlock.matchAll(optionPattern)];
      const answerMatches = [...questionBlock.matchAll(answerPattern)];

      // get image matches in answers


      let allMatches: any[] = [];

      imgMatches.forEach(match => {
        allMatches.push({ type: 'image', data: match });
      });
      optionMatches.forEach(match => {
        allMatches.push({ type: 'option', data: match });
      });
      answerMatches.forEach(match => {
        allMatches.push({ type: 'answer', data: match });
      });


      allMatches.sort((a, b) => (a.data.index || 0) - (b.data.index || 0));

      let endIndex = 0;
      let lastOptionEnd = 0;
      let answerStarted = false;

      for (const match of allMatches) {
        const matchIndex = match.data.index!;
        const textBefore = questionBlock.substring(endIndex, matchIndex).trim();
        if (textBefore) {
          elements.push({ type: 'text', text: cleanLatex(textBefore) });
        }

        if (match.type === 'image') {
          const img = match.data[1];
          const base64 = this.base64Images.find(i => i.id === img)?.imageBase64 || img;
          elements.push({ type: 'image', imgBase64: base64 });
          endIndex = matchIndex + match.data[0].length;
        } else if (match.type === 'option') {
          const label = match.data[1];
          const content = match.data[2].trim();
          elements.push({
            type: 'option',
            label,
            text: cleanLatex(content)
          });
          endIndex = matchIndex + match.data[0].length;
          lastOptionEnd = endIndex;
        } else if (match.type === 'answer') {
          // Before processing answer, extract text between last option and first answer
          if (!answerStarted && lastOptionEnd > 0) {
            const betweenText = questionBlock.substring(lastOptionEnd, matchIndex).trim();
            // Only add if not empty and ends with . or ,
            if (betweenText && /[.,]$/.test(betweenText)) {
              elements.push({ type: 'text', text: cleanLatex(betweenText) });
            }
          }
          const label = match.data[1];
          const content = match.data[2].trim();
          elements.push({
            type: 'answer',
            label,
            text: cleanLatex(content)
          });
          endIndex = matchIndex + match.data[0].length;
          answerStarted = true;
        }
      }

      // Add trailing text after last match
      const tailText = questionBlock.substring(endIndex).trim();
      if (tailText) {
        elements.push({ type: 'text', text: cleanLatex(tailText) });
      }

      // === Assign to slots ===
      let index = 0;
      for (const slot of slots) {
        if (index >= elements.length) break;

        const current = elements[index];
        if (slot.type === current.type) {
          if (slot.type === 'text') {
            question[slot.key] = current.text;
          } else if (slot.type === 'image') {
            question[slot.key] = current.imgBase64;
          } else if (slot.type === 'option' || slot.type === 'answer') {
            if (current.text) question[`${slot.key}Text`] = current.text;
            if (current.img) question[`${slot.key}Img`] = current.img;
          }
          index++;
        }
      }

      this.questions.push(question);
    }
    // console.log("this.questions");
    // console.log(this.questions);
  }

  parseQuestionsFromMarkdown(input: string) {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const questionPattern = this.getQuestionRegex(this.questionIdentifier);
    const optionPattern = this.getOptionRegex(this.optionIdentifier);
    const answerPattern = this.getAnswerRegex(this.answerIdentifier);

    const cleanLatex = (content: string) => {
      return content
        .replace(/\\mathrm{([^}]*)}/g, '$1')
        .replace(/\\bar{([^}]*)}/g, '$1̅')
        .replace(/\\overline{([^}]*)}/g, '$1̅')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1/$2)')
        .replace(/\\cdot/g, '·')
        .replace(/\$\$/g, '')
        .replace(/\$/g, '')
        .replace(/\\\\/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\s*/g, '')
        .replace(/ +/g, ' ')
        .trim();
    };

    for (const match of input.matchAll(questionPattern)) {
      const questionNumber = parseInt(match[1]);
      const questionBlock = match[2].trim();
      const question: any = { questionNumber };

      // console.log("questionNumber", questionNumber);
      // console.log("questionBlock", questionBlock);

      const slots = [
        { key: 'questionText1', type: 'text' },
        { key: 'questionImg1', type: 'image' },
        { key: 'questionImg2', type: 'image' },
        { key: 'questionText2', type: 'text' },

        { key: 'option1A', type: 'option' },
        { key: 'option1B', type: 'option' },
        { key: 'option1C', type: 'option' },
        { key: 'option1D', type: 'option' },
        { key: 'option1E', type: 'option' },

        // { key: 'option1AImg', type: 'image' },
        // { key: 'option1BImg', type: 'image' },
        // { key: 'option1CImg', type: 'image' },
        // { key: 'option1DImg', type: 'image' },
        // { key: 'option1EImg', type: 'image' },

        { key: 'questionImg3', type: 'image' },
        { key: 'questionText3', type: 'text' },

        { key: 'option2A', type: 'option' },
        { key: 'option2B', type: 'option' },
        { key: 'option2C', type: 'option' },
        { key: 'option2D', type: 'option' },
        { key: 'option2E', type: 'option' },

        { key: 'answer1', type: 'answer' },
        { key: 'answer2', type: 'answer' },
        { key: 'answer3', type: 'answer' },
        { key: 'answer4', type: 'answer' },
        { key: 'answer5', type: 'answer' },
      ];

      const elements: {
        type: 'text' | 'image' | 'option' | 'answer';
        label?: string;
        text?: string;
        img?: string;
        imgBase64?: string;
      }[] = [];

      const answerStart = questionBlock.search(answerPattern);
      const questionWithoutAnswersBlock = questionBlock.substring(0, answerStart);

      const imgMatches = [...questionWithoutAnswersBlock.matchAll(imageRegex)];
      const optionMatches = [...questionWithoutAnswersBlock.matchAll(optionPattern)];
      const answerMatches = [...questionBlock.matchAll(answerPattern)];




      let allMatches: any[] = [];

      imgMatches.forEach(match => {
        allMatches.push({ type: 'image', data: match });
      });
      optionMatches.forEach(match => {
        allMatches.push({ type: 'option', data: match });
      });
      answerMatches.forEach(match => {
        allMatches.push({ type: 'answer', data: match });
      });



      allMatches.sort((a, b) => (a.data.index || 0) - (b.data.index || 0));


      let endIndex = 0;
      let lastOptionEnd = 0;
      let answerStarted = false;

      for (const match of allMatches) {
        const matchIndex = match.data.index!;
        const textBefore = questionBlock.substring(endIndex, matchIndex).trim();
        if (textBefore) {
          elements.push({ type: 'text', text: cleanLatex(textBefore) });
        }

        if (match.type === 'image') {
          const img = match.data[1];
          const base64 = this.base64Images.find(i => i.id === img)?.imageBase64 || img;
          elements.push({ type: 'image', imgBase64: base64 });
          endIndex = matchIndex + match.data[0].length;
        } else if (match.type === 'option') {
          const label = match.data[1];
          const content = match.data[2].trim();
          elements.push({
            type: 'option',
            label,
            text: cleanLatex(content)
          });
          endIndex = matchIndex + match.data[0].length;
          lastOptionEnd = endIndex;
        } else if (match.type === 'answer') {
          // Before processing answer, extract text between last option and first answer
          if (!answerStarted && lastOptionEnd > 0) {
            const betweenText = questionBlock.substring(lastOptionEnd, matchIndex).trim();
            // Only add if not empty and ends with . or ,
            if (betweenText && /[.,]$/.test(betweenText)) {
              elements.push({ type: 'text', text: cleanLatex(betweenText) });
            }
          }
          const label = match.data[1];
          const content = match.data[2].trim();
          elements.push({
            type: 'answer',
            label,
            text: cleanLatex(content)
          });
          endIndex = matchIndex + match.data[0].length;
          answerStarted = true;
        }
      }

      // Add trailing text after last match
      const tailText = questionBlock.substring(endIndex).trim();
      if (tailText) {
        elements.push({ type: 'text', text: cleanLatex(tailText) });
      }

      // === Assign to slots ===
      let index = 0;
      for (const slot of slots) {
        if (index >= elements.length) break;

        const current = elements[index];
        if (slot.type === current.type) {
          if (slot.type === 'text') {
            question[slot.key] = current.text;
          } else if (slot.type === 'image') {
            question[slot.key] = current.imgBase64;
          } else if (slot.type === 'option' || slot.type === 'answer') {
            if (current.text) question[`${slot.key}Text`] = current.text;
            if (current.img) question[`${slot.key}Img`] = current.img;
          }
          index++;
        }
      }

      this.questions.push(question);
    }

  }
 @ViewChild('settingsTemplate') settingsTemplate: TemplateRef<any>;

 windowRef: NbWindowRef;
  constructor(
    private windowService: NbWindowService,
    private fb: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    private localStorageService: LocalStorageService,
    private sinhalaUtilService: SinhalaUtilService,
    private ocrViewService: OcrViewService,

  ) { }

  createForm(question: any): FormGroup {

    return this.fb.group({
      questionNumber: [question.questionNumber],

      questionText1: [question.questionText1 || ''],
      questionText1Available: [!(question.questionText1 == null || question.questionText1 == '')],
  
      questionImg1: [''],
      questionImg1Available: [!(question.questionImg1 == null || question.questionImg1 == '')],
      // questionImg2: [question.questionImg2 || ''],
      questionImg2: [''],
      questionImg2Available: [!(question.questionImg2 == null || question.questionImg2 == '')],
      questionText2: [question.questionText2 || ''],
      questionText2Available: [!(question.questionText2 == null || question.questionText2 == '')],

      option1AText: [question.option1AText || ''],
      option1ATextAvailable: [!(question.option1AText == null || question.option1AText == '')],
      option1AImg: [question.option1AImg || ''],
      option1AImgAvailable: [!(question.option1AImg == null || question.option1AImg == '')],
      option1BText: [question.option1BText || ''],
      option1BTextAvailable: [!(question.option1BText == null || question.option1BText == '')],
      option1BImg: [question.option1BImg || ''],
      option1BImgAvailable: [!(question.option1BImg == null || question.option1BImg == '')],
      option1CText: [question.option1CText || ''],
      option1CTextAvailable: [!(question.option1CText == null || question.option1CText == '')],
      option1CImg: [question.option1CImg || ''],
      option1CImgAvailable: [!(question.option1CImg == null || question.option1CImg == '')],
      option1DText: [question.option1DText || ''],
      option1DTextAvailable: [!(question.option1DText == null || question.option1DText == '')],
      option1DImg: [question.option1DImg || ''],
      option1DImgAvailable: [!(question.option1DImg == null || question.option1DImg == '')],
      option1EText: [question.option1EText || ''],
      option1ETextAvailable: [!(question.option1EText == null || question.option1EText == '')],
      option1EImg: [question.option1EImg || ''],
      option1EImgAvailable: [!(question.option1EImg == null || question.option1EImg == '')],

      // questionImg3: [question.questionImg3 || ''],
      questionImg3: [''],
      questionImg3Available: [!(question.questionImg3 == null || question.questionImg3 == '')],
      questionText3: [question.questionText3 || ''],
      questionText3Available: [!(question.questionText3 == null || question.questionText3 == '')],

      option2AText: [question.option2AText || ''],
      option2ATextAvailable: [!(question.option2AText == null || question.option2AText == '')],
      option2AImg: [question.option2AImg || ''],
      option2AImgAvailable: [!(question.option2AImg == null || question.option2AImg == '')],
      option2BText: [question.option2BText || ''],
      option2BTextAvailable: [!(question.option2BText == null || question.option2BText == '')],
      option2BImg: [question.option2BImg || ''],
      option2BImgAvailable: [!(question.option2BImg == null || question.option2BImg == '')],
      option2CText: [question.option2CText || ''],
      option2CTextAvailable: [!(question.option2CText == null || question.option2CText == '')],
      option2CImg: [question.option2CImg || ''],
      option2CImgAvailable: [!(question.option2CImg == null || question.option2CImg == '')],
      option2DText: [question.option2DText || ''],
      option2DTextAvailable: [!(question.option2DText == null || question.option2DText == '')],
      option2DImg: [question.option2DImg || ''],
      option2DImgAvailable: [!(question.option2DImg == null || question.option2DImg == '')],
      option2EText: [question.option2EText || ''],
      option2ETextAvailable: [!(question.option2EText == null || question.option2EText == '')],
      option2EImg: [question.option2EImg || ''],
      option2EImgAvailable: [!(question.option2EImg == null || question.option2EImg == '')],

      answer1Text: [question.answer1Text || ''],
      answer1TextAvailable: [!(question.answer1Text == null || question.answer1Text == '')],
      answer1Img: [question.answer1Img || ''],
      answer1ImgAvailable: [!(question.answer1Img == null || question.answer1Img == '')],
      answer2Text: [question.answer2Text || ''],
      answer2TextAvailable: [!(question.answer2Text == null || question.answer2Text == '')],
      answer2Img: [question.answer2Img || ''],
      answer2ImgAvailable: [!(question.answer2Img == null || question.answer2Img == '')],
      answer3Text: [question.answer3Text || ''],
      answer3TextAvailable: [!(question.answer3Text == null || question.answer3Text == '')],
      answer3Img: [question.answer3Img || ''],
      answer3ImgAvailable: [!(question.answer3Img == null || question.answer3Img == '')],
      answer4Text: [question.answer4Text || ''],
      answer4TextAvailable: [!(question.answer4Text == null || question.answer4Text == '')],
      answer4Img: [question.answer4Img || ''],
      answer4ImgAvailable: [!(question.answer4Img == null || question.answer4Img == '')],
      answer5Text: [question.answer5Text || ''],
      answer5TextAvailable: [!(question.answer5Text == null || question.answer5Text == '')],
      answer5Img: [question.answer5Img || ''],
      answer5ImgAvailable: [!(question.answer5Img == null || question.answer5Img == '')]
    });
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  next() {
    if (this.currentIndex < this.forms.length - 1) this.currentIndex++;
    this.saveQuestionsToLocalStorage();
  }

  togglePreview() {
    this.isPreview = !this.isPreview;
  }

  submitAll() {
    this.saveQuestionsToLocalStorage();
    // const result = this.forms.map(form => form.value);
    // console.log('Submitted Questions:', this.questions);
    for (let question of this.questions) {
      // console.log("question");
      // console.log(question);
      if (question['questionImg1'] && question['questionImg1'].startsWith('data:image/')) {
        question['questionImg1'] = this.base64ToBlob(question['questionImg1']);
      }
      if (question['questionImg2'] && question['questionImg2'].startsWith('data:image/')) {
        question['questionImg2'] = this.base64ToBlob(question['questionImg2']);
      }
      if (question['questionImg3'] && question['questionImg3'].startsWith('data:image/')) {
        question['questionImg3'] = this.base64ToBlob(question['questionImg3']);
      }
    }
    // console.log('Formatted Questions:', this.questions);

    // upload to server
    const formData = new FormData();

    // Put the "textual" parts into JSON
    const questionsWithoutBlobs = this.questions.map(q => {
      const copy = { ...q };
      // remove blob fields for now
      Object.keys(copy).forEach(k => {
        if (copy[k] instanceof Blob) {
          delete copy[k];
        }
      });
      return copy;
    });

    formData.append("questions", JSON.stringify(questionsWithoutBlobs));

    let questionImages: any = [];
    // Attach blobs separately with consistent keys
    this.questions.forEach((q, idx) => {
      Object.keys(q).forEach(key => {
        if (q[key] instanceof Blob) {
          //get image number from key
          const imageNumber = key.match(/Img(\d+)/)?.[1];
          formData.append(`questionImages[${idx}][${imageNumber}]`, q[key], `${this.selectedPaper.subject}-${idx}-${imageNumber}.jpg`);
        }
      });
    });
    // console.log("formData", formData);
  }

  saveQuestionsToLocalStorage() {
    // Only save fields with Available flag true
    this.questions = this.forms.map((form, i) => {
      const values = form.value;
      const filtered: any = {};
      Object.keys(values).forEach(key => {
        // If it's an Available flag and true, include the related field
        if (key.endsWith('Available') && values[key]) {
          if (key.search(/Img/) !== -1) {
            const baseKey = key.replace('Available', '');
            filtered[baseKey] = this.questions[i][baseKey];
            // filtered[key] = true;
          } else {
            const baseKey = key.replace('Available', '');
            filtered[baseKey] = values[baseKey];
            // filtered[key] = true;
          }

        }
      });
      // Always include questionNumber
      if (values.questionNumber !== undefined) {
        filtered.questionNumber = values.questionNumber;
      }
      return filtered;
    });

    // Save to selectedPaper and local storage
    if (this.selectedPaper) {
      this.selectedPaper.questions = this.questions;
      this.localStorageService.setSelectedPaper(this.selectedPaper);
      this.localStorageService.setPaper(this.selectedPaper);
    }
    // console.log('Questions saved to local storage.');
  }

  async parseOcr(base64Pdf: any) {
    try {
      // const apiKey = "BBy9lC2RkVcmPP9ZzIqVAn3F22kGYvNp";
      // const client = new Mistral({ apiKey: apiKey });
      // const ocrResponse = await client.ocr.process({
      //   model: "mistral-ocr-latest",
      //   document: {
      //     type: "document_url",
      //     documentUrl: base64Pdf
      //   },
      //   includeImageBase64: true
      // });
      // console.log("ocrResponse");
      // console.log(ocrResponse);

      // CS
      const ocrResponse = {
        "pages": [
          {
            "index": 0,
            "markdown": "UNIVERSITY OF COLOMBO, SRI LANKA\n\nUNIVERSITY OF COLOMBO SCHOOL OF COMPUTING\n\nDEGREE OF BACHELOR OF INFORMATION TECHNOLOGY (EXTERNAL)\nAcademic Year 2010/2011 – 1st Year Examination – Semester 1\n\nIT1204 - Computer Systems I\n05th March 2011\n(TWO HOURS)\n\n**Important Instructions:**\n\n- The duration of the paper is 2 (two) hours.\n- The medium of instruction and questions is English.\n- The paper has 50 questions and 11 pages.\n- All questions are of the MCQ (Multiple Choice Questions) type.\n- All questions should be answered.\n- Each question will have 5 (five) choices with one or more correct answers.\n- All questions will carry equal marks.\n- There will be a penalty for incorrect responses to discourage guessing.\n- The mark given for a question will vary from 0 to +1 (All the correct choices are marked & no incorrect choices are marked).\n- Answers should be marked on the special answer sheet provided.\n- Note that questions appear on both sides of the paper.\n- If a page is not printed, please inform the supervisor immediately.\n- Mark the correct choices on the question paper first and then transfer them to the given answer sheet which will be machine marked. Please completely read and follow the instructions given on the other side of the answer sheet before you shade your correct choices.",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 1,
            "markdown": "1) Which of the following statements is/are true?\n(a) Herman Hollerith designed the Analytical Engine.\n(b) The Pascaline developed by Blaise Pascal could perform addition with carry and subtraction.\n(c) The Pascaline developed by Blaise Pascal read data from punch cards.\n(d) Ada Lovelace is considered to be the first computer programmer.\n(e) The Differential Engine was developed by Blaise Pascal.\n2) Which component(s) an/ are essential part(s) of a basic computing system?\n(a) A mechanism for transferring data to and from the outside world.\n(b) Pattern driven computing model to extract unique patterns.\n(c) A memory to store both data and programs.\n(d) A processor to interpret and execute programs.\n(e) Personal Information Manager (PIM) software.\n3) Consider the following abstract view of the typical components of a computer.\n![img-0.jpeg](img-0.jpeg)\n\nThe components marked as 1,2 and 3 respectively represent\n(a) Storage, Input, CPU.\n(b) Input, CPU, Storage.\n(c) ALU, CPU, Storage.\n(d) CPU, Storage, Input.\n(e) Input, CPU, Output.\n4) Which of the following statements about second generation computers is/are true?\n(a) They are based on transistors.\n(b) They are based on ICs.\n(c) They used magnetic drums for primary memory.\n(d) They used magnetic cores for primary memory.\n(e) IBM PC is an example for the second generation computers.\n5) What value(s) is/are equivalent to 256 MB ?\n(a) $256 \\times 2^{12} \\mathrm{~KB}$.\n(b) $2^{28}$ Bytes.\n(c) $256 \\times 10^{-6} \\mathrm{~TB}$.\n(d) $2^{20} \\mathrm{MB}$.\n(e) $256 \\times 10^{9} \\mathrm{~KB}$.",
            "images": [
              {
                "id": "img-0.jpeg",
                "topLeftX": 380,
                "topLeftY": 940,
                "bottomRightX": 1357,
                "bottomRightY": 1312,
                "imageBase64": "data:image/jpeg;base64,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bpgHoT7CgDoaKRW3UtABRRRQAUUUUAFed/Fr7ng3/sZ7P/2evRK87+LX3PBv/Yz2f/s9AHU0UUUgCiiigAooooAKKKKACiiigApR1H1pKUdR9aAOX8I/8lI8W/70P8mr0IV574R/5KR4t/3of5NXoQoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAA15t4R/5D/if/r9/wAa9JNebeEf+Q/4n/6/f8aAOuFFAooAKKKKACiiigAooooAKKKKAKerf8ge+/693/8AQTWf8If+SU6B/wBcW/8ARjVoat/yB77/AK93/wDQTWf8If8AklOgf9cW/wDRjUwO3ooooAKKKKACiiigDO1rSY9bslsLiR1tJHH2iNDgzRjOUJBBAJxn1GR3rzr4teEtGuvCEVhpukWq67PPHFpsdtCqOWyN44A+QIGJzwMA16o3b/Oa8t+JXwxsNW0y91+xub6DWbKJrmGR7uR1JQbtoDk7OhxtIwcUAeladFPBp1tFdS+bcJEiyyf32AAJ/E5q1XL/AA61e717wBo+pXzFrqaDEjHq5Uld347c/jXUUAFFFFABRRRQAV538WvueDf+xns//Z69Erzv4tfc8G/9jPZ/+z0AdTRRRSAKKKKACiiigAooooAKKKKAClHUfWkpR1H1oA5fwj/yUjxb/vQ/yavQhXnvhH/kpHi3/eh/k1ehCgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooADXm3hH/kP+J/+v3/ABr0k15t4R/5D/if/r9/xoA64UUCigAooooAKKKKACiiigAooooAp6t/yB77/r3f/wBBNZ/wh/5JToH/AFxb/wBGNWhq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UPp1lr9xbx+QZD8m7J4/2h60Adnjr1owayh4T1r/AKGy6/78/wD2VL/wietf9DZdf9+f/sqQGpg0YNZf/CJ61/0Nl1/35/8AsqP+ET1r/obLr/vz/wDZUAamDRg1l/8ACJ61/wBDZdf9+f8A7Kj/AIRPWv8AobLr/vz/APZUAamDRg1l/wDCJ61/0Nl1/wB+f/sqP+ET1r/obLr/AL8//ZUAamDRg1l/8InrX/Q2XX/fn/7Kj/hE9a/6Gy6/78//AGVAGpg0YNZf/CJ61/0Nl1/35/8AsqP+ET1r/obLr/vz/wDZUAamDQAdwHqay/8AhE9a/wChsuv+/P8A9lSHwprY/wCZtuv+/P8A9lTAzPCP/JSPFueDmH+TV6CDnNcz4e8KLoWoahqD38t7cXpUyPIuMYzjHJ9TXTLzzSAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApNvOTS0UAIABS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUGikJGKAIZpY4I3klcLGoyzHoBXJLFJreqtf3S5tomxarnKkf3v5VU1jW7PX9XbSku1jtLZt0zZ4kI6LXQQiMQoICPKCgLg5AHtTAbdW0d5bvBMN0bj5s/zqjol++jy/wBmaizeVnFvO3II7An8q0+nWqOqLZT2b2t3KkfmD5SzYwfagDp1xmn1yHhPWt13Jok04nlgTfHKGzuTOP6iuuFIBaDRRQBWuxiznIP8B/lXFeDuNNm5/wCWp/ma7a8/485/9w/yrivB/wDyDZ/+up/maYHQn7prKsB/xX0np9jP8xWqfumsux/5H5/+vM/zWgDrwMUtFFIAooooAKKKKACiiigAooooAKKKKACkPSlooAYFx9PSnAYzS0UAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAhproHUqehFPoxxQBzL+CNDLO/2d1ZiWba2Mk1T8PqIrW4hXOyKd0XJzwDiuvYYBrk9EACXv8A19Sf+hGmBqVydzpkOr+OBb3e9oUiDBQ3fFdZXP2v/JQev/LAfyFAHQ6b4Z0zTLo3NpEyylCm4nscH+grYPelHU0tIBB0paKKAILz/jzm/wBw/wAq4nwd/wAgyf8A66n+Zrtrz/jzm/3D/KuJ8Hf8gyf/AK6n+ZpgdCfun6Vl2P8AyPz/APXmf5rWofun6Vl2P/I/P/15n+a0AdhRRRSAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGv0rktF+5e/9fUn/oRrrX6VyWi/cvf+vqT/ANCNAGp2rn7b/koP/bH+ldB2rn7b/koP/bH+lMDuh3paQd6WkAUUUUAQXn/HnN/uH+VcT4O/5Bk//XU/zNdtef8AHnN/uH+VcT4O/wCQZP8A9dT/ADNMDoT90/Ssux/5H5/+vM/zWtQ/drLsP+R+f/rzP8xQB2FFFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAa/SuS0X7l7/ANfUn/oRrrX6VyWi/cvf+vqT/wBCNAGp2rn7b/koP/bH+ldB2rn7b/koP/bH+lMDuh3paQd6WkAUhNLTJG2Rs2M4GaAIbsn7HOMfwH+VcV4OI/s2fkf60/zNPufG1xObq3t9LeXYzREjsRxS+E7aa30hhcxeW8jltuelMDePAxWVYH/ivXOP+XM/zFauOnoOlc5qFze6R4o+3w2TXMbQGL5T0Jx/hQB3u6gE55rldB8WvrOrSWTWTxNEm5m7Z9K6lep+tAD6KKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUU0tgUAOopobjpS59qAFopM+1GfagBaKTPtRn2oAWikz7UZ9qAFopM+1GfagBaKTPtRn2oAWikz7UZ9qAEfpXJaL9y9/6+pP/AEI11jH5a5TRR8l7/wBfUn8zTA0+1c/bf8lB/wC2P9K6Dt0rn7bj4g5/6Y/4UAd0O9LTc4pc+1IBaa33TS59qQmgDj9agn0LUP7UtULWczZuVHUEn7w9etaiypLGro26M4wc561rzQpPE8bqCrAgg1xkSt4Y1NNOnkZ7K5bFu5/gP90/n1pgbx4PHIrP1e6ube1VLJN91M4jRd2McHn6VbuJ0traS5lYLGi5b6VU8OQT6letrkwKxunlwRHsuc5+pwKANLQdIXSLIozGSaQ7pXPUmtcdRSbec55pe+aAH0UmfajPtSAWikz7UZ9qAFopM+1GfagBaKTPtRn2oAWikz7UZ9qAFopM+1GaAFopu456frSg5oAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBrnjjrXMXXjvRLW9nsi1xLNA22QRQlgp/CuoNea+Eo0bxB4nLIrH7b1Iz60Ab3/CwdGXrFf/APgK1L/wsPRf+eV//wCArVd8mL/nkn/fIpfJi/55J/3yKAKP/Cw9F/55X/8A4CtR/wALD0X/AJ5X/wD4CtV7yYv+eSf98ijyYv8Ankn/AHyKAKP/AAsPRf8Anlf/APgK1H/Cw9F/55X/AP4CtV7yYv8Ankn/AHyKPJi/55J/3yKAKP8AwsPRf+eV/wD+ArUf8LD0X/nlf/8AgK1XvJi/55J/3yKPJi/55J/3yKAKP/Cw9F/55X//AICtR/wsPRf+eV//AOArVe8mL/nkn/fIo8mL/nkn/fIoAo/8LD0X/nlf/wDgK1H/AAsPRf8Anlf/APgK1XvJi/55J/3yKPJi/wCeSf8AfIoAo/8ACw9F/wCeV/8A+ArUf8LC0U/8sr//AMBWq95MX/PJP++RR5MX/PJOf9kUAUP+FgaMRjyr/wD8BmrjrPx4tjJdp/Y+pOrzu6sIDyCfpXoIhixnyk/75/8ArUeTHgDy04/2aAOH/wCFkp/0BNS/78N/hVXTfF8Evi06jc6bqEEPl7cm3Y5r0LyY/wDnmn/fNHkx9PLTH+7QBn/8LB0UH/VX/wD4CtS/8LD0X/nlf/8AgK1XvJiP/LNP++RR5EX/ADyT/vkUAUf+Fh6L/wA8r/8A8BWo/wCFh6L/AM8r/wD8BWq95EX/ADyT/vkUeRF/zyT/AL5FAFD/AIWFov8Azy1D/wABWqjqvizw9q9m1tNDf8/db7M2VNbvkRf88k/75FHkRf8APNMf7ooA86t/E3268XT9ThvxYwnJkFq3730+n612cXjzQ4kWNIb5VUYCi1bgVpeTHjHlpj/do8mLPMUef90UAUT8QtFH/LK//wDAVqT/AIWHov8Azyv/APwFar/kxf8APJP++RR5MX/PJP8AvkUAUf8AhYei/wDPK/8A/AVqP+Fh6L/zyv8A/wABWq95MX/PJP8AvkUeTF/zyT/vkUAUf+Fh6L/zyv8A/wABWo/4WHov/PK//wDAVqveTF/zyT/vkUeTF/zyT/vkUAUf+Fh6L/zyv/8AwFaj/hYei/8APK//APAVqveTF/zyT/vkUeTF/wA8k/75FAFH/hYei/8APK//APAVqP8AhYei/wDPK/8A/AVqveTF/wA8k/75FHkxf88k/wC+RQBR/wCFh6L/AM8r/wD8BWo/4WHov/PK/wD/AAFar3kxf88k/wC+RR5MX/PJP++RQBR/4WHov/PK/wD/AAFakPxD0XH+qv8A/wABjV/yYv8Ankn/AHyKBDED/q0/75pgP0bxNpmvvPHYys0luQJEdSpXPTI/A1sqcivPvCChfiP4t2gAboeB9Gr0OkAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRmigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiijNABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAGvNvCP/If8T/8AX7/jXpJrzbwj/wAh/wAT/wDX7/jQB1wooFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHD65rfi2Xx8PDfhpNGBGmi/kk1FZOf3pQgFT/u4GKlFj8WyMhvBn/kz/AIU6w/5L/J/2LH/tyK9LxTA8y+w/Fz+94N/8mf8ACj7D8XP73g3/AMmf8K9OooA8x+w/Fz+94N/8mf8ACj7D8XP73g3/AMmf8K9OooA8x+w/Fz+94N/8mf8ACj7D8XP73g3/AMmf8K9OooA8x+w/Fz+94N/8mf8ACj7D8XP73g3/AMmf8K9OooA8x+w/Fwc7vBvHp9pyf0q54A8Q3vifwrHqOopbpcmaSNltwQnysV4BJPavQSK8p+EH/IhR+n2u4/8ARhoA7yiiikAUUUUAFFFFABRRRQAUUUUAFFFFABSjqPrSUo6j60Acv4R/5KR4t/3of5NXoQrz3wj/AMlI8W/70P8AJq9CFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUjNtFLSMM0AR7xjO4YPSlDr/AHh+deX6Np7+INU1ya91PUkMN6Yo1huWVVXAOMZrX/4Q62z/AMhfWP8AwLb/ABpgd15if3x+dHmJ/fH51wv/AAh1t/0F9Y/8DGo/4Q62/wCgvrH/AIGNSA7rzE/vj86PMT++Pzrhf+EOtv8AoL6x/wCBjUf8Idbf9BfWP/AxqAO68xP74/OjzE/vj864X/hDrb/oL6x/4GNR/wAIdbf9BfWP/AxqAO68xP74/OjzE/vj864X/hDrb/oL6x/4GNR/wh1t/wBBfWP/AAMagDuvMT++Pzo8xP74/OuF/wCEOtv+gvrH/gY1H/CHW3/QX1j/AMDGoA7rzE/vj86PMT++Pzrhf+EOtv8AoL6x/wCBjUf8Idbf9BfWP/AxqAO68xP74/OjzE/vj864X/hDrb/oL6x/4GNR/wAIdbf9BfWP/AxqAO68xP74/OjzE/vj864X/hDrb/oL6x/4GNR/wh1t/wBBfWP/AAMagDuvMT++Pzo8xP74/OuF/wCEOtv+gvrH/gY1H/CHW3/QX1j/AMDGoA7rzE/vj86PMT++Pzrhf+EOtv8AoL6x/wCBjUf8Idbf9BfWP/AxqAO68xP74/OjzE/vj864X/hDrb/oL6x/4GNR/wAIdbf9BfWP/AxqYHcb1zww/OnKwJ4IP0NcKfB9tx/xN9Y6/wDP4/8AjUng1JbPxNrmmfa7me3txF5fnyFyuUBPX60gO5opBS0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUABrzbwj/yH/E//X7/AI16Sa828I/8h/xP/wBfv+NAHXCigUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcdp//Jf5P+xY/wDbkV6ZXmen/wDJf5P+xY/9uRXplMAooooAQnHak3dsUkrBELEEgAk7Rk/hXm914E1TxrZJqmteI9X025nHmW1jZSCOK0Uj5VcYy7gdTkc8D1oA9KByKWvKvhRrmuxa74g8Ha/eNfTaS6mC6cksUJIwT1PG0jJJ5PJr1WgAooooADXlHwg/5EJP+vu4/wDRhr1c15R8IP8AkQk/6+7j/wBGGgDvKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFKOo+tJSjqPrQBy/hH/kpHi3/eh/k1ehCvPfCP8AyUjxb/vQ/wAmr0IUAFFFFABRRRQAUUUUAFFFFABQaKKAIyTnr9aA45y65HvVDXneDQ72aJisiwsQw4IrgvDnh4ap4b06+utY1YzzwLI5W7cDJHPGaYHpu9P74/OjzE/vj864X/hDrb/oL6x/4GNR/wAIdbf9BfWP/AxqQHdeYn98fnR5if3x+dcL/wAIdbf9BfWP/AxqP+EOtv8AoL6x/wCBjUAd15if3x+dHmJ/fH51wv8Awh1t/wBBfWP/AAMaj/hDrb/oL6x/4GNQB3XmJ/fH50eYn98fnXC/8Idbf9BfWP8AwMaj/hDrb/oL6x/4GNQB3XmJ/fH50eYn98fnXC/8Idbf9BfWP/AxqP8AhDrb/oL6x/4GNQB3XmJ/fH50eYn98fnXC/8ACHW3/QX1j/wMaj/hDrb/AKC+sf8AgY1AHdeYn98fnR5if3x+dcL/AMIdbf8AQX1j/wADGo/4Q62/6C+sf+BjUAd15if3x+dHmJ/fH51wv/CHW3/QX1j/AMDGo/4Q62/6C+sf+BjUAd15if3x+dHmJ/fH51wv/CHW3/QX1j/wMaj/AIQ62/6C+sf+BjUAd15if3x+dHmJ/fH51wv/AAh1t/0F9Y/8DGo/4Q62/wCgvrH/AIGNQB3XmJ/fH50eYn98fnXC/wDCHW3/AEF9Y/8AAxqP+EOtv+gvrH/gY1AHdeYn98fnQZE/vL+dcL/wh1t/0F9Y/wDAxqzfEPhxdM8O6hfW+r6t50EDSJuu3IyPbNAHpO9/+ebfnRXjf/CUaz/z/wA3/fRooA9qoNFHamB5v4KP+meIv+wif/QRXW9a5LwX/wAfniL/ALCJ/wDQRXW+tIAooooAKKKKACij19hmigAooooAKKKKACiiigAooooAKKKMEnAGTQAUUUUAFFFFABRRRQAGsXwyf+K98R/7sP8A6AtbRrF8M/8AI++I/wDdh/8AQFoA7QdKWkHSloAKKKKACiiigAooooAKKKKACiiigAooooADXm3hH/kP+J/+v3/GvSTXm3hH/kP+J/8Ar9/xoA64UUCigAooooAKKKKACiiigAooooAKKKKACiiigDjtP/5L/J/2LH/tyK9MrzPT/wDkv8n/AGLH/tyK9MpgFFFFADWFUtU1O10jTp768fZBEuSQMlvRVHdicADqTVyVwkZYgkAZO0EnHsByTXjt5481ifxM93c/D/xPd2do5+wRCxdVB5BmYFeXIyB/dBPUngA6/wAA+HLrT21XxBq0Xlavrk/2iaEnJt4hny48+oB59+O1dqvf1rhPDXjTXPE2uRWsnhLVNFs4laWe41GJlEgxhUTKjksQc+in1ru1ORQAtFFFAAa8o+EH/IhJ/wBfdx/6MNermvKPhB/yISf9fdx/6MNAHeUUUUgCiiigAooooAKKKKACiiigAooooAKUdR9aSlHUfWgDl/CP/JSPFv8AvQ/yavQhXnvhH/kpHi3/AHof5NXoQoAKKKKACiiigAooooAKKKKACiiigDL8R/8AIuX/AP1xaub8Gf8AIl6N/wBeifyrpPEf/IuX/wD1xaub8Gf8iXo3/Xon8qYG7RRRSAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACsTxj/wAibrH/AF6v/KtusTxj/wAibrH/AF6v/KgDzLFFLRQB9BUdqKO1MDzfwX/x+eIv+wif/QRXW+tcl4L/AOPzxF/2ET/6CK631pAFFFFABRRRQBheNWKeBNfdSQy6dcEEcEHy2rnPC3wj8Lat4R0XUboagbi7sIJ5St64BZkDHjPqTXReOP8AkQvEP/YNuP8A0W1bPgT/AJJ54a/7BVr/AOilpgc1/wAKT8H/ANzUv/A6T/Gj/hSfg/8Aual/4HSf416LRQB51/wpPwf/AHNS/wDA6T/Gj/hSfg/+5qX/AIHSf416LRQB51/wpPwf/c1L/wADpP8AGj/hSfg/+5qX/gdJ/jXomaWgDzr/AIUn4P8A7mpf+B0n+NH/AApPwf8A3NS/8DpP8a9FooA86/4Un4P/ALmpf+B0n+NcxrfgnSPBvj7wWdIN2v2u6mWYTXDSBgqAjr9TXtlebfEb/kfPAH/X5cf+i1oA66iiikAUUUUAFFFFAAaxfDP/ACPviP8A3Yf/AEBa2etY3hn/AJH3xH/uwf8AoC0AdoOlLSDpS0AFFFFABRRRQAUUUUAFFFFACbucUbuKY5CEsTgY5rK03xHpmrTzQWlyryQuUYeh/wAimBsZ7d6Ac00E88U5elIBTXm3hH/kP+J/+v3/ABr0g15t4Q/5GDxP/wBfv+NAHXiigUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUevt1oA47T/APkv8n/Ysf8AtyK9MrzPT/8Akv0h/wCpY/8AbkV6XmmAtFJmjNAARkYNGKM0ZoACM0AYozRmgBaKTNGaAFNeUfCD/kQk/wCvu4/9GGvVia8p+EP/ACIaf9fdx/6MNAHeUUUUgCiiigAooooAKKKKACiiigAooooAKUdR9aSlHUfWgDl/CP8AyUjxb/vQ/wAmr0IV574R/wCSkeLf96H+TV6FQAUUUUAFFFFABRRRQAU3dyeKdWZq+r2Oh2v2zUZxBblwnmN0BPSmBoqwY06o43VxuXp6561JSAy/Ef8AyLl//wBcWrm/Bn/Il6N/16J/Kuk8Sf8AIuX/AP1xaub8F/8AIl6N/wBeifypgbtFFFIAooooAKKKKACiiigAooozigAoo9+1FABRRR3oAKKOKKACijvij/DNABRRRQAUUUUAFYnjH/kTdY/69X/lW3WJ4x/5E3WP+vV/5UAeZ0UUUAfQVHaijtTA838F/wDH54i/7CJ/9BFdb61yXgv/AI/PEX/YRP8A6CK631pAFFFFABRRRQBg+OP+RC8Q/wDYNuP/AEW1bPgT/knnhr/sFWv/AKKWsbxx/wAiF4h/7Btx/wCi2rZ8Cf8AJPPDX/YKtf8A0UtMDoKKKKACormdbaBpWSRwo+7Ghdj9AKlpGUNigDivC3j/AP4SfxfrOiLpU9kumINxuWG92JxyoyAPxP4V2wryTwIc/G/x6PQR/wBK9boAKKKKACvNviN/yPngD/r8uP8A0Wtek15t8Rv+R88Af9flz/6LWgDrqKKKQBRRRQAUUUUAJggZ7VzGkazYaf478Q/aJwmVhwex+Ra6gAg8DIPWuT0CxtLnUtVeaCOVvMI3MMnrTA6z/hLNGH/L4tH/AAlmjf8AP4tUv7I07/nzh/75o/sjTv8Anzh/75oAu/8ACWaN/wA/i0f8JZo3/P4tUv7I07/nzh/75o/sjTv+fOH/AL5oAu/8JZo3/P4tH/CWaN/z+LVL+yNO/wCfOH/vmj+yNO/584f++aALv/CWaN/z+LR/wlmjf8/i1S/sjTv+fOH/AL5o/sjTv+fOH/vmgC7/AMJZo3/P4tH/AAlmjf8AP4tUv7I07/nzh/75o/sjTv8Anyh/75oAsT+K9GMMmLxeVI4+lchouk2WsWFxM6mOUzM0c6jB61039kacOfscP/fNWYoYoI/LhjCR/wB1RgUAZEWo6x4aQJdxnUbP/nqvDRj3610+m6xZarbrNaTB1PbuPwqlxtwTn1yO1UZdItTI8tuDa3DDHnRHDUAdQDzzXnHhD/kP+J/+v3/GtOLX9X0GULrMYnswcfaEH3R6tWP4HuoL3VPEd1bSCSGS8+V16HrQB2goo6cHrRSAKKKKACiiigAooooAKKKKACiiigAo/wAiiigDlPEHgO217XU1hdZ1jTbxbYWu7T7gRZjDFsE7Sep557VRPw3lP/M8+Mv/AAaH/wCJruaKAOF/4VtJ/wBDz4y/8Gh/+Jo/4VtJ/wBDz4y/8Gh/+JruqKAOF/4VtJ/0PPjL/wAGh/8AiaP+FbSf9Dz4y/8ABof/AImu6ooA4X/hW0n/AEPPjL/waH/4mj/hW0n/AEPPjL/waH/4mu6ooA4X/hW0n/Q8+Mv/AAaH/wCJo/4VtJ/0PPjL/wAGh/8Aia7qigDhh8N5R08c+Mf/AAaH/wCJrofDHhu08KaImlWU1xNCjs++4YM5LHJyQBWxRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUdx9aKa4OxsenWgDjPD2r2On/ABG8VNcThFcxbSe+A1dr/wAJZowODeLXG+GLC0ur3UpJ7eOSQycswyT1rpf7I0/qbKHn/ZpgXf8AhLNG/wCfxaP+Es0b/n8WqX9kad/z5Q/980f2Rp3/AD5w/wDfNAF3/hLNG/5/Fo/4SzRv+fxapf2Rp3/PnD/3zR/ZGnf8+cP/AHzQBd/4SzRv+fxaP+Es0b/n8WqX9kad/wA+cP8A3zR/ZGnf8+cP/fNAF3/hLdG/5/Frk/H+safq2kWNvbSidjfxnYB1GGrfOkad/wA+cP8A3zSppVjGwkS0iDL907elAGbCl94X3PZE3Gm55gPWMe3tXT6ZrNpq1qJ7WQFTwVPBH4VW5JIwPoaz5tKgkaS4tHe2uSOZYzjP1FAGr4iJPh3UM/8APFq53wX/AMiXo3/Xon8qp6n4jutJ0W9tPEG1IzCwju8YVj2B96u+DP8AkTNGOMf6In8qANyiiikAUUUUAFITilpV4YduetAHnnjr4nQ+EdR/sq3s2utReMOoB4APT+v5VyumfHC/gmK6/oxSF+EeMFefyrS8JJFqfxg8QS3ypNJCuIDKOUAzjFdL8ULCxk8BajLNBCZY13RFl5B9vypgdZaX9te6fFfQyqbaVQyyHgY9TUonhaNpFlRkXq6nKj8a8Q8M315dfAPXxcTSP5IKR7uqrjjFHg53/wCFBeJZC7FtshHOSKAPXta1y10XRbrUy6SrAhOxXB3H0Fc78OfHE3jPT7ue7WCGVJdscanBI57V5Z4LsbfU/hP4ke7TzXt2V4txJKtg81tfBXQNOvNBv9RuLYNdQP8AupM8rwaAPaxc2zH5biJsDPysD+fpTo3SVN0bCRc8FTwT6V84/C3SY/EHi7UbW8uJxbbWLxqxxIM9D7V2vghZtA+I+seFra9mfS4InkSOVs4buaAPWI54pXKxyoz9SoOTig3EIkKGaMP02bua8J+DsjSfEjVNzMQEY8nPeodUaQfH+JMnb56/Lng80AdtefFAr8Rbbw1bQxi1M3lzTuc/iOK9KBxwp+XtXzZcaJp3/C84tL+zg2TXYBjz1GTX0dBBHb26QQjbHGoVVHQCgCUUUUUgCiiigArE8Y/8ibrH/Xq/8q26xPGP/Im6x/16v/KgDzOiiigD6Co7UUdqYHm/gv8A4/PEX/YRP/oIrrfWuS8F/wDH54i/7CJ/9BFdb60gCiiigAooooAwfHH/ACIXiH/sG3H/AKLatnwJ/wAk88Nf9gq1/wDRS1jeN/8AkQvEP/YNuP8A0W1bPgT/AJJ74a/7BVr/AOilpgdBRRRQAUhNLSEZoA8k8Bn/AIvf49I5GIx+PFetg5qjbaHpVnfzX9rptnBeT/624igRZJPXcwGT+Jq8BigBaKKKACvNviN/yPngD/r8uf8A0Wtek15t8Rf+R88Af9flx/6LWgDrqKKKQBRRRQAUUUUAJng84rm/DTot/qYLqv708H610mCM4xnFchpnh+31HxtrsbyyIiCM7VPcqDTA64umfvrRvT++v51S/wCEHsTj9/P0/vUf8INY/wDPef8A76oAu70/vr+dG9P76/nVL/hBrH/nvP8A99Uf8INY/wDPef8A76oAu70/vr+dG9P76/nVL/hBrH/nvP8A99Uf8INY/wDPef8A76oAu70/vr+dG9P76/nVL/hBrH/nvP8A99Uf8INY/wDPef8A76oAu70/vr+dG9P761S/4Qax/wCe8/8A31R/wg1j/wA95/8AvqgC4XXsy4+tP6Y9D0OOtZs3gqySFz9onACk/e9qzfDNybfSrk3dxmOGUqJJDgYBPegDo8c4A5qlqOq2umoDMxZzwsafeasl9VvtdkNvoEeFB+a8kX5Me3vW/pPhi2spBc3LvdXg586U5I+lAGMmj6x4gkJ1Ei105vuwL95x6H2rH8B2VvZaj4is7SLyoYbzCovQdc16ecAe1eR6Ro8+p+J/EckOrXdgqXe0pbsAG688igD0Mc8/rS4rlv8AhFL4n/kZ9UH/AANf8KP+ETvv+hp1T/vtf8KAOpxRiuX/AOESvv8AoadU/wC+1/wo/wCESvv+hp1T/vtf8KAOoxRiuX/4RK+/6GnVP++1/wAKP+ESvv8AoadU/wC+1/woA6jFGK5f/hEr7/oadU/77X/Cj/hEr7/oadU/77X/AAoA6jFGK5f/AIRK+/6GnVP++1/wo/4RK+/6GnVP++1/woA6jFGK5f8A4RK+/wChp1T/AL7X/Cj/AIRK+/6GnVP++1/woA6jFGK5f/hEr7/oadU/77X/AAo/4RK+/wChp1T/AL7X/CgDqMUYrl/+ESvv+hp1T/vtf8KP+ESvv+hp1T/vtf8ACgDqMUYrl/8AhEr7/oadU/77X/Cj/hEr7/oadU/77X/CgDqMUYrl/wDhEr7/AKGnVP8Avtf8KP8AhEr7/oadU/77X/CgDqMUYrl/+ESvv+hp1T/vtf8ACj/hEr7/AKGnVP8Avtf8KAOoxRiuX/4RK+/6GnVP++1/wo/4RK+/6GnVP++1/wAKAOoxRiuX/wCESvv+hp1T/vtf8KP+ESvv+hp1T/vtf8KAOoxRiuX/AOESvv8AoadU/wC+1/wo/wCESvv+hp1T/vtf8KAOoxRiuX/4RK+/6GnVP++1/wAKP+ESvv8AoadU/wC+1/woA6jFGK5f/hEr7/oadU/77X/Cj/hEr7/oadU/77X/AAoA6jFGK5f/AIRK+/6GnVP++1/wo/4RK+/6GnVP++1/woA6jFGK5f8A4RK+/wChp1T/AL7X/Cj/AIRK+/6GnVP++1/woA6jFGK5f/hEr7/oadU/77X/AAo/4RK+/wChp1T/AL7X/CgDqMU1/uN1xiuZ/wCESvv+hp1T/vtf8KP+ESvuh8U6pzx99f8ACgBnhIolxqOWH+s7n611G9BxvXj3rzzwp4Yik8WeItNmv7qdbZ4yHZuTuDf4V23/AAg9j/z8T/8AfVAF3en99fzo3p/fX86pf8INY/8APef/AL6o/wCEGsf+e8//AH1QBd3p/fX86N6f31/OqX/CDWP/AD3n/wC+qP8AhBrH/nvP/wB9UAXd6f31/Ojen99fzql/wg1j/wA95/8Avqj/AIQax/57z/8AfVAF3eh/jX86N65wHWqX/CDWP/Pe4/76rn/FejDw9Z2N3Y3E4kN9HG2W4ZSDkfpQB13VjnrWdqOrW2nFUc+ZM5wkKj5mP0qpe6vPc3A0zSV869bG6QjKR+5//X2rX0jw3DZEXV4Rdah1aV+cfSgDm9X0C91nRr6fXQotFiLx2noe2au+DCT4L0cn/n0T+VdF4iH/ABTl/nr5JrnfBn/Il6P/ANeifyoA3aKKKQBRRRQAUhOBnj6UtFAHlvjzwJr134j/AOEl8M3Ihu1iCtGnBYj0/WuWHgz4keLcWuv3ckNsh3kTn72ete9Yp2Sepz7HpQByWseFB/wru68N6btDtAI0dhyxAryzTfD/AI+0zwRqHhmHQz5F0WLynnIPUV78BilJYnqT9eaAPIPAfgjXLPwFr2j3tsba6vBiIP3xn/61V/h1pHjHwotxpk+jgWMrEyzk/d6817OSTjJJ96ZOHlt5Yw3LoQMnjNMD5f8AAC+IB4pvp/DzA3MQZjCf+Wgz0r1f4eeEdYtb2+8SeInaPVrjdFsbjg9zTfh98NdT8J+I7rUbq6t5IZlK7UGCPTvXpxyTyTnHc80AeFaR4T8a+DPFt7f6fpK3qzAgSD7uD3pum+BPGafEmz1nVbczp5waS4XoB1/SveATx6UAkD7x6UgPEvEngzxPY/E1PEulWS3sXnCZQD0+tey2bzSWcLXCCOZkBdB0Vj1qwDtGBwPakoAKKKKACiiigArE8Y/8ibrH/Xq/8q26xPGP/Im6x/16v/KgDzOiiigD6Co7UUdqYHm/gv8A4/PEX/YRP/oIrrfWuS8F/wDH54i/7CJ/9BFdb60gCiiigAooooAz9e046x4e1LTFlETXlrJAJCMhSykZx361yOnaD8RtM0210+08X6clvawpDEp05SVRQAAT34Fd9RnPrQBxX9n/ABP/AOhy07/wWrR/Z/xP/wChy07/AMFq12tFAHFf2f8AE/8A6HLTv/BatH9n/E//AKHLTv8AwWrXa0UAcV/Z/wAT/wDoctO/8Fq0f2f8T/8AoctO/wDBatdrRQBxX9n/ABP/AOhy07/wWrR/Z/xP/wChy07/AMFq12tFAHFf2f8AE/8A6HLTv/BatV08J+LdQ8S6NqfiHxHZ3sWmSvLHFFaeUSWXB5H4flXe0UAFFFFABRRRQAUUUUAIelY3hrnx74jP+zD/AOgLW0axfDP/ACPviP8A3YP/AEBaAO0A4oxQOlLQAmKMUtFACYoxS0UAJijFLRQAmKMUtFAEcqb0ZeOQRXG6X8PobXUbi4vr2W8ikkMiQscKhJrtqKAII7dIIwkSKijsoxUqjr706igBCOK828IYOv8AijP/AD+/416Ua818I/8AIf8AE/8A1+/40wOuA45zS4FFFIA4o4oooAOKOKKKADijiiigA4o4oooAOKOKKKADik/nR3GOvWlAyxAzk88UwEGDR2zilYEMO/ufSk5C5JGPQkUALx25NGMcGkGcYwAcZNAORmgBeKOKKKQBxRxRRQAcUcUUUAHFHFHPpRQAcUcUUUAHFHFFFABxRxRRQAcUcUUUAHFHFFFABxRxRRQAcUDqKKUdR9aYHL+EufiP4s9N0PH4NXoIFefeEf8AkpHi3/eh/k1ehCkAmKMUtFACYoxS0UAJijFLRQAnSuf8W+G/+Eo0pbH7S1sVmWUSL1GM8frXQ0YoAoadpVrplssNtGqgDlupJ9zVzBxin0UAZXiL/kXL/wD64tXOeDP+RL0b/r0T+VdJ4j/5FzUP+uLVzfgz/kS9G/69E/lTA3aKKKQBRRRQAUUUUAFFFFABRRRQAUGiigBFGOvJpaKKACiiigAooooAKKKKACiiigArE8Y/8ibrH/Xq/wDKtusTxj/yJusf9er/AMqAPM6KKKAPoKg0UjHAoA848F/8fniL/sIn/wBBFdb61wehaza6Fqevw6glzG8l8XTbA5BG0dwK3P8AhNNF/vXf/gLJ/wDE0wOgorn/APhNNG/vXf8A4Cyf4Uf8Jpo3967/APAWT/CkB0FFc/8A8Jpo3967/wDAWT/Cj/hNNG/vXf8A4Cyf4UAdBRXP/wDCaaN/eu//AAFk/wAKP+E00b+9d/8AgLJ/hQB0FFc//wAJpo3967/8BZP8KP8AhNNG/vXf/gLJ/hQB0FFc/wD8Jpo3967/APAWT/Cj/hNNG/vXf/gLJ/hQB0FFc/8A8Jpo3967/wDAWT/Cj/hNNG/vXf8A4Cyf4UAdBRXP/wDCaaN/eu//AAFk/wAKP+E00b+9d/8AgLJ/hQB0FFc//wAJpo3967/8BZP8KP8AhNNG/vXf/gLJ/hQB0FFc/wD8Jpo3967/APAWT/Cj/hNNG/vXf/gLJ/hQB0FFc/8A8Jpo3967/wDAWT/Cj/hNNG/vXf8A4Cyf4UAdBRXP/wDCaaN/eu//AAFk/wAKP+E00b+9d/8AgLJ/hQB0FYvhn/kffEf+7D/6AtQjxnox/iuuve1k/wDiaTwbdLf+LNfv4I5RbSiII8kZTcQgBxke1MDux0paQUtIAooooAKKKKACiiigAooooAKKKKACiiigANebeEf+Q/4n/wCv3/GvSTXm3hH/AJD/AIn/AOv3/GgDrhRQKKACiiigAooooAKKKKACiiigAooooAOpArxX46alfWFzpX2O6lhLKQfLbGele1e9eH/Hj/kI6Jkdzx+Ipgb3wd8T3V/pM2l6pmOS1AkEkxwzg85we1eZ3Wt6uPibJvvblbeTUWaNN52lCxxgemK6rUcaH4n/ALSvj9ns7zRxFbuT958LgcfSuc11WTxd4RB5YWVtnP8AuLQB7v4n8Z6J4UaNNQuGM8nEcMSM7t+ABxWVB8UfDz3ttaXEd7ZSXDbY2uIGVSfrivMfi615B8VbWa1QtKEj8rd90tjHfiqviq08Z+Krm1GpQWSGJvlEU0Y/QHNAHr2ufEnw74d1gaZqEsyylQwdI2dTnpjArPb4w+Fre5W3vfttkWGd09tIP025xXHx6cF+Lmi2t/CsrR2SBwwBGQqiqPxahib4saZE0SbHEe5So2nOOtAHoMnxd8LwbWkF6Ld/uXDW7qrD1AIyfyrfvPF2i6f4cTXbi9xYyKHjYIwZwenykZrzb48W8FpoOkQ20McUayYVEXAAxwK5/wCIaSP8O/CThW8sQqHwPlA2j+tAHpEXxh8Ky3NvHJ9rthPjZJLC23np0FbXifxvo/hO0trrUWkaK5P7tovmz+VeQ/E5bA+BvChtzbtciCNWMeN4G0envil+KCunw78KLIG8wR4bPXOBQB6D/wALi8MG0+1RxX8kAH7yRbd9qH0JK4rq9P8AEWnahoKazDOq2LR+ZuZhkD0PofauR8NaBa6v8G7fT/s6/wCk2u4hAAzNjOSa8uOuyaH8MtU8K3lrIL9bsRk7+hO48c57Y49aAPcPDPjbS/Fr3CaYk+YMh3kUhc+gP4V0ec8gYB6Vxvww0O30XwXZtHC8ctyqyyiTOd2PQ/Wuy9KQC0UUUAFFFFABRRRQAUUUUAFFFFABSjqPrSUo6j60Acv4R/5KR4t/3of5NXoQrz3wj/yUjxb/AL0P8mr0IUAFFFFABRRRQAUUUUAFFFFABRRRQBl+I/8AkXL/AP64tXOeDP8AkS9G/wCvRP5V0niFWfw/fKqlmMLYAGSa4Hwx4o03T/C+mWl0LtJ4bdUdfs0nBH4UwO2orn/+E00b+9d/+Asn+FH/AAmmjf3rv/wFk/wpAdBRXP8A/CaaN/eu/wDwFk/wo/4TTRv713/4Cyf4UAdBRXP/APCaaN/eu/8AwFk/wo/4TTRv713/AOAsn+FAHQUVz/8Awmmjf3rv/wABZP8ACj/hNNG/vXf/AICyf4UAdBRXP/8ACaaN/eu//AWT/Cj/AITTRv713/4Cyf4UAdBRXP8A/CaaN/eu/wDwFk/wo/4TTRv713/4Cyf4UAdBRXP/APCaaN/eu/8AwFk/wo/4TTRv713/AOAsn+FAHQUVz/8Awmmjf3rv/wABZP8ACj/hNNG/vXf/AICyf4UAdBRXP/8ACaaN/eu//AWT/Cj/AITTRv713/4Cyf4UAdBRXP8A/CaaN/eu/wDwFk/wo/4TTRv713/4Cyf4UAdBRXP/APCaaN/eu/8AwFk/wo/4TTRv713/AOAsn+FAHQVieMf+RN1j/r1f+VRf8Jpo3967/wDAWT/CsrxN4p0y/wDDGpWlsLt5prdkRfssnJP4UAcbRVr+zb//AJ85/wDv23+FFAHvFIwyKWigCPJBzTlz3pcUtACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFACUUtFAEbfWl/i4p2BQABQAtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAAa828I/8h/xP/1+/wCNekmvNvCP/If8T/8AX7/jQB1wooFFABRRRQAUUUUAFFFFABRRRQAUUUUAH5471y/ivwJpfjGe1m1GSVTb/c2HGa6gdc0f1pgc7rPgvR9dsLKzvo2kSz2+S3cAdqpal8NdC1XWbTVJfOimtVVY40PygL0711+PSg88k0gMLxP4T0rxbaeVqUJDKf3cyffX8awdJ+Evh7StTh1AyXV3LCcxrO5YA/ia7rFL7nrQBz8vg7TpvFkfiVnk+2Iu1UH3MVT1/wCH2keItfg1q8klW6h27QvTjH+FdZ0GBwKKAOc8WeCtN8Zw28OpSSqkBymw9asSeFtNl8LJ4emQyWSRCJd/LDHetuj1pgee6d8GvDGn6hBdl7mdoSCiSsSvHbrW74s8EaV4yt7aHUWkjS3zsEXArpMYOc0vSkBj20Wm+DvDKRSXBi06zQL5r/wjpz+VeSadBovjn4yyXNjbpJYQRmaViMCRgRyD+Ne06hp1rqtlJZ30KzW8n342GQapaR4X0XQnkfTLCO3aT75QYJHpQBrjgDAwMY/z+GKKMf8A16KACiiigAooooAKKKKACiiigAooooAKUdR9aSlHUfWgDl/CP/JSPFv+9D/Jq9CFee+Ef+SkeLf96H+TV6EKACiiigAooooAKKKKACiiigAooooAYRyOM0DPenYpcUAIPxopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEopaKAEoNLRQBH8396in4ooAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAENeb+EQf7f8Tn/p+wf1r0hs+341y48D2Md/d3kF/qdtJdP5kohuNqlvXGKYF7B9D+VHNVf+EQjJyNb1v/wL/wDrUv8Awh6f9BzW/wDwL/8ArUgLPNHNVv8AhD0/6Dmt/wDgX/8AWo/4Q9P+g5rf/gX/APWoAs80c1W/4Q9P+g5rf/gX/wDWo/4Q9P8AoOa3/wCBf/1qALPNHNVv+EPT/oOa3/4F/wD1qP8AhD0/6Dmt/wDgX/8AWoAs80c1W/4Q9P8AoOa3/wCBf/1qP+EPT/oOa3/4F/8A1qALPNHNVv8AhD0/6Dmt/wDgX/8AWo/4Q9P+g5rf/gX/APWoAs80c1W/4Q9P+g5rf/gX/wDWo/4Q9P8AoOa3/wCBf/1qALPNHNVv+EPT/oOa3/4F/wD1qP8AhD0/6Dmt/wDgX/8AWoAs80c1W/4Q9P8AoOa3/wCBf/1qP+EPT/oOa3/4F/8A1qALPNHNVv8AhD0/6Dmt/wDgX/8AWo/4Q9P+g5rf/gX/APWoAs80c1W/4Q9P+g5rf/gX/wDWo/4Q9P8AoOa3/wCBf/1qALPNHNVv+EPT/oOa3/4F/wD1qP8AhD0/6Dmt/wDgX/8AWoAs80c1W/4Q9P8AoOa3/wCBf/1qP+EPT/oOa3/4F/8A1qALPNHNVv8AhD0/6Dmt/wDgX/8AWo/4Q9P+g5rf/gX/APWoAs80c1W/4Q9P+g5rf/gX/wDWo/4Q9P8AoOa3/wCBf/1qALPNHNVv+EPT/oOa3/4F/wD1qP8AhD0/6Dmt/wDgX/8AWoAs80c1W/4Q9P8AoOa3/wCBf/1qP+EPT/oOa3/4F/8A1qALPNHNVv8AhD0/6Dmt/wDgX/8AWo/4Q9P+g5rf/gX/APWoAs80c1W/4Q9P+g5rf/gX/wDWo/4Q9P8AoOa3/wCBf/1qALPNKOtVf+EPT/oOa3/4F/8A1qB4QQcjXNbyP+nv/wCxoAwfCP8AyUjxbyPvQ9Po1eggg5xWBovhay0K9vL63mupbi7KmV7iXeTjOP5mt5e59aAHUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFJgUUUwAcUtFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApD0oooATGGpR3oooAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==",
                "imageAnnotation": null
              }
            ],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 2,
            "markdown": "6) The number $23_{10}$ is equivalent to\n\n| (a) $111010_{2}$ | (b) $010111_{2}$ | (c) $23_{8}$ |\n| :-- | :-- | :-- |\n| (d) $17_{8}$ | (e) $27_{8}$ |  |\n\n7) Which of the following statements about Two's complement representation is/are true ?\n(a) All positive and negative numbers begin with 0 and 1 respectively.\n(b) Division is done by repeated additions only.\n(c) Two's complement representation of the decimal number -42 is 11010110 .\n(d) Two's complement representation of the decimal number -42 is 11010101 .\n(e) It is widely used in ALU.\n8) What is the loss of accuracy when converting the decimal value -0.0235 to 10 -bit floating point representation with a sign bit, 4-bit exponent and a mantissa?\n\n| (a) 0.003512 | (b) -0.031250 | (c) 0.023375 |\n| :-- | :-- | :-- |\n| (d) -0.015625 | (e) 0.0000625 |  |\n\n9) If the right most bit is taken as the most significant bit (MSB) the two's complement number 1011101010 is equivalent to the decimal number\n\n| (a) -278 | (b) -234 | (c) 349 |\n| :-- | :-- | :-- |\n| (d) -349 | (e) 511 |  |\n\n10) Which of the following statements on Hamming Code is/are true ?\n(a) Minimum distance between any code words is called Hamming Distance.\n(b) A Hamming Code with a minimum distance of N can correct upto ( $\\mathrm{N}-1$ )/2 errors.\n(c) A Hamming $d\\left(C_{1}, C_{2}\\right)$ Code has $C_{1}$ bit data words and $C_{2}$ bit code words.\n(d) The Hamming Distance between 100100101101 and 101000100010 is 6 .\n(e) Smallest possible distance between two distinct code words is 2 .\n11) Which of the following devices are both input and output devices?\n\n| (a) | Mouse | (b) | DVD Burner | (c) | Plotter |\n| :-- | :-- | :-- | :-- | :-- | :-- |\n| (d) | Touch Screen | (e) | Floppy Driver |  |  |\n\n12) The output of the Boolean function $F(x, y, z)=x y+z \\bar{y}$ is 1 when\n\n| (a) $x=1, y=1, z=0$. | (b) $x=1, y=0, z=0$. | (c) $x=0, y=0, z=1$. |\n| :-- | :-- | :-- |\n| (d) $x=0, y=1, z=0$. | (e) $x=0, y=0, z=0$. |  |",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 3,
            "markdown": "13) What is the output $P$ of the following digital circuit?\n![img-1.jpeg](img-1.jpeg)\n(a) $(\\bar{x}+z+y)+(x \\bar{z})$\n(b) $(z+y)+(x)$\n(c) $\\bar{x} z y(x+\\bar{z})$\n(d) 1\n(e) 0\n14) Which of the following K-Maps represent(s) the Boolean expression $Q=A+C \\oplus B$ ?\n![img-2.jpeg](img-2.jpeg)",
            "images": [
              {
                "id": "img-1.jpeg",
                "topLeftX": 380,
                "topLeftY": 254,
                "bottomRightX": 1095,
                "bottomRightY": 580,
                "imageBase64": "data:image/jpeg;base64,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RtJDAD5R8wBycV2/gX4D6foki3/iWSDUrxGV4oI94hiZWJyTwZMgDgqB1B3da9U0XQtL0DTxYaTYwWlsuP3cK4yQAuWPVmwoySSTjmtHAoAjt4Ibe3jt4IkigjULHHGu1UUDAAA4AAHSpMD0pQAOgooATaPSlAxRRQAUUUUAFFFIxwM5oAGJA4rxH41azeeINc0j4d6JIWubqVJbsqSQufuK+05CgZkYFTgBGFbvxE+Mlh4Ov7jRbOylvdYjRSd/yQxFlyMn7zEAqcKOQfvA5A8g8AfEDSdG8Zal4q8WR6jqGqzri3kgSNwhYYY/MV2naFVdvAUsOmKAPqLRdKtdD0i10yyQLb20SxJ8qgnHUnaAMk5JwByTV+vH/wDhozwip507XP8AvxF/8do/4aO8If8AQO1z/vxD/wDHaAPYKK8f/wCGjvCH/QO1z/vxD/8AHaP+GjvCH/QO1z/vxD/8doA9gorx/wD4aO8If9A7XP8AvxD/APHaP+GjvCH/AEDtc/78Q/8Ax2gD2CivH/8Aho7wh/0Dtc/78Q//AB2j/ho7wh/0Dtc/78Q//HaAPYKa/b615D/w0d4Q/wCgdrn/AH4h/wDjtYfin9oWO70wQeErG5hvJSUee/iTEakEAoFcgtkj73Ax0OeACl4tmk+JnxytPDtt5s+j6ZIsd3G0sgiYRsTOxAA2MdxiB7kL83Ix9DoQehFeXfBT4ft4V0B9W1OB49X1FBvimjUNbRAnag7gtwzAkfwggFTXqeKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAMZpMCiigBcYooooAKKKKACiiigAooooAKCM0UUAct4g+HHhLxTfi+1jR0uLnGDIs0kZboMnYwycADJ5wAOgrJ/wCFKfD3/oX/APyduP8A45RRQAf8KT+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J24/8AjlFFAB/wpL4ef9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+OUUUAH/Ckvh5/wBC9/5O3H/xyj/hSXw8/wChe/8AJ24/+OUUUAH/AApL4ef9C9/5O3H/AMco/wCFJfDz/oXv/J24/wDjlFFACf8ACkvh5/0L3/k7cf8AxytzQPAHhXwvMZ9I0aGCfJKyuzSuhIwdrOSVyODgjPeiigDowAOgpaKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==",
                "imageAnnotation": null
              },
              {
                "id": "img-2.jpeg",
                "topLeftX": 271,
                "topLeftY": 853,
                "bottomRightX": 1502,
                "bottomRightY": 1789,
                "imageBase64": "data:image/jpeg;base64,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CYo2jjvj1paKACiiigArkvFH/I4+Cv8Ar/uP/SWWutrkvFH/ACOPgr/r/uP/AElloA63tRR2ooAKKKKACiiigBCM0YpaKACiiigDk9X/AOSmeF/+vHUP529dZXJ6v/yUzwv/ANeOofzt66ygAooooAKKKKAExzSFAc5706igBNv1paKKACiiigAooooAKKKKAOUt/wDkrOof9gK1/wDR9xXV1ylv/wAlZ1D/ALAVr/6PuK6ugAooooAKKKKACiiigAooooA5T4m/8kz8Rf8AXjJ/KupT/Vr9BXLfE3/kmfiL/rxk/lXUp/q1+goAdRRRQAUUUUAJjmkKA4zTqKACiiigAooooAK5L4g/8grSP+w5p/8A6UJXW1yXxB/5BWkf9hzT/wD0oSgDraKKKACiiigApNozmlooATFLRRQAUUUUAFc/47/5J74l/wCwVdf+imroK5/x3/yT3xL/ANgq6/8ARTUAaulf8giy/wCuEf8A6CKt1U0r/kEWX/XCP/0EVboAKKKKACiiigApCuaWigBuwduKcBgYFFFABRRRQAUUUUAIa5L4Y/8AJPdK/wC2v/o16601yXwx/wCSe6V/21/9GvQB11FFFABRRRQAUUUUAIVB60bRS0UAFFFFABRRRQAUUUUAcl4L/wCQt4x/7Dbf+k8FdbXJeC/+Qt4x/wCw23/pPBXW0AFFFFABRRRQAmOaQoDjNOooAKKKKAENcr8Mv+SZ+Hf+vGP+VdUa5X4Zf8kz8O/9eMf8qAOrooooAQ1yvwy/5Jn4d/68Y/5V1Rrlfhl/yTPw7/14x/yoA6uiiigAooooAKKKKACiiigArkviD/yCtI/7Dmn/APpQldbXJfEH/kFaR/2HNP8A/ShKAOtooooAKKKKACiiigAooooAKKKKACiiigDlPAP/ACDtY/7Dmof+lD11dcp4B/5B2sf9hzUP/Sh66ugAooooAKKKKACiiigAooooAK5H4bf8iav/AF/33/pVLXXVyPw2/wCRNX/r/vv/AEqloA66iiigAooooAKKKKACiiigAooooAK5LxR/yOPgr/r/ALj/ANJZa62uS8Uf8jj4K/6/7j/0lloA63tRR2ooAKKKKACiiigAooooAKKKKAOT1f8A5KZ4X/68dQ/nb11lcnq//JTPC/8A146h/O3rrKACiiigAooooAKKKKACiiigAooooAKK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w+nhfw+mny2n2ZAt+xCrtwpHy4yOo9xQB2HjTR4fE3gbVbABJftFqzwnqC4G5Dn6gVW+GuvyeJPh5o2ozMXnMPkzMTyzoShJ9zt3fjVrwPpOoaF4J0rStUkje6tIfKkMbblwD8oyfRcCuP8AgFk/DqTGRH9vm2fT5f8A69AHqdFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAhrlfhl/yTPw7/wBeMf8AKuqNcr8Mv+SZ+Hf+vGP+VAHV0UUUAIa5X4Zf8kz8O/8AXjH/ACrqjXK/DL/kmfh3/rxj/lQB1def/GTR59W+H1zPaAm70yVL+IKOcp978lLH8K9AprxrIjI6hlYYIIyCPSgDnZINL8f+B0F0nmadqlqjkK2CuQGGD2KsPzFc3Z+B/G+nWqadZfEN00+IBIvM0yOSZEHAXcT6cZrvrHTrPTLOOzsbaK2to87IoVCquTk4A9+as4FAHJ+KtR/4RH4a38895JcTWliYUnmPzyykbFZvcsc0nw00KTw38PdH06ZClwIvOmUjlXkJcg+43Y/CujvtMsdTgWC/tILqFXEgjnjDqGByDgjrVrHT2oAUdKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo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kae6uWXBmlbG5sdugGOwA69a6PFGBQAtFFFABRRRQByXxN/5J5qn/bL/ANGpXW1yXxN/5J5qn/bL/wBGpXW0AFFFFABSY/ClooA4aDwxqXhrxhqms6DFBcWGrkSXllLIY2jmGf3iHBBBycg468HtU2keFLuXxldeLdeaE37wfZbO1gculrD1I3kAs7ZJJAAGSOa7LaP60bRmgAHQc596WiigDI8Vf8ijrX/XhP8A+i2o8K/8ifon/XhB/wCi1o8Vf8ijrX/XhP8A+i2o8K/8ifon/XhB/wCi1oA16KKKACiiigAooooAy9fj1OfSbm30uG0knmjaMG5maJVyMA/KjE89uK5f4Y+F9d8F+G10TUxp0qJK8iz21w7E7ucFWjHf3ru9ozmjbQAtFFFACGuS+GP/ACT3Sv8Atr/6NeutNcl8Mf8Aknulf9tf/Rr0AddRRRQAUUUUAFFFFAFa8kukgY2cMMs38KzSGNffLBWx+VcB8N/CHiTwdNqw1IaTPFqN0bpnt7mTMZOcjBjGfzFejkA0YFAC0UUUAFFFFAHJeO/+Za/7D1r/AOzV1tcl47/5lr/sPWv/ALNXW0AFFFFABRRRQAVwfxQ8Ma94z8OvomljToonlSRp7q4dThcnAVYz3xzn14rvKQgGgDM0GPUrfSLW21KG0jmhiSMm2naRWwACfmRSOnvWpSYpaACiiigAooooAKKKKACiiigDkrr/AJK3pn/YEuv/AEdBXW1yV1/yVvTP+wJdf+joK62gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBDXK/DL/AJJn4d/68Y/5V1Rrlfhl/wAkz8O/9eMf8qAOrooooAQ1yvwy/wCSZ+Hf+vGP+VdUa5X4Zf8AJM/Dv/XjH/KgDq6KKKACiiigAooooAKKKKAOS8P/APJQ/GP/AG5f+ijXW1yXh/8A5KH4x/7cv/RRrraACiiigAooooAKKKKACiiigAooooA5L4m/8k81T/tl/wCjUrra5L4m/wDJPNU/7Zf+jUrraACiiigAooooAKKK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",
                "imageAnnotation": null
              }
            ],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 4,
            "markdown": "15) How many NAND gates are required if each of the gates in the following logic circuit is to be replaced directly by a combination of NAND gates only?\n![img-3.jpeg](img-3.jpeg)\n(a) 6 .\n(b) 7 .\n(c) 8 .\n(d) 9 .\n(e) 10 .\n\n16) Consider the following truth table.\n\n| A | B | C | F(A,B,C) |\n| :-- | :-- | :-- | :-- |\n| 1 | 1 | 1 | 1 |\n| 1 | 1 | 0 | 0 |\n| 1 | 0 | 1 | 1 |\n| 1 | 0 | 0 | 1 |\n| 0 | 1 | 1 | 0 |\n| 0 | 1 | 0 | 0 |\n| 0 | 0 | 1 | 0 |\n| 0 | 0 | 0 | 1 |\n\nWhich of the following expressions is/are represented by the Boolean function $\\mathrm{F}(\\mathrm{A}, \\mathrm{B}, \\mathrm{C})$ ?\n\n| (a) $B . \\bar{C}+\\overline{A . C}$ | (b) $A . C+\\overline{B . C}$ |\n| :-- | :-- |\n| (c) $A . C+A+A . \\overline{B . C}$ | (d) $A . C+(B+C)$ |\n| (e) $A . \\bar{C}+\\overline{B . C}$ |  |\n\n17) If any byte of a particular memory space can be addressed by using a 20-bit address and each location can hold one byte, what should be the size of the memory space?\n\n| (a) 4096 Bytes | (b) 10 KB | (c) 1 MB |\n| :-- | :-- | :-- |\n| (d) 1000 KB | (e) 2048 Bytes |  |\n\n18) Suppose that any byte of a particular memory space can be addressed by using a 20-bit address and each location can hold a byte. If a 6-byte variable is stored starting at location 11001110001100100100 , what is the address of next available storage location?\n(a) 11001110001100100111 .\n(b) 11001110001100101001 .\n(c) 11001110001100111010 .\n(d) 11001110001100101011 .\n(e) 11001110001100101010 .\n19) Which of the following memory types is/are having a direct data path to the processor?\n\n| (a) SRAM | (b) MPDRAM | (c) EDORAM |\n| :-- | :-- | :-- |\n| (d) DDR2 SDRAM | (e) RDRAM |  |",
            "images": [
              {
                "id": "img-3.jpeg",
                "topLeftX": 581,
                "topLeftY": 287,
                "bottomRightX": 1152,
                "bottomRightY": 638,
                "imageBase64": "data:image/jpeg;base64,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Q/3JMLKPow4b6HB/2q06KAKdtfw3LuisySoBvhkG1k98Ht7jIOOKtg5qreWUF3sEq4Kco6nayH1VhyPwqt9ruNN4vj5tt2ulABT/AK6AdP8AeAx1yFAzQBqUU1SGGQcj1FOoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCC+/5B9z/ANcm/kaW0/484P8Armv8qS+/5B9z/wBcm/kaW0/484P+ua/yoAmooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKADGaKKKACiiigAooooAKKKKACiiigAooooAKztXHlwwXKgbre4jfPYKTtcn6IzVo1R1mMzaNfRgctbSKPqVNAF4dKKbG4kjV1+6wBH406gAooooAKKKKACiiigApCBnNLRQBlGGTSX8y1Vnsz9+3UZMf+1GPT1Tv1HPDaMMsc8KSxOJI3G5WU5BFPPX8Ky5QdJmM6ELYytmZe0LE/wCs9lJ+8P8AgXA3GgDVopFOR1paACiiigAooooAQnHftWffa7pOmSxxahqtlaSSNtjW4uEQufQAkZpPEGpHR/Dup6mF3GztJbgL67ELf0rh/BHgjRtW8KWmta/Y2+rapq8K3VxcXkYkI3jcFXP3QAccUAekIwZQykFTyCO9Orzr4ftNo3ijxL4PE8s1jprRT2RlYsY45V3bMnsK9EoAWiiigAooooAKKKKACiiigAooooAKKKKAIL7/AJB9z/1yb+RpbT/jzg/65r/Kkvv+Qfc/9cm/kaW0/wCPOD/rmv8AKgCaiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKr3zBLG4duixMT9AKsVn62f+JJeqPvyQtGnuzDao/MigCxYqU0+3RvvLGoP5VYpBjHHSloAKKKKACiiigAooooAKKKKACqeozxW9q5ki87eNiwgDMrNwFGeOffgDJOBUt1cxWkDTTSBEHGfUngADuT2A5PaqdrBNc3K3t2ux8EQw5z5Kn1I6uRjJ5A6DuSARWek3sVnFG+tXqsqgFUWIqvsC0eSPc8+tT/ANm3X/Qbv/8AviD/AON1oLnbz1paAM7+zbr/AKDd/wD98Qf/ABugafdKwJ1m/IHO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",
                "imageAnnotation": null
              }
            ],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 5,
            "markdown": "20) Which of the following is a/are Network Interface Card(NIC) connectors?\n\n| (a) | SCSI | (b) | BNC | (c) | DB9 |\n| :-- | :-- | :-- | :-- | :-- | :-- |\n| (d) | USB 3.0 | (e) | RJ45 |  |  |\n\n21) A stack-based processor executes the following set of machine instructions sequentially.\n\n| PUSH | 100 |\n| :-- | :-- |\n| PUSH | 101 |\n| ADD |  |\n| PUSH | 102 |\n| SUB |  |\n| POP | 103 |\n\nAssuming that:\nI. Variables 0000 1010, 0000 0101, 00000001 and 00000111 are stored at memory locations $100,101,102$ and 103 respectively,\nII. The stack is byte organized and stack pointer is at 00 H , and\nIII. All PUSH and POP instructions have a memory operand,\nwhich of the following could be the final result?\n(a) Memory location 01 H contains the value 00000111 .\n(b) Memory location 02 H contains the value 103 .\n(c) Memory location 00 H contains the value 103 .\n(d) Memory location 103 contains the value 00001110 .\n(e) Memory location 103 contains the value 00000111 .\n\n22) Which of the following statements is/are true with respect to SCSI interface?\n(a) SCSI is a hardware bus similar in function to the ATA controller.\n(b) SCSI interface does not support connections to multiple devices.\n(c) SCSI is mainly used to connect high speed disk drives to high end servers.\n(d) SCSI interface can be used to enhance the performance of high-end PCs using RAID.\n(e) SCSI support RAID, but not IDE interface controllers.\n23) Consider the following three statements about Fire-Wire and USB interfaces.\nI. The data transfer rate of USB 2.0 is 480 Mbps and Fire-Wire 1394a provides up to 400 Mbps .\nII. USB allows up to 128 devices to run simultaneously on a single bus and a maximum of 63 devices can be connected to a single IEEE 1394 Fire-Wire adapter card.\nIII. Fire-Wire 1394b is substantially faster than Hi-Speed USB.\n\nWhich of the following statements is/are correct about Fire-Wire and USB interfaces?\n\n| (a) | Only (I). | (b) | Only (II). | (c) | Only (III). |\n| :-- | :-- | :-- | :-- | :-- | :-- |\n| (d) | Only (I) and (III). | (e) | All are correct. |  |  |",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 6,
            "markdown": "24) Which of the following is a/are System Software?\n\n| (a) | BIOS. | (b) | Web Browsers. | (c) Compilers. |\n| :-- | :-- | :-- | :-- | :-- |\n| (d) | Emulators. | (e) | Utility Software. |  |\n\n25) Which of the following is a/are functionality(ies) of an Operating System?\n(a) Translates user commands to a form that can be understood by the relavent computer component.\n(b) Creates a file structure on the computer hard disk where user data can be stored and retrieved.\n(c) Allocates portions of memory to programs at their request and frees the allowed memory for reuse when no longer needed.\n(d) Reduces the resolution of high quality images to the required level when the file sizes exceed the capacity expected by an application.\n(e) Executes special programs to repair damaged files and backup data.\n26) Which of the following statements is/are true with respect to routers?\n(a) Routers are used to join similar topologies together and to divide network segments.\n(b) Routers can be used to regenerate transmission signals between similar network segments.\n(c) The advantage of using a router over a bridge is that routers can determine the best path that data can take to reach the destination.\n(d) Bridges can segment large networks and can filter out noise but routers cannot.\n(e) When a typical WAN is set up, there should be at least two routers.\n27) Which of the following Wi-Fi standards has/have a maximum of 54 Mbps bandwidth?\n\n| (a) IEEE 802.11 | (b) IEEE 802.11a | (c) IEEE 802.11b |\n| :-- | :-- | :-- |\n| (d) IEEE 802.11g | (e) IEEE 802.11n |  |\n\n28) Which of the following technologies is/are used to set up a short range Personal Area Network?\n\n| (a) Wi-Fi | (b) | Bluetooth |\n| :-- | :-- | :-- |\n| (c) ZigBee | (d) | Wi-Max |\n| (e) Microwave Access Communication |  |  |\n\n29) Which of the following is/are not considered as a magnetic storage device?\n\n| (a) Compact Disks | (b) Castlewood Orb |\n| :-- | :-- |\n| (c) Zip Disk | (d) Floppy Disks |\n| (e) Punch Card |  |",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 7,
            "markdown": "30) Which of the following statements is/are correct about a hard disk drive?\n(a) The hard disk drive speed is measured in cylinder rounds per minute.\n(b) The read/write speed of a hard disk drive is much slower than RAM.\n(c) The number of tracks per disk is equal to the number of cylinders in a hard disk.\n(d) Data transfer rates of the Serial-ATA hard disks are greater than those of ATA hard disks.\n(e) The CPU directly accesses hard disk drive data when primary memory space is not enough.\n31) Which of the following parts is/are on a typical computer motherboard?\n(a) Hard Disk.\n(b) Power Supply.\n(c) Processor Socket.\n(d) I/O Controller Hub.\n(e) RAM cards\n32) What is/are the components of a typical system bus of a computer motherboard?\n(a) Control Bus\n(b) ROM Bus\n(c) Address Bus\n(d) Data Bus\n(e) Program Bus\n33) Which of the following statements is/are correct about a Central Processing Unit (CPU)?\n(a) ALU, Control Unit and Memory are principal parts of a typical CPU.\n(b) ALU executes arithmetic and logical instructions.\n(c) ALU operations are controlled by the Control Unit.\n(d) Both CPU Registers and the Control Unit of the CPU are called the Data-path.\n(e) Address Bus is used to determine the location of the source or destination of the data.\n34) The first two bytes of a main memory with 16-bit addresses have the following hex values:\n\n$$\n\\begin{aligned}\n& \\text { Byte } 0=\\text { FFH } \\\\\n& \\text { Byte } 1=01 \\mathrm{H}\n\\end{aligned}\n$$\n\nIf these two bytes hold a 16-bit two's complement integer value, what is its decimal value if the bytes are organized as big-endian?\n\n| (a) +255 | (b) -254 | (c) +511 |\n| :-- | :-- | :-- |\n| (d) -255 | (e) -256 |  |\n\n35) Which of the following statements about Video Input Devices is/are correct?\n(a) A DV camera stores the input audio and video on a DVD in digital format.\n(b) A DV camera uses FireWire ports for digital video transfer.\n(c) DVD cameras directly write the video input on to a mini-DVD.\n(d) The webcam cannot be considered as a basic video camera.\n(e) Total video transferring time in using FireWire port is equal to the recorded period of the video.",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 8,
            "markdown": "36) Which of the following statements is/are true with respect to Touchpad?\n(a) Touchpad was invented by Cirque in 1994.\n(b) Touchpad must be locked when an external mouse is connected.\n(c) Touchpad is \"Strike-sensitive\".\n(d) Touchpad has a square area about 2 inches by 1.5 inches in laptops.\n(e) Touchpads can be found only on laptops.\n37) Which of the following statements is/are true with respect to CRT and Flat-Panel LCD monitors?\n(a) A CRT monitor tube is a glass vacuum tube with one-end having an electron gun and the other a display surface coated with phosphors.\n(b) A CRT monitor tube uses four electron beams to generate red, green, UV and blue light.\n(c) The electron beams are used to determine the refresh rate a of the CRT monitor screen.\n(d) The LCD Flat-Panel first worked in three-colour mode as RGB.\n(e) A backlight mechanism was introduced to illuminate what was displayed on LCD screen.\n38) Consider the following three statements about Multimedia Projectors.\nI. The images projected by the LCD multimedia projectors are bright and sharp but blured.\nII. The images projected by the DLP multimedia projectors are sharp not blured and brighter.\nIII. DLP multimedia projectors take very little time to cool down when compared with LCD projectors.\n\nWhich of the above statements is/are correct?\n\n| (a) | Only (I). | (b) | Only (II). | (c) Only (III). |\n| :-- | :-- | :-- | :-- | :-- |\n| (d) | Only (II) and (III). | (e) | All are correct. |  |\n\n39) Which of the following features is/are included in Advanced BIOS?\n(a) SWAP Floppy Drive.\n(b) Anti-Virus Program enable/disable.\n(c) DRAM Clock.\n(d) PCI/VGA Palette Snoop.\n(e) Drive A and B enable/disable.\n40) Which of the following statements is/are always true with respect to the BIOS ROM chip?\n(a) True-ROM chip does the writing into the chip during the manufacturing phase.\n(b) EEPROM chip does the writing after manufacture phase and the chip can be erased using UV light.\n(c) EEPROM chip can be erased electronically and re-written.\n(d) PROM chip does the writing after manufacture and the chip can be written only once.\n(e) Most modern day motherboard BIOS chips are EPROMs.",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 9,
            "markdown": "41) Which of the following software is/are not utility software?\n\n| (a) Anti-Virus | (b) Scan Disk | (c) Organizer Notes |\n| :-- | :-- | :-- |\n| (d) Backup Software | (e) Disk Defragmenter |  |\n\n42) Which of the following Operating Systems is/are used in embedded systems?\n\n| (a) Linux | (b) Windows NT | (c) Android |\n| :-- | :-- | :-- |\n| (d) Symbian OS | (e) Windows ME |  |\n\n43) Which of the following applications is launched when \"windows + E\" keys are pressed on 104-key Windows Keyboard?\n(a) Windows Internet Explorer program.\n(b) Windows Explorer program.\n(c) Windows Application Start Menu.\n(d) E-drive partition of the HDD\n(e) Windows My Computer Application program\n44) Which of the following software is/are developed for planning, scheduling, allocating money and controlling resources?\n(a) Enterprise Application Software.\n(b) Financial Management Software.\n(c) Workgroup Application Software.\n(d) Project Management Software.\n(e) Manufacturing Control Software.\n45) Which of the following statements is/are true about Cache Memory?\n(a) The L1 cache is manufactured using SRAM technology since it is fast and constant when powered on.\n(b) In modern computers, the L2 cache is referred as the external cache.\n(c) The L2 cache is manufactured using SRAM since it goes through many refresh cycles per second.\n(d) When a memory request is generated, the request is first presented to the cache memory.\n(e) We define a cache miss to be a reference to an item that is not resident in main memory.\n46) Which of the following network peripherals can be used to prepare data, send data and control the flow of data?\n\n| (a) | Optical Connector | (b) Bridge | (c) Network Interface Card |\n| :-- | :-- | :-- | :-- |\n| (d) | Router | (e) Switch |  |",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          },
          {
            "index": 10,
            "markdown": "47) Which of the following statements is/are always true about a bus system available in a computer system?\n(a) PCI bus is in the form of 16-bit slots mounted on the mother board and is in white colour.\n(b) The fastest bus in the computer system is the processor bus and is used to transfer data between the processor and cache or main memory.\n(c) ISA bus could handle maximum of only 16-bits, and ISA cards cannot be pluggedin to the EISA slots.\n(d) AGP slots are designed particularly to be used with video cards and have high performance connectivity.\n(e) SCSI adapters cannot be plugged-in to the PCI-X slots.\n48) Which of the following statements is/are correct with respect to RAM types?\n(a) SDRAM removes the drawback of latency in synchronizing with the CPU clock.\n(b) The data Transfer on an SDRAM occurs on the rising edge of the motherboard clock cycle.\n(c) DDR2 SDRAMs increase the speed of memory twofold in sending data on both edges of the CPU clock.\n(d) DDR SDRAM memory modules have 184 pins.\n(e) DDR2 SDRAMs consume more power than DDR SDRAMs and generate high heat.\n49) Which of the following statements is/are correct about POST?\n(a) The main devices tested by POST are the CPU, motherboard support circuits, ROM, RAM, video graphic adapter and Hard disk drive.\n(b) The POST program is loaded just after locating the first boot sector to start up the computer system.\n(c) The POST program indicates errors in the form of audio codes, on screen messages or check point codes.\n(d) The POST program protects the bootstrapped code from being interrupted by faulty hardware.\n(e) The BIOS program handles the main duties of POST.\n50) Which of the following components might need to be considered when upgrading the processor of the computer system?\n(a) Main Storage Device\n(b) Main Memory\n(c) Video Graphic Adapter\n(d) Motherboard\n(e) Power Supply",
            "images": [],
            "dimensions": {
              "dpi": 200,
              "height": 2339,
              "width": 1653
            }
          }
        ],
        "model": "mistral-ocr-2505-completion",
        "documentAnnotation": null,
        "usageInfo": {
          "pagesProcessed": 11,
          "docSizeBytes": 908370
        }
      };

     
      this.base64Images = [];

      for (let page of ocrResponse.pages) {
        if (page.index == 0)
          continue;
        // console.log("page");
        // console.log(page);
        this.base64Images.push(...page.images);
        this.completeMarkdown += page.markdown;
        this.parseSequentialSlotWithOptionImagesNew(page.markdown);
        // this.parseQuestions(page.markdown);
      }

      this.questions.forEach(q => {
        this.forms.push(this.createForm(q));
      });

   
    } catch (error) {
      console.error("Error processing OCR:", error);
    }
  }

  async parseOcrFromMarkdown(completeMarkdown: any) {
    try {
      // completeMarkdown = ""

      this.parseSequentialSlotWithOptionImagesNew(completeMarkdown);

      // this.forms = [];
      this.questions.forEach(q => {
        this.forms.push(this.createForm(q));
      });

    
    } catch (error) {
      console.error("Error processing OCR:", error);
    }
  }



  onSelectImageFile(formControlName: string, index: number, event: any) {
    if (event.target.files) {
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.questions[index][formControlName] = reader.result;
      }
    }
  }

  base64ToFile(base64: string, filename: string): File {
    const parts = base64.split(',');
    const mimeMatch = parts[0]?.match(/data:(.*);base64/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'; // fallback

    const byteString = atob(parts[1] || parts[0]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mime });
  }


  downloadImage(base64String: string, questionIndex: number, imageNumber: number) {
    // Remove the data URI prefix if present
    const base64WithoutPrefix = base64String.split(',')[1] || base64String;
    let type = base64String.split(';')[0].split(':')[1];

    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: type });

    let fileName = `${this.selectedPaper.subject}-${this.selectedPaper.year}-Q${questionIndex + 1}-${imageNumber}.png`;
    saveAs(blob, fileName);
  }

  base64ToBlob(base64: string): Blob {

    const contentType = this.getContentTypeFromBase64(base64) || 'application/octet-stream';
    base64 = this.stripBase64Prefix(base64);
    const byteCharacters = atob(base64); // decode base64
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  getContentTypeFromBase64(base64: string): string | null {
    const match = base64.match(/^data:(.*);base64,/);
    return match ? match[1] : null;
  }

  stripBase64Prefix(base64: string): string {
    return base64.replace(/^data:.*;base64,/, '');
  }

  getMediumLabel(code: string): string {
    switch (code) {
      case 'ENG': return 'English';
      case 'SIN': return 'Sinhala';
      case 'TAM': return 'Tamil';
      default: return code;
    }
  }

  createFormList(questionList: any[]): FormGroup[] {
    let forms: FormGroup[] = [];
    questionList.forEach(q => {
      forms.push(this.createForm(q));
    });
    return forms;
  }

  viewPapers() {
    this.view = 'papers';
    this.enteredPapers = this.localStorageService.getPapers();
    this.localStorageService.clearSelectedPaper();
    this.selectedPaper = {} as Paper;
  }

  getQuestionRegex(optionType: string): RegExp {
    switch (optionType) {
      case 'I.': // Roman numeral with dot
        return /(I{1,3}|IV|V)\.\s+([\s\S]*?)(?=(I{1,3}|IV|V)\.|$)/g;

      case '(i)': // Lowercase roman in parentheses
        return /\((i{1,3}|iv|v)\)\s+([\s\S]*?)(?=\((i{1,3}|iv|v)\)|$)/gi;

      // case '(A)': // Uppercase letter in parentheses
      //   return /\(([A-Z])\)\s+([\s\S]*?)(?=\([A-Z]\)|$)/g;

      // case '(a)': // Lowercase letter in parentheses
      //   return /\(([a-z])\)\s+([\s\S]*?)(?=\([a-z]\)|$)/g;

      case '1.': // Arabic numbers with dot
        return /(\d+)\.\s+([\s\S]*?)(?=\d+\.\s+|$)/g;

      case '1)': // Arabic numbers with bracket
        return /(\d+)\)\s+([\s\S]*?)(?=\d+\)\s+|$)/g;

      case '(1)': // Uppercase letter in parentheses
        return /\(([0-9]+)\)\s+([\s\S]*?)(?=\([0-9]+\)|$)/g;
      default:
        throw new Error('Unsupported question format');
    }
  }

  getOptionRegex(optionType: string): RegExp {
    switch (optionType) {
      case 'I.': // Roman numeral with dot
        return /(I{1,3}|IV|V)\.\s+([\s\S]*?)(?=(I{1,3}|IV|V)\.|$)/g;

      case '(i)': // Lowercase roman in parentheses
        return /\((i{1,3}|iv|v)\)\s+([\s\S]*?)(?=\((i{1,3}|iv|v)\)|$)/gi;

      case '(A)': // Uppercase letter in parentheses
        return /\(([A-E])\)\s+([\s\S]*?)(?=\([A-E]\)|$)/g;

      case 'A -': // Uppercase letter in parentheses
        return /([A-E])\s-+([\s\S]*?)(?=([A-E])\s-|$)/g;

      case '(a)': // Lowercase letter in parentheses
        return /\(([a-e])\)\s+([\s\S]*?)(?=\([a-e]\)|$)/g;

      case '1.': // Arabic numbers with dot
        return /(\d+)\.\s+([\s\S]*?)(?=\d+\.\s+|$)/g;

      default:
        throw new Error('Unsupported option format');
    }
  }

  getAnswerRegex(optionType: string): RegExp {
    switch (optionType) {
      case 'I.': // Roman numeral with dot
        return /(I{1,3}|IV|V)\.\s+([\s\S]*?)(?=(I{1,3}|IV|V)\.|$)/g;

      case '(i)': // Lowercase roman in parentheses
        return /\((i{1,3}|iv|v)\)\s+([\s\S]*?)(?=\((i{1,3}|iv|v)\)|$)/gi;

      case '(I)': // Uppercase roman in parentheses
        return /\((I{1,3}|Iv|v)\)\s+([\s\S]*?)(?=\((I{1,3}|Iv|v)\)|$)/gi;

      case '(A)': // Uppercase letter in parentheses
        return /\(([A-E])\)\s+([\s\S]*?)(?=\([A-E]\)|$)/g;

      case '(a)': // Lowercase letter in parentheses
        return /\(([a-e])\)\s+([\s\S]*?)(?=\([a-e]\)|$)/g;

      case '1.': // Arabic numbers with dot
        return /(\d+)\.\s+([\s\S]*?)(?=\d+\.\s+|$)/g;

      case '1)': // Arabic numbers with bracket
        return /(\d+)\)\s+([\s\S]*?)(?=\d+\)\s+|$)/g;

      case '(1)': // Uppercase letter in parentheses
        return /\(([0-9])\)\s+([\s\S]*?)(?=\([0-9]\)|$)/g;
      default:
        throw new Error('Unsupported answer format');
    }
  }

  transferValue(from: string, to: string, index: number, type: 'qtext' | 'atext' | 'qimg' | 'aimg' | 'option') {
    if (type === 'option') {
      let optionList = ['A', 'B', 'C', 'D', 'E'];
      for (let option of optionList) {
        if (this.forms[index].get('option' + from + option + 'TextAvailable')?.value) {
          this.forms[index].get('option' + to + option + 'Text')?.setValue(this.forms[index].get('option' + from + option + 'Text')?.value);
          this.forms[index].get('option' + to + option + 'TextAvailable')?.setValue(true);
          this.forms[index].get('option' + from + option + 'Text')?.setValue('');
          this.forms[index].get('option' + from + option + 'TextAvailable')?.setValue(false);
          this.questions[index]['option' + to + option + 'Text'] = this.forms[index].get('option' + from + option + 'Text')?.value;
          this.questions[index]['option' + from + option + 'Text'] = '';

        }
        if (this.forms[index].get('option' + from + option + 'ImgAvailable')?.value) {
          this.questions[index]['option' + to + option + 'Img'] = this.questions[index]['option' + from + option + 'Img'];
          this.forms[index].get('option' + to + option + 'ImgAvailable')?.setValue(true);
          this.questions[index]['option' + from + option + 'Img'] = '';
          this.forms[index].get('option' + from + option + 'ImgAvailable')?.setValue(false);
        }
      }
    } else if (type.match(/q+/)) {
      let componentType = type === 'qtext' ? 'questionText' : 'questionImg';
      this.forms[index].get(componentType + to)?.setValue(this.forms[index].get(componentType + from)?.value);
      this.forms[index].get(componentType + to + 'Available')?.setValue(true);
      this.forms[index].get(componentType + from)?.setValue('');
      this.forms[index].get(componentType + from + 'Available')?.setValue(false);
      if (type === 'qtext') {
        this.questions[index][componentType + to] = this.forms[index].get(componentType + from)?.value;
      } else {
        this.questions[index][componentType + to] = this.questions[index][componentType + from];
      }
      this.questions[index][componentType + from] = '';
    } else if (type.match(/a+/)) {
      let componentType = type === 'atext' ? 'Text' : 'Img';
      this.forms[index].get('answer' + to + componentType)?.setValue(this.forms[index].get('answer' + from + componentType)?.value);
      this.forms[index].get('answer' + to + componentType + 'Available')?.setValue(true);
      this.forms[index].get('answer' + from + componentType)?.setValue('');
      this.forms[index].get('answer' + from + componentType + 'Available')?.setValue(false);
      if (type === 'qtext') {
        this.questions[index]['answer' + to + componentType] = this.forms[index].get('answer' + from + componentType)?.value;
      } else {
        this.questions[index]['answer' + to + componentType] = this.questions[index]['answer' + from + componentType];
      }
      this.questions[index]['answer' + from + componentType] = '';
    }


  }

  openSettings() {
    // this.offcanvasService.open(content, { position: 'end' });
    this.windowRef = this.windowService.open(this.settingsTemplate, {
      title: 'Settings',
      hasBackdrop: true,
      closeOnBackdropClick: true,
      windowClass: 'side-panel-window', 
    });
  }

  saveSettings(ref: NbWindowRef) {
    this.localStorageService.setSettings([
      { key: 'questionIdentifier', value: this.questionIdentifier },
      { key: 'optionIdentifier', value: this.optionIdentifier },
      { key: 'answerIdentifier', value: this.answerIdentifier }
    ]);
    // this.offcanvasService.dismiss();
    this.windowRef.close();
  }

  setSettings() {
    let settings = this.localStorageService.getSettings();
    for (let setting of settings) {
      if (setting.key === 'questionIdentifier') {
        this.questionIdentifier = setting.value;
      } else if (setting.key === 'optionIdentifier') {
        this.optionIdentifier = setting.value;
      } else if (setting.key === 'answerIdentifier') {
        this.answerIdentifier = setting.value;
      }
    }
  }


  
  excel() {
    this.saveQuestionsToLocalStorage()
    console.log()
    const cleanedQuestions = this.questions.map(q => {
      const cleanedQ: any = { ...q }; 

      for (const key in cleanedQ) {
        if (Object.prototype.hasOwnProperty.call(cleanedQ, key) && typeof cleanedQ[key] === 'string') {
          cleanedQ[key] = (cleanedQ[key] as string).replace(/`/g, '');
        }
      }
      return cleanedQ; 
    });
    const headers = [
      'Question No', 'Chapter No', 'Question Text 1', 'Question Img 1',
      'Option 1 A Text', 'Option 1 A Img', 'Option 1 B Text', 'Option 1 B Img',
      'Option 1 C Text', 'Option 1 C Img', 'Option 1 D Text', 'Option 1 D Img',
      'Option 1 E Text', 'Option 1 E Img', 'Question Img 2', 'Question Text 2',
      'Option 2 A Text', 'Option 2 A Img', 'Option 2 B Text', 'Option 2 B Img',
      'Option 2 C Text', 'Option 2 C Img', 'Option 2 D Text', 'Option 2 D Img',
      'Option 2 E Text', 'Option 2 E Img', 'Question Text 3', 'Question Img 3',
      'Answer 1 Text', 'Answer 1 Img', 'Answer 2 Text', 'Answer 2 Img',
      'Answer 3 Text', 'Answer 3 Img', 'Answer 4 Text', 'Answer 4 Img',
      'Answer 5 Text', 'Answer 5 Img', 'Correct Answers (1,2,3,4,5)',
      'Review Img1', 'Review Text', 'Review Img2', 'Status', 'Feedback'
    ];
    const excelData: any[][] = [[]];
    excelData.push(headers);
    // const dataRows = this.questions.map(q => [
    const dataRows = cleanedQuestions.map((q, index) =>[
      // return {
      // 'Question No': 
      index + 1,
      // q.questionNo || null,
      // q.questionNumber || null,
      // 'q.chapterNo': 
      q.chapterNo || "1",
      // 'Question Text 1': 
      q.questionText1 || null,
      // 'Question Img 1': 
      q.questionImg1 || null,
      // 'Question Img 1': null,

      // 'Option 1 A Text':
      q.option1AText || null,
      // 'Option 1 A Img':
      q.option1AImg || null,
      // 'Option 1 A Img': null,

      // 'Option 1 B Text':
      q.option1BText || null,
      // 'Option 1 B Img': 
      q.option1BImg || null,
      // 'Option 1 B Img': null,

      // 'Option 1 C Text': 
      q.option1CText || null,
      // 'Option 1 C Img': 
      q.option1CImg || null,
      // 'Option 1 C Img': null,

      // 'Option 1 D Text': 
      q.option1DText || null,
      // 'Option 1 D Img': 
      q.option1DImg || null,
      // 'Option 1 D Img': null,

      // 'Option 1 E Text': 
      q.option1EText || null,
      // 'Option 1 E Img': 
      q.option1EImg || null,
      // 'Option 1 E Img': null,


      // 'Question Img 2': 
      q.questionImg2 || null,
      // 'Question Img 2': null,

      // 'Question Text 2': 
      q.questionText2 || null,

      // 'Option 2 A Text': 
      q.option2AText || null,
      // 'Option 2 A Img': 
      q.option2AImg || null,
      // 'Option 2 A Img': null,

      // 'Option 2 B Text': 
      q.option2BText || null,

      // 'Option 2 B Img': 
      q.option2BImg || null,
      // 'Option 2 B Img': null,

      // 'Option 2 C Text': 
      q.option2CText || null,

      // 'Option 2 C Img': 
      q.option2CImg || null,
      // 'Option 2 C Img': null,
      // 'Option 2 D Text': 
      q.option2DText || null,

      // 'Option 2 D Img': 
      q.option2DImg || null,
      // 'Option 2 D Img': null,
      // 'Option 2 E Text': 
      q.option2EText || null,

      // 'Option 2 E Img': 
      q.option2EImg || null,
      // 'Option 2 E Img': null,


      // 'Question Text 3': 
      q.questionText3 || null,
      // 'Question Img 3': 
      q.questionImg3 || null,
      // 'Question Img 3': null,

      // 'Answer 1 Text': 
      q.answer1Text || null,
      // 'Answer 1 Img': 
      q.answer1Img || null,
      // 'Answer 1 Img': null,
      // 'Answer 2 Text': 
      q.answer2Text || null,

      // 'Answer 2 Img': 
      q.answer2Img || null,
      // 'Answer 2 Img': null,
      // 'Answer 3 Text': 
      q.answer3Text || null,

      // 'Answer 3 Img': 
      q.answer3Img || null,
      // 'Answer 3 Img': null,
      // 'Answer 4 Text': 
      q.answer4Text || null,

      // 'Answer 4 Img': 
      q.answer4Img || null,
      // 'Answer 4 Img': null,
      // 'Answer 5 Text': 
      q.answer5Text || null,

      // 'Answer 5 Img': 
      q.answer5Img || null,
      // 'Answer 5 Img': null,

      q.correctAnswers || "0",
      q.reviewImg1 || null,
      q.reviewText || null,
      q.reviewImg2 || null,
      q.status || "A",
      q.feedback || null,
      // };
    ]);
    // console.log("excelData")

    // console.log(excelData)
    // const ws = XLSX.utils.json_to_sheet(excelData);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb,ws, 'Placeholder');
    // XLSX.writeFile(wb, 'Question.xlsx')
    
    excelData.push(...dataRows);
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // XLSX.utils.sheet_add_json(ws, excelData, {
    //   origin: 'A2',
    //   skipHeader: false 
    // });

    const medium = this.selectedPaper.medium === 'ENG' ? 'E' : 'S';
    const wb = XLSX.utils.book_new();
    const sheetName = `${this.selectedPaper.subject} ${this.selectedPaper.year} ${medium}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Questions');
    const fileName = `${this.selectedPaper.subject} ${this.selectedPaper.year} ${medium}.xlsx`;
    XLSX.writeFile(wb, fileName)
  }

  image() {
      console.log("image")
    
    const base64Attributes = this.questions
      .flatMap(question => Object.entries(question)
        .filter(([key, value]) =>
          typeof value === 'string' && value.startsWith('data:image/')
        )
        .map(([key, value]) => ({
          questionNumber: question.questionNumber,
          key: key,
          value: this.base64ToBlob(value as string),
          filename: `${question.questionNumber}-${key}`
        }))
      );
    // console.log(base64Attributes);
    const formData = new FormData();
    base64Attributes.forEach(x => {
      formData.append('questionFileDtoList', x.value, x.filename);
      // console.log(formData)

    });
    // let responseData = [
    //   {
    //     "questionNo": 3,
    //     "attribute": "questionImg1",
    //     "file": null,
    //     "fileUrl": "https://bankfair.blob.core.windows.net/pocketguru/question/20251110063845_886abbef-10e5-41d1-a4f5-d53ba3bedc7e_3-questionImg1"
    //   },
    //   {
    //     "questionNo": 13,
    //     "attribute": "questionImg1",
    //     "file": null,
    //     "fileUrl": "https://bankfair.blob.core.windows.net/pocketguru/question/20251110063845_0bc6636e-08bc-4de8-9461-0acb061e8084_13-questionImg1"
    //   },
    //   {
    //     "questionNo": 14,
    //     "attribute": "questionImg1",
    //     "file": null,
    //     "fileUrl": "https://bankfair.blob.core.windows.net/pocketguru/question/20251110063845_0ffcb820-709e-4d38-b434-3b62fc901118_14-questionImg1"
    //   },
    //   {
    //     "questionNo": 15,
    //     "attribute": "questionImg1",
    //     "file": null,
    //     "fileUrl": "https://bankfair.blob.core.windows.net/pocketguru/question/20251110063845_722d2c85-9f0e-4330-8295-f535713ff9f8_15-questionImg1"
    //   }
    // ]
    
    // console.log("questions");
    // console.log( this.questions);
    if (base64Attributes.length > 0) {
      this.ocrViewService.imageUrl(formData).subscribe({
        next: (response:any) => {
          // setTimeout(() => { }, 1600);
          if (response && response['code'] == '200' && response.responseData) {
            // swal.fire('Success', 'Subject Created Successfully!', 'success');
            response.responseData	.forEach((res:any) => {
              const question = this.questions.find(q => q.questionNumber === res.questionNo);
                question[res.attribute] = res.fileUrl;
                // this.questions[index] = question;

                // console.log("question")
                // console.log(question)
                // console.log("response.responseData")
                // console.log(response.responseData)
                
            });

            this.excel()
            this.saveQuestionsToLocalStorage();
          // } else if (response['code'] == '400'){
            // swal.fire('Warning', 'Failed!', 'warning');
          // }else if(response['code'] == '416') {
            // swal.fire('Warning', 'Subject id duplicate', 'warning');
          }
          else{
            "bad"
            // swal.fire('Warning', 'Something went wrong try again later', 'warning');
          }
        },
        error: (e) => {
          // swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          "bad request"
        }
      });
    }else{
      this.excel()
    }
  }
  // Add these methods to your OcrViewComponent class

insertQuestion() {
  const newQuestion = {};
  const insertIndex = this.currentIndex + 1;
  this.questions.splice(insertIndex, 0, newQuestion);
  const newForm = this.createForm(newQuestion);
  newForm.get('questionText1Available')?.setValue(true);
  newForm.get('answer1TextAvailable')?.setValue(true);
  newForm.get('answer2TextAvailable')?.setValue(true);
  newForm.get('answer3TextAvailable')?.setValue(true);
  newForm.get('answer4TextAvailable')?.setValue(true);
  newForm.get('answer5TextAvailable')?.setValue(true);

  this.forms.splice(insertIndex, 0, newForm);
  this.questions.forEach((q, index) => {
    const newNumber = index + 1;
    q.questionNumber = newNumber;
    if (this.forms[index]) {
      this.forms[index].patchValue({ questionNumber: newNumber });
    }
  });
    this.currentIndex = insertIndex;
    this.saveQuestionsToLocalStorage();
  }

  deleteQuestion() {
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to Delete Question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.questions.splice(this.currentIndex, 1);
          this.forms.splice(this.currentIndex, 1);
          this.questions.forEach((q, index) => {
          const newNumber = index + 1;
          q.questionNumber = newNumber;
          if (this.forms[index]) {
            this.forms[index].patchValue({ questionNumber: newNumber });
          }
        });
      }
    });
  }
  onPageChange(pageNumber: number) {
    this.currentIndex = pageNumber - 1;
    this.saveQuestionsToLocalStorage();
  }
}
