import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-total-chart-demo',
  standalone: true,
  imports: [],
  templateUrl: './total-chart-demo.component.html',
  styleUrl: './total-chart-demo.component.scss'
})

export class TotalChartDemoComponent {
  @Input() dataId!: string;
  @Input() questData!: any;

  ngAfterViewInit(): void {
    if (this.questData.questionType != 'text') {
      this.showPie();
    }

  }



  // 顯示圓餅圖
  showPie(): void {
    const ctx = document.getElementById(this.dataId) as HTMLCanvasElement;
    if (ctx) {
      const data = {
        labels: this.questData.labels,
        datasets: [
          {
            data: this.questData.data,
            backgroundColor: this.questData.color,
            hoverOffset: 10,
          },
        ],
      };

      new Chart(ctx, {
        type: 'pie',
        data: data,
      });
    }
  }
}

