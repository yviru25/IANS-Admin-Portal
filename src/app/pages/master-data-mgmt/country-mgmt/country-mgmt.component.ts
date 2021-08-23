import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortEvent, AdvancedSortableDirective } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { Observable } from 'rxjs';
import { CountryModel } from './table-config/country.model';
import { tableData } from './table-config/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormGroupName } from '@angular/forms';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country-mgmt',
  templateUrl: './country-mgmt.component.html',
  styleUrls: ['./country-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CountryMgmtComponent implements OnInit {
  serviceName = 'iansCountries';
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
              public formBuilder: FormBuilder, private spiner: NgxSpinnerService,
              private apiService: ApiService) {
    // this.tables$ = service.tables$;
    // this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Quick Service', active: true }];
    this.getCountryList();


    this.addCountryForm = this.formBuilder.group({
      countryCode: ['', [Validators.required]],
      countryName: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }

  getCountryList() {
    this.spiner.show();
    this.apiService.sendGetRequest(this.serviceName).subscribe( (res) => {
      this.spiner.hide();
      this.tableData = res._embedded.iansCountries;    
         
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

  addCountry(): void {
     this.spiner.show();
     this.apiService.sendPostFormRequest(this.serviceName, this.addCountryForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Added!',
            'Country has been added.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
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
        countryId: [tabelDataModel.countryId],
        countryCode: [tabelDataModel.countryCode, [Validators.required]],
        countryName: [tabelDataModel.countryName, [Validators.required]],
        currency: [tabelDataModel.currency, [Validators.required]],
      });
  }

  addStatePopupForm(tabelDataModel: CountryModel, addStatecenterDataModal: any) {
    this.modalService.open(addStatecenterDataModal, { centered: true });
    this.addStateForm = this.formBuilder.group({
      iansCountry: {
        countryId: tabelDataModel.countryId
      },
      stateCode: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
      countryName: [{value: tabelDataModel.countryName, disabled: true}, [Validators.required]],
    });
}

  submitUpdateCountryForm() {
    this.spiner.show();
     this.apiService.sendPostFormRequest(this.serviceName, this.updateCountryForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Updated!',
            'Country has been Updated.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }

  deleteCountry(tabelDataModel: CountryModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Country Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest(this.serviceName+ '/' + tabelDataModel.countryId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Country has been removed successfully.',
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

  submitAddStateForm() {
    this.spiner.show();
    this.apiService.sendPostFormRequest('iansStates', this.addStateForm.value).subscribe((res) => {
         this.spiner.hide();
         Swal.fire(
           'Added!',
           'State has been added.',
           'success'
         ).then( okay => {
           if (okay) {
             window.location.reload();
           }
       });

    })
  }

}
