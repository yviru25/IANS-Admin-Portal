// Table data
export interface StateModel {
    stateCode: string;
    stateName: string;
    countryName: string;
}

// Search Data
export interface SearchResult {
    tables: StateModel[];
    total: number;
}
