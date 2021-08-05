import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMgmtComponent } from './service-mgmt.component';

describe('ServiceMgmtComponent', () => {
  let component: ServiceMgmtComponent;
  let fixture: ComponentFixture<ServiceMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
