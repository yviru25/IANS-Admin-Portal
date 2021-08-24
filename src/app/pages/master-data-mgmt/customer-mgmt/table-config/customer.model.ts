// Table data
export interface CustomerModel {
    customerId:             number;
    companyAddress:         string;
    companyEmailId:         string;
    companyName:            string;
    companyPhoneNo:         string;
    loginId:                string;
    headOfficeAddress:      string;
    headOfficeEmailId:      string;
    headOfficePhoneNo:      string;
    createdAt:              string;
    createdBy:              string;
    customerName:           string;
    description:            string;
    gstNo:                  string;
    isActive:               string;
    isGstEnabled:           string;
    primaryContactEmail:    string;
    primaryContactMobileno: string;
    updatedAt:              string;
    updatedBy:              string;
}


// Search Data
export interface SearchResult {
    tables: CustomerModel[];
    total: number;
}
