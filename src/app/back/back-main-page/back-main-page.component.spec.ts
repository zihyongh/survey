import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackMainPageComponent } from './back-main-page.component';

describe('BackMainPageComponent', () => {
  let component: BackMainPageComponent;
  let fixture: ComponentFixture<BackMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
