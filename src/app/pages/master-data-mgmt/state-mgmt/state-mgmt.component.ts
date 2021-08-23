import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { StateModel } from './table-config/state.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedSortableDirective, SortEvent } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateData } from './table-config/data';
import { DecimalPipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';


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
              public formBuilder: FormBuilder, private spiner: NgxSpinnerService,
              private apiService: ApiService) {
    /* this.statetables$ = service.tables$;
    this.total$ = service.total$; */
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'State Management', active: true }];
    this.getStateList();


    

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }

  getStateList() {
    this.spiner.show();
    this.apiService.sendGetRequest('getStates').subscribe( (res) => {
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


  get updateStateFormControls() {
    return this.updateStateForm.controls;
  }

  get addCityFormControls() {
    return this.addCityForm.controls;
  }

  editStatePopupForm(tabelDataModel: StateModel, editCntrycenterDataModal: any) {
      this.modalService.open(editCntrycenterDataModal, { centered: true });
      this.updateStateForm = this.formBuilder.group({
        iansCountry: {
          countryId: tabelDataModel.iansCountry.countryId
        },
        stateId: tabelDataModel.stateId,
        stateCode: [tabelDataModel.stateCode, [Validators.required]],
        stateName: [tabelDataModel.stateName, [Validators.required]],
        countryName: [{value: tabelDataModel.iansCountry.countryName, disabled: true}, [Validators.required]],
      });
  }

  addCityPopupForm(tabelDataModel: StateModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
    this.addCityForm = this.formBuilder.group({
      cityCode: ['', [Validators.required]],
      cityName: ['', [Validators.required]],
      stateName: [{value: tabelDataModel.stateName, disabled: true}, [Validators.required]],
      iansState: {
        stateId: tabelDataModel.stateId
      }
    });
}

  submitUpdateStateForm() {
    this.spiner.show();
    this.apiService.sendPostFormRequest('iansStates', this.updateStateForm.value).subscribe((res) => {
         this.spiner.hide();
         Swal.fire(
           'Updated!',
           'State has been Updated.',
           'success'
         ).then( okay => {
           if (okay) {
             window.location.reload();
           }
       });

    })
  }

  submitAddCityForm() {
    this.spiner.show();
    this.apiService.sendPostFormRequest('iansCities', this.addCityForm.value).subscribe((res) => {
         this.spiner.hide();
         Swal.fire(
           'Added!',
           'City has been added.',
           'success'
         ).then( okay => {
           if (okay) {
             window.location.reload();
           }
       });

    })
  }


  deleteState(tabelDataModel: StateModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete State Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('iansStates/' + tabelDataModel.stateId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'State has been removed successfully.',
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
