import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../../@services/http-client.service';
import { ChartDemoComponent } from '../main/front-chart/chart-demo/chart-demo.component';

@Component({
  selector: 'app-total-chart',
  standalone: true,
  imports: [ChartDemoComponent],
  templateUrl: './total-chart.component.html',
  styleUrl: './total-chart.component.scss'
})

export class TotalChartComponent {
  survey: any = {};         // 問卷資料
  quizId!: number;          // 問卷 ID
  title!: string;           // 問卷標題
  source: string = '';      // 用於判斷是前台還是後台

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClientService
  ) {}

  ngOnInit(): void {
    // 從 URL 獲取 quizId
    this.route.queryParams.subscribe((params) => {
      this.quizId = +params['quizId'];
      this.source = params['source'];           // 獲取 source 參數

      if (!this.quizId) {
        alert('未指定問卷 ID 或問卷標題，返回列表頁！');
        this.router.navigate(['/backMain/backList']);
      } else {
        this.loadStatistics(); // 加載統計資料
      }
    });
  }

  // 加載統計資料
  loadStatistics(): void {
    const url = `http://localhost:8080/quiz/statistics?quizId=${this.quizId}`;
    this.http.getApi<{ code: number; message: String, statisticsVoList: any[] }>(url).subscribe({
      next: (res) => {
        if (res.code == 200 && res.statisticsVoList) {
          this.survey = this.processStatistics(res.statisticsVoList);
          console.log("圖表數據",this.survey);
        } else {
          console.error('統計數據加載失敗:', res.message);
        }
      },
      error: (err) => {
        console.error('API 請求失敗:', err);
        alert('無法加載統計數據，請稍後再試！');
      },
    });
  }

  // 處理統計數據
  processStatistics(statisticsVoList: any[]): any {
    const processedData = {
      questionData: statisticsVoList.map((item) => {
        const labels = Object.keys(item.optionCountMap || {});
        const data = Object.values(item.optionCountMap || {});
        return {
          title: item.quizTitle,
          questionId: item.questionId,
          questionType: item.questionType,
          questionTitle: item.questionTitle || '未知題目',
          labels,
          data,
          color: labels.map(() => this.getRandomColor()), // 為選項生成隨機顏色
        };
      }),
    };
    return processedData;
  }

  // 生成隨機顏色
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // 返回按鈕的處理邏輯
  back(): void {
    if (this.source == 'back') {
      // 後台返回到回饋頁
      this.router.navigate(['/backMain/backFeedback'], {
        queryParams: { quizId: this.quizId },
      });
    } else if (this.source == 'front') {
      // 前台返回到問卷列表
      this.router.navigate(['/frontMain/surveyList']);
    }
  }


}

