import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMgmtComponent } from './country-mgmt.component';

describe('CountryMgmtComponent', () => {
  let component: CountryMgmtComponent;
  let fixture: ComponentFixture<CountryMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
