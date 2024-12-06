import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalChartDemoComponent } from './total-chart-demo.component';

describe('TotalChartDemoComponent', () => {
  let component: TotalChartDemoComponent;
  let fixture: ComponentFixture<TotalChartDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalChartDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalChartDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
