import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { CityModel } from './table-config/city.model';
import { CityData } from './table-config/data';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';


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
              public formBuilder: FormBuilder, private spiner: NgxSpinnerService,
              private apiService: ApiService) {
    this.statetables$ = service.tables$;
    this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'State Management', active: true }];
    // this.tableData = CityData;
    this.getCityList();
    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }

  getCityList() {
    this.spiner.show();
    this.apiService.sendGetRequest('getCities').subscribe( (res) => {
      this.spiner.hide();
      this.tableData = res; 
         
    });
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


  editCityPopupForm(tabelDataModel: CityModel, editCntrycenterDataModal: any) {
      this.modalService.open(editCntrycenterDataModal, { centered: true });
      this.updateCityForm = this.formBuilder.group({
        cityId: tabelDataModel.cityId,
        cityCode: [tabelDataModel.cityCode, [Validators.required]],
        cityName: [tabelDataModel.cityName, [Validators.required]],
        stateName: [{value: tabelDataModel.iansState.stateName, disabled: true}, [Validators.required]],
        iansState: {
          stateId: tabelDataModel.iansState.stateId
        }
      });
  }

  addStatePopupForm(tabelDataModel: CityModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
  }

  submitUpdateCityForm() {
    this.spiner.show();
    this.apiService.sendPostFormRequest('iansCities', this.updateCityForm.value).subscribe((res) => {
         this.spiner.hide();
         Swal.fire(
           'Updated!',
           'City has been Updated.',
           'success'
         ).then( okay => {
           if (okay) {
             window.location.reload();
           }
       });

    })
  }

  submitAddStateForm() {

  }

  deleteCity(tabelDataModel: CityModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete City Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('iansCities/' + tabelDataModel.cityId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'City has been removed successfully.',
                  'success'
                ).then( okay => {
                  if (okay) {
                    window.location.reload();
                  }
              });
        });
      }
    });
  }

}
