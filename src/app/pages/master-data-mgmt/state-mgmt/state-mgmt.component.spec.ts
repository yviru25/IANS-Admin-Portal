import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMgmtComponent } from './state-mgmt.component';

describe('StateMgmtComponent', () => {
  let component: StateMgmtComponent;
  let fixture: ComponentFixture<StateMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
