import { Stack, Pagination, Flex, Divider, Text, Loader, Container, Button } from "@mantine/core";
import MovieCard from "./components/movieCard/MovieCard";
import Filters from "./components/filters/Filters";
import { IFilters, IPageData } from "models/models";
import { useContext, useLayoutEffect, useState } from "react";
import { AbortError, NoParamsError } from "models/classes";
import * as classes from "./MovieSearch.module.css";
import ErrorModal from "components/ErrorModal";
import { fetchData } from "utils/api";
import { URLParamsToFilters, filtersToURLParams } from "utils/filters";
import { useSearchParams } from "react-router-dom";
import { MoviesContext } from "context/movieSearch.context";

const MovieSearch = () => {
	const { pageData, setPageData, filters, setFilters, resetFilters, isLoading, setIsLoading, error, setError } = useContext(MoviesContext);
	const [searchParams] = useSearchParams();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const paginationPageLimit = pageData.page + 10;

	const changePage = (page: number): void => {
		const newFilters = { ...filters, page: page };
		setFilters(newFilters);
		fetchPageData(newFilters);
	};

	const fetchPageData = async (filters: IFilters, signal?: AbortSignal): Promise<void> => {
		setIsLoading(true);
		setFilters(filters);

		const selectedFields = "selectFields=id&selectFields=name&selectFields=description&selectFields=year&selectFields=ageRating&selectFields=genres&selectFields=countries&selectFields=poster";
		const filterParams = filtersToURLParams(filters);

		try {
			const url = `/v1.4/movie?${filterParams.toString()}&${selectedFields}`;
			const data = await fetchData<IPageData>(url, signal);
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

		//Попытка забрать параметры фильтрации из URL
		try {
			const filtersFromParams = URLParamsToFilters(searchParams);
			setFilters(filtersFromParams);
			fetchPageData(filtersFromParams, abortController.signal);

		} catch (e: unknown) {
			if (e instanceof NoParamsError) {
				// Попытка забрать данные из хранилища
				try {
					const localData =  JSON.parse(localStorage.getItem("pageData") ?? "");
					const localFilters= JSON.parse(localStorage.getItem("filters") ?? "");

					setPageData(localData);
					setFilters(localFilters);
					setIsLoading(false);
		
				} catch (e: unknown) {
					fetchPageData(filters, abortController.signal);
				}

				return;
			}

			if (e instanceof Error) {
				setError(e);
			}
		}

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<Container size="80rem">
			<Flex gap="lg" direction={{ base: "column", sm: "row" }} className={classes["container"]}>
				<Button onClick={() => setIsOpen(true)} hiddenFrom="sm">
					Открыть фильтры
				</Button>
				<Filters
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					onSubmit={fetchPageData}
					onReset={resetFilters}
				/>
				<Divider orientation="vertical" visibleFrom="sm"/>
				<Stack gap="sm" justify="flex-start" className={classes["content"]}>
					{
						isLoading ?
							<Loader size={50} className={classes["loader"]}/> :
							pageData.docs.map((film) => (
								<div key={film.id}>
									<MovieCard movie={film} />
									<Divider my="xs" />
								</div>
							))
					}
					<Flex gap="md" align="center" direction={{ base: "column", sm: "row" }}>
						<Pagination
							total={paginationPageLimit < pageData.pages ? paginationPageLimit : pageData.pages}
							value={pageData.page}
							onChange={changePage}
						/>
						<Text fz="sm">
						Показано {(filters.page - 1) * filters.limit} - {filters.page * filters.limit} из {pageData.pages * filters.limit}
						</Text>
					</Flex>
				</Stack>
				{
					error &&
				<ErrorModal error={error}/>
				}
			</Flex>
		</Container>
	);
};

export default MovieSearch;