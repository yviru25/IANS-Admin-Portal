import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { CityModel } from './table-config/city.model';
import { CityData } from './table-config/data';

@Component({
  selector: 'app-city-mgmt',
  templateUrl: './city-mgmt.component.html',
  styleUrls: ['./city-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CityMgmtComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tableData: CityModel[];
  statetables$: Observable<CityModel[]>;
  total$: Observable<number>;
  updateCityForm: FormGroup;

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
    this.tableData = CityData;

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


  get updateCityFormControls() {
    return this.updateCityForm.controls;
  }


  editStatePopupForm(tabelDataModel: CityModel, editCntrycenterDataModal: any) {
      this.modalService.open(editCntrycenterDataModal, { centered: true });
      this.updateCityForm = this.formBuilder.group({
        cityCode: [tabelDataModel.cityCode, [Validators.required]],
        cityName: [tabelDataModel.cityName, [Validators.required]],
        stateName: [tabelDataModel.stateName, [Validators.required]],
      });
  }

  addStatePopupForm(tabelDataModel: CityModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
}

  submitUpdateCountryForm() {
    console.log(this.updateCityForm.value);
  }

  submitAddStateForm() {

  }

}
