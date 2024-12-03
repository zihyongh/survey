import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackReadonlyComponent } from './back-readonly.component';

describe('BackReadonlyComponent', () => {
  let component: BackReadonlyComponent;
  let fixture: ComponentFixture<BackReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
