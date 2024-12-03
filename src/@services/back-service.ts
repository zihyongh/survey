import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BackService {

  // 用於存儲當前問卷的資料
  BackAnswer: any = {};

  // 假設服務端支援多問卷，這裡可以改用陣列管理所有問卷
  private surveys: any[] = [];

  // 保存或更新問卷
  saveSurvey(survey: any): void {
    const index = this.surveys.findIndex(s => s.title === survey.title); // 假設以 `title` 唯一標識問卷
    if (index !== -1) {
      // 如果問卷已存在，進行更新
      this.surveys[index] = survey;
    } else {
      // 如果是新問卷，新增到陣列
      this.surveys.push(survey);
    }

    // 同步更新當前的問卷
    this.BackAnswer = survey;
    console.log('問卷已保存:', this.surveys);
  }

  // 獲取當前問卷
  getSurvey(): any {
    return this.BackAnswer;
  }

  // 獲取所有問卷（可選）
  getAllSurveys(): any[] {
    return this.surveys;
  }

  // 清空當前問卷（可選）
  clearCurrentSurvey(): void {
    this.BackAnswer = {};
  }
}

