import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnswerService } from '../../../@services/answer-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestDataService } from '../../../@services/test-data-service';
import { HttpClientService } from '../../../@services/http-client.service';
import { WriteService } from '../../../@services/write-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-survey-write',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './survey-write.component.html',
  styleUrl: './survey-write.component.scss'
})

export class SurveyWriteComponent {


  survey: any = {}; // 問卷資料
  formData: any = {
    name: '',
    phone: '',
    email: '',
    age: null,
    answers: {}, // 儲存每個問題的答案
  };

  constructor(
    private answerService: AnswerService,
    private router: Router,
    private http: HttpClientService,
    private writeService: WriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.survey = this.writeService.getSurvey();

    // 延遲檢查，讓資料有足夠時間載入
    setTimeout(() => {
      this.survey = this.writeService.getSurvey();

      if (!this.survey) {
        console.error('未能從 WriteService 獲取問卷資料');
        alert('請先從問卷列表進入問卷填寫頁面！');
        this.router.navigate(['/frontMain/surveyList']);
        return;
      }

      // 從 AnswerService 中加載之前的答案
      const savedAnswers = this.answerService.getAnswerData();
      if (savedAnswers) {
        this.formData = {
          ...this.formData, // 保留原有的結構
          name: savedAnswers.name || '',
          phone: savedAnswers.phone || '',
          email: savedAnswers.email || '',
          age: savedAnswers.age || null,
          answers: savedAnswers.answers || {},
        };
      }

      console.log('從 WriteService 獲取的問卷資料:', this.survey);
      console.log('加載的填寫資料:', this.formData);
    }, 100); // 延遲 100ms，根據實際情況可調整

  }

  isFormValid(): boolean {
    // 基本資料檢查
    if (!this.formData.name || !this.formData.phone || !this.emailValid) {
      return false;
    }

    // 檢查每個必填問題是否填寫
    return this.survey.quesList.every((question: any) => {
      if (question.required) {
        return (
          this.formData.answers[question.questionId] &&
          this.formData.answers[question.questionId].length > 0
        );
      }
      return true; // 非必填的問題可忽略
    });
  }


  // 處理多選題
  onCheckboxChange(questionId: number, option: string, event: Event): void {
    if (!this.formData.answers[questionId]) {
      this.formData.answers[questionId] = [];
    }

    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.formData.answers[questionId].push(option);
    } else {
      this.formData.answers[questionId] = this.formData.answers[questionId].filter((item: string) => item !== option);
    }

    console.log('Updated answers:', this.formData.answers);
  }


  submitSurvey(): void {
    if (!this.isFormValid()) {
      // 彈出提醒
      this.snackBar.open('請填寫所有必填項目！', '關閉', {
        duration: 3000, // 提示持續時間 (毫秒)
        horizontalPosition: 'center', // 水平位置
        verticalPosition: 'top', // 垂直位置
      });
      return; // 停止提交
    }

    // 如果表單有效，進行後續處理（如保存或提交到後端）
    console.log('表單有效，準備提交:', this.formData);
    this.saveAnswersToService(); // 儲存答案並跳轉
  }



  // 儲存答案到 Service
  saveAnswersToService(): void {
    console.log('儲存的答案:', this.formData);
    this.answerService.setAnswerData(this.formData); // 儲存到 Service
    this.router.navigateByUrl('/frontMain/answerPreview'); // 跳轉到預覽頁
  }

  // 返回列表頁
  backToList(): void {
    // 清空填寫內容
  this.answerService.clearAnswerData();
  // 返回列表頁
    this.router.navigateByUrl('/frontMain/surveyList');
  }

  // 驗證 email 格式是否包含 @
  get emailValid(): boolean {
    return this.formData.email.includes('@');
  }


}















