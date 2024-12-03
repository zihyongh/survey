import { Routes } from '@angular/router';
import { LoginComponent } from './main/login/login.component';
import { SurveyListComponent } from './main/survey-list/survey-list.component';
import { BackListComponent } from './back/back-list/back-list.component';
import { SurveyWriteComponent } from './main/survey-write/survey-write.component';
import { AnswerPreviewComponent } from './main/answer-preview/answer-preview.component';
import { FrontChartComponent } from './main/front-chart/front-chart.component';
import { BackCreateComponent } from './back/back-create/back-create.component';
import { BackEditComponent } from './back/back-edit/back-edit.component';
import { BackFeedbackComponent } from './back/back-feedback/back-feedback.component';
import { BackMainPageComponent } from './back/back-main-page/back-main-page.component';
import { ConfirmComponent } from './back/confirm/confirm.component';
import { ChartDataComponent } from './chart-data/chart-data.component';
import { FrontMainPageComponent } from './main/front-main-page/front-main-page.component';
import { BackReadonlyComponent } from './back/back-readonly/back-readonly.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'frontMain', component: FrontMainPageComponent,
    children:[
      { path: '', redirectTo: 'surveyList', pathMatch: 'full' },
      { path: 'surveyList', component: SurveyListComponent },
      { path: 'surveyWrite', component: SurveyWriteComponent },
      { path: 'answerPreview', component: AnswerPreviewComponent},
      { path: 'chart', component: FrontChartComponent},
      { path: 'frontChart', component: FrontChartComponent},
    ]
  },
  { path: 'backMain' , component: BackMainPageComponent,
      children:[
        { path: '', redirectTo: 'backList', pathMatch: 'full' },
        { path: 'backList', component: BackListComponent },
        { path: 'backEdit', component: BackEditComponent },
        { path: 'backCreate', component: BackCreateComponent },
        { path: 'backFeedback', component: BackFeedbackComponent },
        { path: 'backConfirm', component: ConfirmComponent },
        { path: 'backReadonly', component: BackReadonlyComponent },
      ]
  },
  { path: 'chartData', component: ChartDataComponent},
  { path: '', redirectTo: '/frontMain', pathMatch: 'full' }
];

