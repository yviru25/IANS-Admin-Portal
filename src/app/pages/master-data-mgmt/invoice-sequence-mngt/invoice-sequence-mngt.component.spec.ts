import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSequenceMngtComponent } from './invoice-sequence-mngt.component';

describe('InvoiceSequenceMngtComponent', () => {
  let component: InvoiceSequenceMngtComponent;
  let fixture: ComponentFixture<InvoiceSequenceMngtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSequenceMngtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSequenceMngtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
