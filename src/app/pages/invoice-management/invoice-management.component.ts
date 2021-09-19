import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/dateAdapter/datePicker.adapter';
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss'],
  providers: [ {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}]
})
export class InvoiceManagementComponent implements OnInit {

  rows = [];
  selected = [];
  allRowsSelected=  [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadCrumbItems: Array<{}>;
  expanded: any = {};
  updateInvoiceForm: FormGroup;
  rangesubmit: boolean;

  serviceStartdate: string;
  serviceEnddate: string;
  subscriptionDate: string;

  subscriptionList = []

  constructor(private spiner: NgxSpinnerService,
              private apiService: ApiService, 
              private modalService: NgbModal,
              public formBuilder: FormBuilder,
              private ngbCalendar: NgbCalendar, 
              private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit(): void {
    this.getAllInvoices();
    this.getSubcriptionList();
  }

  getAllInvoices() {
    this.spiner.show();
    this.apiService.sendGetRequest('getAllInvoices').subscribe( (res) => {
      this.spiner.hide();
      this.rows = res; 
      console.log(this.rows);   
    });
  }

  getSubcriptionList() {
    this.spiner.show();
    this.apiService.sendGetRequest('iansSubscriptions').subscribe( (res) => {
      this.spiner.hide();
      this.subscriptionList = res._embedded.iansSubscriptions;   
      console.log(this.subscriptionList);
    });
  }


  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  
  onActivate(event) {
    console.log('Activate Event', event);
  }
  
  add() {
    this.selected.push(this.rows[1], this.rows[3]);
    console.log(this.selected);
  }
  
  remove() {
    this.selected = [];
  }

  onCheckboxChangeFn(event: any) {
    console.log(event);
  }
  
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    // this.renewCustomerTable.rowDetail.toggleExpandRow(row);
  }


  deleteInvoice(rowDetails: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete Invoice',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.apiService.sendGetRequest('deleteInvoice/' + rowDetails.invoiceId)
            .subscribe( res => {
                this.spiner.hide();
                Swal.fire(
                  'Deleted!',
                  'Invoice has been removed successfully.',
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


  dowwnloadInvoice() {
    console.log(this.selected.length);
    if(this.selected.length >= 1) {
  
       const jsonData = {
        downloadInvoices: []
       }
  
      this.selected.forEach(el => {
        
          jsonData.downloadInvoices.push({
            invoiceId:el.invoiceId,
            customerName:el.iansCustomer.customerName,
            customerId:el.iansCustomer.customerId,
            companyName:el.iansCustomer.companyName,
            headOfficeAddress:el.iansCustomer.headOfficeAddress,
            gstNo:el.iansCustomer.gstNo,
            createdBy: 'Portal',
            invoiceNo:el.invoiceNo,
            totalAmount:el.totalAmount,
            totalCGSTAmount:el.cgstAmount,
            totalSGSTAmount:el.sgstAmount,
            totalIGSTAmount:el.igstAmount,
            subscriptionDate:el.subscriptionDate,
            serviceStartDate:el.serviceStartDate,
            serviceEndDate:el.serviceEndDate,
            serviceId:el.iansServiceId,
            subscriptionValue: el.iansCustomer.iansSubscription.subscriptionValue,
            serviceDescription: el.serviceDescription
          });
      })
      console.log(jsonData);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Want to download Invoice',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, download.',
        cancelButtonText: 'No, let me think'
      }).then((result) => {
     
        if (result.value) {

        this.spiner.show();
        this.apiService.downloadPost('downloadInvoices', jsonData)
            .subscribe( blob => {
                const a = document.createElement('a')
                const objectUrl = URL.createObjectURL(blob)
                a.href = objectUrl
                a.download = 'Invoice_'+ new Date()+'.zip';
                a.click();
                URL.revokeObjectURL(objectUrl);
                this.spiner.hide();
                Swal.fire(
                  'Downloaded!',
                  'Invoice has been successfully downloaded.',
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
    else {
      Swal.fire({
        title: 'Alert?',
        text: 'Please Select at least one row',
        icon: 'warning',
        cancelButtonText: 'Ok'
      })
    }
  
  }


  // ==============================================  Update Invoice  ====================================================

  get updateInvoiceFormControls() {
    return this.updateInvoiceForm.controls;
  }

  get iansServicesArray() {
    return this.updateInvoiceForm.get('iansServices') as FormArray
  }

  updateInvoicePopupModel(tableModel: any, UpdateInvoicecenterDataModal: any) {
    console.log(tableModel);
    this.modalService.open(UpdateInvoicecenterDataModal, { size: 'xl', scrollable: true, });
    /* const sendSubscriptDate=new Date();
    sendSubscriptDate.setMonth(sendSubscriptDate.getMonth()+Number(tableModel.iansCustomer.iansSubscription.subscriptionValue)); */
    this.updateInvoiceForm = this.formBuilder.group({
        customerId: tableModel.iansCustomer.customerId,
        companyName: [tableModel.iansCustomer.companyName, [Validators.required]],
        description: [tableModel.iansCustomer.description, [Validators.required]],
        companyPhoneNo: [tableModel.iansCustomer.companyPhoneNo, [Validators.required]],
        customerName: [tableModel.iansCustomer.customerName, [Validators.required]],
        companyEmailId: [tableModel.iansCustomer.companyEmailId, [Validators.required]],
        companyAddress: [tableModel.iansCustomer.companyAddress, [Validators.required]],
        headOfficePhoneNo: [tableModel.iansCustomer.headOfficePhoneNo, [Validators.required]],
        headOfficeEmailId: [tableModel.iansCustomer.headOfficeEmailId, [Validators.required]],
        headOfficeAddress: [tableModel.iansCustomer.headOfficeAddress, [Validators.required]],
        createdBy: 'Portal',
        totalAmount: [tableModel.totalAmount, [Validators.required]],
        totalCGSTAmount: [tableModel.cgstAmount, [Validators.required]],
        totalSGSTAmount: [tableModel.sgstAmount, [Validators.required]],
        totalIGSTAmount: [tableModel.igstAmount, [Validators.required]],
        subscriptionValue: [Number(tableModel.iansCustomer.iansSubscription.subscriptionValue), [Validators.required]],
        iansServices: this.formBuilder.array([])

    });

    this.spiner.show();
    this.apiService.sendGetRequest('iansServices').subscribe( (res) => {
          this.spiner.hide();
          const invoiceServiceArray = this.updateInvoiceForm.get('iansServices') as FormArray;
          for (let index = 0; index < 1; index++) {
              invoiceServiceArray.push(this.formBuilder.group({
                 customerId: tableModel.iansCustomer.customerId,
                 invoiceId: tableModel.invoiceId,
                 serviceId: [tableModel.iansServiceId, [Validators.required]],
                 serviceName: [tableModel.serviceDescription, [Validators.required]],
                 serviceDescription: [tableModel.serviceDescription, [Validators.required]],
                 sacCode: [tableModel.sacCode, [Validators.required]],
                 totalAmount: [tableModel.totalAmount, [Validators.required]],
                 totalCGSTAmount: [tableModel.cgstAmount, [Validators.required]],
                 totalSGSTAmount: [tableModel.sgstAmount, [Validators.required]],
                 totalIGSTAmount: [tableModel.igstAmount, [Validators.required]],
                 subscriptionDate: [tableModel.subscriptionDate, [Validators.required]],
                 serviceStartDate: [tableModel.serviceStartDate, [Validators.required]],
                 serviceEndDate: [tableModel.serviceEndDate, [Validators.required]],
                 createdBy: 'Portal'
              }))
            
          } 
          
          const frService = this.updateInvoiceForm.get('iansServices') as FormArray;
          console.log(frService.value);
         // this.totalAmountCalCulation(frService.value);
      
    });

  }

  submitupdateInvoiceForm() {
    this.updateInvoiceForm.value.iansServices.forEach(element => {
     /*  const sendSubscriptDate=new Date(element.subscriptionDate);
      console.log(sendSubscriptDate);
      sendSubscriptDate.setMonth(sendSubscriptDate.getMonth()+Number(this.updateInvoiceForm.get("subscriptionValue").value));  
      element['subscriptionDate'] = sendSubscriptDate.toISOString().slice(0,10); */
      this.spiner.show();
      this.apiService.sendPostFormRequest('updateInvoice', element).subscribe((res) => {
          this.spiner.hide();
          Swal.fire(
            'Created!',
            'Invoice has been Updated.',
            'success'
          ).then( okay => {
            if (okay) {
               window.location.reload();
            }
          });
        })
              
    })
  }


}
