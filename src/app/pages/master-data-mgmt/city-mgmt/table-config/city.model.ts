// Table data
export interface CityModel {
    cityId:    number;
    cityCode:  string;
    cityName:  string;
    createdAt: Date;
    createdBy: string;
    isActive:  string;
    updatedAt: Date;
    updatedBy: string;
    iansState: IansState;
}

export interface IansState {
    stateId:     number;
    createdAt:   string;
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
    tables: CityModel[];
    total: number;
}
