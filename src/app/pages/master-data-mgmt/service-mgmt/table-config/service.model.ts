// Table data
export interface ServiceModel {
    serviceId:          number;
    createdAt:          string;
    createdBy:          string;
    defaultPrice:       number;
    isActive:           string;
    serviceCode:        string;
    serviceDescription: string;
    serviceName:        string;
    serviceType:        string;
    updatedAt:          string;
    updatedBy:          string;
    sacCode: string;
}

// Search Data
export interface SearchResult {
    tables: ServiceModel[];
    total: number;
}
