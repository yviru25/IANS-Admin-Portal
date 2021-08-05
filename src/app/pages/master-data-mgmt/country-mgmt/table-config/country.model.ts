// Table data
export interface CountryModel {
    countryCode: string;
    countryName: string;
    currency: string;
}

// Search Data
export interface SearchResult {
    tables: CountryModel[];
    total: number;
}
