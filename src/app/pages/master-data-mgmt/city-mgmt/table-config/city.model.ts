// Table data
export interface CityModel {
    cityCode: string;
    cityName: string;
    stateName: string;
}

// Search Data
export interface SearchResult {
    tables: CityModel[];
    total: number;
}
