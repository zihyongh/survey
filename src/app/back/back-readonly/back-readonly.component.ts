import { Router } from '@angular/router';
import { TestDataService } from './../../../@services/test-data-service';
import { Component } from '@angular/core';
import { HttpClientService } from '../../../@services/http-client.service';
import { ReadonlyService } from '../../../@services/readonly-service';

@Component({
  selector: 'app-back-readonly',
  standalone: true,
  imports: [],
  templateUrl: './back-readonly.component.html',
  styleUrl: './back-readonly.component.scss'
})
export class BackReadonlyComponent {

  constructor(
    private testDataService: TestDataService,
    private router : Router,
    private http: HttpClientService,

  ){}

  survey:any = {};

  ngOnInit():void{
    this.survey = this.testDataService.getTestSurvey2()
  }

  backToList(){
    this.router.navigateByUrl('/backMain')
  }



}
