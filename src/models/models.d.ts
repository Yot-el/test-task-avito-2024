export interface IGenre {
	name: string
}

export interface ICountry {
	name: string;
	slug?: string;
}

interface IImage {
	url: string | null;
	previewUrl: string | null;
}

type MovieType = "movie" | "tv-series" | "cartoon" | "anime" | "animated-series" | "tv-show"

interface IRating {
	kp?: number | null;
	imdb?: number | null;
	tmdb?: number | null;
	filmCritics?: number | null;
	russianFilmCritics?: number | null;
	await?: number | null;
}

interface IReviewInfo {
	count?: number | null;
	positiveCount?: number | null;
	percentage?: number | null;
}

export interface IMovie {
	id: number;
	name: string;
	alternativeName?: string | null;
	enName?: string | null;
	type?: MovieType | null;
	year?: number | null;
	description?: string | null;
	shortDescription?: string | null;
	rating?: IRating | null;
	countries: ICountry[] | null;
	ageRating?: number | null;
	poster: IImage;
	backdrop?: IImage;
	genres: IGenre[];
	persons?: IPerson[] | null;
	reviewInfo?: IReviewInfo | null;
	seasonsInfo?: {
		number?: number | null;
		episodesCount?: number | null;
	} | null;
	similarMovies?: ILinkedMovie[] | null;
	sequelsAndPreques?: ILinkedMovie[] | null;
	isSeries?: boolean | null;
}

export interface ILinkedMovie {
	id: number;
	name: string | null;
	enName: string | null;
	alternativeName: string;
	type: MovieType;
	poster: IImage;
}

interface IReview {
	id: number;
	title: string;
	type?: "Нейтральный" | "Позитивный" | "Негативный";
	review: string;
	date: string;
	author: string;
}

export interface IDocs {
	total: number;
	limit: number;
	page: number;
	pages: number;
}

export interface IPageData extends IDocs {
	docs: IMovie[];
}

export interface ISeasonsData extends IDocs {
	docs: ISeason[];
}

export interface IPostersData extends IDocs {
	docs: IImage[];
}

export interface IReviewData extends IDocs {
	docs: IReview[];
}

export interface IEpisode {
	number: number;
	name: string | null;
	enName: string | null;
	still: IImage;
	duration: number | null;
	date: Date | string | null;
	airDate: string | null;
	description: string | null;
	enDescription: string | null;
}

export interface ISeason {
	id: string;
	number: number;
	name: string | null;
	episodesCount?: number;
	episodes: IEpisode[];
}

export interface IFilters {
	startYear: number | null;
	endYear: number | null;
	includedCountries: string[];
	excludedCountries: string[];
	ageRating: number | null;
	limit: number;
	page: number;
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