import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDemoComponent } from './chart-demo/chart-demo.component';

@Component({
  selector: 'app-chart-data',
  standalone: true,
  imports: [ChartDemoComponent],
  templateUrl: './chart-data.component.html',
  styleUrl: './chart-data.component.scss'
})
export class ChartDataComponent {

  constructor(private router: Router){}

  survey = {
    title: '你的寵物調查',
    describe: '問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明',
    startDate:'2024-11-01',
    endDate:'2024-12-25',
    questionData: [{
        questionId: '1',
        questionType: 't',
        questionTitle: '你家寵物的名字?',
        labels:[],
        data:['阿呆','阿狗','阿胖'],
        color:['#4679E8','#46E0E8','#763DEB']
      },
      {
        questionId: '2',
        questionType: 's',
        questionTitle: '他是?',
        labels:['貓','狗','其他'],
        data:[3000,200,100],
        color:['#4679E8','#46E0E8','#763DEB']

      },
      {
        questionId: '3',
        questionType: 'm',
        questionTitle: '他會做什麼?',
        labels:['擊掌','握手','跳圈圈'],
        data:[3000,2000,400],
        color:['#4679E8','#46E0E8','#763DEB']
      }
    ]
  }



  backToSurvey() {
    this.router.navigate(['/backMain/backFeedback']);      // 返回問卷回饋
  }
}
