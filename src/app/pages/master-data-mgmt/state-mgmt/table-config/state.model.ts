// Table data
export interface StateModel {
    stateId:     number;
    createdAt:   Date;
    createdBy:   string;
    isActive:    string;
    stateCode:   string;
    stateName:   string;
    updatedAt:   Date;
    updatedBy:   string;
    iansCountry: IansCountry;
}

export interface IansCountry {
    countryId:   number;
    countryCode: string;
    countryName: string;
    createdAt:   Date;
    createdBy:   string;
    currency:    string;
    isActive:    string;
    updatedAt:   Date;
    updatedBy:   string;
}
// Search Data
export interface SearchResult {
    tables: StateModel[];
    total: number;
}
