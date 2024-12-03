import { EditService } from './../../../@services/edit-service';
import { DateService } from './../../../@services/date-service';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [RouterLink, MatSlideToggleModule,MatSelectModule,
    MatFormFieldModule, MatTableModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatPaginatorModule,
    MatTableModule, FormsModule, CommonModule],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss'
})


export class SurveyListComponent {

  displayedColumns: string[] = ['id', 'title', 'status', 'start', 'end', 'result'];

  // 跟下方資料串聯
  dataSource = new MatTableDataSource<Quiz>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dateService: DateService,
    private router: Router,
    private http: HttpClientService
  ) { }






  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // 以下是資料排列的code
    // 前面要寫 "this.dataSource.data =" 是因為要把原本的資料取代成已排序的樣子
    // 數字、英文接可以排序
    // 當希望順序相反，可以將1和-1對調，或者<和>對調
    // "function (a,b)" 跟 "(a,b) =>" 是一樣的，只是寫法不同，但兩個不能共用
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

  }



  // 以下是搜尋的code
  inputName!: string;
  inputStartDate!: string;
  inputEndDate!: string;
  minDate!: string;
  maxDate!: string;
  eMaxDate!: string;




  // 下面是搜尋框輸入的條件
  ngOnInIt(): void {
    // 設定選取日期最小值為當天
    this.minDate = this.dateService.changeDateFormat(new Date(), '/');
    // 設定選取日期最大值為當天+30天
    this.maxDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 180));

    this.loadQuizzes(); // 呼叫方法從後端獲取數據
  }

  // 隨開始日期變動，改變結束日期
  changeSDate() {
    this.eMaxDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(this.inputStartDate), 2));
  }





  // 從後端獲取問卷數據
  loadQuizzes(): void {
    this.http.getApi<{ code: number; message: string; quizList: any[] }>('http://localhost:8080/quiz/all')
      .subscribe({
        next: (res) => {
          if (res.code == 200 && res.quizList) {
            // 格式化後端數據到前端格式
            const formattedData = res.quizList.map((quiz) => ({
              id: quiz.id,
              title: quiz.title,
              status: this.getStatus(quiz.startDate, quiz.endDate, quiz.published),
              start: quiz.startDate,
              end: quiz.endDate
            }));
            this.dataSource.data = formattedData; // 更新表格數據
          }
          else {
            console.error('後端返回數據格式不正確:', res);
          }
        },
        error: (err) => {
          console.error('加載問卷列表失敗:', err);
          // 在界面上顯示錯誤通知（根據需求顯示）
          alert('無法加載問卷列表，請稍後再試。');
        }
      });
  }

  // 根據日期和發布狀態計算問卷狀態
  getStatus(startDate: string, endDate: string, published: boolean): string {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return '未開始';
    } else if (today >= start && today <= end) {
      return '進行中';
    } else {
      return '已結束';
    }
  }


  searchSurveys(): void {
    // 檢查輸入的搜尋條件
    const searchCriteria = {
      title: this.inputName || "", // 若無輸入，傳空字串
      startDate: this.inputStartDate || null, // 若無輸入，傳 null
      endDate: this.inputEndDate || null, // 若無輸入，傳 null
    };


    // 呼叫後端搜尋 API
    this.http.postApi('http://localhost:8080/quiz/search', searchCriteria)
      .subscribe({
        next: (response: any) => {
          console.log('搜尋結果:', response);
          // 更新資料表
          if (response && response.quizList) {
            this.dataSource.data = response.quizList.map((quiz: any) => ({
              id: quiz.id,
              title: quiz.title,
              status: this.getStatus(quiz.startDate, quiz.endDate, quiz.published), // 根據日期計算狀態
              start: quiz.startDate,
              end: quiz.endDate,
            }));
          } else {
            this.dataSource.data = [];
          }
        },
        error: (err) => {
          console.error('搜尋失敗:', err);
        }
      });
  }

}




export interface Quiz {
  id: number;
  title: string;
  status: string;     // "已結束"、"進行中"、"未發布"
  start: string;      // Start date
  end: string;        // End date
}


