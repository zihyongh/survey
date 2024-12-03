import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TestDataService {

  private testSurvey1 = {
    title: '明星調查',
    description: '問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明',
    startDate: '2024-11-01',
    endDate: '2024-12-25',
    questionData: [{
      questionId: 1,
      questionTitle: '你最喜歡的明星?',
      questionType: 'single',
      required: true,
      questionContent: [
        { optionName: '1', option: 'BlackPink' },
        { optionName: '2', option: 'BTS' },
        { optionName: '3', option: 'IU' }
      ]
    },
    {
      questionId: 2,
      questionTitle: '最喜歡他的什麼特質?',
      questionType: 'text',
      required: true,
      questionContent: '',          // 這裡就算沒有值，也不能空著，不然程式會報錯
    },
    {
      questionId: 3,
      questionTitle: '他在做什麼?',
      questionType: 'multi',
      required: false,
      questionContent: [
        { optionName: '1', option: '唱歌' },
        { optionName: '2', option: '跳舞' },
        { optionName: '3', option: '出去玩' }
      ]
    }
    ]
  }

  getTestSurvey1() {
    return this.testSurvey1;
  }


  private testSurvey2 = {
    title: '你的寵物調查',
    describe: '問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明問卷說明',
    startDate: '2024-11-01',
    endDate: '2024-12-25',
    questionData: [{
      questionId: 1,
      questionTitle: '你家寵物的名字?',
      questionType: 'text',
      required: true,
      questionContent: '',          // 這裡就算沒有值，也不能空著，不然程式會報錯
    },
    {
      questionId: 2,
      questionTitle: '他是?',
      questionType: 'single',
      required: true,
      questionContent: [
        { optionName: '1', option: '貓' },
        { optionName: '2', option: '狗' },
        { optionName: '3', option: '其他' }
      ]
    },
    {
      questionId: 3,
      questionTitle: '他會做什麼?',
      questionType: 'multi',
      required: false,
      questionContent: [
        { optionName: '1', option: '擊掌' },
        { optionName: '2', option: '握手' },
        { optionName: '3', option: '跳圈圈' }
      ]
    }
    ]

  }

  private answers = {
    name: '阿豬',
    age: 44,
    email: 'aa@dd',
    phone: '090000000',
    surveyAns: [
      { questionId: 1, answer: '阿呆' },      // 填空題
      { questionId: 2, answer: '2' },        // 單選題
      { questionId: 3, answer: ['1', '2'] }  // 多選題
    ]
  };

  getTestSurvey2() {
    return this.testSurvey2;
  }

  getAnswers(){
    return this.answers;
  }


}
