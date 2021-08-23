import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortEvent, AdvancedSortableDirective } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormGroupName } from '@angular/forms';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';
import { ServiceModel } from './table-config/service.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-service-mgmt',
  templateUrl: './service-mgmt.component.html',
  styleUrls: ['./service-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class ServiceMgmtComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  tableData: ServiceModel[];
  tables$: Observable<ServiceModel[]>;
  total$: Observable<number>;
  addServiceForm: FormGroup;
  updateServiceForm: FormGroup;
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
    this.getServiceList();


    this.addServiceForm = this.formBuilder.group({
      serviceCode: ['', [Validators.required]],
      serviceName: ['', [Validators.required]],
      serviceDescription: ['', [Validators.required]],
      defaultPrice: ['', [Validators.required]],
      sacCode: ['', [Validators.required]],
    });

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }

  getServiceList() {
    this.spiner.show();
    this.apiService.sendGetRequest('iansServices').subscribe( (res) => {
      this.spiner.hide();
      this.tableData = res._embedded.iansServices;    
         
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

  openAddServiceModel(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  addService(): void {
     this.spiner.show();
     this.apiService.sendPostFormRequest('iansServices', this.addServiceForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Added!',
            'Service has been added.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }
  get serviceFormControls() {
    return this.addServiceForm.controls;
  }

  get updateServiceControls() {
    return this.updateServiceForm.controls;
  }

  get addStateFormControls() {
    return this.addStateForm.controls;
  }

  editServicePopupForm(tabelDataModel: ServiceModel, editServicecenterDataModal: any) {
      this.modalService.open(editServicecenterDataModal, { centered: true });
      this.updateServiceForm = this.formBuilder.group({
          serviceId: tabelDataModel.serviceId,
          serviceCode: [tabelDataModel.serviceCode, [Validators.required]],
          serviceName: [tabelDataModel.serviceName, [Validators.required]],
          serviceDescription: [tabelDataModel.serviceDescription, [Validators.required]],
          defaultPrice: [tabelDataModel.defaultPrice, [Validators.required]],
          sacCode: [tabelDataModel.sacCode, [Validators.required]],
      });
  }

  submitUpdateServiceForm() {
    this.spiner.show();
     this.apiService.sendPostFormRequest('iansServices', this.updateServiceForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Updated!',
            'Service has been Updated.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }

  deleteService(tabelDataModel: ServiceModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Service Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('iansServices/' + tabelDataModel.serviceId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Service has been removed successfully.',
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
    this.apiService.sendPostFormRequest('iansServices', this.addStateForm.value).subscribe((res) => {
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
