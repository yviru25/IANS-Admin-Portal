import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityMgmtComponent } from './city-mgmt.component';

describe('CityMgmtComponent', () => {
  let component: CityMgmtComponent;
  let fixture: ComponentFixture<CityMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
