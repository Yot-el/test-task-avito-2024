import { IPageData } from "models/models";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface IMoviesContextProviderValue {
  pageData: IPageData;
  setPageData: Dispatch<SetStateAction<IPageData>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
	error: Error | undefined;
	setError: Dispatch<SetStateAction<Error | undefined>>;
}

const defaultContextValue: IPageData = {
	docs: [],
	total: 0,
	limit: 10,
	page: 1,
	pages: 11,
};

export const MoviesContext = createContext<IMoviesContextProviderValue>({
	pageData: defaultContextValue,
	setPageData: () => {},
	isLoading: true,
	setIsLoading: () => {},
	error: undefined,
	setError: () => {},
});

export const MoviesContextProvider = ({ children }: React.PropsWithChildren) => {
	const [pageData, setPageData] = useState<IPageData>(defaultContextValue);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error>();

	return (
		<MoviesContext.Provider value={{ pageData, setPageData, isLoading, setIsLoading, error, setError }}>
			{ children }
		</MoviesContext.Provider>
	);
};