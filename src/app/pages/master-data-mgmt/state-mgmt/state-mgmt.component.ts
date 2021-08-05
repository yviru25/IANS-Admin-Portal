import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { StateModel } from './table-config/state.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedSortableDirective, SortEvent } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateData } from './table-config/data';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-state-mgmt',
  templateUrl: './state-mgmt.component.html',
  styleUrls: ['./state-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class StateMgmtComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tableData: StateModel[];
  statetables$: Observable<StateModel[]>;
  total$: Observable<number>;
  updateStateForm: FormGroup;
  addCityForm: FormGroup;

  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private modalService: NgbModal,
              public formBuilder: FormBuilder) {
    this.statetables$ = service.tables$;
    this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'State Management', active: true }];
    this.tableData = [
      {
        stateCode: 'UP',
        stateName: 'Uttar Pradesh',
        countryName: 'India'
      },
    ];


    this.addCityForm = this.formBuilder.group({
      cityCode: ['', [Validators.required]],
      cityName: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
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


  get updateStateFormControls() {
    return this.updateStateForm.controls;
  }

  get addCityFormControls() {
    return this.addCityForm.controls;
  }

  editStatePopupForm(tabelDataModel: StateModel, editCntrycenterDataModal: any) {
      this.modalService.open(editCntrycenterDataModal, { centered: true });
      this.updateStateForm = this.formBuilder.group({
        stateCode: [tabelDataModel.stateCode, [Validators.required]],
        stateName: [tabelDataModel.stateName, [Validators.required]],
        countryName: [tabelDataModel.countryName, [Validators.required]],
      });
  }

  addStatePopupForm(tabelDataModel: StateModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
}

  submitUpdateCountryForm() {
    console.log(this.updateStateForm.value);
  }

  submitAddStateForm() {

  }

}
