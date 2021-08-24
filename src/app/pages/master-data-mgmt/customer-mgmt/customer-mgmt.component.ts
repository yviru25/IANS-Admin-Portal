import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortEvent, AdvancedSortableDirective } from './table-config/advanced-sortable.directive';
import { AdvancedService } from './table-config/advanced.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormGroupName, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';
import { CustomerModel } from './table-config/customer.model';
import { DecimalPipe } from '@angular/common';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-customer-mgmt',
  templateUrl: './customer-mgmt.component.html',
  styleUrls: ['./customer-mgmt.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CustomerMgmtComponent implements OnInit {

 
  breadCrumbItems: Array<{}>;
  tableData: CustomerModel[];
  tables$: Observable<CustomerModel[]>;
  total$: Observable<number>;
  addCustomerForm: FormGroup;
  updateCustomerForm: FormGroup;
  createInvoiceForm: FormGroup;

  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;

  serviceStartdate: { day: number, month: number,  year: number };
  serviceEnddate: { day: number, month: number,  year: number };

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: AdvancedService, private modalService: NgbModal,
              public formBuilder: FormBuilder, private spiner: NgxSpinnerService,
              private apiService: ApiService) {
    // this.tables$ = service.tables$;
    // this.total$ = service.total$;
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Quick Service', active: true }];
    this.getCustomerList();


    this.addCustomerForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      primaryContactEmail: ['', [Validators.required]],
      primaryContactMobileno: ['', [Validators.required]],
      headOfficePhoneNo: ['', [Validators.required]],
      headOfficeEmailId: ['', [Validators.required]],
      headOfficeAddress: ['', [Validators.required]],
      companyPhoneNo: ['', [Validators.required]],
      companyEmailId: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
      isActive: ['Y', [Validators.required]],
    });

    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;

  }

  getCustomerList() {
    this.spiner.show();
    this.apiService.sendGetRequest('iansCustomers').subscribe( (res) => {
      this.spiner.hide();
      this.tableData = res._embedded.iansCustomers;    
         
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

  openAddCustomerModel(centerDataModal: any) {
    this.modalService.open(centerDataModal, { size: 'xl'});
  }

  addCustomer(): void {
     // console.log(this.addCustomerForm.value);
     this.spiner.show();
     this.apiService.sendPostFormRequest('iansCustomers', this.addCustomerForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Added!',
            'Customer has been added.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }
  get CustomerFormControls() {
    return this.addCustomerForm.controls;
  }

  get updateCustomerControls() {
    return this.updateCustomerForm.controls;
  }

  editCustomerPopupForm(tabelDataModel: CustomerModel, editCustomercenterDataModal: any) {
      this.modalService.open(editCustomercenterDataModal, { centered: true, size: 'xl' });
      this.updateCustomerForm = this.formBuilder.group({
        customerId: tabelDataModel.customerId,
        companyName: [tabelDataModel.companyName, [Validators.required]],
        description: [tabelDataModel.description, [Validators.required]],
        primaryContactEmail: [tabelDataModel.primaryContactEmail, [Validators.required]],
        primaryContactMobileno: [tabelDataModel.primaryContactMobileno, [Validators.required]],
        gstNo: [tabelDataModel.gstNo, [Validators.required]],
        headOfficePhoneNo: [tabelDataModel.headOfficePhoneNo, [Validators.required]],
        headOfficeEmailId: [tabelDataModel.headOfficeEmailId, [Validators.required]],
        headOfficeAddress: [tabelDataModel.headOfficeAddress, [Validators.required]],
        companyPhoneNo: [tabelDataModel.companyPhoneNo, [Validators.required]],
        customerName: [tabelDataModel.customerName, [Validators.required]],
        companyEmailId: [tabelDataModel.companyEmailId, [Validators.required]],
        companyAddress: [tabelDataModel.companyAddress, [Validators.required]],
        isActive: [tabelDataModel.isActive, [Validators.required]],
      });
  }

  submitUpdateCustomerForm() {
    this.spiner.show();
     this.apiService.sendPostFormRequest('iansCustomers', this.updateCustomerForm.value).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Updated!',
            'Customer has been Updated.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
        });

     })
  }

  deleteCustomer(tabelDataModel: CustomerModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Customer Data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendDeleteRequest('iansCustomers/' + tabelDataModel.customerId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Customer has been removed successfully.',
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


  /*   ======================== Create Invoice Functionality ======================================== */

  get createInvoiceFormControls() {
    return this.createInvoiceForm.controls;
  }

  get iansServicesArray() {
    return this.createInvoiceForm.get('iansServices') as FormArray
  }

  createInvoicePopupModel(tableModel: CustomerModel, CreatInvoicecenterDataModal: any) {
    this.modalService.open(CreatInvoicecenterDataModal, { size: 'xl', scrollable: true, });
    this.createInvoiceForm = this.formBuilder.group({
        customerId: tableModel.customerId,
        companyName: [tableModel.companyName, [Validators.required]],
        description: [tableModel.description, [Validators.required]],
        companyPhoneNo: [tableModel.companyPhoneNo, [Validators.required]],
        customerName: [tableModel.customerName, [Validators.required]],
        companyEmailId: [tableModel.companyEmailId, [Validators.required]],
        companyAddress: [tableModel.companyAddress, [Validators.required]],
        headOfficePhoneNo: [tableModel.headOfficePhoneNo, [Validators.required]],
        headOfficeEmailId: [tableModel.headOfficeEmailId, [Validators.required]],
        headOfficeAddress: [tableModel.headOfficeAddress, [Validators.required]],
        createdBy: 'Portal',
        totalAmount: ['', [Validators.required]],
        totalGSTAmount: ['', [Validators.required]],
        iansServices: this.formBuilder.array([])

    });

    this.spiner.show();
    this.apiService.sendGetRequest('iansServices').subscribe( (res) => {
          this.spiner.hide();
          const invoiceServiceArray = this.createInvoiceForm.get('iansServices') as FormArray;
          for (let index = 0; index < res._embedded.iansServices.length; index++) {
              invoiceServiceArray.push(this.formBuilder.group({
                 serviceId: [res._embedded.iansServices[index].serviceId, [Validators.required]],
                 serviceName: [res._embedded.iansServices[index].serviceName, [Validators.required]],
                 serviceAmount: [res._embedded.iansServices[index].defaultPrice, [Validators.required]],
                 serviceDescription: [res._embedded.iansServices[index].serviceDescription, [Validators.required]],
                 cgstAmount: ['', [Validators.required]],
                 sgstAmount: ['', [Validators.required]],
                 igstAmount: ['', [Validators.required]],
                 serviceStartDate: ['', [Validators.required]],
                 serviceEndDate: ['', [Validators.required]],
              }))
            
          }  
      
    });
  }

  submitCreateInvoiceForm() {
    console.log(this.createInvoiceForm.value);
  }

  

  deleteServiceGroup(index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Service ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        const serviceArray = this.createInvoiceForm.get('iansServices') as FormArray
        serviceArray.removeAt(index);
      }
    });
    
  }



}
