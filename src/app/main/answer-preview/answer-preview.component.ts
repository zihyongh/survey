import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnswerService } from '../../../@services/answer-service';
import { Router } from '@angular/router';
import { TestDataService } from '../../../@services/test-data-service';

@Component({
  selector: 'app-answer-preview',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule,],
  templateUrl: './answer-preview.component.html',
  styleUrl: './answer-preview.component.scss'
})
export class AnswerPreviewComponent {

  previewAns: any = {};   // 答案資料
  survey: any = {};       // 題目資料

  constructor(private answerService:AnswerService,
    private router: Router,
    private testDataService: TestDataService
  ){}

  ngOnInit():void{
    this.survey = this.testDataService.getTestSurvey1(); // 獲取問卷資料
    this.previewAns = this.answerService.getAnswerData();
    console.log('預覽的答案:',this.previewAns);
  }

  // 根據 questionId 獲取答案
  getAnswerByQuestionId(questionId: number): string | string[] | undefined {
    const answerEntry = this.previewAns.surveyAns.find((ans: any) => ans.questionId == questionId);
    return answerEntry ? answerEntry.answer : undefined; // 如果找不到，返回 undefined
  }

  // 返回問卷填寫頁
  backToSurvey() {
    this.router.navigate(['/frontMain/surveyWrite']);             // 返回問卷填寫頁
  }

  // 最終儲存並清空暫存
  saveToList(){
    this.answerService.clearAnswerData();               // 最後儲存時要把serice裡面的東西清掉
    this.router.navigate(['/frontMain/surveyList']);              // 返回問卷列表
  }
}
