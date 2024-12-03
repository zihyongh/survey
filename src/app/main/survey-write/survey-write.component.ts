import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnswerService } from '../../../@services/answer-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestDataService } from '../../../@services/test-data-service';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-survey-write',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './survey-write.component.html',
  styleUrl: './survey-write.component.scss'
})

export class SurveyWriteComponent {

  // 問卷假資料
  survey: any = {}; // 問卷資料
  // 表單控制
  basicFormGroup!: FormGroup;
  selectedOptions: { [key: number]: string[] } = {}; // 用於儲存多選題的選擇結果


  constructor(
    private answerService: AnswerService,
    private router: Router,
    private testDataService: TestDataService,
    private http: HttpClientService
  ) {}


  ngOnInit(): void {
    this.survey = this.testDataService.getTestSurvey1(); // 獲取問卷資料
    this.initForm(); // 初始化表單
    this.loadSavedData(); // 載入已保存的答案
  }

  // 初始化表單
  initForm(): void {
    const controls: { [key: string]: FormControl } = {
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      age: new FormControl('', [Validators.min(0), Validators.max(120)])
    };

    // 根據問卷動態生成題目控制
    this.survey.questionData.forEach(
      (question: { questionType: string; questionId: number; required: boolean; }) => {
      if (question.questionType == 'multi') {
        this.selectedOptions[question.questionId] = []; // 初始化多選題
      } else {
        controls[`question${question.questionId}`] = new FormControl('', question.required ? Validators.required : null);
      }
    }
  );

    this.basicFormGroup = new FormGroup(controls);
  }

  // 處理多選題
  onCheckboxChange(questionId: number, option: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOptions[questionId].push(option);
    } else {
      this.selectedOptions[questionId] = this.selectedOptions[questionId].filter(item => item !== option);
    }
  }

  // 儲存答案到 Service
  saveAnswersToService(): void {
    const answers = {
      name: this.basicFormGroup.value.name,
      phone: this.basicFormGroup.value.phone,
      email: this.basicFormGroup.value.email,
      age: this.basicFormGroup.value.age,
      surveyAns: this.survey.questionData.map((question: any) => {
        if (question.questionType === 'multi') {
          return { questionId: question.questionId, answer: this.selectedOptions[question.questionId] };
        }
        return {
          questionId: question.questionId,
          answer: this.basicFormGroup.value[`question${question.questionId}`],
        };
      }),
    };

    this.answerService.setAnswerData(answers); // 儲存到 Service
    console.log('儲存的答案:', answers);
    this.router.navigateByUrl('/frontMain/answerPreview'); // 跳轉到預覽頁
  }



  // // 儲存答案並預覽
  // saveAndPreview(): void {
  //   const answers = {
  //     ...this.basicFormGroup.value,
  //     surveyAns: this.survey.questionData.map((question: any) => {
  //       if (question.questionType === 'multi') {
  //         return { questionId: question.questionId, answer: this.selectedOptions[question.questionId] };
  //       }
  //       return { questionId: question.questionId, answer: this.basicFormGroup.value[`question${question.questionId}`] };
  //     }),
  //   };

  //   const surveyResult = {
  //     title: this.survey.title,
  //     describe: this.survey.describe,
  //     startDate: this.survey.startDate,
  //     endDate: this.survey.endDate,
  //     questionData: this.survey.questionData,
  //     answers
  //   };

  //   console.log('填寫結果:', surveyResult); // 確認資料是否正確
  //   this.answerService.setAnswerData(surveyResult); // 存入服務
  //   this.router.navigateByUrl('/frontMain/answerPreview'); // 跳轉至預覽頁
  // }

  // 載入之前的答案
  // 載入之前的答案
  loadSavedData(): void {
    const savedData = this.answerService.getAnswerData();
    if (savedData) {
      this.basicFormGroup.patchValue(savedData); // 填入基本資料
      if (savedData.surveyAns) {
        savedData.surveyAns.forEach((ans: any) => {
          if (Array.isArray(ans.answer)) {
            this.selectedOptions[ans.questionId] = ans.answer; // 填入多選題答案
          } else {
            this.basicFormGroup.patchValue({
              [`question${ans.questionId}`]: ans.answer, // 填入單選題/文字題答案
            });
          }
        });
      }
    }
  }


  // 返回列表頁
  backToList(): void {
    this.router.navigateByUrl('/frontMain/surveyList');
  }


}











