import { Router } from '@angular/router';
import { TestDataService } from './../../../@services/test-data-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-readonly',
  standalone: true,
  imports: [],
  templateUrl: './back-readonly.component.html',
  styleUrl: './back-readonly.component.scss'
})
export class BackReadonlyComponent {

  constructor( private testDataService: TestDataService, private router : Router){}

  survey:any = {};

  ngOnInit():void{
    this.survey = this.testDataService.getTestSurvey2()
  }

  backToList(){
    this.router.navigateByUrl('/backMain')
  }

}
