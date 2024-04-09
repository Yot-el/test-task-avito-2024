import { Stack, Pagination, Flex, Divider, Text, Loader } from "@mantine/core";
import MovieCard from "./components/movieCard/MovieCard";
import Filters from "./components/filters/Filters";
import { IFilters, IPageData } from "models/models";
import { useLayoutEffect, useState } from "react";
import { AbortError, NoParamsError } from "models/classes";
import * as classes from "./MovieSearch.module.css";
import ErrorModal from "components/ErrorModal";
import { fetchData } from "api/api";
import { useForm } from "@mantine/form";
import { URLParamsToFilters, filtersToURLParams } from "api/filters";
import { useSearchParams } from "react-router-dom";

const MovieSearch = () => {
	const [pageData, setPageData] = useState<IPageData>({
		docs: [],
		total: 0,
		limit: 10,
		page: 1,
		pages: 11,
	});

	const filters = useForm<IFilters>({
		initialValues: {
			startYear: null,
			endYear: null,
			includedCountries: [],
			excludedCountries: [],
			ageRating: null,
			pageLimit: 10,
		},
		validate: {
			startYear: (value) => {
				if (value && value > (filters.values.endYear ?? new Date().getFullYear())) {
					return "Значение превышает крайнюю границу диапазона лет выпусков";
				}

				return null;
			},
			endYear: (value) => {
				if (value && value < (filters.values.startYear ?? 1890)) {
					return "Значение меньше левой границы диапазона лет выпусков";
				}

				return null;
			}
		}
	});

	const paginationPageLimit = pageData.page + 10;
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error>();
	const [searchParams, setSearchParams] = useSearchParams();

	const changePage = (page: number): void => {
		fetchPageData(page);
	};

	const fetchPageData = async (page: number, signal?: AbortSignal): Promise<void> => {
		setIsLoading(true);

		const selectedFields = "selectFields=id&selectFields=name&selectFields=description&selectFields=year&selectFields=ageRating&selectFields=genres&selectFields=countries&selectFields=poster";

		const filterParams = filtersToURLParams(filters.values);
		setSearchParams(filterParams);

		try {
			const data = await fetchData<IPageData>(`/v1.4/movie?page=${page}&${filterParams.toString()}&${selectedFields}`, signal);
			localStorage.setItem("pageData", JSON.stringify(data));
			setPageData(data);
			setIsLoading(false);
		} catch (e: unknown) {
			if (e instanceof AbortError) {
				return;
			}
			
			if (e instanceof Error) {
				setError(e);
			}
		}
	};

	useLayoutEffect(() => {
		setIsLoading(true);
		const abortController = new AbortController();

		// Попытка забрать параметры фильтрации из URL
		try {
			const filtersFromParams = URLParamsToFilters(searchParams);
			filters.setValues(filtersFromParams);
			fetchPageData(pageData.page, abortController.signal);
		} catch (e: unknown) {
			if (e instanceof NoParamsError) {

				// Попытка забрать данные из хранилища
				try {
					const localData =  JSON.parse(localStorage.getItem("pageData") ?? "");
					const localFilters= JSON.parse(localStorage.getItem("filters") ?? "");
		
					setPageData(localData);
					filters.setValues(localFilters);
					setIsLoading(false);
		
				} catch (e: unknown) {
					fetchPageData(pageData.page, abortController.signal);
				}

				return;
			}

			throw e;
		}
		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<Flex gap="lg" className={classes.container}>
			<Filters page={pageData.page} filters={filters} onSubmit={fetchPageData}/>
			<Divider orientation="vertical"/>
			<Stack gap="sm" justify="flex-start" className={classes.content}>
				{
					isLoading ?
						<Loader size={50} className={classes.loader}/> :
						pageData.docs.map((film) => (
							<div key={film.id}>
								<MovieCard movie={film} />
								<Divider my="xs" />
							</div>
						))
				}
				<Flex gap="md" align="center">
					<Pagination
						total={paginationPageLimit < pageData.pages ? paginationPageLimit : pageData.pages}
						siblings={2}
						value={pageData.page}
						onChange={changePage}/>
					<Text fz="sm">
						Показано {(pageData.page - 1) * pageData.limit} - {pageData.page * pageData.limit} из {pageData.pages * pageData.limit}
					</Text>
				</Flex>
			</Stack>
			{
				error &&
				<ErrorModal error={error}/>
			}
		</Flex>
	);
};

export default MovieSearch;