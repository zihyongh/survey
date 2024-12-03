import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AnswerService {

  private answers: any = null;

 constructor(){};

  // 設定答案
  setAnswerData(data: any): void {
    this.answers = data;
    console.log('答案已儲存:', this.answers);
  }

  // 獲取答案
  getAnswerData(): any {
    return this.answers;
  }

  // 清除答案
  clearAnswerData(): void {
    this.answers = null;
  }


}
