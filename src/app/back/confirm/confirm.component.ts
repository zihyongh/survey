import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Router as AppRouter, ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})

export class BackConfirmComponent {
  feedback: any;      // 問卷ID
  quizId!: number;    // 個人填寫回饋

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.feedback = navigation?.extras.state?.['feedback'];
    if (!this.feedback) {
      alert('無法獲取資料，請返回回饋頁面！');
      this.router.navigate(['/backMain/backFeedback']);
    }
  }


  ngOnInit(): void {
    // 獲取 quizId
    this.route.queryParams.subscribe((params) => {
      this.quizId = +params['quizId'];
      if (!this.quizId || !this.feedback) {
        alert('無法獲取資料，請返回回饋頁面！');
        this.router.navigate(['/backMain/backFeedback'], { queryParams: { quizId: this.quizId } });
      }
    });
  }

  // ngOnInit(): void {
  //   // 從 URL 中獲取 quizId 和 email
  //   this.route.queryParams.subscribe((params) => {
  //     this.quizId = +params['quizId'];
  //     this.email = params['email'];

  //     if (!this.quizId || !this.email) {
  //       alert('無法獲取問卷 ID 或 Email，請返回問卷列表！');
  //       this.router.navigate(['/backMain/backFeedback']);
  //     } else {
  //       this.loadUserFeedback(); // 加載個人填寫數據
  //     }
  //   });
  // }

  // // 加載個人填寫數據
  // loadUserFeedback(): void {
  //   const url = `http://localhost:8080/quiz/feedback?quizId=${this.quizId}`;
  //   this.http.getApi<{ code: number; feedbackDtoList: any[] }>(url).subscribe({
  //     next: (res) => {
  //       if (res.code === 200 && res.feedbackDtoList) {
  //         this.processFeedbackData(res.feedbackDtoList);
  //       } else {
  //         alert('無法加載用戶填寫數據');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('API 請求失敗:', err);
  //       alert('加載用戶填寫數據失敗');
  //     }
  //   });
  // }

  // // 處理回饋數據
  // processFeedbackData(feedbackList: any[]): void {
  //   const userFeedback = feedbackList.filter(item => item.email === this.email);
  //   if (userFeedback.length > 0) {
  //     const firstRecord = userFeedback[0]; // 提取用戶基本信息
  //     this.userInfo = {
  //       name: firstRecord.userName,
  //       phone: firstRecord.phone,
  //       email: firstRecord.email,
  //       age: firstRecord.age,
  //     };

  //     this.userAnswers = userFeedback.map((item) => ({
  //       questionTitle: item.questionTitle,
  //       answer: JSON.parse(item.answerStr).join(', '), // 格式化答案
  //     }));
  //   } else {
  //     alert('找不到該用戶的回饋數據');
  //   }
  // }

  // 返回到問卷回饋頁面
  backToFeedback(): void {
    this.router.navigate(['/backMain/backFeedback'], { queryParams: { quizId: this.quizId } });
  }
}
