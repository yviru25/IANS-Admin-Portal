import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMgmtComponent } from './customer-mgmt.component';

describe('CustomerMgmtComponent', () => {
  let component: CustomerMgmtComponent;
  let fixture: ComponentFixture<CustomerMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
