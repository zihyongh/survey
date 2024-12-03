import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontMainPageComponent } from './front-main-page.component';

describe('FrontMainPageComponent', () => {
  let component: FrontMainPageComponent;
  let fixture: ComponentFixture<FrontMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
