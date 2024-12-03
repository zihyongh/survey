import { TestDataService } from './../../../@services/test-data-service';
import { Component } from '@angular/core';
import { AnswerService } from '../../../@services/answer-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})

export class ConfirmComponent {

  confirmSurvey: any = {}; // 問卷資料
  confirmAnswers: any = {}; // 答案資料

  constructor(private testDataService: TestDataService,private router: Router){}

  ngOnInit():void{
    this.confirmSurvey = this.testDataService.getTestSurvey2(); // 獲取問卷資料
    this.confirmAnswers = this.testDataService.getAnswers();   // 獲取答案資料
    console.log('問卷:', this.confirmSurvey);
    console.log('答案:', this.confirmAnswers);
  }

  // 根據 questionId 查找答案
  getAnswerByQuestionId(questionId: number): string | string[] | undefined {
    return this.confirmAnswers.surveyAns.find(
      (ans: { questionId: number; answer: string | string[] }) => ans.questionId === questionId
    )?.answer;
  }



  backToSurvey() {
    this.router.navigate(['/backMain/backFeedback']);      // 返回問卷回饋
  }

  // saveToList(){
  //   this.answerService.clearAnswerData();               // 最後儲存時要把serice裡面的東西清掉
  //   this.router.navigate(['/surveyList']);              // 返回問卷列表
  // }
}
