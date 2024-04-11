export interface IGenres {
	name: string
}

export interface ICountries {
	name: string;
	slug?: string;
}

interface IPoster {
	url: string;
	previewUrl: string;
}

export interface IMovie {
	id: number;
	name: string;
	ageRating: number;
	year: number;
	countries: ICountries[];
	description: string;
	poster: IPoster;
	genres: IGenres[];
}

export interface IPageData {
	docs: IMovie[];
	total: number;
	limit: number;
	page: number;
	pages: number;
}

export interface IFilters {
	startYear: number | null;
	endYear: number | null;
	includedCountries: string[];
	excludedCountries: string[];
	ageRating: number | null;
}

export interface IMantineInputProps<T> {
	value?: T;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
  onBlur?(event: React.FocusEvent<HTMLInputElement>): void;
  error?: string;
}

export interface IMantineSelectProps {
	value?: string[];
	onChange?(value: string[]): void;
}

export interface IPerson {
	id: number;
	photo?: string;
	name?: string;
	enName?: string;
	description?: string | null;
	profession?: string;
	enProfession?: string;
}