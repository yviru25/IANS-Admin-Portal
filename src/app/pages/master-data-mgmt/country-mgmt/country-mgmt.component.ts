import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortEvent, AdvancedSortableDirective } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { Observable } from 'rxjs';
import { CountryModel } from './table-config/country.model';
import { tableData } from './table-config/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormGroupName } from '@angular/forms';

@Component({
  selector: 'app-country-mgmt',
  templateUrl: './country-mgmt.component.html',
  styleUrls: ['./country-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CountryMgmtComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  tableData: CountryModel[];
  tables$: Observable<CountryModel[]>;
  total$: Observable<number>;
  addCountryForm: FormGroup;
  updateCountryForm: FormGroup;
  addStateForm: FormGroup;

  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private modalService: NgbModal,
              public formBuilder: FormBuilder) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Quick Service', active: true }];
    this.tableData = tableData;


    this.addCountryForm = this.formBuilder.group({
      countryCode: ['', [Validators.required]],
      countryName: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });


    this.addStateForm = this.formBuilder.group({
      stateCode: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
      countryName: ['', [Validators.required]],
    });

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }


  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  openAddCountryModel(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  addCountry(): void {
    this.rangesubmit = true;
    console.log(this.addCountryForm.value);
  }
  get countryFormControls() {
    return this.addCountryForm.controls;
  }

  get updateCountryFormControls() {
    return this.updateCountryForm.controls;
  }

  get addStateFormControls() {
    return this.addStateForm.controls;
  }

  editCountryPopupForm(tabelDataModel: CountryModel, editCntrycenterDataModal: any) {
      this.modalService.open(editCntrycenterDataModal, { centered: true });
      this.updateCountryForm = this.formBuilder.group({
        countryCode: [tabelDataModel.countryCode, [Validators.required]],
        countryName: [tabelDataModel.countryName, [Validators.required]],
        currency: [tabelDataModel.currency, [Validators.required]],
      });
  }

  addStatePopupForm(tabelDataModel: CountryModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
}

  submitUpdateCountryForm() {
    console.log(this.updateCountryForm.value);
  }

  submitAddStateForm() {

  }

}
