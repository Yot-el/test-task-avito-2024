import { AppShell, Autocomplete, Container, Flex, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import * as classes from "./Header.module.css";
import { fetchData } from "utils/api";
import { fixedEncodeURIComponent } from "utils/utils";
import { IPageData } from "models/models";
import { MoviesContext } from "context/movieSearch.context";
import { AbortError } from "models/classes";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 1000);
	const [autocompleteData, setAutocompleteData] = useState<string[]>([]);
	const { filters, setPageData, setIsLoading, setError } = useContext(MoviesContext);

	const fetchSearchData = async (query: string, signal?: AbortSignal): Promise<void> => {
		setIsLoading(true);
		setAutocompleteData((prevData) => [...new Set([...prevData, query])]);

		try {
			const data = await fetchData<IPageData>(`/v1.4/movie/search?page=${filters.page}&limit=${filters.limit}&query=${fixedEncodeURIComponent(query)}`, signal);
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

	useEffect(() => {
		const abortController = new AbortController();
		const searchValue = debouncedSearchValue.trim();
		const regex = /\s{2,}/g;

		if (!searchValue) {
			return;
		}

		if (location.pathname !== "/") {
			navigate("/");
		}
		// Замена двух и более пробелов одним перед fetch
		fetchSearchData(searchValue.replaceAll(regex, " "), abortController.signal);

		() => {
			abortController.abort();
		};
	}, [debouncedSearchValue]);


	return (
		<AppShell.Header>
			<Container className={classes["container"]} size="80rem">
				<Flex
					className={classes["flex-inner"]}
					h="100%"
					px="md"
					justify="space-between"
					align={{ base: "start", sm: "center" }}
					direction={{ base: "column", sm: "row" }}
				>
					<Title fz={{ base: 26, sm: 32, lg: 48 }} order={1} c="yellow.6">
						АвиПоиск
					</Title>
					<Autocomplete
						className={classes["search"]}
						placeholder="Введите название фильма"
						value={searchValue}
						data={autocompleteData}
						limit={5}
						onChange={(value) => setSearchValue(value)}
					/>
				</Flex>
			</Container>
		</AppShell.Header>
	);
};

export default Header;