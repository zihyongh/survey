import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ReadonlyService {

  private preLoadSurvey : any;       // 用來儲存選中的問卷資料


  setSurvey(survey: any){
    this.preLoadSurvey = survey;
  }

  getSurvey(){
    return this.preLoadSurvey;
  }

  resetSurvey() {
    this.preLoadSurvey = null;
  }

}
