// Table data
export interface CountryModel {
    countryId: number;
    countryCode: string;
    countryName: string;
    currency: string;
}

// Search Data
export interface SearchResult {
    tables: CountryModel[];
    total: number;
}
