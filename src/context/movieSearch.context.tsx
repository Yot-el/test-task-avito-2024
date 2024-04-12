import { filtersToURLParams } from "utils/filters";
import { IFilters, IPageData } from "models/models";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultPageDataValue: IPageData = {
	docs: [],
	total: 0,
	limit: 10,
	page: 1,
	pages: 11,
};

const defaultFiltersValue: IFilters = {
	startYear: null,
	endYear: null,
	includedCountries: [],
	excludedCountries: [],
	ageRating: null,
	limit: 10,
	page: 1,
};

interface IMoviesContextProviderValue {
  pageData: IPageData;
  setPageData: Dispatch<SetStateAction<IPageData>>;
	filters: IFilters;
	setFilters: Dispatch<SetStateAction<IFilters>>;
	resetFilters: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
	error: Error | undefined;
	setError: Dispatch<SetStateAction<Error | undefined>>;
}

export const MoviesContext = createContext<IMoviesContextProviderValue>({
	pageData: defaultPageDataValue,
	setPageData: () => {},
	filters: defaultFiltersValue,
	setFilters: () => {},
	resetFilters: () => {},
	isLoading: true,
	setIsLoading: () => {},
	error: undefined,
	setError: () => {},
});

export const MoviesContextProvider = ({ children }: React.PropsWithChildren) => {
	const [pageData, setPageData] = useState<IPageData>(defaultPageDataValue);
	const [filters, setFilters] = useState<IFilters>(defaultFiltersValue);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error>();
	const resetFilters = () => { setFilters(defaultFiltersValue); };

	const [, setSearchParams] = useSearchParams();

	useEffect(() => {
		const filterParams = filtersToURLParams(filters);
		setSearchParams(filterParams);
	}, [filters]);

	return (
		<MoviesContext.Provider value={{ pageData, setPageData, filters, setFilters, resetFilters, isLoading, setIsLoading, error, setError }}>
			{ children }
		</MoviesContext.Provider>
	);
};