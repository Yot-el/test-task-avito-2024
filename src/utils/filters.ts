import { NoParamsError } from "models/classes";
import { IFilters } from "models/models";

const yearsToString = (startYear: number | null, endYear: number | null): string => {
	if (startYear && endYear) {
		return `${startYear}-${endYear}`;
	} else if (!(startYear || endYear)) {
		return "";
	} else {
		return `${startYear ?? endYear}`;
	}
};

const stringToYears = (value: string) => {
	const years = value.split("-").map((year) => parseInt(year));

	return years.length === 2 ? years : [years[0], null];
};

const countryToString = (country: string, isExcluded = false): string => `${isExcluded ? "!" : "+"}${country}`;

export const filtersToURLParams = (filters: IFilters): URLSearchParams => {
	const params = new URLSearchParams();

	const year = filters.startYear || filters.endYear ? `${yearsToString(filters.startYear, filters.endYear)}` : "";
	if (year) params.append("year", year);

	const ageRating = filters.ageRating || filters.ageRating === 0 ? `${filters.ageRating}` : "";
	if (ageRating) params.append("ageRating", ageRating);

	const countries = [...filters.includedCountries.map((country) => countryToString(country)),
		...filters.excludedCountries.map((country) => countryToString(country, true))];
	countries.forEach((country) => params.append("countries.name", country));

	params.append("limit", `${filters.limit}`);
	params.append("page", `${filters.page}`);

	return params;
};

export const URLParamsToFilters = (params: URLSearchParams): IFilters => {
	if (!params.size) {
		throw new NoParamsError();
	}

	const filters: IFilters = {
		startYear: null,
		endYear: null,
		includedCountries: [],
		excludedCountries: [],
		ageRating: null,
		limit: 10,
		page: 1,
	};

	for (const [key, value] of params.entries()) {
		const decodedValue = decodeURIComponent(value);

		if (key.includes("countries")) {
			if (decodedValue.includes("!")) {
				filters.excludedCountries.push(decodedValue.slice(1));
				continue;
			}

			filters.includedCountries.push(decodedValue.slice(1));
			continue;
		}

		if (key.includes("year")) {
			const [startYear, endYear] = stringToYears(decodedValue);

			filters.startYear = startYear;
			filters.endYear = endYear;

			continue;
		}

		if (key === "ageRating") {
			filters.ageRating = parseInt(decodedValue);
			continue;
		}

		if (key === "limit") {
			filters.limit = parseInt(decodedValue);
			continue;
		}

		if (key === "page") {
			filters.page = parseInt(decodedValue);
		}
	}

	return filters;
};