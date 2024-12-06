import { HttpClient } from '@angular/common/http';
import { WriteService } from './../../../@services/write-service';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnswerService } from '../../../@services/answer-service';
import { Router } from '@angular/router';
import { TestDataService } from '../../../@services/test-data-service';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-answer-preview',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,],
  templateUrl: './answer-preview.component.html',
  styleUrl: './answer-preview.component.scss'
})

export class AnswerPreviewComponent {

  constructor(
    private answerService:AnswerService,
    private router: Router,
    private writeService: WriteService,
    private http: HttpClientService
  ){}

  survey: any = {};       // 題目資料
  previewAns: any = {     // 儲存使用者的填寫答案
    name: '',
    phone: '',
    email: '',
    age: null,
    answer: {},
  };



  ngOnInit(): void {
    this.survey = this.writeService.getSurvey();
    console.log("預覽題目:",this.survey)
    if (!this.survey) {
      console.error('未能從 WriteService 獲取問卷資料');
      alert('請先從問卷列表進入問卷填寫頁面！');
      this.router.navigate(['/frontMain/surveyList']);
      return;
    }

    // 假設從 AnswerService 中取得的答案結構如下
    const savedAnswers = this.answerService.getAnswerData();
    console.log('答案:',savedAnswers)

    // 初始化 previewAns，確保結構存在，即使答案為空
    this.previewAns = {
      name: savedAnswers?.name || '',
      phone: savedAnswers?.phone || '',
      email: savedAnswers?.email || '',
      age: savedAnswers?.age || null,
      answers: savedAnswers?.answers || {}, // 如果不存在，初始化為空物件
    };

    console.log('預覽答案:', this.previewAns);
  }




  // 返回問卷填寫頁
  backToSurvey() {
    this.router.navigate(['/frontMain/surveyWrite']);             // 返回問卷填寫頁
  }

  submitAnswers(): void {
    // 確認資料完整性
    if (!this.survey || !this.previewAns) {
      alert('資料不完整，無法提交！');
      return;
    }

    // 構造答案的 JSON 格式
    const payload = {
      quizId: this.survey.id, // 問卷 ID
      userName: this.previewAns.name,
      phone: this.previewAns.phone,
      email: this.previewAns.email,
      age: this.previewAns.age || null, // 年齡可能為空
      fillinDate: new Date().toISOString().split('T')[0], // 當前日期 (YYYY-MM-DD 格式)
      answer: this.constructAnswers(this.previewAns.answers), // 將答案轉換為符合 API 的結構
    };



    // 呼叫 API
    this.http.postApi('http://localhost:8080/quiz/fillin', payload).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          alert('儲存成功！');
          this.answerService.clearAnswerData();
          this.router.navigate(['/frontMain/surveyList']);
          console.log('提交的資料:', payload);
        } else {
          // 後端返回的錯誤處理
          console.error('後端錯誤:', res.message);
          alert(`儲存失敗: ${res.message}`);
        }
      },
      error: (err) => {
        // 發生網絡或伺服器錯誤
        console.error('提交失敗:', err);
        alert('提交失敗，請稍後再試！');
      },
    });
  }

  // 將答案轉換為符合 API 的結構
  constructAnswers(answers: any): any {
    const formattedAnswers: any = {};
    for (const questionId in answers) {
      const answer = answers[questionId];
      if (Array.isArray(answer)) {
        // 多選題答案
        formattedAnswers[questionId] = answer;
      } else {
        // 單選題或填充題答案，包裝成陣列
        formattedAnswers[questionId] = [answer];
      }
    }
    return formattedAnswers;
  }


  // 返回問卷填寫頁
  backToList() {
    this.router.navigate(['/frontMain/surveyList']);
  }

}
