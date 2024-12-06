import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { Chart } from 'chart.js/auto'
import { HttpClient } from '@angular/common/http';
import { Router as AppRouter, ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-back-feedback',
  standalone: true,
  imports: [MatSlideToggleModule,MatSelectModule, MatFormFieldModule, MatTableModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatPaginatorModule,MatTableModule, FormsModule,
  CommonModule, RouterLink, MatTabsModule],
  templateUrl: './back-feedback.component.html',
  styleUrl: './back-feedback.component.scss'
})

export class BackFeedbackComponent {

  displayedColumns: string[] = ['id', 'name', 'time', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);
  quizId!: number; // 問卷 ID
  title!: string; // 問卷標題


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClientService
  ) { }


  ngOnInit(): void {
    // 從 URL 中獲取 quizId
    this.route.queryParams.subscribe((params) => {
      this.quizId = +params['quizId'];

      if (!this.quizId) {
        alert('未指定問卷 ID 或問卷標題，返回列表頁！');
        this.router.navigate(['/backMain/backList']);
      } else {
        this.loadFeedback(); // 加載回饋數據
      }
    });
  }


  // 加載問卷回饋數據
  loadFeedback(): void {
    const url = `http://localhost:8080/quiz/feedback?quizId=${this.quizId}`;
    this.http.getApi <{ code: number; feedbackDtoList: any[] }> (url).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.feedbackDtoList) {
          this.dataSource.data = this.groupFeedback(res.feedbackDtoList);
          console.log('回饋數據:', this.dataSource);
        } else {
          console.error('回饋數據加載失敗:', res.message);
        }
      },
      error: (err) => {
        console.error('API 請求失敗:', err);
      },
    });
  }

  // 格式化數據
  groupFeedback(feedbackList: any[]): any[] {
    const grouped = feedbackList.reduce((acc, item) => {
      const key = `${item.email}-${item.fillinDate}`;
      if (!acc[key]) {
        acc[key] = {
          name: item.userName,
          email: item.email,
          phone: item.phone,
          age: item.age,
          time: item.fillinDate,
          quizName: item.quizName,
          quizDesc: item.quizDesc,
          answers: [],
        };
      }
      acc[key].answers.push({ question: item.questionTitle, answer: JSON.parse(item.answerStr) });
      return acc;
    }, {});
    return Object.values(grouped);
  }


  // 查看個人回復
  viewIndividualFeedback(feedback: any): void {
    this.router.navigate(['/backMain/backConfirm'], {
      queryParams: { quizId: this.quizId },
      state: { feedback },
    });
  }

  // 點擊 "查看統計總表" 按鈕
  toChart(): void {
    this.router.navigate(['/backMain/chart'], { queryParams: { quizId: this.quizId , source: 'back'} });
  }


  backToList(){
    this.router.navigateByUrl('/backMain');
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // 以下是資料排列的code
    // 前面要寫 "this.dataSource.data =" 是因為要把原本的資料取代成已排序的樣子
    // 數字、英文接可以排序
    // 當希望順序相反，可以將1和-1對調，或者<和>對調
    // "function (a,b)" 跟 "(a,b) =>" 是一樣的，只是寫法不同，但兩個不能共用
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      if (a.id < b.id) {
        return 1;
      }
      if (a.id > b.id) {
        return -1;
      }
      return 0;
    });

  }




}


